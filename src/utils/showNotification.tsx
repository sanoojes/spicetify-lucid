import {
  addNotification,
  type NotificationItem,
  pendingQueue,
} from "@/components/NotificationManager.tsx";
import generateId from "@/utils/generateId.ts";
import type { ReactNode } from "react";

type ShowNotificationArgs = {
  message: ReactNode;
  id?: string;
  isError?: boolean;
  timeout?: number;
};

export const showNotification = ({
  message,
  id = generateId(),
  isError = false,
  timeout = 3000,
}: ShowNotificationArgs) => {
  const notification: NotificationItem = { id, message, isError, timeout };

  if (addNotification) {
    addNotification(notification);
  } else {
    pendingQueue.push(notification);
  }
};
