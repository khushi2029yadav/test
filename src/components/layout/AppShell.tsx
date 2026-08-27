import React from 'react';
import { useSkyGuard } from '../../context/SkyGuardContext';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ConnectionStatus } from './ConnectionStatus';
import { ToastContainer } from './ToastContainer';
import { GuidedDemoTour } from './GuidedDemoTour';
import { AssistantDrawer } from '../ai/AssistantDrawer';
import { StationSummaryDrawer } from '../station/StationSummaryDrawer';

import { DashboardPage } from '../../pages/DashboardPage';
import { LiveStationsPage } from '../../pages/LiveStationsPage';
import { StationDetailPage } from '../../pages/StationDetailPage';
import { AlertsPage } from '../../pages/AlertsPage';
import { AlertDetailPage } from '../../pages/AlertDetailPage';
import { AnalyticsPage } from '../../pages/AnalyticsPage';
import { SensorHealthPage } from '../../pages/SensorHealthPage';
import { FaultSimulatorPage } from '../../pages/FaultSimulatorPage';
import { SkyGuardAIPage } from '../../pages/SkyGuardAIPage';
import { SystemStatusPage } from '../../pages/SystemStatusPage';

export const AppShell: React.FC = () => {
  const { currentPage } = useSkyGuard();

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'stations':
        return <LiveStationsPage />;
      case 'station-detail':
        return <StationDetailPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'alert-detail':
        return <AlertDetailPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'health':
      case 'health-detail':
        return <SensorHealthPage />;
      case 'simulator':
        return <FaultSimulatorPage />;
      case 'copilot':
        return <SkyGuardAIPage />;
      case 'system':
        return <SystemStatusPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07111F] text-[#F8FAFC]">
      {/* 240px Mission Control Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <ConnectionStatus />
        
        <main className="flex-1 pb-24 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Persistent Floating Drawers & Overlays */}
      <ToastContainer />
      <GuidedDemoTour />
      <AssistantDrawer />
      <StationSummaryDrawer />
    </div>
  );
};
