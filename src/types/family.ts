/**
 * Type definitions for Family Information components
 */

import type { EventDetails } from "@/config/events";

export interface ParentInfo {
  fatherName: string;
  motherName: string;
}

export interface FamilyData {
  husband: ParentInfo;
  wife: ParentInfo;
}

export interface FamilyInformationProps {
  enableAnimations?: boolean;
  className?: string;
  eventID?: EventDetails["id"];
}

export interface FamilyHouseCardProps {
  houseTitle: string;          // "Nhà trai" or "Nhà gái"
  fatherName: string;
  motherName: string;
  enableAnimations?: boolean;
  animationDelay?: number;      // Stagger effect in milliseconds
  className?: string;
  address?: string;          // Address of the household
}
