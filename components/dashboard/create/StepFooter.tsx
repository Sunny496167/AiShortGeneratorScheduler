import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepFooterProps {
  onNext: () => void;
  onBack?: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  showBack?: boolean;
}

export const StepFooter = ({ 
  onNext, 
  onBack, 
  isNextDisabled = false, 
  nextLabel = "Continue to Next Step",
  showBack = false
}: StepFooterProps) => {
  return (
    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
      <div>
        {showBack && onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-slate-400 hover:text-white hover:bg-white/5 px-6 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      </div>
      
      <Button 
        onClick={onNext}
        disabled={isNextDisabled}
        className="bg-white text-slate-950 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] px-8 py-2 rounded-full font-semibold transition-all duration-200"
      >
        {nextLabel}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
