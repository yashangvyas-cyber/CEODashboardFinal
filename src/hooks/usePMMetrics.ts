import { useMemo } from 'react';
import type { DateRangeOption, BusinessUnitOption } from '../types';

// ---------------------------------------------------------------------------
// usePMMetrics — Date-range-aware data for the Project Management tab.
//
// All data here is structured mock data that varies meaningfully based on the
// selected date range. This mirrors the usePeopleMetrics / useCrmMetrics
// pattern, making PM widgets fully reactive to the Top Bar date filter.
//
// Project type terminology (from the SaaS product):
//   - "Fixed-Price"     → Fixed budget, has Estimated Hours + Top-Up hours.
//                         Burn % = Spent / (Estimated + Top-Up Hours).
//   - "Time & Material" → Hourly billing. Target = Total Purchased (Initial +
//                         Additional Top-ups). Actual = Total Billed hours.
//   - "Dedicated (Hirebase)" → Contract-based resource billing.
//   - "Inhouse"         → Non-billable internal projects.
// ---------------------------------------------------------------------------

interface HealthMetric {
    value: number;
    status: 'Healthy' | 'Warning' | 'Critical';
    text: string;
}

interface PMHealthData {
    fixedCost: HealthMetric;
    timeAndMaterial: HealthMetric;
    hirebase: HealthMetric;
}

interface LeakageItem {
    project: string;
    type: 'Fixed Cost' | 'Hourly';
    actual: number;
    target: number;
    amount: number;
}

interface EffortItem {
    name: string;
    hours: number;
    type: 'Fixed Cost' | 'Time & Material' | 'Hirebase';
}

interface ContractItem {
    resourceOrProject: string;
    type: string;
    manager: string;
    status: 'Hired' | 'Expired' | 'Hired & Expired';
}

interface HireVsExpire {
    newlyHired: number;
    expired: number;
    netChange: number;
}

interface ComplianceItem {
    department: string;
    unapproved: number;
    missing: number;
}

interface AllocationsData {
    missingLogs: { department: string; missingCount: number }[];
    onBench: { department: string; benchCount: number }[];
}

interface PortfolioData {
    statuses: string[];
    data: Record<string, string | number>[];
}

interface SkillItem {
    skill: string;
    count: number;
}

interface DeptItem {
    department: string;
    billable: number;
    nonBillable: number;
}

interface SummaryData {
    activeProjects: number;
    projectsClosed: number;
    resourceUtilization: number;
}

export interface PMMetrics {
    summary: SummaryData;
    projectPortfolio: PortfolioData;
    healthBreakdown: PMHealthData;
    leakage: LeakageItem[];
    effortConsumers: EffortItem[];
    contractAdjustments: ContractItem[];
    hireVsExpire: HireVsExpire;
    compliance: ComplianceItem[];
    dailyAllocations: AllocationsData;
    topSkillsDemand: SkillItem[];
    hirebaseByDept: DeptItem[];
}

// ---------------------------------------------------------------------------
// Datasets per date range. Each dataset represents a genuine historical
// snapshot so the CEO sees meaningful diffs when switching periods.
// ---------------------------------------------------------------------------

const DATASETS: Record<DateRangeOption, PMMetrics> = {

    // ---- THIS YEAR (most data, current running period) --------------------
    this_year: {
        summary: {
            activeProjects: 48,
            projectsClosed: 21,
            resourceUtilization: 78,
        },
        projectPortfolio: {
            statuses: ['In Development', 'Testing', 'On Hold', 'Client Review', 'Done'],
            data: [
                { type: 'Fixed-Price', 'In Development': 4, 'Testing': 6, 'On Hold': 2, 'Client Review': 2, 'Done': 2 },
                { type: 'Dedicated (Hirebase)', 'In Development': 7, 'Testing': 9, 'On Hold': 2, 'Client Review': 4, 'Done': 3 },
                { type: 'Time & Material', 'In Development': 1, 'Testing': 7, 'On Hold': 1, 'Client Review': 1, 'Done': 0 },
                { type: 'Inhouse', 'In Development': 0, 'Testing': 1, 'On Hold': 0, 'Client Review': 0, 'Done': 0 },
            ],
        },
        healthBreakdown: {
            fixedCost: {
                value: 68,
                status: 'Warning',
                // Burn % = Spent / (Estimated + Top-Up Hours). 68% = used 68% of total purchased hours across 32 fixed projects.
                text: 'Avg burn across 32 fixed-price projects (Estimated + Top-Up hours)',
            },
            timeAndMaterial: {
                value: 39,
                status: 'Warning',
                // For T&M: Billed % = Total Billed / Total Purchased hours. 39% billed of all purchased hours.
                text: 'Only 39% of purchased T&M hours billed across 31 buckets',
            },
            hirebase: {
                value: 92,
                status: 'Healthy',
                text: 'Optimal utilization for 23 active Hirebase contracts',
            },
        },
        leakage: [
            { project: 'Alpha Software Req', type: 'Fixed Cost', actual: 2350, target: 2100, amount: 250 },
            { project: 'Chatbot App (Fixed)', type: 'Fixed Cost', actual: 950, target: 800, amount: 150 },
            { project: 'MindTree Hourly Bucket', type: 'Hourly', actual: 61, target: 24, amount: 37 },
            { project: 'Charlie Portfolio App', type: 'Fixed Cost', actual: 2050, target: 2000, amount: 50 },
            { project: 'Alpha Enterprise Dev', type: 'Hourly', actual: 24, target: 16, amount: 8 },
        ],
        effortConsumers: [
            { name: 'E-commerce App', hours: 580, type: 'Hirebase' },
            { name: 'MindTree T&M', hours: 420, type: 'Time & Material' },
            { name: 'Chatbot (Fixed)', hours: 310, type: 'Fixed Cost' },
            { name: 'Innovexa Cloud', hours: 195, type: 'Hirebase' },
            { name: 'Crypto Platform', hours: 140, type: 'Time & Material' },
        ],
        contractAdjustments: [
            { resourceOrProject: 'A. Patel (Assoc. SW Eng)', type: 'Hirebase', manager: 'Admin', status: 'Hired' },
            { resourceOrProject: 'A. Suthar (Accountant)', type: 'Hirebase', manager: 'Admin', status: 'Expired' },
            { resourceOrProject: 'D. Mehta (QA)', type: 'Hirebase', manager: 'BD', status: 'Hired' },
            { resourceOrProject: 'MI Hire (Hire Base)', type: 'Hirebase', manager: 'C. Patel', status: 'Hired & Expired' },
            { resourceOrProject: 'R. Shah (Frontend Dev)', type: 'Hirebase', manager: 'Admin', status: 'Hired' },
            { resourceOrProject: 'P. Kumar (Cloud Arch)', type: 'Hirebase', manager: 'BD', status: 'Hired' },
        ],
        hireVsExpire: { newlyHired: 12, expired: 4, netChange: 8 },
        compliance: [
            { department: 'Backend Engineering', unapproved: 45, missing: 12 },
            { department: 'Frontend UI', unapproved: 8, missing: 4 },
            { department: 'Quality Assurance', unapproved: 5, missing: 2 },
            { department: 'Business Analysis', unapproved: 0, missing: 0 },
        ],
        dailyAllocations: {
            missingLogs: [
                { department: 'Frontend UI', missingCount: 4 },
                { department: 'Backend Engineering', missingCount: 2 },
                { department: 'Business Analysis', missingCount: 1 },
            ],
            onBench: [
                { department: 'Frontend UI', benchCount: 1 },
                { department: 'Quality Assurance', benchCount: 2 },
                { department: 'Business Analysis', benchCount: 3 },
            ],
        },
        topSkillsDemand: [
            { skill: 'React JS', count: 12 },
            { skill: 'Node JS', count: 9 },
            { skill: 'Agile', count: 8 },
            { skill: 'Angular JS', count: 7 },
            { skill: 'Figma', count: 5 },
            { skill: 'Business Analysis', count: 5 },
            { skill: '3DS Max', count: 3 },
            { skill: 'FastAPI', count: 3 },
        ],
        hirebaseByDept: [
            { department: 'Business Analysis', billable: 14, nonBillable: 2 },
            { department: 'Frontend Engineering', billable: 6, nonBillable: 0 },
            { department: 'Game Developer', billable: 4, nonBillable: 0 },
            { department: 'Java Developer', billable: 3, nonBillable: 1 },
            { department: 'Cloud Architecture', billable: 2, nonBillable: 1 },
        ],
    },

    // ---- THIS QUARTER (smaller slice, recent activity) --------------------
    this_quarter: {
        summary: {
            activeProjects: 32,
            projectsClosed: 6,
            resourceUtilization: 82,
        },
        projectPortfolio: {
            statuses: ['In Development', 'Testing', 'On Hold', 'Client Review', 'Done'],
            data: [
                { type: 'Fixed-Price', 'In Development': 2, 'Testing': 4, 'On Hold': 1, 'Client Review': 1, 'Done': 1 },
                { type: 'Dedicated (Hirebase)', 'In Development': 5, 'Testing': 6, 'On Hold': 1, 'Client Review': 2, 'Done': 1 },
                { type: 'Time & Material', 'In Development': 1, 'Testing': 4, 'On Hold': 0, 'Client Review': 1, 'Done': 0 },
                { type: 'Inhouse', 'In Development': 0, 'Testing': 0, 'On Hold': 0, 'Client Review': 0, 'Done': 0 },
            ],
        },
        healthBreakdown: {
            fixedCost: {
                value: 54,
                status: 'Healthy',
                text: 'Q burn across 27 fixed-price projects — well within budget',
            },
            timeAndMaterial: {
                value: 61,
                status: 'Healthy',
                text: '61% of purchased T&M hours billed this quarter',
            },
            hirebase: {
                value: 88,
                status: 'Healthy',
                text: 'Strong billability across 21 active Hirebase contracts',
            },
        },
        leakage: [
            { project: 'Alpha Software Req', type: 'Fixed Cost', actual: 980, target: 850, amount: 130 },
            { project: 'Cosmos ERP (Fixed)', type: 'Fixed Cost', actual: 430, target: 400, amount: 30 },
            { project: 'MindTree T&M Bucket', type: 'Hourly', actual: 28, target: 20, amount: 8 },
        ],
        effortConsumers: [
            { name: 'MindTree T&M', hours: 210, type: 'Time & Material' },
            { name: 'E-commerce App', hours: 180, type: 'Hirebase' },
            { name: 'Chatbot (Fixed)', hours: 120, type: 'Fixed Cost' },
            { name: 'Crypto Platform', hours: 85, type: 'Time & Material' },
            { name: 'Innovexa Cloud', hours: 62, type: 'Hirebase' },
        ],
        contractAdjustments: [
            { resourceOrProject: 'D. Mehta (QA)', type: 'Hirebase', manager: 'BD', status: 'Hired' },
            { resourceOrProject: 'A. Suthar (Accountant)', type: 'Hirebase', manager: 'Admin', status: 'Expired' },
            { resourceOrProject: 'P. Kumar (Cloud Arch)', type: 'Hirebase', manager: 'BD', status: 'Hired' },
        ],
        hireVsExpire: { newlyHired: 5, expired: 2, netChange: 3 },
        compliance: [
            { department: 'Backend Engineering', unapproved: 18, missing: 5 },
            { department: 'Frontend UI', unapproved: 3, missing: 2 },
            { department: 'Quality Assurance', unapproved: 2, missing: 1 },
            { department: 'Business Analysis', unapproved: 0, missing: 0 },
        ],
        dailyAllocations: {
            missingLogs: [
                { department: 'Backend Engineering', missingCount: 3 },
                { department: 'Frontend UI', missingCount: 1 },
            ],
            onBench: [
                { department: 'Quality Assurance', benchCount: 1 },
                { department: 'Business Analysis', benchCount: 2 },
            ],
        },
        topSkillsDemand: [
            { skill: 'React JS', count: 7 },
            { skill: 'Node JS', count: 5 },
            { skill: 'Business Analysis', count: 4 },
            { skill: 'Angular JS', count: 3 },
            { skill: 'Figma', count: 2 },
            { skill: '3DS Max', count: 2 },
            { skill: 'FastAPI', count: 1 },
        ],
        hirebaseByDept: [
            { department: 'Business Analysis', billable: 10, nonBillable: 1 },
            { department: 'Frontend Engineering', billable: 5, nonBillable: 0 },
            { department: 'Game Developer', billable: 3, nonBillable: 0 },
            { department: 'Java Developer', billable: 2, nonBillable: 1 },
            { department: 'Cloud Architecture', billable: 2, nonBillable: 0 },
        ],
    },

    // ---- LAST QUARTER (full closed quarter) -------------------------------
    last_quarter: {
        summary: {
            activeProjects: 29,
            projectsClosed: 8,
            resourceUtilization: 74,
        },
        projectPortfolio: {
            statuses: ['In Development', 'Testing', 'On Hold', 'Client Review', 'Done'],
            data: [
                { type: 'Fixed-Price', 'In Development': 3, 'Testing': 3, 'On Hold': 3, 'Client Review': 1, 'Done': 3 },
                { type: 'Dedicated (Hirebase)', 'In Development': 4, 'Testing': 5, 'On Hold': 2, 'Client Review': 2, 'Done': 3 },
                { type: 'Time & Material', 'In Development': 1, 'Testing': 3, 'On Hold': 1, 'Client Review': 0, 'Done': 0 },
                { type: 'Inhouse', 'In Development': 0, 'Testing': 1, 'On Hold': 0, 'Client Review': 0, 'Done': 0 },
            ],
        },
        healthBreakdown: {
            fixedCost: {
                value: 82,
                status: 'Critical',
                text: '3 fixed-price projects exceeded total purchased hours (Estimated + Top-Ups)',
            },
            timeAndMaterial: {
                value: 34,
                status: 'Warning',
                text: 'Only 34% of T&M purchased hours were billed — low efficiency',
            },
            hirebase: {
                value: 80,
                status: 'Warning',
                text: '4 Hirebase contracts went non-billable last quarter',
            },
        },
        leakage: [
            { project: 'Chatbot App (Fixed)', type: 'Fixed Cost', actual: 1800, target: 1500, amount: 300 },
            { project: 'Alpha Software Req', type: 'Fixed Cost', actual: 1100, target: 900, amount: 200 },
            { project: 'DB T&M Bucket', type: 'Hourly', actual: 55, target: 36, amount: 19 },
            { project: 'Charlie Portfolio (Fixed)', type: 'Fixed Cost', actual: 2010, target: 1950, amount: 60 },
        ],
        effortConsumers: [
            { name: 'Chatbot (Fixed)', hours: 430, type: 'Fixed Cost' },
            { name: 'E-commerce App', hours: 380, type: 'Hirebase' },
            { name: 'MindTree T&M', hours: 290, type: 'Time & Material' },
            { name: 'Crypto Platform', hours: 150, type: 'Time & Material' },
            { name: 'Innovexa Cloud', hours: 90, type: 'Hirebase' },
        ],
        contractAdjustments: [
            { resourceOrProject: 'A. Patel (Assoc. SW Eng)', type: 'Hirebase', manager: 'Admin', status: 'Hired' },
            { resourceOrProject: 'N. Desai (BA Lead)', type: 'Hirebase', manager: 'C. Patel', status: 'Expired' },
            { resourceOrProject: 'S. Joshi (Dev Ops)', type: 'Hirebase', manager: 'Admin', status: 'Hired' },
            { resourceOrProject: 'MI Hire (Hire Base)', type: 'Hirebase', manager: 'C. Patel', status: 'Hired & Expired' },
        ],
        hireVsExpire: { newlyHired: 7, expired: 6, netChange: 1 },
        compliance: [
            { department: 'Backend Engineering', unapproved: 52, missing: 18 },
            { department: 'Quality Assurance', unapproved: 14, missing: 6 },
            { department: 'Frontend UI', unapproved: 9, missing: 3 },
            { department: 'Business Analysis', unapproved: 2, missing: 1 },
        ],
        dailyAllocations: {
            missingLogs: [
                { department: 'Backend Engineering', missingCount: 6 },
                { department: 'Frontend UI', missingCount: 3 },
                { department: 'Quality Assurance', missingCount: 2 },
            ],
            onBench: [
                { department: 'Frontend UI', benchCount: 2 },
                { department: 'Quality Assurance', benchCount: 3 },
                { department: 'Business Analysis', benchCount: 4 },
            ],
        },
        topSkillsDemand: [
            { skill: 'Node JS', count: 11 },
            { skill: 'React JS', count: 9 },
            { skill: 'Business Analysis', count: 7 },
            { skill: 'Agile', count: 6 },
            { skill: '3DS Max', count: 4 },
            { skill: 'Angular JS', count: 4 },
            { skill: 'FastAPI', count: 2 },
        ],
        hirebaseByDept: [
            { department: 'Business Analysis', billable: 11, nonBillable: 3 },
            { department: 'Frontend Engineering', billable: 5, nonBillable: 1 },
            { department: 'Game Developer', billable: 4, nonBillable: 0 },
            { department: 'Java Developer', billable: 2, nonBillable: 2 },
            { department: 'Cloud Architecture', billable: 1, nonBillable: 2 },
        ],
    },

    // ---- YTD (Year-to-Date — same snapshot as this_year for mock data) ----
    ytd: {
        summary: {
            activeProjects: 48,
            projectsClosed: 21,
            resourceUtilization: 78,
        },
        projectPortfolio: {
            statuses: ['In Development', 'Testing', 'On Hold', 'Client Review', 'Done'],
            data: [
                { type: 'Fixed-Price', 'In Development': 4, 'Testing': 6, 'On Hold': 2, 'Client Review': 2, 'Done': 2 },
                { type: 'Dedicated (Hirebase)', 'In Development': 7, 'Testing': 9, 'On Hold': 2, 'Client Review': 4, 'Done': 3 },
                { type: 'Time & Material', 'In Development': 1, 'Testing': 7, 'On Hold': 1, 'Client Review': 1, 'Done': 0 },
                { type: 'Inhouse', 'In Development': 0, 'Testing': 1, 'On Hold': 0, 'Client Review': 0, 'Done': 0 },
            ],
        },
        healthBreakdown: {
            fixedCost: { value: 68, status: 'Warning', text: 'YTD burn across 32 fixed-price projects (Estimated + Top-Up hours)' },
            timeAndMaterial: { value: 39, status: 'Warning', text: 'Only 39% of purchased T&M hours billed YTD across 31 buckets' },
            hirebase: { value: 92, status: 'Healthy', text: 'Optimal utilization for 23 active Hirebase contracts' },
        },
        leakage: [
            { project: 'Alpha Software Req', type: 'Fixed Cost', actual: 2350, target: 2100, amount: 250 },
            { project: 'Chatbot App (Fixed)', type: 'Fixed Cost', actual: 950, target: 800, amount: 150 },
            { project: 'MindTree T&M Bucket', type: 'Hourly', actual: 61, target: 24, amount: 37 },
            { project: 'Charlie Portfolio App', type: 'Fixed Cost', actual: 2050, target: 2000, amount: 50 },
            { project: 'Alpha Enterprise Dev', type: 'Hourly', actual: 24, target: 16, amount: 8 },
        ],
        effortConsumers: [
            { name: 'E-commerce App', hours: 580, type: 'Hirebase' },
            { name: 'MindTree T&M', hours: 420, type: 'Time & Material' },
            { name: 'Chatbot (Fixed)', hours: 310, type: 'Fixed Cost' },
            { name: 'Innovexa Cloud', hours: 195, type: 'Hirebase' },
            { name: 'Crypto Platform', hours: 140, type: 'Time & Material' },
        ],
        contractAdjustments: [
            { resourceOrProject: 'A. Patel (Assoc. SW Eng)', type: 'Hirebase', manager: 'Admin', status: 'Hired' },
            { resourceOrProject: 'A. Suthar (Accountant)', type: 'Hirebase', manager: 'Admin', status: 'Expired' },
            { resourceOrProject: 'D. Mehta (QA)', type: 'Hirebase', manager: 'BD', status: 'Hired' },
            { resourceOrProject: 'MI Hire (Hire Base)', type: 'Hirebase', manager: 'C. Patel', status: 'Hired & Expired' },
        ],
        hireVsExpire: { newlyHired: 12, expired: 4, netChange: 8 },
        compliance: [
            { department: 'Backend Engineering', unapproved: 45, missing: 12 },
            { department: 'Frontend UI', unapproved: 8, missing: 4 },
            { department: 'Quality Assurance', unapproved: 5, missing: 2 },
            { department: 'Business Analysis', unapproved: 0, missing: 0 },
        ],
        dailyAllocations: {
            missingLogs: [
                { department: 'Frontend UI', missingCount: 4 },
                { department: 'Backend Engineering', missingCount: 2 },
                { department: 'Business Analysis', missingCount: 1 },
            ],
            onBench: [
                { department: 'Frontend UI', benchCount: 1 },
                { department: 'Quality Assurance', benchCount: 2 },
                { department: 'Business Analysis', benchCount: 3 },
            ],
        },
        topSkillsDemand: [
            { skill: 'React JS', count: 12 },
            { skill: 'Node JS', count: 9 },
            { skill: 'Agile', count: 8 },
            { skill: 'Angular JS', count: 7 },
            { skill: 'Figma', count: 5 },
            { skill: 'Business Analysis', count: 5 },
            { skill: '3DS Max', count: 3 },
            { skill: 'FastAPI', count: 3 },
        ],
        hirebaseByDept: [
            { department: 'Business Analysis', billable: 14, nonBillable: 2 },
            { department: 'Frontend Engineering', billable: 6, nonBillable: 0 },
            { department: 'Game Developer', billable: 4, nonBillable: 0 },
            { department: 'Java Developer', billable: 3, nonBillable: 1 },
            { department: 'Cloud Architecture', billable: 2, nonBillable: 1 },
        ],
    },

    // ---- LAST YEAR (full historical year) ---------------------------------
    last_year: {
        summary: {
            activeProjects: 41,
            projectsClosed: 28,
            resourceUtilization: 71,
        },
        projectPortfolio: {
            statuses: ['In Development', 'Testing', 'On Hold', 'Client Review', 'Done'],
            data: [
                { type: 'Fixed-Price', 'In Development': 5, 'Testing': 4, 'On Hold': 4, 'Client Review': 2, 'Done': 8 },
                { type: 'Dedicated (Hirebase)', 'In Development': 6, 'Testing': 7, 'On Hold': 3, 'Client Review': 3, 'Done': 7 },
                { type: 'Time & Material', 'In Development': 2, 'Testing': 3, 'On Hold': 2, 'Client Review': 1, 'Done': 4 },
                { type: 'Inhouse', 'In Development': 0, 'Testing': 0, 'On Hold': 1, 'Client Review': 0, 'Done': 1 },
            ],
        },
        healthBreakdown: {
            fixedCost: {
                value: 77,
                status: 'Warning',
                text: 'Avg burn across 38 fixed-price projects over the full year',
            },
            timeAndMaterial: {
                value: 58,
                status: 'Healthy',
                text: '58% of T&M purchased hours billed — improving trend vs prior year',
            },
            hirebase: {
                value: 85,
                status: 'Warning',
                text: 'Fell just below the 85% threshold — 6 non-billable contracts',
            },
        },
        leakage: [
            { project: 'Chatbot App (Fixed)', type: 'Fixed Cost', actual: 3200, target: 2800, amount: 400 },
            { project: 'Alpha Software Req', type: 'Fixed Cost', actual: 4100, target: 3700, amount: 400 },
            { project: 'Cosmos ERP (Fixed)', type: 'Fixed Cost', actual: 2300, target: 2100, amount: 200 },
            { project: 'MindTree T&M Bucket', type: 'Hourly', actual: 110, target: 80, amount: 30 },
            { project: 'Charlie Portfolio (Fixed)', type: 'Fixed Cost', actual: 3900, target: 3800, amount: 100 },
        ],
        effortConsumers: [
            { name: 'E-commerce App', hours: 1820, type: 'Hirebase' },
            { name: 'Chatbot (Fixed)', hours: 1480, type: 'Fixed Cost' },
            { name: 'MindTree T&M', hours: 1230, type: 'Time & Material' },
            { name: 'Alpha Enterprise', hours: 940, type: 'Time & Material' },
            { name: 'Innovexa Cloud', hours: 710, type: 'Hirebase' },
        ],
        contractAdjustments: [
            { resourceOrProject: 'A. Patel (Assoc. SW Eng)', type: 'Hirebase', manager: 'Admin', status: 'Hired' },
            { resourceOrProject: 'A. Suthar (Accountant)', type: 'Hirebase', manager: 'Admin', status: 'Expired' },
            { resourceOrProject: 'D. Mehta (QA)', type: 'Hirebase', manager: 'BD', status: 'Hired' },
            { resourceOrProject: 'MI Hire (Hire Base)', type: 'Hirebase', manager: 'C. Patel', status: 'Hired & Expired' },
            { resourceOrProject: 'N. Desai (BA Lead)', type: 'Hirebase', manager: 'C. Patel', status: 'Expired' },
            { resourceOrProject: 'S. Joshi (Dev Ops)', type: 'Hirebase', manager: 'Admin', status: 'Hired' },
            { resourceOrProject: 'R. Shah (Frontend Dev)', type: 'Hirebase', manager: 'Admin', status: 'Hired' },
        ],
        hireVsExpire: { newlyHired: 18, expired: 11, netChange: 7 },
        compliance: [
            { department: 'Backend Engineering', unapproved: 168, missing: 48 },
            { department: 'Frontend UI', unapproved: 34, missing: 14 },
            { department: 'Quality Assurance', unapproved: 21, missing: 9 },
            { department: 'Business Analysis', unapproved: 5, missing: 3 },
        ],
        dailyAllocations: {
            missingLogs: [
                { department: 'Backend Engineering', missingCount: 18 },
                { department: 'Frontend UI', missingCount: 9 },
                { department: 'Quality Assurance', missingCount: 5 },
                { department: 'Business Analysis', missingCount: 2 },
            ],
            onBench: [
                { department: 'Frontend UI', benchCount: 3 },
                { department: 'Quality Assurance', benchCount: 4 },
                { department: 'Business Analysis', benchCount: 5 },
            ],
        },
        topSkillsDemand: [
            { skill: 'React JS', count: 18 },
            { skill: 'Node JS', count: 15 },
            { skill: 'Agile', count: 13 },
            { skill: 'Business Analysis', count: 11 },
            { skill: 'Angular JS', count: 9 },
            { skill: 'Figma', count: 7 },
            { skill: '3DS Max', count: 5 },
            { skill: 'FastAPI', count: 4 },
            { skill: 'Cloud Arch.', count: 3 },
        ],
        hirebaseByDept: [
            { department: 'Business Analysis', billable: 20, nonBillable: 4 },
            { department: 'Frontend Engineering', billable: 9, nonBillable: 1 },
            { department: 'Game Developer', billable: 6, nonBillable: 0 },
            { department: 'Java Developer', billable: 4, nonBillable: 3 },
            { department: 'Cloud Architecture', billable: 3, nonBillable: 2 },
        ],
    },
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePMMetrics(
    dateRange: DateRangeOption,
    _businessUnit: BusinessUnitOption
): { data: PMMetrics; loading: false } {
    // useMemo ensures the object reference only changes when inputs change,
    // preventing unnecessary child re-renders.
    const data = useMemo<PMMetrics>(() => {
        // Fall back to this_year if an unsupported range is passed.
        return DATASETS[dateRange] ?? DATASETS['this_year'];
    }, [dateRange]);

    // loading is always false since this is mock/structured data.
    // When a real API is wired in, replace this with useState + useEffect.
    return { data, loading: false };
}
