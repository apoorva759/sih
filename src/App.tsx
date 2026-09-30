import React from 'react';
import { RailwayProvider, useRailway } from './context/RailwayContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { OperationsDashboard } from './components/operations/OperationsDashboard';
import { PassengerDashboard } from './components/passenger/PassengerDashboard';
import { DemoGuideModal } from './components/common/DemoGuideModal';
import { SimulateEventModal } from './components/common/SimulateEventModal';
import { AuthModal } from './components/auth/AuthModal';

const MainLayout: React.FC = () => {
  const { mode, theme } = useRailway();

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200`}
    >
      {/* Top Header & Navigation */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {mode === 'OPERATIONS' ? <OperationsDashboard /> : <PassengerDashboard />}
      </main>

      {/* Interactive Authentication Portal (Login / Signup) */}
      <AuthModal />

      {/* Interactive Hackathon Guide & Event Simulator Modals */}
      <DemoGuideModal />
      <SimulateEventModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RailwayProvider>
      <MainLayout />
    </RailwayProvider>
  );
}
