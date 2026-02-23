import { useState } from 'react';
import { TopControlBar } from './components/layout/TopControlBar';
import { HeroSection } from './components/hero/HeroSection';
import { DynamicTabs } from './components/layout/DynamicTabs';
import type { ModuleOption, BusinessUnitOption, DateRangeOption } from './types';

function App() {
  const [selectedModules, setSelectedModules] = useState<ModuleOption[]>([
    'people', 'crm', 'recruitment', 'project_management'
  ]);
  const [selectedBU, setSelectedBU] = useState<BusinessUnitOption>('all');
  const [selectedDate, setSelectedDate] = useState<DateRangeOption>('last_year');

  // This state controls what is actually rendered in the tabs
  const [searchedModules, setSearchedModules] = useState<ModuleOption[]>([]);

  const toggleModule = (module: ModuleOption) => {
    setSelectedModules(prev =>
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const handleClear = () => {
    setSelectedModules(['people', 'crm', 'recruitment', 'project_management']);
    setSelectedBU('all');
    setSelectedDate('last_year');
    setSearchedModules([]); // Resetting search clears the tabs
  };

  const handleSearch = () => {
    setSearchedModules(selectedModules);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopControlBar
        selectedModules={selectedModules}
        onToggleModule={toggleModule}
        selectedBU={selectedBU}
        onChangeBU={setSelectedBU}
        selectedDate={selectedDate}
        onChangeDate={setSelectedDate}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <HeroSection selectedBU={selectedBU} />

      <DynamicTabs searchedModules={searchedModules} />
    </div>
  );
}

export default App;
