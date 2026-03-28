"use client";

import { useState } from "react";
import { Stepper } from "@/components/dashboard/create/Stepper";
import { NicheSelection } from "@/components/dashboard/create/NicheSelection";
import { VoiceSelection } from "@/components/dashboard/create/VoiceSelection";
import { StepFooter } from "@/components/dashboard/create/StepFooter";

export interface CreateSeriesData {
  nicheType: "available" | "custom";
  nicheId: string;
  customNicheDescription: string;
  language: string;
  voiceId: string;
  voiceModel: string;
  voiceName: string;
}

const initialFormData: CreateSeriesData = {
  nicheType: "available",
  nicheId: "",
  customNicheDescription: "",
  language: "English",
  voiceId: "",
  voiceModel: "",
  voiceName: ""
};

export default function CreateSeriesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateSeriesData>(initialFormData);

  const handleNextStep1 = (stepData: Partial<CreateSeriesData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(2);
  };

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
      <div className="shrink-0">
        <Stepper currentStep={currentStep} />
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto py-8 px-4 flex flex-col relative z-10">
        {currentStep === 1 && (
          <NicheSelection 
            initialData={formData} 
            onNext={handleNextStep1} 
          />
        )}
        
        {currentStep === 2 && (
          <VoiceSelection
            initialData={formData}
            onNext={(stepData) => {
              setFormData((prev) => ({ ...prev, ...stepData }));
              setCurrentStep(3);
            }}
            onBack={handleBack}
          />
        )}

        {/* Placeholders for subsequent steps */}
        {currentStep > 2 && (
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            <div className="text-center py-20 flex-1 text-slate-400">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400 mb-4">
                Step {currentStep} under construction.
              </h2>
              <div className="p-4 bg-slate-900/50 rounded-lg border border-white/5 text-left text-slate-300 text-sm font-mono max-w-lg mx-auto overflow-auto mt-8">
                <span className="text-purple-400 block mb-2">// Current Global State</span>
                {JSON.stringify(formData, null, 2)}
              </div>
            </div>
            <div className="mt-auto">
              <StepFooter onNext={handleNext} onBack={handleBack} showBack />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
