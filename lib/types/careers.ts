export interface JobPosting {
  id: string;
  title: string;
  titleEn: string;
  department: string;
  departmentEn: string;
  location: string;
  locationEn: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  typeEn: "Full-time" | "Part-time" | "Contract" | "Internship";
  remote: "remote" | "hybrid" | "office";
  remoteEn: "Remote" | "Hybrid" | "Office-based";
  description: string;
  descriptionEn: string;
  requirements: string[];
  requirementsEn: string[];
  benefits: string[];
  benefitsEn: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CareersContent {
  hero: {
    title: string;
    titleEn: string;
    subtitle: string;
    subtitleEn: string;
  };
  unleashPotential: {
    title: string;
    titleEn: string;
    paragraphs: string[];
    paragraphsEn: string[];
    ctaText: string;
    ctaTextEn: string;
  };
  featuredCareers: {
    title: string;
    titleEn: string;
    categories: {
      id: number;
      title: string;
      titleEn: string;
      description: string;
      descriptionEn: string;
    }[];
  };
  testimonials: {
    quote: string;
    quoteEn: string;
    name: string;
    role: string;
    roleEn: string;
    department: string;
    departmentEn: string;
  }[];
  companyCards: {
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    linkText: string;
    linkTextEn: string;
  }[];
  talentNetwork: {
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    buttonText: string;
    buttonTextEn: string;
  };
  exploreLife: {
    title: string;
    titleEn: string;
    stories: {
      title: string;
      titleEn: string;
      description: string;
      descriptionEn: string;
      url: string;
    }[];
  };
}

