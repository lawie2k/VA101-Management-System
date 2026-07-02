export interface VAProfileData {
  fullName: string;
  title: string;
  experienceYears: number;
  location: string;
  niche: string;
  expectedRate: number;
  openToOpportunities: boolean;
  avatar: string | null;
  coverImage: string | null;
  about: string;
  experience: any[];
  portfolio: any[];
  certifications: any[];
  skills: string[];
  tools: string[];
  availability: {
    hours: string;
    schedule: string;
    timezone: string;
  };
}
