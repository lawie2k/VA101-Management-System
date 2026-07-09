import React from "react";
import { PCard, PCardHeader, Button } from "./ProfileUI";
import { IconPencil } from "./ProfileIcons";

interface StudentLearningJourneyProps {
  learningGoal: string;
}

export function StudentLearningJourney({ learningGoal }: StudentLearningJourneyProps) {
  return (
    <PCard className="hover:border-slate-350">
      <PCardHeader title="About You" />
      <p className="text-sm leading-relaxed text-slate-600 font-medium whitespace-pre-line">
        {learningGoal || "No info provided yet. Share your interests!"}
      </p>
    </PCard>
  );
}
