import { useState, useCallback, useEffect } from 'react';
import type { ModuleOption } from '../types';
import type { Layout, LayoutItem } from 'react-grid-layout/legacy';

export interface WidgetDefinition {
    id: string;
    label: string;
    description: string;
}

export type { Layout, LayoutItem };

// Widget registry per tab
export const WIDGET_REGISTRY: Record<ModuleOption, WidgetDefinition[]> = {
    people: [
        { id: 'peopleSummaryCards', label: 'People Snapshot', description: 'Top-line KPIs: Headcount, Growth, Attrition, Experience Ratio, Span of Control.' },
        { id: 'talentRiskScore', label: 'Early Attrition', description: 'Tracks early attrition rate of employees who left within 90 days.' },
        { id: 'exitByTypeAndReason', label: 'Exit by Type & Reason', description: 'Breakdown of exits by resignation vs termination and root cause.' },
        { id: 'attritionAnalysis', label: 'Exit Trend', description: 'Monthly trend of employee exits categorized by regrettable/non-regrettable.' },
        { id: 'skillsGap', label: 'Critical Skills Gap', description: 'Heatmap of skill proficiency levels across domains.' },
        { id: 'attritionMetrics', label: 'Exit Metrics', description: 'KPIs for total exits and average monthly exit rate.' },
        { id: 'managerWatchlist', label: 'Manager Watchlist', description: 'Managers with the highest turnover in their teams.' },
        { id: 'topEmployees', label: 'Top Recognized', description: 'Top performing employees ranked by peer recognition badges.' },
    ],
    crm: [
        { id: 'crmSummaryCards', label: 'CRM Summary Cards', description: 'Top-line KPIs: Won, Invoiced, Collected, Outstanding, Unbilled.' },
        { id: 'revenueTrend', label: 'Revenue Trend', description: 'Monthly revenue trend line chart.' },
        { id: 'avgDaysToPay', label: 'Avg. Days to Pay', description: 'Average collection cycle time and payment efficiency.' },
        { id: 'crmFunnelSwitcher', label: 'Pipeline Funnel', description: 'Lead and deal funnel stage conversion visualization.' },
        { id: 'salesMetrics', label: 'Sales Metrics', description: 'Average deal size and sales cycle length.' },
        { id: 'receivablesAging', label: 'Receivables Aging', description: 'Outstanding receivables bucketed by aging period.' },
        { id: 'crmPipelineSummaries', label: 'Pipeline Summaries', description: 'Aggregated lead and deal counts with win/loss ratios.' },
        { id: 'collectionEfficiency', label: 'Collection Efficiency', description: 'Score and trend for cash collection efficiency.' },
        { id: 'collectionGoalCard', label: 'Collection Goal', description: 'Progress towards the annual collection target.' },
        { id: 'revenueSourceMix', label: 'Revenue Source Mix', description: 'Split between new vs existing client revenue.' },
        { id: 'lostDealAnalysis', label: 'Lost Deal Analysis', description: 'Root causes for deals that were lost in the pipeline.' },
        { id: 'topRevenueContributors', label: 'Top Revenue Contributors', description: 'Client-wise breakdown of revenue contributions.' },
    ],
    recruitment: [
        { id: 'recruitmentSummaryCards', label: 'Recruitment KPIs', description: 'Top-line cards: Total Candidates, Hires, Efficiency, Open Roles.' },
        { id: 'stageConversion', label: 'Stage Conversion', description: 'Candidate funnel from application to joining.' },
        { id: 'recruitmentVelocity', label: 'Recruitment Velocity', description: 'Speed and efficiency of the hiring pipeline.' },
        { id: 'jobStatus', label: 'Job Status', description: 'Current status of all open and closed job positions.' },
        { id: 'offerAcceptance', label: 'Offer Acceptance', description: 'Ratio of accepted vs declined/pending offers.' },
    ],
    project_management: [
        { id: 'pmSummaryCards', label: 'PM Snapshot', description: 'Top-line KPIs: Projects, On-Time %, Budget Var, Resource Util.' },
        { id: 'resourceAllocationCentral', label: 'Resource Availability', description: 'Bird\'s-eye view of team allocation, availability, and utilization.' },
        { id: 'pmHealthBreakdown', label: 'Project Delivery Health', description: 'Health scores across Fixed Cost, Hourly, and Hirebase projects.' },
        { id: 'revenueLeakage', label: 'Revenue Leakage Risk', description: 'Projects exceeding budget targets, flagged by leakage amount.' },
        { id: 'topEffortConsumers', label: 'Top Effort Consumers', description: 'Projects consuming the most team hours this period.' },
        { id: 'upcomingExpirations', label: 'Upcoming Expirations', description: 'Contracts and hirebase assignments expiring soon.' },
        { id: 'timesheetCompliance', label: 'Timesheet Compliance', description: 'Departments with unapproved or missing timesheet logs.' },
        { id: 'missingAllocations', label: 'Missing Logs', description: 'Daily unlogged allocations and bench resources by department.' },
    ],
};

const DEFAULT_LAYOUTS: Record<ModuleOption, LayoutItem[]> = {
    people: [
        { i: 'peopleSummaryCards', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 },
        { i: 'talentRiskScore', x: 0, y: 4, w: 3, h: 6, minW: 3, minH: 5 },
        { i: 'attritionAnalysis', x: 3, y: 4, w: 9, h: 9, minW: 4, minH: 7 },
        { i: 'exitByTypeAndReason', x: 0, y: 13, w: 4, h: 10, minW: 3, minH: 8 },
        { i: 'skillsGap', x: 5, y: 13, w: 7, h: 11, minW: 4, minH: 8 },
        { i: 'managerWatchlist', x: 0, y: 20, w: 4, h: 9, minW: 3, minH: 7 },
        { i: 'attritionMetrics', x: 4, y: 24, w: 5, h: 9, minW: 4, minH: 5 },
        { i: 'topEmployees', x: 9, y: 24, w: 3, h: 9, minW: 3, minH: 7 },
    ],
    crm: [
        { i: 'crmSummaryCards', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 },
        { i: 'revenueTrend', x: 0, y: 4, w: 12, h: 11, minW: 6, minH: 8 },
        { i: 'crmFunnelSwitcher', x: 0, y: 15, w: 8, h: 16, minW: 6, minH: 10 },
        { i: 'crmPipelineSummaries', x: 8, y: 15, w: 4, h: 7, minW: 3, minH: 5 },
        { i: 'salesMetrics', x: 8, y: 25, w: 4, h: 5, minW: 3, minH: 4 },
        { i: 'avgDaysToPay', x: 0, y: 31, w: 4, h: 10, minW: 3, minH: 8 },
        { i: 'receivablesAging', x: 4, y: 31, w: 4, h: 10, minW: 3, minH: 8 },
        { i: 'collectionEfficiency', x: 0, y: 41, w: 2, h: 10, minW: 2, minH: 8 },
        { i: 'collectionGoalCard', x: 2, y: 41, w: 2, h: 10, minW: 2, minH: 8 },
        { i: 'revenueSourceMix', x: 4, y: 41, w: 4, h: 10, minW: 4, minH: 8 },
        { i: 'lostDealAnalysis', x: 8, y: 31, w: 4, h: 10, minW: 4, minH: 6 },
        { i: 'topRevenueContributors', x: 0, y: 51, w: 12, h: 8, minW: 6, minH: 6 },
    ],
    recruitment: [
        { i: 'recruitmentSummaryCards', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 },
        { i: 'recruitmentVelocity', x: 0, y: 4, w: 4, h: 15, minW: 4, minH: 10 },
        { i: 'stageConversion', x: 4, y: 4, w: 4, h: 15, minW: 4, minH: 10 },
        { i: 'jobStatus', x: 8, y: 4, w: 4, h: 7, minW: 3, minH: 5 },
        { i: 'offerAcceptance', x: 8, y: 11, w: 4, h: 8, minW: 3, minH: 5 },
    ],
    project_management: [
        { i: 'pmSummaryCards', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 },
        { i: 'resourceAllocationCentral', x: 0, y: 4, w: 8, h: 12, minW: 6, minH: 8 },
        { i: 'missingAllocations', x: 8, y: 4, w: 4, h: 12, minW: 3, minH: 8 },
        { i: 'pmHealthBreakdown', x: 0, y: 16, w: 4, h: 15, minW: 3, minH: 10 },
        { i: 'revenueLeakage', x: 4, y: 16, w: 8, h: 15, minW: 4, minH: 10 },
        { i: 'topEffortConsumers', x: 0, y: 31, w: 4, h: 12, minW: 3, minH: 8 },
        { i: 'upcomingExpirations', x: 4, y: 31, w: 4, h: 12, minW: 3, minH: 8 },
        { i: 'timesheetCompliance', x: 8, y: 31, w: 4, h: 12, minW: 3, minH: 8 },
    ],
};

type WidgetConfig = Record<string, boolean>;

function getInitialConfig(tab: ModuleOption): WidgetConfig {
    try {
        const stored = localStorage.getItem(`widgetConfig_${tab}`);
        if (stored) return JSON.parse(stored);
    } catch (_) { /* ignore */ }

    const defaults: WidgetConfig = {};
    WIDGET_REGISTRY[tab]?.forEach(w => { defaults[w.id] = true; });
    return defaults;
}

function getInitialLayout(tab: ModuleOption): Layout {
    try {
        const stored = localStorage.getItem(`widgetLayout_v21_${tab}`);
        if (stored) {
            const parsed = JSON.parse(stored) as LayoutItem[];
            const defaultLayout = DEFAULT_LAYOUTS[tab] || [];
            const storedIds = new Set(parsed.map(l => l.i));
            const missing = defaultLayout.filter(l => !storedIds.has(l.i));
            return [...parsed, ...missing];
        }
    } catch (_) { /* ignore */ }
    return DEFAULT_LAYOUTS[tab] || [];
}

export function useWidgetConfig(tab: ModuleOption) {
    const [config, setConfig] = useState<WidgetConfig>(() => getInitialConfig(tab));
    const [layout, setLayout] = useState<Layout>(() => getInitialLayout(tab));

    useEffect(() => {
        setConfig(getInitialConfig(tab));
        setLayout(getInitialLayout(tab));
    }, [tab]);

    const toggle = useCallback((widgetId: string) => {
        setConfig(prev => {
            const next = { ...prev, [widgetId]: !prev[widgetId] };
            try { localStorage.setItem(`widgetConfig_${tab}`, JSON.stringify(next)); } catch (_) { /* ignore */ }
            return next;
        });
    }, [tab]);

    const isVisible = useCallback((widgetId: string): boolean => {
        return config[widgetId] !== false;
    }, [config]);

    const updateLayout = useCallback((newLayout: Layout) => {
        setLayout(newLayout);
        try { localStorage.setItem(`widgetLayout_v21_${tab}`, JSON.stringify(newLayout)); } catch (_) { /* ignore */ }
    }, [tab]);

    const resetLayout = useCallback(() => {
        try {
            ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11', 'v12', 'v13', 'v14', 'v15', 'v16', 'v17', 'v18', 'v19', 'v20', 'v21'].forEach(v => {
                localStorage.removeItem(`widgetLayout_${v}_${tab}`);
            });
            localStorage.removeItem(`widgetLayout_${tab}`);
            localStorage.removeItem(`widgetConfig_${tab}`);
        } catch (_) { }

        const initialConfig = getInitialConfig(tab);
        const initialLayout = DEFAULT_LAYOUTS[tab] || [];

        setConfig(initialConfig);
        setLayout(initialLayout);
    }, [tab]);

    const visibleCount = Object.values(config).filter(Boolean).length;

    return { config, toggle, isVisible, visibleCount, layout, updateLayout, resetLayout };
}
