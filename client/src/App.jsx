import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import SchemeMatchingPage from './pages/SchemeMatchingPage';
import ComparisonPage from './pages/ComparisonPage';
import PartnerDiscoveryPage from './pages/PartnerDiscoveryPage';
import ApplicationGuidancePage from './pages/ApplicationGuidancePage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-ivory font-sans text-text-primary">
      <Navbar />
      <main className="flex-1 flex flex-col pt-[92px]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/match" element={<SchemeMatchingPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/partners" element={<PartnerDiscoveryPage />} />
          <Route path="/guidance" element={<ApplicationGuidancePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
