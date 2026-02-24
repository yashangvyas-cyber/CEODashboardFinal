import { useState, useCallback } from 'react';
import type { ModuleOption } from '../types';

export interface WidgetDefinition {
    id: string;
    label: string;
    description: string;
}

// Widget registry per tab
export const WIDGET_REGISTRY: Record<ModuleOption, WidgetDefinition[]> = {
    people: [
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
        { id: 'resourceAllocationCentral', label: 'Resource Availability', description: 'Bird\'s-eye view of team allocation, availability, and utilization.' },
        { id: 'pmHealthBreakdown', label: 'Project Delivery Health', description: 'Health scores across Fixed Cost, Hourly, and Hirebase projects.' },
        { id: 'revenueLeakage', label: 'Revenue Leakage Risk', description: 'Projects exceeding budget targets, flagged by leakage amount.' },
        { id: 'topEffortConsumers', label: 'Top Effort Consumers', description: 'Projects consuming the most team hours this period.' },
        { id: 'upcomingExpirations', label: 'Upcoming Expirations', description: 'Contracts and hirebase assignments expiring soon.' },
        { id: 'timesheetCompliance', label: 'Timesheet Compliance', description: 'Departments with unapproved or missing timesheet logs.' },
        { id: 'missingAllocations', label: 'Missing Logs', description: 'Daily unlogged allocations and bench resources by department.' },
    ],
};

type WidgetConfig = Record<string, boolean>;

function getInitialConfig(tab: ModuleOption): WidgetConfig {
    // Try to read from localStorage
    try {
        const stored = localStorage.getItem(`widgetConfig_${tab}`);
        if (stored) return JSON.parse(stored);
    } catch (_) { /* ignore */ }

    // Default: all widgets visible
    const defaults: WidgetConfig = {};
    WIDGET_REGISTRY[tab]?.forEach(w => { defaults[w.id] = true; });
    return defaults;
}

export function useWidgetConfig(tab: ModuleOption) {
    const [config, setConfig] = useState<WidgetConfig>(() => getInitialConfig(tab));

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

    const visibleCount = Object.values(config).filter(Boolean).length;

    return { config, toggle, isVisible, visibleCount };
}
