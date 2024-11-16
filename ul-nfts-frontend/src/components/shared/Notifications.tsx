import { useNotifications } from '../../hooks/useNotifications';
import {
    FaCheckCircle,
    FaTimesCircle,
    FaInfoCircle,
    FaExclamationCircle
} from 'react-icons/fa';
import { IoCloseCircleOutline } from 'react-icons/io5';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
}

export const Notifications = () => {
    const { notifications, removeNotification } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <FaCheckCircle className="h-6 w-6 text-green-400" />;
            case 'error':
                return <FaTimesCircle className="h-6 w-6 text-red-400" />;
            case 'warning':
                return <FaExclamationCircle className="h-6 w-6 text-yellow-400" />;
            default:
                return <FaInfoCircle className="h-6 w-6 text-blue-400" />;
        }
    };

    const getBorderColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'border-green-400';
            case 'error':
                return 'border-red-400';
            case 'warning':
                return 'border-yellow-400';
            default:
                return 'border-blue-400';
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-4">
            {notifications.map((notification: Notification) => (
                <div
                    key={notification.id}
                    className={`
                        max-w-sm w-full bg-dark-light rounded-lg shadow-lg
                        border-l-4 p-4
                        ${getBorderColor(notification.type)}
                        transform transition-all duration-300 hover:scale-102
                    `}
                    role="alert"
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {getIcon(notification.type)}
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            {notification.title && (
                                <p className="text-sm font-medium text-white">
                                    {notification.title}
                                </p>
                            )}
                            <p className="text-sm text-gray-300">
                                {notification.message}
                            </p>
                        </div>
                        <button
                            className="ml-4 flex-shrink-0 inline-flex text-gray-400 
                                     hover:text-gray-200 focus:outline-none 
                                     focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                                     transition-colors duration-200"
                            onClick={() => removeNotification(notification.id)}
                            aria-label="Close notification"
                        >
                            <IoCloseCircleOutline className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
