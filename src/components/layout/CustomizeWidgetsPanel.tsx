import React, { useEffect, useRef } from 'react';
import { SlidersHorizontal, X, Info, Check } from 'lucide-react';
import type { ModuleOption } from '../../types';
import { WIDGET_REGISTRY, useWidgetConfig } from '../../hooks/useWidgetConfig';

interface Props {
    tab: ModuleOption;
    isOpen: boolean;
    onClose: () => void;
    config: ReturnType<typeof useWidgetConfig>['config'];
    toggle: ReturnType<typeof useWidgetConfig>['toggle'];
}

const CustomizeWidgetsPanel: React.FC<Props> = ({ tab, isOpen, onClose, config, toggle }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const widgets = WIDGET_REGISTRY[tab] ?? [];

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            className="absolute right-0 top-full mt-2 z-50 w-72 bg-white border border-slate-200 rounded-xl shadow-xl"
            style={{ boxShadow: '0 8px 32px -4px rgba(15, 23, 42, 0.15)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-800">Customize Widgets</span>
                <button
                    onClick={onClose}
                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Widget List */}
            <div className="py-2 max-h-80 overflow-y-auto">
                {widgets.map(widget => {
                    const isChecked = config[widget.id] !== false;
                    return (
                        <button
                            key={widget.id}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group text-left"
                            onClick={() => toggle(widget.id)}
                        >
                            {/* Checkbox */}
                            <div
                                className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-all duration-150 ${isChecked
                                        ? 'bg-indigo-600 border-indigo-600'
                                        : 'bg-white border-slate-300 group-hover:border-slate-400'
                                    }`}
                            >
                                {isChecked && <Check size={10} strokeWidth={3} className="text-white" />}
                            </div>

                            {/* Label */}
                            <span className={`text-sm flex-1 ${isChecked ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                                {widget.label}
                            </span>

                            {/* Info icon with tooltip */}
                            <div className="relative group/info shrink-0">
                                <Info size={13} className="text-slate-300 group-hover/info:text-slate-500 transition-colors" />
                                <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] leading-relaxed rounded-lg opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-10">
                                    {widget.description}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                {widgets.filter(w => config[w.id] !== false).length} of {widgets.length} widgets visible
            </div>
        </div>
    );
};

interface CustomizeWidgetsButtonProps {
    tab: ModuleOption;
    config: ReturnType<typeof useWidgetConfig>['config'];
    toggle: ReturnType<typeof useWidgetConfig>['toggle'];
}

export const CustomizeWidgetsButton: React.FC<CustomizeWidgetsButtonProps> = ({ tab, config, toggle }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const widgets = WIDGET_REGISTRY[tab] ?? [];
    const visibleCount = widgets.filter(w => config[w.id] !== false).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-200 ${isOpen
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm'
                    }`}
            >
                <SlidersHorizontal size={13} />
                <span>Customize Widgets</span>
                <span
                    className={`ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isOpen ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                >
                    {visibleCount}/{widgets.length}
                </span>
            </button>

            <CustomizeWidgetsPanel
                tab={tab}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                config={config}
                toggle={toggle}
            />
        </div>
    );
};

export default CustomizeWidgetsPanel;
