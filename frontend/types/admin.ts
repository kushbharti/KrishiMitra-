export interface OverviewMetrics {
  total_farmers: number;
  monthly_growth: string;
  total_scans: number;
  active_alerts: number;
  top_crop: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  email_or_phone: string;
  selected_language: string;
  total_scans: number;
  last_scan_date: string;
  location: string;
  registered_at: string;
  status: "Active" | "Inactive";
}

export interface DiseaseLog {
  crop: string;
  pathogen: string;
  confidence: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  timestamp: string;
  farmer_id: string;
}

export interface CropDistribution {
  name: string;
  value: number;
}

export interface DiseaseTelemetry {
  logs: DiseaseLog[];
  crop_distribution: CropDistribution[];
}

export interface AILog {
  query_intent: string;
  language: string;
  timestamp: string;
  resolved: boolean;
}

export interface LanguageDistribution {
  name: string;
  value: number;
}

export interface AITelemetry {
  logs: AILog[];
  language_distribution: LanguageDistribution[];
}
