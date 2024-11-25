import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OnboardingLayout } from './components/layout/OnboardingLayout';
import { VerifyIdentityStep } from './pages/steps/VerifyIdentityStep';
import { BusinessProfileStep } from './pages/steps/BusinessProfileStep';
import { StepProvider } from './context/StepContext';
import './index.css';

function App() {
  return (
    <StepProvider>
      <Router>
        <div className={`min-h-screen bg-white`}>
          <OnboardingLayout>
            <Routes>
              <Route path="/" element={<VerifyIdentityStep />} />
              <Route path="/business-profile" element={<BusinessProfileStep />} />
            </Routes>
          </OnboardingLayout>
        </div>
      </Router>
    </StepProvider>
  );
}

export default App; 