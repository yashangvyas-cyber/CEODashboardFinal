import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { BusinessUnitOption, DateRangeOption } from '../types';

export interface PeopleMetrics {
    summary: {
        totalHeadcount: number;
        newJoins: number;
        exits: number;
        attritionRate: number;
        shadows: number;
        experts: number;
        totalManagers: number;
        headcountTrend?: { value: number; percent: number; };
    };
    talentRisk: {
        compositeScore: number;
        earlyAttrition: { exitsUnder90Days: number; newJoins: number };
        status: string;
    };
    exitByTypeAndReason: {
        types: string[];
        chartDataMap: Record<string, any[]>;
    };
    exitTrend: {
        chartData: any[];
        kpis: any;
    };
    skillsGap: any[];
    managerWatchlist: any[];
    topEmployees: any[];
    leaveAndDeptRisk: any;
}

export function usePeopleMetrics(dateRange: DateRangeOption, businessUnit: BusinessUnitOption) {
    const [data, setData] = useState<PeopleMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                setLoading(true);

                // Fetch all employees (apply BU filter if needed)
                if (!supabase) throw new Error("Supabase client not initialized.");
                let empQuery = supabase.from('employees').select('*');
                if (businessUnit !== 'all') {
                    empQuery = empQuery.eq('business_unit', businessUnit);
                }
                const { data: employees, error: empError } = await empQuery;
                if (empError) throw empError;

                const now = new Date();
                let startDate = new Date();
                let endDate = new Date();
                let prevEndDate = new Date();

                switch (dateRange) {
                    case 'this_month': {
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                        prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
                        break;
                    }
                    case 'last_month': {
                        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                        endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of last month
                        prevEndDate = new Date(now.getFullYear(), now.getMonth() - 1, 0); // Last day of two months ago
                        break;
                    }
                    case 'this_quarter': {
                        const currentQuarter = Math.floor(now.getMonth() / 3);
                        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
                        // endDate is current time
                        prevEndDate = new Date(now.getFullYear(), currentQuarter * 3, 0); // Last day of last quarter
                        break;
                    }
                    case 'last_quarter': {
                        const currentQuarter = Math.floor(now.getMonth() / 3);
                        startDate = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
                        endDate = new Date(now.getFullYear(), currentQuarter * 3, 0); // last day of prev quarter
                        prevEndDate = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 0); // Last day of quarter before that
                        break;
                    }
                    case 'ytd': {
                        startDate = new Date(now.getFullYear(), 0, 1);
                        prevEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59); // End of last year
                        break;
                    }
                    case 'this_year': {
                        startDate = new Date(now.getFullYear(), 0, 1);
                        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                        prevEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
                        break;
                    }
                    case 'last_year': {
                        startDate = new Date(now.getFullYear() - 1, 0, 1);
                        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
                        prevEndDate = new Date(now.getFullYear() - 2, 11, 31, 23, 59, 59);
                        break;
                    }
                    default:
                        startDate.setFullYear(now.getFullYear() - 1);
                        prevEndDate = new Date(startDate);
                }

                /* Process Summary Data */
                let totalHeadcount = 0;
                let prevHeadcount = 0;
                let newJoins = 0;
                let exits = 0;
                let experts = 0;
                let shadows = 0;

                const exitReasons: Record<string, Record<string, number>> = {};
                const exitTypes = new Set<string>();

                // exitTrend defaults (dynamic based on dateRange)
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const trendMap: Record<string, any> = {};

                const startYear = startDate.getFullYear();
                const startMonth = startDate.getMonth();
                const endYear = endDate.getFullYear();
                const endMonth = endDate.getMonth();
                const totalMonths = Math.max(1, (endYear - startYear) * 12 + (endMonth - startMonth) + 1);

                for (let i = 0; i < totalMonths; i++) {
                    const d = new Date(startYear, startMonth + i, 1);
                    const label = `${monthNames[d.getMonth()]}-${d.getFullYear().toString().slice(-2)}`;
                    trendMap[label] = { month: label, regrettable: 0, nonRegrettable: 0, unspecified: 0 };
                }

                // Skills distribution
                const skillsMap: Record<string, any> = {};

                (employees || []).forEach(emp => {
                    const hireDate = new Date(emp.hire_date);
                    const exitDate = emp.exit_date ? new Date(emp.exit_date) : null;

                    // Headcount is active employees at the END of the period
                    const isActiveAtEnd = hireDate <= endDate && (!exitDate || exitDate > endDate);

                    // Headcount active at the END of the previous period
                    const isActiveAtPrevEnd = hireDate <= prevEndDate && (!exitDate || exitDate > prevEndDate);

                    if (isActiveAtEnd) totalHeadcount++;
                    if (isActiveAtPrevEnd) prevHeadcount++;

                    if (hireDate >= startDate && hireDate <= endDate) newJoins++;

                    if (emp.status === 'Exited' && exitDate && exitDate >= startDate && exitDate <= endDate) {
                        exits++;

                        // Exit by Type and Reason
                        let type = emp.exit_type || 'Other';
                        if (type === 'Voluntary') type = 'Resignation';
                        if (type === 'Involuntary') type = 'Termination';

                        const reason = emp.exit_reason || 'Unspecified';
                        exitTypes.add(type);
                        if (!exitReasons[type]) exitReasons[type] = {};
                        exitReasons[type][reason] = (exitReasons[type][reason] || 0) + 1;

                        // Exit trend
                        const mLabel = `${monthNames[exitDate.getMonth()]}-${exitDate.getFullYear().toString().slice(-2)}`;
                        if (trendMap[mLabel]) {
                            if (reason === 'Better Opportunity') trendMap[mLabel].regrettable++;
                            else if (reason === 'Unspecified') trendMap[mLabel].unspecified++;
                            else trendMap[mLabel].nonRegrettable++;
                        }
                    }

                    if (isActiveAtEnd) {
                        // Experts vs Shadows proxy using salary/skills
                        if (emp.salary > 120000 || (emp.skills && emp.skills.length >= 3)) experts++;
                        else shadows++;

                        // Skills gap
                        (emp.skills || []).forEach((skill: string) => {
                            if (!skillsMap[skill]) {
                                skillsMap[skill] = { skill, domain: emp.department, levels: { beginner: 0, intermediate: 0, experienced: 0 } };
                            }
                            // Proxy level by salary
                            if (emp.salary > 140000) skillsMap[skill].levels.experienced++;
                            else if (emp.salary > 80000) skillsMap[skill].levels.intermediate++;
                            else skillsMap[skill].levels.beginner++;
                        });
                    }
                });

                const attritionRate = totalHeadcount > 0 ? Number(((exits / totalHeadcount) * 100).toFixed(1)) : 0;
                const totalManagers = Math.max(1, Math.floor(totalHeadcount / 7)); // Simulated span of control ~ 1:7

                const headcountDiff = totalHeadcount - prevHeadcount;
                const headcountPercent = prevHeadcount > 0 ? ((headcountDiff / prevHeadcount) * 100).toFixed(2) : '0.00';
                const headcountTrend = {
                    value: headcountDiff,
                    percent: parseFloat(headcountPercent)
                };

                // Format exitByType chartDataMap
                const chartDataMap: Record<string, any[]> = {};
                const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
                Object.keys(exitReasons).forEach(type => {
                    chartDataMap[type] = Object.entries(exitReasons[type]).map(([name, value], i) => ({
                        name, value, color: colors[i % colors.length]
                    }));
                });

                const trendArray = Object.values(trendMap);

                // Derived mock structures for remaining widgets for prototype
                const mockResult: PeopleMetrics = {
                    summary: {
                        totalHeadcount, newJoins, exits, attritionRate, shadows, experts, totalManagers, headcountTrend
                    },
                    talentRisk: {
                        compositeScore: 72,
                        earlyAttrition: { exitsUnder90Days: Math.floor(exits * 0.2), newJoins },
                        status: attritionRate > 10 ? 'High' : (attritionRate > 5 ? 'Elevated' : 'Normal')
                    },
                    exitByTypeAndReason: {
                        types: Array.from(exitTypes).length > 0 ? Array.from(exitTypes) : ['Resignation', 'Termination'],
                        chartDataMap: Object.keys(chartDataMap).length > 0 ? chartDataMap : { 'Resignation': [] }
                    },
                    exitTrend: {
                        chartData: trendArray,
                        kpis: {
                            totalExits: {
                                percent: `${attritionRate.toFixed(2)}%`,
                                count: `${exits} employees`,
                                breakdown: []
                            },
                            avgMonthly: {
                                percent: `${(attritionRate / 12).toFixed(2)}%`,
                                count: `${(exits / totalMonths).toFixed(2)} employees`
                            }
                        }
                    },
                    skillsGap: Object.values(skillsMap).length > 0 ? Object.values(skillsMap).slice(0, 10) : [
                        { skill: 'React/Frontend', domain: 'Engineering', levels: { beginner: 5, intermediate: 15, experienced: 25 } }
                    ],
                    managerWatchlist: [
                        { id: 1, name: 'A. Patel', dept: 'Engineering', exits: Math.floor(exits * 0.3), severity: 'danger', avatar: 'AP' },
                        { id: 2, name: 'S. Jenkins', dept: 'Sales', exits: Math.floor(exits * 0.1), severity: 'warning', avatar: 'SJ' }
                    ],
                    topEmployees: [
                        { rank: 1, name: 'Elena Fisher', role: 'Snr. Dev', badges: 12, avatarUrl: 'https://i.pravatar.cc/150?u=elena' }
                    ],
                    leaveAndDeptRisk: {
                        companyAvailability: { totalEmployees: totalHeadcount, onLeave: Math.floor(totalHeadcount * 0.05) },
                        deptRisk: [{ name: 'Engineering', onLeave: 5, riskPercent: 10 }],
                        peakLeaveWarning: 'Mid-December'
                    }
                };

                setData(mockResult);
            } catch (err: any) {
                console.error('Error fetching people metrics:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();
    }, [dateRange, businessUnit]);

    return { data, loading, error };
}
