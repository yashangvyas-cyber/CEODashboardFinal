import React, { useEffect, useRef, useState } from 'react';
import { X, Info, Check, RotateCcw, ChevronDown } from 'lucide-react';
import { ALL_WIDGETS, type UnifiedWidgetDefinition } from '../../hooks/useMyDashboardConfig';
import type { ModuleOption } from '../../types';

interface EditDashboardPanelProps {
    isOpen: boolean;
    onClose: () => void;
    config: Record<string, boolean>;
    onToggle: (widgetId: string) => void;
    onReset: () => void;
}

const MODULE_ORDER: { id: ModuleOption; label: string; color: string; bg: string }[] = [
    { id: 'crm', label: 'CRM & Invoice', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
    { id: 'people', label: 'People', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
    { id: 'project_management', label: 'Project Management', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    { id: 'recruitment', label: 'Recruitment', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
];

const EditDashboardPanel: React.FC<EditDashboardPanelProps> = ({ isOpen, onClose, config, onToggle, onReset }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(MODULE_ORDER.map(m => m.id)));

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

    // Animate in
    useEffect(() => {
        if (isOpen) {
            setExpandedModules(new Set(MODULE_ORDER.map(m => m.id)));
        }
    }, [isOpen]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(moduleId)) next.delete(moduleId);
            else next.add(moduleId);
            return next;
        });
    };

    const visibleCount = Object.values(config).filter(Boolean).length;
    const totalCount = ALL_WIDGETS.length;

    const groupedWidgets = MODULE_ORDER.map(mod => ({
        ...mod,
        widgets: ALL_WIDGETS.filter(w => w.module === mod.id),
    }));

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Slide-in Panel */}
            <div
                ref={panelRef}
                className={`fixed top-0 right-0 h-full z-50 w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Edit Dashboard</h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">{visibleCount} of {totalCount} widgets visible</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onReset}
                            title="Reset to default"
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <RotateCcw size={14} />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Hint */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                        Toggle widgets on or off. Drag widgets on the dashboard to rearrange.
                    </p>
                </div>

                {/* Widget list grouped by module */}
                <div className="flex-1 overflow-y-auto py-2">
                    {groupedWidgets.map(group => {
                        const isExpanded = expandedModules.has(group.id);
                        const visibleInGroup = group.widgets.filter(w => config[w.id]).length;

                        return (
                            <div key={group.id} className="mb-1">
                                {/* Module header */}
                                <button
                                    onClick={() => toggleModule(group.id)}
                                    className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${group.bg} ${group.color}`}>
                                            {group.label}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">{visibleInGroup}/{group.widgets.length}</span>
                                    </div>
                                    <ChevronDown
                                        size={13}
                                        className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Widget items */}
                                {isExpanded && (
                                    <div className="pb-1">
                                        {group.widgets.map(widget => {
                                            const isChecked = !!config[widget.id];
                                            return (
                                                <WidgetToggleRow
                                                    key={widget.id}
                                                    widget={widget}
                                                    isChecked={isChecked}
                                                    onToggle={() => onToggle(widget.id)}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </>
    );
};

const WidgetToggleRow: React.FC<{
    widget: UnifiedWidgetDefinition;
    isChecked: boolean;
    onToggle: () => void;
}> = ({ widget, isChecked, onToggle }) => {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors group">
            <button
                onClick={onToggle}
                className="flex items-center gap-3 flex-1 text-left"
            >
                <div
                    className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-all duration-150 ${isChecked
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'bg-white border-slate-300 group-hover:border-slate-400'
                        }`}
                >
                    {isChecked && <Check size={10} strokeWidth={3} className="text-white" />}
                </div>
                <span className={`text-[12px] flex-1 ${isChecked ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                    {widget.label}
                </span>
            </button>

            <div
                className="relative shrink-0"
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
            >
                <Info size={13} className="text-slate-300 hover:text-slate-500 transition-colors cursor-default" />
                {showInfo && (
                    <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] leading-relaxed rounded-lg z-10 shadow-xl">
                        {widget.description}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditDashboardPanel;
