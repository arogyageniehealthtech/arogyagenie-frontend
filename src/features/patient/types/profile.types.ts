import type { LucideIcon } from "lucide-react";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  membership: string;
}

export interface ProfileMenuItemConfig {
  label: string;
  icon: LucideIcon;
  href: string;
}