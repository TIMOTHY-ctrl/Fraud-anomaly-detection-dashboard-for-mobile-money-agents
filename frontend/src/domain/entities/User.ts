export type UserRole = "manager" | "agent" | "analyst";

export interface DemoUser {
  role: UserRole;
  name: string;
  initials: string;
  title: string;
  organization: string;
}

export const demoUsers: Record<UserRole, DemoUser> = {
  manager: {
    role: "manager",
    name: "Alex Kimani",
    initials: "AK",
    title: "Network manager",
    organization: "Safelink Networks",
  },
  agent: {
    role: "agent",
    name: "James Mwangi",
    initials: "JM",
    title: "Mobile money agent",
    organization: "Safelink Networks",
  },
  analyst: {
    role: "analyst",
    name: "Maya Otieno",
    initials: "MO",
    title: "Fraud analyst",
    organization: "Safelink Networks",
  },
};
