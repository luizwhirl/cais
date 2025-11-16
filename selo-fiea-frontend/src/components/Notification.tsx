// src/components/Notification.tsx
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationProps {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  variant: 'admin' | 'industry' | 'public';
  isMock?: boolean; // Nova prop opcional
}

export const Notification: React.FC<NotificationProps> = ({ 
  id, 
  message, 
  type, 
  variant, 
  isMock = false // Valor padrão
}) => {
  const { removeNotification } = useNotifications();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Só remove a notificação se NÃO for um mock
    if (!isMock) {
      removeNotification(id);
    }
  };

  // 'variant' aqui aplica a classe no item, mas as cores principais 
  // são definidas pelo 'type' (success, error, info)
  const variantClass = `notification-${variant}`; 
  
  return (
    <div className={`notification-item ${type} ${variantClass}`}>
      <span className="notification-message">{message}</span>
      <button 
        className="notification-close-btn" 
        onClick={handleClose}
        disabled={isMock} // Desativa o botão se for mock
      >
        &times;
      </button>
    </div>
  );
};