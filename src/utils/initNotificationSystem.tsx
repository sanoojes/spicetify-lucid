import NotificationManager from '@/components/NotificationManager.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';

let root: ReactDOM.Root | null = null;

export default function initNotificationSystem() {
  if (root) return;

  const container = document.createElement('div');
  container.id = 'notification-root';
  document.body.appendChild(container);

  root = ReactDOM.createRoot(container);
  root.render(<NotificationManager />);
}
