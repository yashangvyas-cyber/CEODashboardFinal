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
        { id: 'skillsGap', label: 'Skill Proficiency Distribution', description: 'Heatmap of skill proficiency levels across domains.' },
        { id: 'managerWatchlist', label: 'Manager Watchlist', description: 'Managers with the highest turnover in their teams.' },
        { id: 'topEmployees', label: 'Top Recognized', description: 'The employees who as we will only consider, badges and recognitions.' },
    ],
    crm: [
        { id: 'crmSummaryCards', label: 'CRM Summary Cards', description: 'Top-line KPIs: Won, Invoiced, Collected, Outstanding, Unbilled.' },
        { id: 'revenueTrend', label: 'Revenue Trend', description: 'Monthly revenue trend line chart.' },
        { id: 'avgDaysToPay', label: 'Avg. Days to Pay', description: 'Average collection cycle time and payment efficiency.' },
        { id: 'crmFunnelSwitcher', label: 'Pipeline Funnel', description: 'Lead and deal funnel stage conversion visualization.' },
        { id: 'salesMetrics', label: 'Sales Metrics', description: 'Average deal size and sales cycle length.' },
        { id: 'crmPipelineSummaries', label: 'Pipeline Summaries', description: 'Aggregated lead and deal counts with win/loss ratios.' },
        { id: 'collectionGoalCard', label: 'Collection Goal', description: 'Progress towards the annual collection target.' },
        { id: 'revenueSourceMix', label: 'Revenue Source Mix', description: 'Split between new vs existing client revenue.' },
        { id: 'lostDealAnalysis', label: 'Lost Deal Analysis', description: 'Root causes for deals that were lost in the pipeline.' },
        { id: 'recentLargeInflows', label: 'Key Recent Collections', description: 'Top 5 largest recent payment inflows.' },
        { id: 'multiCurrencyCashFlow', label: 'Multi-Currency Flow', description: 'Cash inflows consolidated by foreign currency.' },
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
        { id: 'projectPortfolioStatus', label: 'Project Portfolio Status', description: 'Historical view of project allocation by type and status.' },
        { id: 'pmHealthBreakdown', label: 'Project Delivery Health', description: 'Health scores across Fixed Cost, Hourly, and Hirebase projects.' },
        { id: 'revenueLeakage', label: 'Revenue Leakage Risk', description: 'Projects exceeding budget targets, flagged by leakage amount.' },
        { id: 'topEffortConsumers', label: 'Top Effort Consumers', description: 'Projects consuming the most team hours this period.' },
        { id: 'contractAdjustments', label: 'Contract Adjustments', description: 'Historical view of Hired/Expired resource contracts.' },
        { id: 'timesheetCompliance', label: 'Timesheet Compliance', description: 'Departments with unapproved or missing timesheet logs.' },
        { id: 'topSkillsDemand', label: 'Top Skills Demand', description: 'Ranked skills most requested in active Hirebase contracts (from the Hired For column).' },
        { id: 'hirebaseByDepartment', label: 'Hirebase by Department', description: 'Resource headcount across departments split by Billable vs Non-Billable status.' },
    ],
};

const DEFAULT_LAYOUTS: Record<ModuleOption, LayoutItem[]> = {
    people: [
        { i: 'peopleSummaryCards', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 },
        { i: 'talentRiskScore', x: 0, y: 4, w: 3, h: 7, minW: 3, minH: 5 },
        { i: 'exitByTypeAndReason', x: 0, y: 13, w: 4, h: 11, minW: 3, minH: 8 },
        { i: 'skillsGap', x: 5, y: 13, w: 7, h: 12, minW: 4, minH: 8 },
        { i: 'managerWatchlist', x: 0, y: 20, w: 4, h: 10, minW: 3, minH: 7 },
        { i: 'topEmployees', x: 4, y: 20, w: 4, h: 10, minW: 3, minH: 7 },
    ],
    crm: [
        { i: 'crmSummaryCards', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 },
        { i: 'revenueTrend', x: 0, y: 3, w: 8, h: 11, minW: 6, minH: 6 },
        { i: 'crmFunnelSwitcher', x: 8, y: 3, w: 4, h: 11, minW: 4, minH: 6 },
        { i: 'crmPipelineSummaries', x: 0, y: 14, w: 4, h: 8, minW: 3, minH: 5 },
        { i: 'salesMetrics', x: 4, y: 14, w: 3, h: 8, minW: 3, minH: 4 },
        { i: 'lostDealAnalysis', x: 7, y: 14, w: 5, h: 10, minW: 4, minH: 6 },
        { i: 'avgDaysToPay', x: 0, y: 22, w: 6, h: 5, minW: 3, minH: 5 },
        { i: 'revenueSourceMix', x: 6, y: 22, w: 6, h: 5, minW: 4, minH: 5 },
        { i: 'collectionGoalCard', x: 0, y: 27, w: 6, h: 9, minW: 4, minH: 6 },
        { i: 'multiCurrencyCashFlow', x: 6, y: 27, w: 6, h: 7, minW: 4, minH: 6 },
        { i: 'recentLargeInflows', x: 0, y: 36, w: 6, h: 8, minW: 4, minH: 6 },
        { i: 'topRevenueContributors', x: 6, y: 36, w: 6, h: 8, minW: 6, minH: 6 },
    ],
    recruitment: [
        { i: 'recruitmentSummaryCards', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 },
        { i: 'recruitmentVelocity', x: 0, y: 4, w: 4, h: 10, minW: 4, minH: 8 },
        { i: 'stageConversion', x: 4, y: 4, w: 4, h: 10, minW: 4, minH: 8 },
        { i: 'jobStatus', x: 8, y: 4, w: 4, h: 6, minW: 3, minH: 4 },
        { i: 'offerAcceptance', x: 8, y: 10, w: 4, h: 7, minW: 3, minH: 4 },
    ],
    project_management: [
        { i: 'pmSummaryCards', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 },
        { i: 'projectPortfolioStatus', x: 0, y: 4, w: 8, h: 14, minW: 6, minH: 8 },
        { i: 'pmHealthBreakdown', x: 0, y: 18, w: 4, h: 16, minW: 3, minH: 10 },
        { i: 'revenueLeakage', x: 4, y: 18, w: 8, h: 16, minW: 4, minH: 10 },
        { i: 'topEffortConsumers', x: 0, y: 34, w: 4, h: 13, minW: 3, minH: 8 },
        { i: 'contractAdjustments', x: 4, y: 34, w: 4, h: 13, minW: 3, minH: 8 },
        { i: 'timesheetCompliance', x: 8, y: 34, w: 4, h: 13, minW: 3, minH: 8 },
        { i: 'topSkillsDemand', x: 0, y: 47, w: 6, h: 13, minW: 4, minH: 8 },
        { i: 'hirebaseByDepartment', x: 6, y: 47, w: 6, h: 13, minW: 4, minH: 8 },
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
        const stored = localStorage.getItem(`widgetLayout_v34_${tab}`);
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
        return !!config[widgetId];
    }, [config]);

    const updateLayout = useCallback((newLayout: Layout) => {
        setLayout(newLayout);
        try { localStorage.setItem(`widgetLayout_v34_${tab}`, JSON.stringify(newLayout)); } catch (_) { /* ignore */ }
    }, [tab]);

    const resetLayout = useCallback(() => {
        try {
            ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v11', 'v12', 'v13', 'v14', 'v15', 'v16', 'v17', 'v18', 'v19', 'v20', 'v21', 'v22', 'v23', 'v24', 'v25', 'v26', 'v27', 'v28', 'v29', 'v30', 'v31', 'v32', 'v33', 'v34'].forEach(v => {
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
