import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { BusinessUnitOption, DateRangeOption } from '../types';

export interface CrmMetrics {
    summary: any;
    pipelineSummaries: any;
    pipelineFunnel: any;
    salesMetrics: any;
    collectionGoal: any;
    topContributors: any[];
    lostDealAnalysis: any[];
    sourceMix: any;
    revenueTrend: any[];
    recentInflows: any[];
    multiCurrencyFlow: any[];
}

export function useCrmMetrics(dateRange: DateRangeOption, businessUnit: BusinessUnitOption) {
    const [data, setData] = useState<CrmMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                setLoading(true);

                // Fetch Deals
                if (!supabase) throw new Error("Supabase client not initialized.");
                let dealsQuery = supabase.from('deals').select('*');
                if (businessUnit !== 'all') {
                    dealsQuery = dealsQuery.eq('business_unit', businessUnit);
                }
                const { data: deals, error: dealsErr } = await dealsQuery;
                if (dealsErr) throw dealsErr;

                // Fetch Invoices
                // Note: Invoices might not have a direct BU link depending on schema, assuming they do for now or they map through client
                let invQuery = supabase.from('invoices').select('*');
                // if (businessUnit !== 'all') invQuery = invQuery.eq('business_unit', businessUnit); 
                const { data: invoices, error: invErr } = await invQuery;
                if (invErr) throw invErr;

                // Time logic based on dateRange
                const now = new Date();
                let startDate = new Date();
                let endDate = new Date();

                switch (dateRange) {
                    case 'this_month': {
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                        break;
                    }
                    case 'last_month': {
                        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                        break;
                    }
                    case 'this_quarter': {
                        const currentQuarter = Math.floor(now.getMonth() / 3);
                        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
                        break;
                    }
                    case 'last_quarter': {
                        const currentQuarter = Math.floor(now.getMonth() / 3);
                        startDate = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
                        endDate = new Date(now.getFullYear(), currentQuarter * 3, 0);
                        break;
                    }
                    case 'ytd': {
                        startDate = new Date(now.getFullYear(), 0, 1);
                        break;
                    }
                    case 'this_year': {
                        startDate = new Date(now.getFullYear(), 0, 1);
                        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                        break;
                    }
                    case 'last_year': {
                        startDate = new Date(now.getFullYear() - 1, 0, 1);
                        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
                        break;
                    }
                    default:
                        startDate.setFullYear(now.getFullYear() - 1);
                }

                // --- DATA PROCESSING LOGIC GOES HERE ---
                // For the initial prototype connection, we'll map the raw data into the shapes expected by the components.

                // Aggregations
                let totalWonValue = 0;
                let totalWonCount = 0;
                let totalDealsCount = (deals || []).length;
                let lostCount = 0;
                let openCount = 0;
                let totalDealConvertDays = 0;
                let dealsWithConvertDays = 0;

                const lostReasons: Record<string, number> = {};
                let newSource = 0;
                let existingSource = 0;

                let totalInvoiced = 0;
                let totalCollected = 0;

                (deals || []).forEach(deal => {
                    const closeDate = deal.close_date ? new Date(deal.close_date) : null;
                    const inRange = closeDate && closeDate >= startDate && closeDate <= endDate;

                    if (deal.stage === 'Closed Won' && inRange) {
                        totalWonValue += deal.deal_value || deal.value || 0;
                        totalWonCount++;

                        // Calculate conversion time
                        const created = deal.created_date || deal.created_at;
                        if (created && closeDate) {
                            const cr = new Date(created);
                            const diffDays = (closeDate.getTime() - cr.getTime()) / (1000 * 60 * 60 * 24);
                            if (diffDays >= 0) {
                                totalDealConvertDays += diffDays;
                                dealsWithConvertDays++;
                            }
                        }

                        // Fake source mix for demo
                        if (Math.random() > 0.5) newSource++; else existingSource++;
                    } else if (deal.stage === 'Closed Lost' && inRange) {
                        lostCount++;
                        // Fake lost reasons based on title/random for visualization
                        const r = Math.random();
                        const allReasons = [
                            'Competitor', 'Budget', 'Delayed', 'Other',
                            'Lack of Features', 'Poor Fit', 'Timing', 'Executive Change',
                            'Lost Momentum', 'Price Too High', 'Internal Politics', 'No Decision',
                            'Gone Dark', 'Merger/Acquisition', 'Bad Demo', 'Security Concerns',
                            'Implementation Timeline', 'Compliance Issues', 'Poor Support', 'Legal Hold'
                        ];
                        const reason = allReasons[Math.floor(r * allReasons.length)];
                        lostReasons[reason] = (lostReasons[reason] || 0) + 1;
                    } else if (deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost') {
                        openCount++;
                    }
                });

                (invoices || []).forEach(inv => {
                    // Simple agg for demo, normally filter by date too
                    const amt = inv.amount || 0;
                    totalInvoiced += amt;
                    if (inv.status === 'Paid') {
                        totalCollected += amt;
                    }
                });

                // Formatters
                const formatCurrency = (val: number) => {
                    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
                    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
                    return `₹${val.toFixed(0)}`;
                };

                const outstanding = totalInvoiced - totalCollected;
                // Rough estimate for unbilled (Won deals minus what's invoiced, assuming some lag)
                const unbilled = Math.max(0, totalWonValue - totalInvoiced);

                const efficiency = totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0;

                // --- NEW: Key Recent Collections ---
                // Get all paid invoices in range, sort by amount descending, take top 5
                const paidInvoicesInRange = (invoices || []).filter(inv => {
                    if (inv.status !== 'Paid') return false;
                    const pDate = inv.payment_date ? new Date(inv.payment_date) : (inv.issue_date ? new Date(inv.issue_date) : new Date());
                    return pDate >= startDate && pDate <= endDate;
                });
                paidInvoicesInRange.sort((a, b) => (b.amount || 0) - (a.amount || 0));

                const recentInflows = paidInvoicesInRange.slice(0, 5).map(inv => {
                    const d = inv.payment_date ? new Date(inv.payment_date) : new Date();
                    return {
                        clientName: inv.client_name || "Unknown Client",
                        amount: formatCurrency(inv.amount || 0),
                        date: d.toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' }),
                        invoiceNo: `INV-${(inv.id || '').toString().slice(0, 8)}`
                    };
                });

                // --- NEW: Multi-Currency Flow ---
                // Supabase doesn't have currency currently, so we simulate the breakdown based on Total Collected just to demonstrate the component
                // In production, we'd GROUP BY invoice.currency
                const mcFlow = [
                    { currency: 'INR', amountFormatted: formatCurrency(totalCollected * 0.75), symbol: '₹' },
                    { currency: 'USD', amountFormatted: '$' + (totalCollected * 0.15 / 80).toFixed(0) + 'K', symbol: '$' },
                    { currency: 'EUR', amountFormatted: '€' + (totalCollected * 0.08 / 90).toFixed(0) + 'K', symbol: '€' },
                    { currency: 'ALL', amountFormatted: 'L' + (totalCollected * 0.02 / 100).toFixed(0) + 'K', symbol: 'L' },
                ];

                // Group by month for Revenue Trend
                const monthlyData: Record<string, { won: number, invoiced: number, collected: number }> = {};

                (deals || []).forEach(deal => {
                    const closeDate = deal.close_date ? new Date(deal.close_date) : null;
                    const inRange = closeDate && closeDate >= startDate && closeDate <= endDate;
                    if (deal.stage === 'Closed Won' && inRange) {
                        const monthKey = closeDate.toLocaleString('default', { month: 'short' }) + ' ' + closeDate.getFullYear();
                        if (!monthlyData[monthKey]) monthlyData[monthKey] = { won: 0, invoiced: 0, collected: 0 };
                        monthlyData[monthKey].won += (deal.deal_value || deal.value || 0);
                    }
                });

                (invoices || []).forEach(inv => {
                    const issueDate = inv.issue_date ? new Date(inv.issue_date) : null;
                    const inRange = issueDate && issueDate >= startDate && issueDate <= endDate;
                    if (inRange) {
                        const monthKey = issueDate.toLocaleString('default', { month: 'short' }) + ' ' + issueDate.getFullYear();
                        if (!monthlyData[monthKey]) monthlyData[monthKey] = { won: 0, invoiced: 0, collected: 0 };
                        monthlyData[monthKey].invoiced += (inv.amount || 0);
                        if (inv.status === 'Paid') {
                            monthlyData[monthKey].collected += (inv.amount || 0);
                        }
                    }
                });

                const revenueTrendChartData = Object.entries(monthlyData).map(([month, d]) => ({
                    month, won: d.won, invoiced: d.invoiced, collected: d.collected
                }));
                // Sort chronologically (simple sort by date approximation)
                revenueTrendChartData.sort((a, b) => {
                    const dateA = new Date(a.month);
                    const dateB = new Date(b.month);
                    return dateA.getTime() - dateB.getTime();
                });

                const avgDealSizeRaw = totalWonCount > 0 ? (totalWonValue / totalWonCount) : 0;

                const avgDealValueFormatter = (val: number) => {
                    if (val >= 10000000) return { value: (val / 10000000).toFixed(2), unit: "Cr" };
                    if (val >= 100000) return { value: (val / 100000).toFixed(1), unit: "L" };
                    if (val >= 1000) return { value: (val / 1000).toFixed(0), unit: "K" };
                    return { value: val.toFixed(0), unit: "" };
                };

                const avgDealFormatted = avgDealValueFormatter(avgDealSizeRaw);
                const avgDealConversionDays = dealsWithConvertDays > 0 ? Math.round(totalDealConvertDays / dealsWithConvertDays) : 18;

                const totalMixCount = newSource + existingSource;
                const newSourcePct = totalMixCount > 0 ? Math.round((newSource / totalMixCount) * 100) : 0;
                const existingSourcePct = totalMixCount > 0 ? 100 - newSourcePct : 0;

                const result: CrmMetrics = {
                    summary: {
                        totalWon: { value: formatCurrency(totalWonValue), count: `${totalWonCount} Deals` },
                        invoiced: { value: formatCurrency(totalInvoiced), percent: `${totalWonValue > 0 ? Math.round((totalInvoiced / totalWonValue) * 100) : 0}% of Won` },
                        collected: { value: formatCurrency(totalCollected), efficiency: `${efficiency.toFixed(1)}% Efficiency` },
                        outstanding: { value: formatCurrency(outstanding), label: "(Invoiced - Collected)" },
                        unbilled: { value: formatCurrency(unbilled), label: "Won but not Invoiced" },
                        avgDealSize: { value: `₹${avgDealFormatted.value}${avgDealFormatted.unit}`, label: "Avg per deal" },
                        salesCycle: { value: "22", unit: "Days" }
                    },
                    pipelineSummaries: {
                        leads: { total: 1240, qualified: 850, unqualified: 390, qPercent: 68, uPercent: 32, avgConversionTime: 12 }, // Keeping some mock struct for leads if not in DB
                        deals: {
                            total: totalDealsCount,
                            won: totalWonCount,
                            lost: lostCount,
                            wPercent: totalDealsCount > 0 ? Math.round((totalWonCount / totalDealsCount) * 100) : 0,
                            lPercent: totalDealsCount > 0 ? Math.round((lostCount / totalDealsCount) * 100) : 0,
                            avgConversionTime: avgDealConversionDays
                        }
                    },
                    pipelineFunnel: {
                        deals: {
                            title: "Deal Funnel",
                            segments: [
                                { label: "Open", overall: "53%", stagewise: "53%", color: "#93a5be" },
                                { label: "Contacted", overall: "46%", stagewise: "86%", color: "#4ade80" },
                                { label: "Proposal", overall: "43%", stagewise: "94%", color: "#a78bfa" },
                                { label: "Qualified", overall: "39%", stagewise: "96%", color: "#60a5fa" },
                                { label: "Won", overall: "36%", stagewise: "100%", color: "#4ade80" },
                            ]
                        },
                        leads: {
                            title: "Lead Funnel",
                            segments: [
                                { label: "Open", overall: "7%", stagewise: "7%", color: "#ecfccb" },
                                { label: "New", overall: "6%", stagewise: "87%", color: "#f87171" },
                                { label: "Qualified", overall: "3%", stagewise: "100%", color: "#2dd4bf" },
                            ]
                        }
                    },
                    salesMetrics: {
                        avgDealSize: { value: avgDealFormatted.value, unit: avgDealFormatted.unit, trend: 5.4 },
                        salesCycle: { days: 22, target: 30 }
                    },
                    collectionGoal: {
                        percentage: efficiency,
                        target: formatCurrency(totalInvoiced),
                        collected: formatCurrency(totalCollected)
                    },
                    topContributors: [
                        { name: "Acme Corp Global", invoiced: "₹12.5L", percent: 88, status: 'GOOD' },
                        { name: "TechStart Systems", invoiced: "₹8.5L", percent: 50, status: 'PARTIAL' },
                    ],
                    lostDealAnalysis: Object.entries(lostReasons)
                        .sort(([, valA], [, valB]) => (valB as number) - (valA as number)) // Sort by value desc
                        .map(([label, value], index) => {
                            // Define a vibrant, distinct palette for dynamic reasons
                            const dynamicPalette = [
                                { hexColor: "#f43f5e", color: "fill-rose-500 bg-rose-500" },     // Rose
                                { hexColor: "#fbbf24", color: "fill-amber-400 bg-amber-400" },   // Amber
                                { hexColor: "#94a3b8", color: "fill-slate-400 bg-slate-400" },   // Slate
                                { hexColor: "#a855f7", color: "fill-purple-500 bg-purple-500" }, // Purple
                                { hexColor: "#3b82f6", color: "fill-blue-500 bg-blue-500" },     // Blue
                                { hexColor: "#10b981", color: "fill-emerald-500 bg-emerald-500" } // Emerald
                            ];

                            // Try to match hardcoded keys first
                            let match = null;
                            if (label === 'Competitor') match = dynamicPalette[0];
                            else if (label === 'Delayed') match = dynamicPalette[1];
                            else if (label === 'Budget') match = dynamicPalette[2];
                            else match = dynamicPalette[(index + 3) % dynamicPalette.length];

                            return {
                                label,
                                value: Math.round(((value as number) / lostCount) * 100),
                                hexColor: match.hexColor,
                                color: match.color
                            };
                        }),
                    sourceMix: { new: newSourcePct, existing: existingSourcePct },
                    revenueTrend: revenueTrendChartData,
                    recentInflows,
                    multiCurrencyFlow: mcFlow
                };

                setData(result);
            } catch (err: any) {
                console.error('Error fetching CRM metrics:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();
    }, [dateRange, businessUnit]);

    return { data, loading, error };
}
