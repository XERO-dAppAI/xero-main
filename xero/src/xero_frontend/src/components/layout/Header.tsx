import React from 'react';
import xeroLogo from '../../assets/xero.png';
import { StepIndicator } from '../steps/StepIndicator';
import { ProgressDots } from '../ProgressDots';
import { useStep } from '../../context/StepContext';

export const Header: React.FC = () => {
  const { currentStep, steps, goToStep } = useStep();

  return (
    <div className="w-full px-12 py-8">
      <div className="flex flex-col max-w-6xl mx-auto">
        <div className="mb-12">
          <img src={xeroLogo} alt="Xero Logo" className="w-16" />
        </div>
        <div className="flex justify-between items-start gap-4">
          {steps.map((step) => (
            <div key={step.id} className="flex-1">
              <StepIndicator 
                {...step} 
                onClick={() => goToStep(step.id)}
              />
            </div>
          ))}
        </div>
        <ProgressDots currentStep={currentStep} totalSteps={steps.length} />
      </div>
    </div>
  );
}; 