"use client";

import { useState } from "react";
import { Stepper } from "@/components/dashboard/create/Stepper";
import { NicheSelection } from "@/components/dashboard/create/NicheSelection";
import { VoiceSelection } from "@/components/dashboard/create/VoiceSelection";
import { VisualSelection } from "@/components/dashboard/create/VisualSelection";
import { MusicSelection } from "@/components/dashboard/create/MusicSelection";
import { ScheduleSelection } from "@/components/dashboard/create/ScheduleSelection";
import { ReviewSelection } from "@/components/dashboard/create/ReviewSelection";

export interface CreateSeriesData {
  nicheType: "available" | "custom";
  nicheId: string;
  customNicheDescription: string;
  language: string;
  voiceId: string;
  voiceModel: string;
  voiceName: string;
  visualStyle: string;
  musicStyle: string;
  scheduleFrequency: string;
  scheduleTime: string;
}

const initialFormData: CreateSeriesData = {
  nicheType: "available",
  nicheId: "",
  customNicheDescription: "",
  language: "English",
  voiceId: "",
  voiceModel: "",
  voiceName: "",
  visualStyle: "",
  musicStyle: "",
  scheduleFrequency: "daily",
  scheduleTime: "18:00"
};

export default function CreateSeriesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateSeriesData>(initialFormData);

  const handleNextStep1 = (stepData: Partial<CreateSeriesData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(2);
  };

  const handleNextStep2 = (stepData: Partial<CreateSeriesData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(3);
  };

  const handleNextStep3 = (stepData: Partial<CreateSeriesData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(4);
  };

  const handleNextStep4 = (stepData: Partial<CreateSeriesData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(5);
  };

  const handleNextStep5 = (stepData: Partial<CreateSeriesData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(6);
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
            onNext={handleNextStep2}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <VisualSelection
            initialData={formData}
            onNext={handleNextStep3}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <MusicSelection
            initialData={formData}
            onNext={handleNextStep4}
            onBack={handleBack}
          />
        )}

        {currentStep === 5 && (
          <ScheduleSelection
            initialData={formData}
            onNext={handleNextStep5}
            onBack={handleBack}
          />
        )}

        {currentStep === 6 && (
          <ReviewSelection
            initialData={formData}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
