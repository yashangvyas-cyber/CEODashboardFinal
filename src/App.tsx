import { useState } from 'react';
import { TopControlBar } from './components/layout/TopControlBar';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { HeroSection } from './components/hero/HeroSection';
import { DashboardControls } from './components/layout/DashboardControls';
import { DynamicTabs } from './components/layout/DynamicTabs';
import { CustomizeWidgetsButton } from './components/layout/CustomizeWidgetsPanel';
import { useWidgetConfig } from './hooks/useWidgetConfig';
import type { ModuleOption, BusinessUnitOption, DateRangeOption } from './types';

const ALL_MODULES: { id: ModuleOption; label: string }[] = [
  { id: 'people', label: 'People' },
  { id: 'crm', label: 'CRM & Invoice' },
  { id: 'recruitment', label: 'Recruitment' },
  { id: 'project_management', label: 'Project Management' },
];

function App() {
  // Global filter
  const [selectedBU, setSelectedBU] = useState<BusinessUnitOption>('all');
  const [selectedDate, setSelectedDate] = useState<DateRangeOption>('last_year');

  const [appliedBU, setAppliedBU] = useState<BusinessUnitOption>('all');
  const [appliedDate, setAppliedDate] = useState<DateRangeOption>('last_year');

  // Section 3 multi-select tabs (pending selection before Apply)
  const [selectedTabs, setSelectedTabs] = useState<ModuleOption[]>([]);

  // Section 4 state (snapshot after Apply)
  const [appliedTabs, setAppliedTabs] = useState<ModuleOption[]>([]);
  const [lastAppliedTab, setLastAppliedTab] = useState<ModuleOption>('crm');
  const activeAppliedTab = appliedTabs.length > 0 ? (appliedTabs.includes(lastAppliedTab) ? lastAppliedTab : appliedTabs[0]) : 'crm' as ModuleOption;
  const isApplied = appliedTabs.length > 0;

  // Widget config for the active applied tab
  const wc = useWidgetConfig(activeAppliedTab);

  const toggleTab = (tab: ModuleOption) => {
    setSelectedTabs(prev =>
      prev.includes(tab)
        ? prev.filter(t => t !== tab)
        : [...prev, tab]
    );
  };

  // Check if pending selections differ from applied state
  const isDirty =
    selectedBU !== appliedBU ||
    selectedDate !== appliedDate ||
    JSON.stringify(selectedTabs) !== JSON.stringify(appliedTabs);

  const handleApply = () => {
    setAppliedTabs(selectedTabs);
    setAppliedBU(selectedBU);
    setAppliedDate(selectedDate);
    // Set active to first selected tab, or keep current if still in set
    setLastAppliedTab(
      selectedTabs.includes(lastAppliedTab) ? lastAppliedTab : selectedTabs[0]
    );
  };

  const handleClear = () => {
    setSelectedTabs([]);
    setAppliedTabs([]);
    setLastAppliedTab('crm');
    setSelectedBU('all');
    setAppliedBU('all');
    setSelectedDate('last_year');
    setAppliedDate('last_year');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top navigation bar */}
      <TopControlBar />

      <main className="flex-1 flex flex-col">
        {/* ── SECTION 1: Dashboard name + Business Unit filter ── */}
        <DashboardHeader selectedBU={selectedBU} onChangeBU={setSelectedBU} />

        {/* ── SECTION 2: Hero KPI cards (reactive to BU) ── */}
        <HeroSection selectedBU={selectedBU} />

        {/* ── SECTION 3: Multi-select tabs + date filter + Search ── */}
        <DashboardControls
          selectedTabs={selectedTabs}
          onToggleTab={toggleTab}
          selectedDate={selectedDate}
          onChangeDate={setSelectedDate}
          onSearch={handleApply}
          onClear={handleClear}
          isApplied={isApplied}
          isDirty={isDirty}
        />

        {/* ── SECTION 4: Applied report content with in-section tab switcher ── */}
        <div className="flex-1 bg-white">
          {isApplied ? (
            <div className="flex flex-col h-full">
              {/* Tab Switcher & Customize Button Row */}
              <div className="flex items-center justify-between px-6 pt-2 bg-white border-b border-slate-200">
                <div className="flex items-center gap-6">
                  {ALL_MODULES.filter(m => appliedTabs.includes(m.id)).map(mod => (
                    <button
                      key={mod.id}
                      onClick={() => setLastAppliedTab(mod.id)}
                      className={`py-3 text-sm font-semibold transition-all duration-150 whitespace-nowrap select-none border-b-2 outline-none -mb-[1px] ${activeAppliedTab === mod.id
                        ? 'text-indigo-600 border-indigo-600'
                        : 'text-slate-500 border-transparent hover:text-slate-800'
                        }`}
                    >
                      {mod.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center pb-2">
                  <CustomizeWidgetsButton
                    tab={activeAppliedTab}
                    config={wc.config}
                    toggle={wc.toggle}
                  />
                </div>
              </div>

              {/* Report content for the active applied tab */}
              <DynamicTabs
                activeTab={activeAppliedTab}
                dateRange={appliedDate}
                selectedBU={appliedBU}
                wc={wc}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500">No data to display</p>
                  <p className="text-xs text-slate-400 mt-1">Select one or more tabs, choose a date range, and click <strong>Search</strong>.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
