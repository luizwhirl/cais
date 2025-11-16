// src/components/NotificationInbox.tsx
import React, { useEffect, useRef } from 'react'; // Imports atualizados
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from './Notification';
import './Notification.css'; 

// Definição do tipo para os mocks
type MockNotification = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

// Exemplos de notificações
const mockAdminNotifications: MockNotification[] = [
  { id: 999, message: "Nova solicitação de auditoria da 'Indústria Têxtil S.A.'", type: 'info' },
  { id: 998, message: "Perfil 'Auditor Chefe' criado com sucesso.", type: 'success' },
  { id: 997, message: "Falha ao exportar relatório de 'Indústria ABC'.", type: 'error' },
];

const mockIndustryNotifications: MockNotification[] = [
  { id: 999, message: "Sua autoavaliação foi submetida com sucesso.", type: 'success' },
  { id: 998, message: "Auditoria agendada para 20/12/2025.", type: 'info' },
  { id: 997, message: "Documento 'Plano de Ação' pendente de envio.", type: 'error' },
];


interface NotificationInboxProps {
  isOpen: boolean;
  variant: 'admin' | 'industry' | 'public';
  onClose: () => void; 
}

export const NotificationInbox: React.FC<NotificationInboxProps> = ({ 
  isOpen, 
  variant, 
  onClose 
}) => {
  const { notifications, clearNotifications } = useNotifications();
  const inboxRef = useRef<HTMLDivElement>(null); // <-- Ref para o container da inbox

  // Efeito para "click outside"
  useEffect(() => {
    // Só executa se a inbox estiver aberta
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // 1. Verifica se o clique foi no sino (ou dentro dele)
      // Se sim, não faz nada (deixa o onClick do sino nos layouts cuidar disso)
      if (target.closest('.notification-bell')) {
        return;
      }
      
      // 2. Se o clique foi fora da inbox E não foi no sino, fecha a inbox
      if (inboxRef.current && !inboxRef.current.contains(target)) {
        onClose();
      }
    };

    // Adiciona o listener
    document.addEventListener('mousedown', handleClickOutside);

    // Limpa o listener ao desmontar ou quando isOpen mudar
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]); // Depende de isOpen e onClose

  // Se não estiver aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  // Lógica de Mock: (copiada da resposta anterior)
  const isMock = notifications.length === 0;
  let displayNotifications: MockNotification[] = notifications;

  if (isMock) {
    if (variant === 'admin') {
      displayNotifications = mockAdminNotifications;
    } else if (variant === 'industry') {
      displayNotifications = mockIndustryNotifications;
    }
  }

  return (
    // Atribui a ref ao container principal
    <div className={`notification-inbox ${variant}`} ref={inboxRef}> 
      <div className="inbox-header">
        <h3>Notificações</h3>
        
        {displayNotifications.length > 0 && !isMock && (
          <button onClick={clearNotifications} className="inbox-clear-btn">
            Limpar tudo
          </button>
        )}
        
        {isMock && displayNotifications.length > 0 && (
          <button 
            className="inbox-clear-btn" 
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
            title="Exemplos não podem ser limpos"
            disabled
          >
            Limpar tudo
          </button>
        )}
      </div>
      
      <div className="inbox-list">
        {displayNotifications.length === 0 ? (
          <p className="inbox-empty">Nenhuma notificação</p>
        ) : (
          displayNotifications.map(notification => (
            <Notification
              key={notification.id}
              id={notification.id}
              message={notification.message}
              type={notification.type}
              variant={variant}
              isMock={isMock}
            />
          ))
        )}
      </div>
    </div>
  );
};