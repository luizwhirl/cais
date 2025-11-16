// src/layouts/IndustryLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { NotificationBell } from '../components/NotificationBell';
import { NotificationInbox } from '../components/NotificationInbox';

export const IndustryLayout: React.FC = () => {
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  return (
    <>
      <NotificationBell 
        variant="industry" 
        onClick={() => setIsInboxOpen(prev => !prev)} 
      />

      <NotificationInbox 
        variant="industry" 
        isOpen={isInboxOpen} 
        onClose={() => setIsInboxOpen(false)} 
      />
      
      <main>
        <Outlet />
      </main>
    </>
  );
};