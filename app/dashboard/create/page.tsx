"use client";

import { useState } from "react";
import { Stepper } from "@/components/dashboard/create/Stepper";
import { NicheSelection } from "@/components/dashboard/create/NicheSelection";

export default function CreateSeriesPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <Stepper currentStep={currentStep} />
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto py-8 px-4 h-full relative z-10">
        {currentStep === 1 && <NicheSelection onNext={handleNext} />}
        
        {currentStep === 2 && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
              Language & Voice Selection
            </h2>
            <p className="text-slate-400">Step 2 coming soon...</p>
            <button 
              onClick={handleBack}
              className="mt-8 px-6 py-2 rounded-full border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Placeholders for subsequent steps */}
        {currentStep > 2 && (
          <div className="text-center py-20 text-slate-400">
            Step {currentStep} under construction.
            <br />
            <button 
              onClick={handleBack}
              className="mt-8 px-6 py-2 rounded-full border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
