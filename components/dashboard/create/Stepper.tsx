import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: "Niche" },
  { id: 2, name: "Language" },
  { id: 3, name: "Voice" },
  { id: 4, name: "Visuals" },
  { id: 5, name: "Music" },
  { id: 6, name: "Review" },
];

export const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="w-full py-6 mb-8 border-b border-white/10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {/* Progress Bar Background */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0"></div>
          
          {/* Active Progress Bar */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300",
                    isCompleted ? "bg-purple-500 text-white" : 
                    isActive ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : 
                    "bg-slate-800 text-slate-400 border border-white/10"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={cn(
                  "text-xs font-medium absolute -bottom-6 w-max",
                  isActive || isCompleted ? "text-slate-200" : "text-slate-500"
                )}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
