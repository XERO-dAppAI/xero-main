import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingLayout } from './components/layout/OnboardingLayout';
import { VerifyIdentityStep } from './pages/steps/VerifyIdentityStep';
import { BusinessProfileStep } from './pages/steps/BusinessProfileStep';
import { FeaturesStep } from './pages/steps/FeaturesStep';
import { TermsStep } from './pages/steps/TermsStep';
import { BusinessDashboard } from './pages/dashboard/BusinessDashboard';
import { StepProvider } from './context/StepContext';
import './index.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <StepProvider>
      <Router>
        <Routes>
          <Route element={<OnboardingLayout />}>
            <Route path="/" element={<VerifyIdentityStep />} />
            <Route path="/business-profile" element={<BusinessProfileStep />} />
            <Route path="/features" element={<FeaturesStep />} />
            <Route path="/terms" element={<TermsStep />} />
          </Route>
          <Route path="/dashboard" element={<BusinessDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </StepProvider>
  );
}

export default App; 