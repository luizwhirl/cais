import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import './Notification.css'; 

interface NotificationBellProps {
  onClick: () => void;
  variant: 'admin' | 'industry' | 'public';
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onClick, variant }) => {
  const { notifications } = useNotifications();
  const count = notifications.length;

  return (
    <button className={`notification-bell ${variant}`} onClick={onClick} aria-label="Notificações">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.93 6 11V16L4 18V19H20V18L18 16Z" />
      </svg>
      {count > 0 && (
        <span className="notification-badge">{count > 9 ? '9+' : count}</span>
      )}
    </button>
  );
};