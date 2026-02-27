import type { ModuleOption, DateRangeOption, BusinessUnitOption } from '../../types';
import { useWidgetConfig } from '../../hooks/useWidgetConfig';
import { usePeopleMetrics } from '../../hooks/usePeopleMetrics';
import { useCrmMetrics } from '../../hooks/useCrmMetrics';
import { usePMMetrics } from '../../hooks/usePMMetrics';
import { useRecruitmentMetrics } from '../../hooks/useRecruitmentMetrics';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import WidgetWrapper from './SortableWidget';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import type { Layout, LayoutItem } from 'react-grid-layout/legacy';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Gemini People Components
import PeopleSummaryCards from '../people/PeopleSummaryCards';
import ExitByTypeAndReason from '../people/ExitByTypeAndReason';
import AttritionAnalysis from '../people/AttritionAnalysis';
import TalentRiskScore from '../people/TalentRiskScore';
import ManagerWatchlist from '../people/ManagerWatchlist';
import SkillsGap from '../people/SkillsGap';
import TopEmployees from '../people/TopEmployees';

// Project Management Components
import PMSummaryCards from '../project_management/PMSummaryCards';
import PMHealthBreakdown from '../project_management/PMHealthBreakdown';
import ContractAdjustments from '../project_management/ContractAdjustments';
import RevenueLeakage from '../project_management/RevenueLeakage';
import TopEffortConsumers from '../project_management/TopEffortConsumers';
import TimesheetCompliance from '../project_management/TimesheetCompliance';
import ProjectPortfolioStatus from '../project_management/ProjectPortfolioStatus';
import TopSkillsDemand from '../project_management/TopSkillsDemand';
import HirebaseByDepartment from '../project_management/HirebaseByDepartment';

// CRM Components
import CRMSummaryCards from '../crm/CRMSummaryCards';
import CRMFunnelSwitcher from '../crm/CRMFunnelSwitcher';
import CollectionGoalCard from '../crm/CollectionGoalCard';
import CRMPipelineSummaries from '../crm/CRMPipelineSummaries';
import TopRevenueContributors from '../crm/TopRevenueContributors';
import LostDealAnalysis from '../crm/LostDealAnalysis';
import RevenueSourceMix from '../crm/RevenueSourceMix';
import RecentLargeInflows from '../crm/RecentLargeInflows';
import MultiCurrencyCashFlow from '../crm/MultiCurrencyCashFlow';
import RevenueTrend from '../crm/RevenueTrend';
import AvgDaysToPay from '../crm/AvgDaysToPay';

// Recruitment Components
import RecruitmentSummaryCards from '../recruitment/RecruitmentSummaryCards';
import StageConversion from '../recruitment/StageConversion';
import RecruitmentVelocity from '../people/RecruitmentVelocity';
import JobStatus from '../recruitment/JobStatus';
import OfferAcceptance from '../recruitment/OfferAcceptance';



// Mock Recruitment Data Removed

interface DynamicTabsProps {
    activeTab: ModuleOption;
    dateRange: DateRangeOption;
    selectedBU: BusinessUnitOption;
    wc?: any;
}

export const DynamicTabs: React.FC<DynamicTabsProps> = ({ activeTab, dateRange, selectedBU, wc: passedWc }) => {
    const peopleWC = useWidgetConfig('people');
    const crmWC = useWidgetConfig('crm');
    const recruitmentWC = useWidgetConfig('recruitment');
    const pmWC = useWidgetConfig('project_management');

    // Fetch data for all modules
    const { data: peopleData, loading: peopleLoading } = usePeopleMetrics(dateRange, selectedBU);
    const { data: crmData, loading: crmLoading } = useCrmMetrics(dateRange, selectedBU);
    const { data: pmData, loading: pmLoading } = usePMMetrics(dateRange, selectedBU);
    const { data: recruitmentData, loading: recruitmentLoading } = useRecruitmentMetrics(dateRange, selectedBU);

    // Current tab's widget config
    const wc = passedWc || (activeTab === 'people' ? peopleWC
        : activeTab === 'crm' ? crmWC
            : activeTab === 'recruitment' ? recruitmentWC
                : pmWC);

    // The current layout state and update function for the active tab
    const visibleLayout = wc.layout.filter((l: any) => wc.isVisible(l.i));

    const renderWidget = (id: string) => {
        if (activeTab === 'people') {
            if (peopleLoading || !peopleData) {
                return <div className="h-full w-full flex items-center justify-center bg-white rounded-[10px] border border-slate-200">
                    <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
                </div>;
            }
            switch (id) {
                case 'peopleSummaryCards': return <PeopleSummaryCards dateRange={dateRange} data={peopleData.summary} />;
                case 'talentRiskScore': return <TalentRiskScore data={peopleData.talentRisk} />;
                case 'exitByTypeAndReason': return <ExitByTypeAndReason data={peopleData.exitByTypeAndReason} />;
                case 'attritionAnalysis': return <AttritionAnalysis data={peopleData.exitTrend} />;
                case 'skillsGap': return <SkillsGap data={peopleData.skillsGap} />;
                case 'managerWatchlist': return <ManagerWatchlist data={peopleData.managerWatchlist} />;
                case 'topEmployees': return <TopEmployees data={peopleData.topEmployees} />;
            }
        }
        if (activeTab === 'crm') {
            if (crmLoading || !crmData) {
                return <div className="h-full w-full flex items-center justify-center bg-white rounded-[10px] border border-slate-200">
                    <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
                </div>;
            }
            switch (id) {
                case 'crmSummaryCards': return <CRMSummaryCards dateRange={dateRange} data={crmData.summary} />;
                case 'revenueTrend': return <RevenueTrend data={crmData.revenueTrend} />;
                case 'avgDaysToPay': return <AvgDaysToPay />;
                case 'crmFunnelSwitcher': return <CRMFunnelSwitcher data={crmData.pipelineFunnel} />;
                case 'crmPipelineSummaries': return <CRMPipelineSummaries data={crmData.pipelineSummaries} />;
                case 'collectionGoalCard': return <CollectionGoalCard dateRange={dateRange} data={crmData.collectionGoal} />;
                case 'revenueSourceMix': return <RevenueSourceMix data={crmData.sourceMix} />;
                case 'lostDealAnalysis': return <LostDealAnalysis data={crmData.lostDealAnalysis} />;
                case 'topRevenueContributors': return <TopRevenueContributors data={crmData.topContributors} />;
                case 'recentLargeInflows': return <RecentLargeInflows data={crmData.recentInflows} />;
                case 'multiCurrencyCashFlow': return <MultiCurrencyCashFlow data={crmData.multiCurrencyFlow} />;
            }
        }
        if (activeTab === 'recruitment') {
            if (recruitmentLoading || !recruitmentData) {
                return <div className="h-full w-full flex items-center justify-center bg-white rounded-[10px] border border-slate-200">
                    <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
                </div>;
            }
            switch (id) {
                case 'recruitmentSummaryCards': return <RecruitmentSummaryCards data={recruitmentData} />;
                case 'stageConversion': return <StageConversion data={recruitmentData.stageConversion} />;
                case 'recruitmentVelocity': return <RecruitmentVelocity dateRange={dateRange} />;
                case 'jobStatus': return <JobStatus data={recruitmentData.jobStatus} />;
                case 'offerAcceptance': return <OfferAcceptance data={recruitmentData.offerAcceptance} />;
            }
        }
        if (activeTab === 'project_management') {
            if (pmLoading || !pmData) {
                return (
                    <div className="h-full w-full flex items-center justify-center bg-white rounded-[10px] border border-slate-200">
                        <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
                    </div>
                );
            }
            switch (id) {
                case 'pmSummaryCards': return <PMSummaryCards dateRange={dateRange} data={pmData.summary} />;
                case 'projectPortfolioStatus': return <ProjectPortfolioStatus dateRange={dateRange} data={pmData.projectPortfolio.data} statuses={pmData.projectPortfolio.statuses} />;
                case 'pmHealthBreakdown': return <PMHealthBreakdown dateRange={dateRange} data={pmData.healthBreakdown} />;
                case 'revenueLeakage': return <RevenueLeakage dateRange={dateRange} data={pmData.leakage} />;
                case 'topEffortConsumers': return <TopEffortConsumers dateRange={dateRange} data={pmData.effortConsumers} />;
                case 'contractAdjustments': return <ContractAdjustments dateRange={dateRange} data={pmData.contractAdjustments} metricData={pmData.hireVsExpire} />;
                case 'timesheetCompliance': return <TimesheetCompliance dateRange={dateRange} data={pmData.compliance} />;
                case 'topSkillsDemand': return <TopSkillsDemand data={pmData.topSkillsDemand} />;
                case 'hirebaseByDepartment': return <HirebaseByDepartment data={pmData.hirebaseByDept} />;
            }
        }
        return null; // Fallback
    };

    return (
        <div className="w-full flex-1 flex flex-col pt-1 bg-slate-50/50">
            {/* Tab Content Area */}
            <div className="flex-1 px-4 pt-4 pb-12">
                <ResponsiveGridLayout
                    key={activeTab} // CRITICAL FIX: Forces deep remount on tab switch, preventing layout crossover scrambling!
                    className="layout"
                    layouts={{ lg: visibleLayout, md: visibleLayout, sm: visibleLayout }}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={24}
                    margin={[12, 12]}
                    draggableHandle=".dashboard-drag-handle"
                    onDragStop={(newLayout: Layout) => wc.updateLayout(newLayout)}
                    onResizeStop={(newLayout: Layout) => wc.updateLayout(newLayout)}
                    compactType="vertical"
                    isDraggable={true}
                    isResizable={false}
                >
                    {visibleLayout.map((item: LayoutItem) => (
                        <div key={item.i}>
                            <WidgetWrapper>
                                {renderWidget(item.i)}
                            </WidgetWrapper>
                        </div>
                    ))}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};
