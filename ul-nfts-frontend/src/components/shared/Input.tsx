import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helper,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-200 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-4 py-2 bg-dark-light rounded-lg border
          ${error ? 'border-red-500' : 'border-gray-700'}
          text-white placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary
          transition duration-200
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
            {helper && !error && (
                <p className="mt-1 text-sm text-gray-400">{helper}</p>
            )}
        </div>
    );
};