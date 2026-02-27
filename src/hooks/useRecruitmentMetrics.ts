import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { BusinessUnitOption, DateRangeOption } from '../types';

export interface RecruitmentMetrics {
    hiringEfficiency: {
        interviewToHire: string;
        timeToHire: number;
    };
    candidateRatio: {
        totalCandidates: number;
        totalHires: number;
        hireRatio: number;
    };
    stageConversion: any[];
    jobStatus: {
        totalJobs: number;
        chartData: any[];
    };
    offerAcceptance: {
        totalOffers: number;
        chartData: any[];
    };
}

export function useRecruitmentMetrics(dateRange: DateRangeOption, businessUnit: BusinessUnitOption) {
    const [data, setData] = useState<RecruitmentMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchMetrics() {
            try {
                setLoading(true);

                if (!supabase) throw new Error("Supabase client not initialized.");

                // Map "BusinessUnitOption" roughly to Department for typical recruiter views
                let reqQuery = supabase.from('job_requisitions').select('*');
                if (businessUnit !== 'all') {
                    reqQuery = reqQuery.eq('department', businessUnit);
                }

                const { data: requisitions, error: reqError } = await reqQuery;
                if (reqError) throw reqError;

                const reqIds = requisitions?.map(r => r.id) || [];

                let candQuery = supabase.from('candidates').select('*');
                if (reqIds.length > 0) {
                    candQuery = candQuery.in('req_id', reqIds);
                } else if (businessUnit !== 'all') {
                    // if they selected a BU with 0 reqs, we return 0 candidates
                    candQuery = candQuery.in('req_id', ['00000000-0000-0000-0000-000000000000']);
                }

                const { data: allCandidates, error: candError } = await candQuery;
                if (candError) throw candError;

                const now = new Date();
                let startDate = new Date();
                let endDate = new Date();

                switch (dateRange) {
                    case 'this_month':
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                        break;
                    case 'last_month':
                        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                        break;
                    case 'this_quarter':
                        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                        break;
                    case 'last_quarter':
                        startDate = new Date(now.getFullYear(), (Math.floor(now.getMonth() / 3) - 1) * 3, 1);
                        endDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0);
                        break;
                    case 'ytd':
                    case 'this_year':
                        startDate = new Date(now.getFullYear(), 0, 1);
                        break;
                    case 'last_year':
                        startDate = new Date(now.getFullYear() - 1, 0, 1);
                        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
                        break;
                    default: // 'all_time'
                        startDate = new Date(2000, 0, 1);
                }

                // Filter candidates by creation/join date depending on stage
                const candidates = (allCandidates || []).filter(c => {
                    const d = new Date(c.created_at || c.offer_date || c.join_date || now);
                    return d >= startDate && d <= endDate;
                });

                const reqs = (requisitions || []).filter(r => {
                    const d = new Date(r.posted_date);
                    return d >= startDate && d <= endDate;
                });

                // 1. Candidate Ratio & Overview
                const totalCandidates = candidates.length;
                const hires = candidates.filter(c => c.current_stage === 'Hired');
                const totalHires = hires.length;
                const hireRatioVal = totalCandidates > 0 ? Math.round((totalHires / totalCandidates) * 100) : 0;

                // 2. Stage Conversion (Funnel)
                const applied = candidates.length;
                const screening = candidates.filter(c => ['Screening', 'Interview', 'Offered', 'Hired'].includes(c.current_stage)).length;
                const interviewed = candidates.filter(c => ['Interview', 'Offered', 'Hired'].includes(c.current_stage)).length;
                const offered = candidates.filter(c => ['Offered', 'Hired'].includes(c.current_stage)).length;

                const stageConversion = [
                    { name: 'Applied', value: applied, color: '#be123c' },
                    { name: 'Screening', value: screening, color: '#f43f5e' },
                    { name: 'Interviewed', value: interviewed, color: '#fb923c' },
                    { name: 'Offered', value: offered, color: '#a3e635' },
                    { name: 'Hired', value: totalHires, color: '#22c55e' }
                ];

                // 3. Job Status
                const closedReqs = reqs.filter(r => r.status === 'Closed').length;
                const openReqs = reqs.filter(r => r.status === 'Open').length;
                const jobStatus = {
                    totalJobs: reqs.length,
                    chartData: [
                        { name: 'Closed', value: closedReqs, color: '#10b981' }, // emerald-500
                        { name: 'Open', value: openReqs, color: '#f43f5e' }   // rose-500
                    ]
                };

                // 4. Offer Acceptance
                const acceptedOffers = hires.length;
                const declinedOffers = candidates.filter(c => c.offer_status === 'Declined').length;
                const pendingOffers = candidates.filter(c => c.offer_status === 'Pending').length;

                const offerAcceptance = {
                    totalOffers: offered,
                    chartData: [
                        { name: 'Accepted', value: acceptedOffers, color: '#10b981' }, // emerald-500
                        { name: 'Pending', value: pendingOffers, color: '#f59e0b' },   // amber-500
                        { name: 'Declined', value: declinedOffers, color: '#f43f5e' }  // rose-500
                    ]
                };

                // 5. Hiring Efficiency
                const screeningToHireRatio = totalHires > 0 ? `${Math.round(screening / totalHires)}:1` : '0:1';

                // Average days from posted to closed for closed reqs
                const closedReqData = reqs.filter(r => r.status === 'Closed' && r.closed_date);
                let avgTimeToHire = 45; // default
                if (closedReqData.length > 0) {
                    const totalDays = closedReqData.reduce((sum, r) => {
                        return sum + ((new Date(r.closed_date!).getTime() - new Date(r.posted_date).getTime()) / (1000 * 60 * 60 * 24));
                    }, 0);
                    avgTimeToHire = Math.round(totalDays / closedReqData.length);
                }


                setData({
                    hiringEfficiency: {
                        interviewToHire: screeningToHireRatio,
                        timeToHire: avgTimeToHire
                    },
                    candidateRatio: {
                        totalCandidates,
                        totalHires,
                        hireRatio: hireRatioVal
                    },
                    stageConversion,
                    jobStatus,
                    offerAcceptance
                });

            } catch (err: any) {
                console.error('Error fetching recruitment metrics:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchMetrics();
    }, [dateRange, businessUnit]);

    return { data, loading, error };
}
