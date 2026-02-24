import { useState } from 'react';
import { TopControlBar } from './components/layout/TopControlBar';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { HeroSection } from './components/hero/HeroSection';
import { DashboardControls } from './components/layout/DashboardControls';
import { DynamicTabs } from './components/layout/DynamicTabs';
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

  // Section 3 multi-select tabs (pending selection before Apply)
  const [selectedTabs, setSelectedTabs] = useState<ModuleOption[]>(['crm']);

  // Section 4 state (snapshot after Apply)
  const [appliedTabs, setAppliedTabs] = useState<ModuleOption[]>([]);
  const [activeAppliedTab, setActiveAppliedTab] = useState<ModuleOption>('crm');
  const isApplied = appliedTabs.length > 0;

  const toggleTab = (tab: ModuleOption) => {
    setSelectedTabs(prev =>
      prev.includes(tab)
        ? prev.length === 1 ? prev // must keep at least one selected
          : prev.filter(t => t !== tab)
        : [...prev, tab]
    );
  };

  const handleApply = () => {
    setAppliedTabs(selectedTabs);
    // Set active to first selected tab, or keep current if still in set
    setActiveAppliedTab(
      selectedTabs.includes(activeAppliedTab) ? activeAppliedTab : selectedTabs[0]
    );
  };

  const handleClear = () => {
    setSelectedTabs(['crm']);
    setAppliedTabs([]);
    setActiveAppliedTab('crm');
    setSelectedDate('last_year');
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
        />

        {/* ── SECTION 4: Applied report content with in-section tab switcher ── */}
        <div className="flex-1 bg-slate-50">
          {isApplied ? (
            <div className="flex flex-col h-full">
              {/* Applied tab switcher — pill group with spacing, inside content area */}
              {appliedTabs.length > 1 && (
                <div className="px-6 pt-5 pb-1 flex items-center gap-2">
                  {ALL_MODULES.filter(m => appliedTabs.includes(m.id)).map(mod => (
                    <button
                      key={mod.id}
                      onClick={() => setActiveAppliedTab(mod.id)}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border ${activeAppliedTab === mod.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600'
                        }`}
                    >
                      {mod.label}
                    </button>
                  ))}
                </div>
              )}
              {/* Report content for the active applied tab */}
              <DynamicTabs
                activeTab={activeAppliedTab}
                dateRange={selectedDate}
                selectedBU={selectedBU}
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
