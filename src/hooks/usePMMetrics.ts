import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { BusinessUnitOption, DateRangeOption } from '../types';

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

export function usePMMetrics(dateRange: DateRangeOption, businessUnit: BusinessUnitOption) {
    const [data, setData] = useState<PMMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                setLoading(true);

                if (!supabase) throw new Error("Supabase client not initialized.");

                // Fetch projects
                let projQuery = supabase.from('projects').select('*');
                if (businessUnit !== 'all') {
                    projQuery = projQuery.eq('business_unit', businessUnit);
                }
                const { data: allProjects, error: projError } = await projQuery;
                if (projError) throw projError;

                // Fetch employees (for skills/bench/compliance mocks where needed)
                let empQuery = supabase.from('employees').select('*');
                if (businessUnit !== 'all') {
                    empQuery = empQuery.eq('business_unit', businessUnit);
                }
                const { data: employees, error: empError } = await empQuery;
                if (empError) throw empError;

                const now = new Date();
                let startDate = new Date();
                let endDate = new Date();

                switch (dateRange) {
                    case 'this_month':
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                        break;
                    case 'last_month':
                        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                        break;
                    case 'this_quarter':
                        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                        endDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
                        break;
                    case 'last_quarter':
                        startDate = new Date(now.getFullYear(), (Math.floor(now.getMonth() / 3) - 1) * 3, 1);
                        endDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0);
                        break;
                    case 'ytd':
                    case 'this_year':
                        startDate = new Date(now.getFullYear(), 0, 1);
                        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                        break;
                    case 'last_year':
                        startDate = new Date(now.getFullYear() - 1, 0, 1);
                        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
                        break;
                    default: // 'all_time'
                        startDate = new Date(2000, 0, 1);
                        endDate = new Date(2100, 0, 1);
                }

                // Filter projects by date (assuming created_at represents project timeframe for demo)
                const projects = (allProjects || []).filter(p => {
                    const d = new Date(p.created_at);
                    return d >= startDate && d <= endDate;
                });

                // 1. Summary
                const activeProjects = projects.filter(p => ['Active', 'At Risk'].includes(p.status)).length;
                const projectsClosed = projects.filter(p => p.status === 'Completed').length;

                // Calculate Resource Utilization (Spent / Budget overall)
                const totalSpent = projects.reduce((sum, p) => sum + Number(p.spent_hours || 0), 0);
                const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget_hours || 0), 0);
                const resourceUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

                // 2. Project Portfolio (Grouping by type and status)
                const statuses = ['Active', 'Paused', 'Completed', 'At Risk'];
                const types = ['Fixed Cost', 'Hourly', 'Hirebase'];
                const portfolioData = types.map(type => {
                    const typeProjs = projects.filter(p => p.type === type);
                    const row: any = { type: type === 'Fixed Cost' ? 'Fixed-Price' : type === 'Hourly' ? 'Time & Material' : 'Dedicated (Hirebase)' };
                    statuses.forEach(status => {
                        row[status] = typeProjs.filter(p => p.status === status).length;
                    });
                    return row;
                });

                // 3. Health Breakdown
                const fixedProjects = projects.filter(p => p.type === 'Fixed Cost');
                const tnmProjects = projects.filter(p => p.type === 'Hourly');
                const hirebaseProjects = projects.filter(p => p.type === 'Hirebase');

                const calcHealth = (projs: any[], description: string) => {
                    if (projs.length === 0) return { value: 0, status: 'Healthy' as const, text: `No ${description} projects` };
                    const spent = projs.reduce((sum, p) => sum + Number(p.spent_hours), 0);
                    const budget = projs.reduce((sum, p) => sum + Number(p.budget_hours), 0);
                    const burn = budget > 0 ? Math.round((spent / budget) * 100) : 0;

                    let status: 'Healthy' | 'Warning' | 'Critical' = 'Healthy';
                    if (burn > 100) status = 'Critical';
                    else if (burn > 85) status = 'Warning';

                    return {
                        value: burn,
                        status,
                        text: `Avg burn across ${projs.length} ${description} projects`
                    };
                };

                const healthBreakdown: PMHealthData = {
                    fixedCost: calcHealth(fixedProjects, 'fixed-price'),
                    timeAndMaterial: calcHealth(tnmProjects, 'T&M'),
                    hirebase: calcHealth(hirebaseProjects, 'Hirebase')
                };

                // 4. Leakage (Projects over budget)
                const leakageList = projects
                    .filter(p => Number(p.spent_hours) > Number(p.budget_hours))
                    .map(p => ({
                        project: p.name,
                        type: p.type === 'Hourly' ? 'Hourly' : 'Fixed Cost',
                        actual: Number(p.spent_hours),
                        target: Number(p.budget_hours),
                        amount: Number(p.spent_hours) - Number(p.budget_hours)
                    }))
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 5) as LeakageItem[];

                // 5. Effort Consumers (Top spent hours)
                const effortConsumers = [...projects]
                    .sort((a, b) => Number(b.spent_hours) - Number(a.spent_hours))
                    .slice(0, 5)
                    .map(p => ({
                        name: p.name,
                        hours: Number(p.spent_hours),
                        type: p.type === 'Hourly' ? 'Time & Material' : (p.type === 'Fixed Cost' ? 'Fixed Cost' : 'Hirebase')
                    })) as EffortItem[];

                // 6. Top Skills Demand
                const skillCounts: Record<string, number> = {};
                (employees || []).forEach(emp => {
                    (emp.skills || []).forEach((skill: string) => {
                        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                    });
                });
                const topSkillsDemand = Object.entries(skillCounts)
                    .map(([skill, count]) => ({ skill, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 8);

                // 7. Hirebase By Dept
                const deptCounts: Record<string, { billable: number, nonBillable: number }> = {};
                (employees || []).forEach(emp => {
                    const dept = emp.department;
                    if (!deptCounts[dept]) deptCounts[dept] = { billable: 0, nonBillable: 0 };
                    // Fake billability for the sake of the visualization
                    if (emp.status === 'Active' && Math.random() > 0.2) {
                        deptCounts[dept].billable++;
                    } else {
                        deptCounts[dept].nonBillable++;
                    }
                });

                const hirebaseByDept = Object.entries(deptCounts)
                    .map(([department, counts]) => ({ department, ...counts }))
                    .sort((a, b) => (b.billable + b.nonBillable) - (a.billable + a.nonBillable))
                    .slice(0, 5);


                // Build final object (with some static mocks for extremely specific PM UI elements 
                // like timesheet compliance and daily allocations which aren't in standard HR schema)
                setData({
                    summary: {
                        activeProjects,
                        projectsClosed,
                        resourceUtilization
                    },
                    projectPortfolio: {
                        statuses,
                        data: portfolioData
                    },
                    healthBreakdown,
                    leakage: leakageList,
                    effortConsumers,
                    topSkillsDemand,
                    hirebaseByDept,
                    // Mocks for highly specific UI components where schema doesn't match
                    contractAdjustments: [
                        { resourceOrProject: 'A. Patel (Assoc. SW Eng)', type: 'Hirebase', manager: 'Admin', status: 'Hired' },
                        { resourceOrProject: 'A. Suthar (Accountant)', type: 'Hirebase', manager: 'Admin', status: 'Expired' },
                        { resourceOrProject: 'D. Mehta (QA)', type: 'Hirebase', manager: 'BD', status: 'Hired' },
                    ],
                    hireVsExpire: { newlyHired: 12, expired: 4, netChange: 8 },
                    compliance: [
                        { department: 'Backend Engineering', unapproved: 45, missing: 12 },
                        { department: 'Frontend UI', unapproved: 8, missing: 4 },
                        { department: 'Quality Assurance', unapproved: 5, missing: 2 },
                    ],
                    dailyAllocations: {
                        missingLogs: [
                            { department: 'Frontend UI', missingCount: 4 },
                            { department: 'Backend Engineering', missingCount: 2 },
                        ],
                        onBench: [
                            { department: 'Frontend UI', benchCount: 1 },
                            { department: 'Quality Assurance', benchCount: 2 },
                        ],
                    }
                });

            } catch (err: any) {
                console.error('Error fetching PM metrics:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();
    }, [dateRange, businessUnit]);

    return { data, loading, error };
}
