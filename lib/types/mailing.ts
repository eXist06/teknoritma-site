export type MailingCategory = "ik" | "general";

export interface MailingSubscriber {
  id: string;
  email: string;
  name?: string;
  organization?: string;
  subscribedAt: string;
  source: "contact" | "demo" | "talent-network" | "manual";
  category: MailingCategory | MailingCategory[]; // Support both single category and array
  tags?: string[];
  active: boolean;
}

export interface MailingList {
  subscribers: MailingSubscriber[];
}

