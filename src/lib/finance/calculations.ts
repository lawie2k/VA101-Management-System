export type VAPayoutBreakdown = {
  baseRate: number;
  bonusAmount: number;
  netPayout: number;
};

// VA payout breakdown (Default to 100% Base Rate, $0 Bonus)
export function calculateVAPayoutBreakdown(totalAmount: number | string): VAPayoutBreakdown {
  const amount = Number(totalAmount) || 0;
  
  return {
    baseRate: amount,
    bonusAmount: 0,
    netPayout: amount
  };
}

// System takes a 30% cut of the client's posted job budget
export function calculateJobPostRates(clientBudget: number | string) {
  const amount = Number(clientBudget) || 0;
  
  return {
    platformFee: amount * 0.3,
    vaTakeHome: amount * 0.7
  };
}

// System takes a 30% cut of trainer course sales
export function calculateTrainerCourseRates(coursePrice: number | string) {
  const amount = Number(coursePrice) || 0;
  
  return {
    platformFee: amount * 0.3,
    trainerTakeHome: amount * 0.7
  };
}

// Calculate bi-monthly payout based on work schedule and va hourly rate
export function calculateBiMonthlyPayout(vaHourlyRate: number | string, workSchedule: string | null): number {
  const rate = Number(vaHourlyRate) || 0;
  
  // Default to Full-Time (80 hours per bi-monthly cycle)
  // If explicitly part-time, use 40 hours
  let hours = 80;
  if (workSchedule && workSchedule.toLowerCase().includes("part-time")) {
    hours = 40;
  }
  
  return rate * hours;
}
