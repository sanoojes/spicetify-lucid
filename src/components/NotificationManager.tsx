import UI from "@/components/ui";
import generateId from "@/utils/generateId.ts";
import { useEffect, useRef, useState } from "react";

export type Notification = {
  id?: string;
  message: React.ReactNode;
  isError: boolean;
  timeout: number;
};

export type NotificationItem = Required<Notification>;

export const pendingQueue: Notification[] = [];

export let addNotification: ((item: Notification) => void) | null = null;

const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const notificationTimers = useRef<Map<string, number>>(new Map());

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    const timer = notificationTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      notificationTimers.current.delete(id);
    }
  };

  const processNotification = ({ id, message, isError, timeout }: Notification) => {
    const notificationId = id ?? generateId();

    // Clear existing timeout if notification with same ID already exists
    if (notificationTimers.current.has(notificationId)) {
      clearTimeout(notificationTimers.current.get(notificationId));
    }

    setNotifications((prev) => {
      const withoutExisting = prev.filter((n) => n.id !== notificationId);
      return [...withoutExisting, { id: notificationId, message, isError, timeout }];
    });

    const timer = setTimeout(() => removeNotification(notificationId), timeout);
    notificationTimers.current.set(notificationId, timer);
  };

  useEffect(() => {
    addNotification = processNotification;

    while (pendingQueue.length > 0) {
      const item = pendingQueue.shift();
      if (item) processNotification(item);
    }

    return () => {
      addNotification = null;
      notificationTimers.current.forEach(clearTimeout);
      notificationTimers.current.clear();
    };
  }, []);

  return (
    <div className="notification-container">
      {notifications.map(({ id, message, isError, timeout }) => (
        <UI.Notification
          key={id}
          message={message}
          isError={isError}
          timeout={timeout}
          onClose={() => removeNotification(id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;
