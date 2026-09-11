import { ElementType } from "react";

export interface StatMetric {
  label: string;
  value: number;
  trend: number;
  icon: ElementType;
  color: string;
  bg: string;
  isCurrency?: boolean;
}

export interface HealthDistribution {
  name: string;
  healthy: number;
  moderate: number;
  risk: number;
  profit: number;
}

export interface DiagnosticScan {
  id: number;
  crop: string;
  disease: string;
  confidence: number;
  severity: "None" | "Low" | "Moderate" | "High" | "Critical";
  time: string;
  image: string;
}

export interface GovernmentScheme {
  id: number;
  title: string;
  tag: string;
  benefit: string;
  status: "Active" | "Eligible" | "Action Needed" | "Registered";
  statusColor: string;
}

export interface SmartAlert {
  id: number;
  type: "alert" | "danger" | "success" | "info";
  message: string;
  time: string;
  icon: ElementType;
  color: string;
  bg: string;
}

export interface TimelineEvent {
  id: number;
  title: string;
  desc: string;
  time: string;
  icon: ElementType;
  color: string;
}
