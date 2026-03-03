import React from 'react';

interface MobileContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children, className = '' }) => {
    return (
        <div className={`w-full max-w-7xl mx-auto px-2 py-4 space-y-4 ${className}`}>
            {children}
        </div>
    );
};
