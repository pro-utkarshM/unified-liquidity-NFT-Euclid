type NotificationType = "success" | "error" | "info" | "warning";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

class NotificationService {
  private static instance: NotificationService;
  private listeners: ((notification: Notification) => void)[] = [];

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  subscribe(listener: (notification: Notification) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(
    message: string,
    type: NotificationType = "info",
    title?: string,
    duration: number = 5000
  ) {
    const notification: Notification = {
      id: Math.random().toString(36).slice(2),
      type,
      message,
      title,
      duration,
    };

    this.listeners.forEach((listener) => listener(notification));
  }
}

export const notificationService = NotificationService.getInstance();
