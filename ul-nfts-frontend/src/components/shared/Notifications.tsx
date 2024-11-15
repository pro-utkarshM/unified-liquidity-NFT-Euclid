import { useNotifications } from '../../hooks/useNotifications';
import {
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export const Notifications = () => {
    const { notifications, removeNotification } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
            case 'error':
                return <XCircleIcon className="h-6 w-6 text-red-400" />;
            case 'warning':
                return <ExclamationCircleIcon className="h-6 w-6 text-yellow-400" />;
            default:
                return <InformationCircleIcon className="h-6 w-6 text-blue-400" />;
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-4">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`
            max-w-sm w-full bg-dark-light rounded-lg shadow-lg
            border-l-4 p-4
            ${notification.type === 'success' && 'border-green-400'}
            ${notification.type === 'error' && 'border-red-400'}
            ${notification.type === 'warning' && 'border-yellow-400'}
            ${notification.type === 'info' && 'border-blue-400'}
          `}
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
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="bg-transparent text-gray-400 hover:text-gray-200"
                                onClick={() => removeNotification(notification.id)}
                            >
                                <XCircleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};