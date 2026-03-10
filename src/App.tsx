import { useState } from 'react';
import { TopControlBar } from './components/layout/TopControlBar';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { HeroSection } from './components/hero/HeroSection';
import { DashboardControls } from './components/layout/DashboardControls';
import MyDashboard from './components/layout/MyDashboard';
import type { BusinessUnitOption, DateRangeOption } from './types';

function App() {
  const [selectedBU, setSelectedBU] = useState<BusinessUnitOption>('all');
  const [selectedDate, setSelectedDate] = useState<DateRangeOption>('last_year');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top navigation bar */}
      <TopControlBar />

      <main className="flex-1 flex flex-col">
        {/* Dashboard name + Business Unit filter */}
        <DashboardHeader selectedBU={selectedBU} onChangeBU={setSelectedBU} />

        {/* Hero KPI cards (real-time, BU-reactive) */}
        <HeroSection selectedBU={selectedBU} />

        {/* Date filter bar */}
        <DashboardControls
          selectedDate={selectedDate}
          onChangeDate={setSelectedDate}
        />

        {/* Unified customizable widget dashboard */}
        <MyDashboard
          dateRange={selectedDate}
          selectedBU={selectedBU}
        />
      </main>
    </div>
  );
}

export default App;
