import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    className = ''
}) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <div className={`${sizes[size]} ${className}`}>
            <svg
                className="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
};

export const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-dark bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-dark-light p-8 rounded-lg shadow-xl flex flex-col items-center">
                <Spinner size="lg" />
                <p className="mt-4 text-lg text-white">Loading...</p>
            </div>
        </div>
    );
};