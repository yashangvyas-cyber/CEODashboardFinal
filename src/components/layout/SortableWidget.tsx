import React from 'react';
import { GripHorizontal } from 'lucide-react';

interface WidgetProps {
    children: React.ReactNode;
    className?: string;
}

// This is a simple wrapper that only provides the visual structure and drag handle.
// The actual drag behavior is managed by react-grid-layout via the 'dashboard-drag-handle' class.
const WidgetWrapper: React.FC<WidgetProps> = ({ children, className = '' }) => {
    return (
        <div className={`relative group h-full ${className}`}>
            {/* Drag Handle - has 'dashboard-drag-handle' class for react-grid-layout to use */}
            <div
                className="dashboard-drag-handle absolute right-4 top-4 z-[90] cursor-grab active:cursor-grabbing text-slate-300 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-sm border border-slate-100"
                title="Drag to reposition widget"
            >
                <GripHorizontal className="w-4 h-4" />
            </div>

            {/* Widget Content */}
            <div className="h-full">
                {children}
            </div>
        </div>
    );
};

export default WidgetWrapper;
