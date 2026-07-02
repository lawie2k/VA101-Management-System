import React from "react";
import { PCard, PCardHeader, Button } from "./ProfileUI";
import { IconPencil } from "./ProfileIcons";

interface StudentLearningJourneyProps {
  learningGoal: string;
  openModal: () => void;
}

export function StudentLearningJourney({ learningGoal, openModal }: StudentLearningJourneyProps) {
  return (
    <PCard className="hover:border-slate-350">
      <PCardHeader 
        title="Learning Journey" 
        action={
          <Button variant="ghost" size="sm" className="rounded-full p-2" onClick={openModal}>
            <IconPencil className="h-4 w-4 text-slate-500" />
          </Button>
        }
      />
      <p className="text-sm leading-relaxed text-slate-600 font-medium whitespace-pre-line">
        {learningGoal || "No learning goal set yet. Share what you want to achieve to track your progress."}
      </p>
    </PCard>
  );
}
