import React, { useState } from 'react';
import type { DateRangeOption, BusinessUnitOption } from '../../types';
import { useMyDashboardConfig } from '../../hooks/useMyDashboardConfig';
import { usePeopleMetrics } from '../../hooks/usePeopleMetrics';
import { useCrmMetrics } from '../../hooks/useCrmMetrics';
import { usePMMetrics } from '../../hooks/usePMMetrics';
import { useRecruitmentMetrics } from '../../hooks/useRecruitmentMetrics';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import WidgetWrapper from './SortableWidget';
import EditDashboardPanel from './EditDashboardPanel';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import type { Layout, LayoutItem } from 'react-grid-layout/legacy';
import { LayoutGrid, SlidersHorizontal } from 'lucide-react';

// People Components
import PeopleSummaryCards from '../people/PeopleSummaryCards';
import ExitByTypeAndReason from '../people/ExitByTypeAndReason';
import AttritionAnalysis from '../people/AttritionAnalysis';
import TalentRiskScore from '../people/TalentRiskScore';
import ManagerWatchlist from '../people/ManagerWatchlist';
import SkillsGap from '../people/SkillsGap';
import TopEmployees from '../people/TopEmployees';

// PM Components
import PMSummaryCards from '../project_management/PMSummaryCards';
import PMHealthBreakdown from '../project_management/PMHealthBreakdown';
import RevenueLeakage from '../project_management/RevenueLeakage';
import TopEffortConsumers from '../project_management/TopEffortConsumers';
import ProjectPortfolioStatus from '../project_management/ProjectPortfolioStatus';
import TopSkillsDemand from '../project_management/TopSkillsDemand';
import HirebaseByDepartment from '../project_management/HirebaseByDepartment';

// CRM Components
import CRMSummaryCards from '../crm/CRMSummaryCards';
import CRMFunnelSwitcher from '../crm/CRMFunnelSwitcher';
import CRMSideBySideFunnel from '../crm/CRMSideBySideFunnel';
import CollectionGoalCard from '../crm/CollectionGoalCard';
import CRMPipelineSummaries from '../crm/CRMPipelineSummaries';
import TopRevenueContributors from '../crm/TopRevenueContributors';
import LostDealAnalysis from '../crm/LostDealAnalysis';
import RevenueSourceMix from '../crm/RevenueSourceMix';
import RecentLargeInflows from '../crm/RecentLargeInflows';
import CurrencySwitcher from '../crm/CurrencySwitcher';
import RevenueTrend from '../crm/RevenueTrend';
import AvgDaysToPay from '../crm/AvgDaysToPay';

// Recruitment Components
import RecruitmentSummaryCards from '../recruitment/RecruitmentSummaryCards';
import Top3Recruiters from '../recruitment/Top3Recruiters';
import RecruitmentVelocity from '../people/RecruitmentVelocity';
import JobStatus from '../recruitment/JobStatus';
import OfferAcceptance from '../recruitment/OfferAcceptance';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface MyDashboardProps {
    dateRange: DateRangeOption;
    selectedBU: BusinessUnitOption;
}

const Spinner = () => (
    <div className="h-full w-full flex items-center justify-center bg-white rounded-[10px] border border-slate-200">
        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
);

const MyDashboard: React.FC<MyDashboardProps> = ({ dateRange, selectedBU }) => {
    const dashboard = useMyDashboardConfig();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [activeCurrency, setActiveCurrency] = useState('ALL');

    // Always fetch all, but only render what's visible
    const { data: peopleData, loading: peopleLoading } = usePeopleMetrics(dateRange, selectedBU);
    const { data: crmData, loading: crmLoading } = useCrmMetrics(dateRange, selectedBU, activeCurrency);
    const { data: pmData, loading: pmLoading } = usePMMetrics(dateRange, selectedBU);
    const { data: recruitmentData, loading: recruitmentLoading } = useRecruitmentMetrics(dateRange, selectedBU);

    const renderWidget = (id: string): React.ReactNode => {
        // People
        if (peopleLoading && ['peopleSummaryCards', 'talentRiskScore', 'exitByTypeAndReason', 'attritionAnalysis', 'skillsGap', 'managerWatchlist', 'topEmployees'].includes(id)) return <Spinner />;
        if (crmLoading && ['crmSummaryCards', 'revenueTrend', 'avgDaysToPay', 'crmFunnelSwitcher', 'crmPipelineSummaries', 'collectionGoalCard', 'crmSideBySideFunnel', 'revenueSourceMix', 'lostDealAnalysis', 'recentLargeInflows', 'topRevenueContributors'].includes(id)) return <Spinner />;
        if (pmLoading && ['pmSummaryCards', 'projectPortfolioStatus', 'pmHealthBreakdown', 'revenueLeakage', 'topEffortConsumers', 'topSkillsDemand', 'hirebaseByDepartment'].includes(id)) return <Spinner />;
        if (recruitmentLoading && ['recruitmentSummaryCards', 'stageConversion', 'recruitmentVelocity', 'jobStatus', 'offerAcceptance'].includes(id)) return <Spinner />;

        switch (id) {
            // People
            case 'peopleSummaryCards': return peopleData ? <PeopleSummaryCards dateRange={dateRange} data={peopleData.summary} /> : <Spinner />;
            case 'talentRiskScore': return peopleData ? <TalentRiskScore data={peopleData.talentRisk} /> : <Spinner />;
            case 'exitByTypeAndReason': return peopleData ? <ExitByTypeAndReason data={peopleData.exitByTypeAndReason} /> : <Spinner />;
            case 'attritionAnalysis': return peopleData ? <AttritionAnalysis data={peopleData.exitTrend} /> : <Spinner />;
            case 'skillsGap': return peopleData ? <SkillsGap data={peopleData.skillsGap} /> : <Spinner />;
            case 'managerWatchlist': return peopleData ? <ManagerWatchlist data={peopleData.managerWatchlist} /> : <Spinner />;
            case 'topEmployees': return peopleData ? <TopEmployees data={peopleData.topEmployees} /> : <Spinner />;

            // CRM
            case 'crmSummaryCards': return crmData ? <CRMSummaryCards dateRange={dateRange} data={crmData.summary} /> : <Spinner />;
            case 'revenueTrend': return crmData ? <RevenueTrend data={crmData.revenueTrend} currencySymbol={crmData.currencySymbol} /> : <Spinner />;
            case 'avgDaysToPay': return crmData ? <AvgDaysToPay data={crmData.avgDaysToPay} /> : <Spinner />;
            case 'crmFunnelSwitcher': return crmData ? <CRMFunnelSwitcher data={crmData.pipelineFunnel} /> : <Spinner />;
            case 'crmSideBySideFunnel': return crmData ? <CRMSideBySideFunnel data={crmData.pipelineFunnel} /> : <Spinner />;
            case 'crmPipelineSummaries': return crmData ? <CRMPipelineSummaries data={crmData.pipelineSummaries} /> : <Spinner />;
            case 'collectionGoalCard': return crmData ? <CollectionGoalCard data={crmData.collectionGoal} /> : <Spinner />;
            case 'revenueSourceMix': return crmData ? <RevenueSourceMix data={crmData.sourceMix} /> : <Spinner />;
            case 'lostDealAnalysis': return crmData ? <LostDealAnalysis data={crmData.lostDealAnalysis} /> : <Spinner />;
            case 'topRevenueContributors': return crmData ? <TopRevenueContributors data={crmData.topContributors} /> : <Spinner />;
            case 'recentLargeInflows': return crmData ? <RecentLargeInflows data={crmData.recentInflows} /> : <Spinner />;

            // Recruitment
            case 'recruitmentSummaryCards': return recruitmentData ? <RecruitmentSummaryCards data={recruitmentData} /> : <Spinner />;
            case 'stageConversion': return recruitmentData ? <Top3Recruiters data={recruitmentData.topRecruiters} dateRange={dateRange} /> : <Spinner />;
            case 'recruitmentVelocity': return <RecruitmentVelocity dateRange={dateRange} />;
            case 'jobStatus': return recruitmentData ? <JobStatus data={recruitmentData.jobStatus} /> : <Spinner />;
            case 'offerAcceptance': return recruitmentData ? <OfferAcceptance data={recruitmentData.offerAcceptance} /> : <Spinner />;

            // Project Management
            case 'pmSummaryCards': return pmData ? <PMSummaryCards dateRange={dateRange} data={pmData.summary} /> : <Spinner />;
            case 'projectPortfolioStatus': return pmData ? <ProjectPortfolioStatus dateRange={dateRange} data={pmData.projectPortfolio.data} statuses={pmData.projectPortfolio.statuses} /> : <Spinner />;
            case 'pmHealthBreakdown': return pmData ? <PMHealthBreakdown dateRange={dateRange} data={pmData.healthBreakdown} /> : <Spinner />;
            case 'revenueLeakage': return pmData ? <RevenueLeakage dateRange={dateRange} data={pmData.leakage} /> : <Spinner />;
            case 'topEffortConsumers': return pmData ? <TopEffortConsumers dateRange={dateRange} data={pmData.effortConsumers} /> : <Spinner />;
            case 'topSkillsDemand': return pmData ? <TopSkillsDemand data={pmData.topSkillsDemand} /> : <Spinner />;
            case 'hirebaseByDepartment': return pmData ? <HirebaseByDepartment data={pmData.hirebaseByDept} /> : <Spinner />;

            default: return null;
        }
    };

    const hasCrmWidgets = dashboard.visibleWidgets.some(w => w.module === 'crm');

    return (
        <div className="w-full flex-1 flex flex-col bg-slate-50/50">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-slate-500">
                        <LayoutGrid size={14} />
                        <span className="text-[11px] font-semibold text-slate-500">
                            {dashboard.visibleWidgets.length} widgets on your dashboard
                        </span>
                    </div>
                    {hasCrmWidgets && (
                        <CurrencySwitcher activeCurrency={activeCurrency} onCurrencyChange={setActiveCurrency} />
                    )}
                </div>
                <button
                    onClick={() => setIsPanelOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                >
                    <SlidersHorizontal size={13} />
                    Edit Dashboard
                </button>
            </div>

            {/* Grid */}
            <div className="flex-1 px-4 pt-4 pb-12">

                {dashboard.visibleLayout.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-2xl">
                            📊
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500">No widgets on your dashboard</p>
                            <p className="text-xs text-slate-400 mt-1">Click <strong>Edit Dashboard</strong> to add widgets from any module.</p>
                        </div>
                        <button
                            onClick={() => setIsPanelOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            <SlidersHorizontal size={13} />
                            Edit Dashboard
                        </button>
                    </div>
                ) : (
                    <ResponsiveGridLayout
                        className="layout"
                        layouts={{ lg: dashboard.visibleLayout, md: dashboard.visibleLayout, sm: dashboard.visibleLayout }}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={24}
                        margin={[12, 12]}
                        draggableHandle=".dashboard-drag-handle"
                        onDragStop={(newLayout: Layout) => dashboard.updateLayout(newLayout)}
                        onResizeStop={(newLayout: Layout) => dashboard.updateLayout(newLayout)}
                        compactType="vertical"
                        isDraggable={true}
                        isResizable={false}
                    >
                        {dashboard.visibleLayout.map((item: LayoutItem) => (
                            <div key={item.i}>
                                <WidgetWrapper>
                                    {renderWidget(item.i)}
                                </WidgetWrapper>
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                )}
            </div>

            {/* Edit Panel */}
            <EditDashboardPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                config={dashboard.config}
                onToggle={dashboard.toggleWidget}
                onReset={dashboard.resetToDefault}
            />
        </div>
    );
};

export default MyDashboard;
