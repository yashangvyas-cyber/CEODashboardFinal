import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { BusinessUnitOption } from '../types';

interface DashboardMetrics {
    totalEmployees: number;
    employeeTrend: number;
    employeeTrendPct: number;
    revenueYTD: number;
    revenueTargetPct: number;
    collectionPct: number;
    billablePct: number;
    openRoles: number;
    cashForecast: number;
    cashForecastTrend: number;
    cashForecastTrendUp: boolean;
}

export function useDashboardMetrics(businessUnit: BusinessUnitOption) {
    const [data, setData] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchMetrics() {
            setLoading(true);
            setError(null);

            try {
                // 1. Employees Query
                let empQuery = supabase.from('employees').select('status, exit_date');
                if (businessUnit !== 'all') empQuery = empQuery.eq('business_unit', businessUnit);

                // 2. Invoices Query (Revenue, Collection, Forecast)
                let invQuery = supabase.from('invoices').select('amount, status, due_date, issue_date');
                if (businessUnit !== 'all') invQuery = invQuery.eq('business_unit', businessUnit);

                // 3. Projects Query (Billable)
                let projQuery = supabase.from('projects').select('spent_hours, billed_hours');
                if (businessUnit !== 'all') projQuery = projQuery.eq('business_unit', businessUnit);

                // 4. Roles Query
                let rolesQuery = supabase.from('job_requisitions').select('status, priority', { count: 'exact' });
                if (businessUnit !== 'all') rolesQuery = rolesQuery.eq('department', businessUnit); // map BU to Dept roughly for roles

                rolesQuery = rolesQuery.eq('status', 'Open').eq('priority', 'Critical');

                const [empRes, invRes, projRes, rolesRes] = await Promise.all([
                    empQuery, invQuery, projQuery, rolesQuery
                ]);

                if (empRes.error) throw empRes.error;
                if (invRes.error) throw invRes.error;
                if (projRes.error) throw projRes.error;
                if (rolesRes.error) throw rolesRes.error;

                const employees = empRes.data || [];
                const invoices = invRes.data || [];
                const projects = projRes.data || [];

                // --- CALC 1: HEADCOUNT ---
                const activeEmployees = employees.filter(e => e.status === 'Active');
                const trendCount = Math.floor(activeEmployees.length * 0.05) || 2; // Simulated trend

                // --- CALC 2: REVENUE ---
                // YTD Revenue = Sum of all Paid invoices this year (mocked as all invoices for prototype)
                const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
                const annualTarget = totalInvoiced > 0 ? totalInvoiced * 1.15 : 1000000; // Fake target is 115% of current
                const targetPercent = totalInvoiced > 0 ? Math.round((totalInvoiced / annualTarget) * 100) : 0;

                // --- CALC 3: COLLECTION ---
                const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
                const totalCollected = paidInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
                const collectionPct = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

                // --- CALC 4: BILLABLE ---
                const totalSpent = projects.reduce((sum, p) => sum + Number(p.spent_hours || 0), 0);
                const totalBilled = projects.reduce((sum, p) => sum + Number(p.billed_hours || 0), 0);
                const billablePct = totalSpent > 0 ? Math.round((totalBilled / totalSpent) * 100) : 0;

                // --- CALC 5: OPEN ROLES ---
                const openRolesCount = rolesRes.count || 0;

                // --- CALC 6: 30-DAY FORECAST ---
                const today = new Date();
                const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

                const upcomingInvoices = invoices.filter(inv => {
                    if (inv.status === 'Paid') return false;
                    const due = new Date(inv.due_date);
                    return due >= today && due <= next30Days;
                });

                const forecastAmount = upcomingInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

                setData({
                    totalEmployees: activeEmployees.length,
                    employeeTrend: trendCount,
                    employeeTrendPct: 5,
                    revenueYTD: totalInvoiced,
                    revenueTargetPct: targetPercent,
                    collectionPct: collectionPct,
                    billablePct: billablePct || 75, // Fallback if no projects
                    openRoles: openRolesCount,
                    cashForecast: forecastAmount,
                    cashForecastTrend: 8,
                    cashForecastTrendUp: true
                });

            } catch (e: any) {
                console.error('Error fetching dashboard metrics:', e);
                setError(e);
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();
    }, [businessUnit]);

    return { data, loading, error };
}
