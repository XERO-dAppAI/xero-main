import React, { createContext, useContext, useState, useEffect } from 'react';

export type Step = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
};

interface StepContextType {
  currentStep: number;
  steps: Step[];
  completeStep: (stepId: number) => void;
  setCurrentStep: (step: number) => void;
  goToStep: (stepId: number) => void;
}

const initialSteps: Step[] = [
  {
    id: 1,
    title: "Verify Identity",
    description: "One time sign in with Nfid / Iii",
    completed: false,
    current: true
  },
  {
    id: 2,
    title: "Set Up business Profile",
    description: "Tell Us about Your Business Details",
    completed: false,
    current: false
  },
  {
    id: 3,
    title: "Features you use",
    description: "What features of Xero will you be using",
    completed: false,
    current: false
  },
  {
    id: 4,
    title: "Terms & Conditions",
    description: "Agree to XERO's TM's before starting",
    completed: false,
    current: false
  }
];

const StepContext = createContext<StepContextType | undefined>(undefined);

export const StepProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>(initialSteps);

  const updateSteps = (stepId: number, completed: boolean) => {
    setSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        completed: step.id === stepId ? completed : step.completed,
        current: step.id === currentStep
      }))
    );
  };

  const completeStep = async (stepId: number) => {
    try {
      updateSteps(stepId, true);
      
      // Move to next step
      if (stepId < steps.length) {
        setCurrentStep(stepId + 1);
      }
    } catch (error) {
      console.error('Error completing step:', error);
    }
  };

  // Add function to go to a specific step
  const goToStep = (stepId: number) => {
    if (steps[stepId - 1].completed || stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  // Update current step indicator
  useEffect(() => {
    setSteps(prevSteps =>
      prevSteps.map(step => ({
        ...step,
        current: step.id === currentStep
      }))
    );
  }, [currentStep]);

  return (
    <StepContext.Provider value={{ 
      currentStep, 
      steps, 
      completeStep, 
      setCurrentStep,
      goToStep
    }}>
      {children}
    </StepContext.Provider>
  );
};

export const useStep = () => {
  const context = useContext(StepContext);
  if (context === undefined) {
    throw new Error('useStep must be used within a StepProvider');
  }
  return context;
}; 