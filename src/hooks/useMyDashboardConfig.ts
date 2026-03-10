import { useState, useCallback } from 'react';
import type { ModuleOption } from '../types';
import type { Layout, LayoutItem } from 'react-grid-layout/legacy';

export interface UnifiedWidgetDefinition {
    id: string;
    label: string;
    description: string;
    module: ModuleOption;
    moduleLabel: string;
}

// All widgets across all modules in one flat registry
export const ALL_WIDGETS: UnifiedWidgetDefinition[] = [
    // People
    { id: 'peopleSummaryCards', label: 'People Snapshot', description: 'Top-line KPIs: Headcount, Growth, Attrition, Experience Ratio, Span of Control.', module: 'people', moduleLabel: 'People' },
    { id: 'talentRiskScore', label: 'Early Attrition Analysis', description: 'Tracks early attrition rate of employees who left within 90 days.', module: 'people', moduleLabel: 'People' },
    { id: 'exitByTypeAndReason', label: 'Exit by Type & Reason', description: 'Breakdown of exits by resignation vs termination and root cause.', module: 'people', moduleLabel: 'People' },
    { id: 'attritionAnalysis', label: 'Exit Trend', description: 'Monthly trend of employee exits categorized by regrettable/non-regrettable.', module: 'people', moduleLabel: 'People' },
    { id: 'skillsGap', label: 'Skill Proficiency Distribution', description: 'Heatmap of skill proficiency levels across domains.', module: 'people', moduleLabel: 'People' },
    { id: 'managerWatchlist', label: 'Manager Watchlist', description: 'Managers with the highest turnover in their teams.', module: 'people', moduleLabel: 'People' },
    { id: 'topEmployees', label: 'Top Recognized', description: 'Employees ranked by badges and recognitions.', module: 'people', moduleLabel: 'People' },

    // CRM
    { id: 'crmSummaryCards', label: 'CRM Summary Cards', description: 'Top-line KPIs: Won, Invoiced, Collected, Outstanding, Unbilled.', module: 'crm', moduleLabel: 'CRM & Invoice' },
    { id: 'revenueTrend', label: 'Revenue Trend', description: 'Monthly revenue trend line chart.', module: 'crm', moduleLabel: 'CRM & Invoice' },
    { id: 'avgDaysToPay', label: 'Avg. Days to Pay', description: 'Average collection cycle time and payment efficiency.', module: 'crm', moduleLabel: 'CRM & Invoice' },
    { id: 'crmFunnelSwitcher', label: 'Pipeline Funnel', description: 'Lead and deal funnel stage conversion visualization.', module: 'crm', moduleLabel: 'CRM & Invoice' },
    { id: 'crmPipelineSummaries', label: 'Pipeline Summaries', description: 'Aggregated lead and deal counts with win/loss ratios.', module: 'crm', moduleLabel: 'CRM & Invoice' },
    { id: 'collectionGoalCard', label: 'Collection Goal', description: 'Progress towards the annual collection target.', module: 'crm', moduleLabel: 'CRM & Invoice' },
    { id: 'crmSideBySideFunnel', label: 'Side-by-Side Funnels', description: 'Deals and Leads funnel comparison displayed together.', module: 'crm', moduleLabel: 'CRM & Invoice' },
    { id: 'revenueSourceMix', label: 'Revenue Source Mix', description: 'Split between new vs existing client revenue.', module: 'crm', moduleLabel: 'CRM & Invoice' },
    { id: 'lostDealAnalysis', label: 'Lost Deal Reasons', description: 'Root causes for deals that were lost in the pipeline.', module: 'crm', moduleLabel: 'CRM & Invoice' },
    { id: 'recentLargeInflows', label: 'Key Recent Collections', description: 'Top 5 largest recent payment inflows.', module: 'crm', moduleLabel: 'CRM & Invoice' },
    { id: 'topRevenueContributors', label: 'Top Revenue Contributors', description: 'Client-wise breakdown of revenue contributions.', module: 'crm', moduleLabel: 'CRM & Invoice' },

    // Recruitment
    { id: 'recruitmentSummaryCards', label: 'Recruitment KPIs', description: 'Total Candidates, Hires, Efficiency, Open Roles.', module: 'recruitment', moduleLabel: 'Recruitment' },
    { id: 'stageConversion', label: 'Top 3 Recruiters', description: 'Top 3 recruiters ranked by hiring ratio, each with a candidate-to-join funnel.', module: 'recruitment', moduleLabel: 'Recruitment' },
    { id: 'recruitmentVelocity', label: 'Recruitment Velocity', description: 'Speed and efficiency of the hiring pipeline.', module: 'recruitment', moduleLabel: 'Recruitment' },
    { id: 'jobStatus', label: 'Job Status', description: 'Current status of all open and closed job positions.', module: 'recruitment', moduleLabel: 'Recruitment' },
    { id: 'offerAcceptance', label: 'Offer Acceptance', description: 'Ratio of accepted vs declined/pending offers.', module: 'recruitment', moduleLabel: 'Recruitment' },

    // Project Management
    { id: 'pmSummaryCards', label: 'PM Snapshot', description: 'Top-line KPIs: Projects, On-Time %, Budget Var, Resource Util.', module: 'project_management', moduleLabel: 'Project Management' },
    { id: 'projectPortfolioStatus', label: 'Project Portfolio Status', description: 'Historical view of project allocation by type and status.', module: 'project_management', moduleLabel: 'Project Management' },
    { id: 'pmHealthBreakdown', label: 'Project Delivery Health', description: 'Health scores across Fixed Cost, Hourly, and Hirebase projects.', module: 'project_management', moduleLabel: 'Project Management' },
    { id: 'revenueLeakage', label: 'Revenue Leakage Analysis', description: 'Projects exceeding budget targets, flagged by leakage amount.', module: 'project_management', moduleLabel: 'Project Management' },
    { id: 'topEffortConsumers', label: 'Top Effort Consumers', description: 'Projects consuming the most team hours this period.', module: 'project_management', moduleLabel: 'Project Management' },
    { id: 'topSkillsDemand', label: 'Top Skills Demand', description: 'Ranked skills most requested in active Hirebase contracts.', module: 'project_management', moduleLabel: 'Project Management' },
    { id: 'hirebaseByDepartment', label: 'Hirebase by Department', description: 'Resource headcount across departments split by Billable vs Non-Billable.', module: 'project_management', moduleLabel: 'Project Management' },
];

// Default visible widgets on first load — curated CEO view
const DEFAULT_VISIBLE: string[] = [
    'crmSummaryCards',
    'peopleSummaryCards',
    'revenueTrend',
    'collectionGoalCard',
    'talentRiskScore',
    'attritionAnalysis',
    'pmSummaryCards',
    'revenueLeakage',
    'recruitmentSummaryCards',
    'stageConversion',
];

// Default layout for default visible widgets
const DEFAULT_LAYOUT: LayoutItem[] = [
    { i: 'crmSummaryCards', x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 3 },
    { i: 'peopleSummaryCards', x: 0, y: 3, w: 12, h: 3, minW: 6, minH: 3 },
    { i: 'revenueTrend', x: 0, y: 6, w: 8, h: 11, minW: 6, minH: 6 },
    { i: 'collectionGoalCard', x: 8, y: 6, w: 4, h: 11, minW: 4, minH: 6 },
    { i: 'talentRiskScore', x: 0, y: 17, w: 3, h: 7, minW: 3, minH: 5 },
    { i: 'attritionAnalysis', x: 3, y: 17, w: 9, h: 9, minW: 6, minH: 8 },
    { i: 'pmSummaryCards', x: 0, y: 26, w: 12, h: 3, minW: 6, minH: 3 },
    { i: 'revenueLeakage', x: 0, y: 29, w: 7, h: 14, minW: 4, minH: 10 },
    { i: 'recruitmentSummaryCards', x: 7, y: 29, w: 5, h: 3, minW: 6, minH: 3 },
    { i: 'stageConversion', x: 7, y: 32, w: 5, h: 10, minW: 4, minH: 8 },
];

// Per-widget default layout dimensions for when a widget is newly added
export const WIDGET_DEFAULT_SIZES: Record<string, { w: number; h: number; minW: number; minH: number }> = {
    peopleSummaryCards: { w: 12, h: 3, minW: 6, minH: 3 },
    talentRiskScore: { w: 3, h: 7, minW: 3, minH: 5 },
    exitByTypeAndReason: { w: 4, h: 11, minW: 3, minH: 8 },
    attritionAnalysis: { w: 9, h: 9, minW: 6, minH: 8 },
    skillsGap: { w: 7, h: 12, minW: 4, minH: 8 },
    managerWatchlist: { w: 4, h: 10, minW: 3, minH: 7 },
    topEmployees: { w: 4, h: 10, minW: 3, minH: 7 },
    crmSummaryCards: { w: 12, h: 3, minW: 6, minH: 3 },
    revenueTrend: { w: 8, h: 11, minW: 6, minH: 6 },
    avgDaysToPay: { w: 4, h: 4, minW: 3, minH: 3 },
    crmFunnelSwitcher: { w: 4, h: 11, minW: 4, minH: 6 },
    crmPipelineSummaries: { w: 4, h: 5, minW: 3, minH: 5 },
    collectionGoalCard: { w: 4, h: 9, minW: 4, minH: 6 },
    crmSideBySideFunnel: { w: 8, h: 9, minW: 6, minH: 6 },
    revenueSourceMix: { w: 4, h: 4, minW: 4, minH: 3 },
    lostDealAnalysis: { w: 4, h: 6, minW: 4, minH: 6 },
    recentLargeInflows: { w: 4, h: 8, minW: 4, minH: 6 },
    topRevenueContributors: { w: 8, h: 8, minW: 6, minH: 6 },
    recruitmentSummaryCards: { w: 12, h: 3, minW: 6, minH: 3 },
    stageConversion: { w: 4, h: 10, minW: 4, minH: 8 },
    recruitmentVelocity: { w: 4, h: 10, minW: 4, minH: 8 },
    jobStatus: { w: 4, h: 6, minW: 3, minH: 4 },
    offerAcceptance: { w: 4, h: 7, minW: 3, minH: 4 },
    pmSummaryCards: { w: 12, h: 3, minW: 6, minH: 3 },
    projectPortfolioStatus: { w: 8, h: 14, minW: 6, minH: 8 },
    pmHealthBreakdown: { w: 4, h: 16, minW: 3, minH: 10 },
    revenueLeakage: { w: 8, h: 16, minW: 4, minH: 10 },
    topEffortConsumers: { w: 6, h: 13, minW: 3, minH: 8 },
    topSkillsDemand: { w: 6, h: 13, minW: 4, minH: 8 },
    hirebaseByDepartment: { w: 6, h: 13, minW: 4, minH: 8 },
};

const STORAGE_KEY_CONFIG = 'myDashboard_config_v1';
const STORAGE_KEY_LAYOUT = 'myDashboard_layout_v1';

function loadConfig(): Record<string, boolean> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
        if (stored) return JSON.parse(stored);
    } catch (_) { /* ignore */ }

    const defaults: Record<string, boolean> = {};
    ALL_WIDGETS.forEach(w => { defaults[w.id] = DEFAULT_VISIBLE.includes(w.id); });
    return defaults;
}

function loadLayout(): Layout {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_LAYOUT);
        if (stored) {
            const parsed = JSON.parse(stored) as LayoutItem[];
            return parsed.filter(l => ALL_WIDGETS.some(w => w.id === l.i));
        }
    } catch (_) { /* ignore */ }
    return DEFAULT_LAYOUT;
}

export function useMyDashboardConfig() {
    const [config, setConfig] = useState<Record<string, boolean>>(loadConfig);
    const [layout, setLayout] = useState<Layout>(loadLayout);

    const isVisible = useCallback((widgetId: string) => !!config[widgetId], [config]);

    const toggleWidget = useCallback((widgetId: string) => {
        setConfig(prev => {
            const isCurrentlyVisible = !!prev[widgetId];
            const next = { ...prev, [widgetId]: !isCurrentlyVisible };
            try { localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(next)); } catch (_) { }

            // When adding a new widget, append it to the bottom of the layout
            if (!isCurrentlyVisible) {
                setLayout(prevLayout => {
                    // Find max Y in current layout
                    const maxY = prevLayout.reduce((acc, item) => Math.max(acc, item.y + item.h), 0);
                    const sizes = WIDGET_DEFAULT_SIZES[widgetId] || { w: 6, h: 8, minW: 3, minH: 4 };
                    const newItem: LayoutItem = { i: widgetId, x: 0, y: maxY, ...sizes };
                    const newLayout = [...prevLayout, newItem];
                    try { localStorage.setItem(STORAGE_KEY_LAYOUT, JSON.stringify(newLayout)); } catch (_) { }
                    return newLayout;
                });
            } else {
                // When hiding, keep layout item but it won't be rendered
                setLayout(prevLayout => {
                    const newLayout = prevLayout.filter(l => l.i !== widgetId);
                    try { localStorage.setItem(STORAGE_KEY_LAYOUT, JSON.stringify(newLayout)); } catch (_) { }
                    return newLayout;
                });
            }

            return next;
        });
    }, []);

    const updateLayout = useCallback((newLayout: Layout) => {
        setLayout(newLayout);
        try { localStorage.setItem(STORAGE_KEY_LAYOUT, JSON.stringify(newLayout)); } catch (_) { }
    }, []);

    const resetToDefault = useCallback(() => {
        const defaultConfig: Record<string, boolean> = {};
        ALL_WIDGETS.forEach(w => { defaultConfig[w.id] = DEFAULT_VISIBLE.includes(w.id); });
        setConfig(defaultConfig);
        setLayout(DEFAULT_LAYOUT);
        try {
            localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(defaultConfig));
            localStorage.setItem(STORAGE_KEY_LAYOUT, JSON.stringify(DEFAULT_LAYOUT));
        } catch (_) { }
    }, []);

    const visibleWidgets = ALL_WIDGETS.filter(w => config[w.id]);
    const visibleLayout = layout.filter(l => config[l.i]);

    return { config, isVisible, toggleWidget, layout, visibleLayout, updateLayout, resetToDefault, visibleWidgets };
}
