// src/layouts/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NotificationBell } from '../components/NotificationBell';
import { NotificationInbox } from '../components/NotificationInbox';

export const AdminLayout: React.FC = () => {
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  return (
    <>
      <NotificationBell 
        variant="admin" 
        onClick={() => setIsInboxOpen(prev => !prev)} 
      />

      <NotificationInbox 
        variant="admin" 
        isOpen={isInboxOpen} 
        onClose={() => setIsInboxOpen(false)} 
      />
      
      <main>
        <Outlet />
      </main>
    </>
  );
};