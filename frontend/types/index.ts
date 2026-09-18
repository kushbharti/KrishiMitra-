// =============================================
// Authentication & User Types
// =============================================

/** The authenticated user as returned by /api/auth/me and /api/profile/me */
export interface AuthUser {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  picture?: string;
  role: string;
  phone?: string;
  state?: string;
  district?: string;
  village?: string;
  primary_crop?: string;
  land_size_acres?: number;
  farming_experience_years?: number;
}

/** Fields the farmer may update via PATCH /api/profile/me.
 *  Email is intentionally absent — it is immutable from this form. */
export interface ProfileUpdatePayload {
  full_name?: string;
  phone?: string;
  state?: string;
  district?: string;
  village?: string;
  primary_crop?: string;
  land_size_acres?: number;
  farming_experience_years?: number;
}

/** Confirmed-update response from the backend */
export interface ProfileUpdateResponse {
  message: string;
  user: AuthUser;
}

// =============================================
// Disease Detection Types
// =============================================

export interface SupportedCropsResponse {
  success: boolean;
  crops: string[];
}

export interface TopPrediction {
  crop: string;
  disease: string;
  confidence: number;
  healthy: boolean;
  symptoms: string[];
  causes: string;
  treatment: string[];
  prevention: string[];
  fungicide?: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  recovery_tips?: string;
}

export interface DiseaseDetails {
  disease_name: string;
  crop_name: string;
  confidence: number;
  healthy: boolean;
  symptoms: string[];
  causes: string;
  treatment: string[];
  prevention: string[];
  fungicide?: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  recovery_tips?: string;
}

export interface DiseasePredictionResponse {
  success: boolean;
  selected_crop: string;
  detected_crop: string;
  crop_match: boolean;
  confidence: number;
  predictions: TopPrediction[];
  details: DiseaseDetails;
  low_confidence: boolean;
  message: string;
}
// =============================================
// Income Advisor Types
// =============================================
export interface CropData {
  id: string;
  name: string;
  season: string;
  yieldPerAcre: number; // in quintals
  costPerAcre: number; // in INR
  pricePerQuintal: number; // in INR
  water_need: "Low" | "Medium" | "High";
  risk_level: "Low" | "Medium" | "High";
  source: string;
  sourceYear: string;
  sourceUrl?: string;
  geography: string;
  notes?: string;
  isVerified: boolean;
}

export interface CropRecommendation {
  id: string;
  name: string;
  category: string;
  season: string;
  water_need: string;
  risk_level: string;
  revenue_per_acre: number;
  cost_per_acre: number;
  profit_per_acre: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  soil_types: string[];
  recommended: boolean;
  rank: number;
}

export interface IncomeRequest {
  land_size_acres: number;
  season: string;
  selected_crop: string | null;
}

export interface IncomeResult {
  land_size_acres: number;
  recommendations: CropRecommendation[];
  best_crop: string;
  best_crop_profit: number;
  season_filter: string;
}

// =============================================
// Crop Calendar Types
// =============================================
export interface ActivityMilestone {
  week: number;
  activity: string;
}

export interface CalendarCrop {
  id: string;
  name: string;
  category: string;
  season: string;
  sow_month: number;
  harvest_month: number;
  duration_days: number;
  water_need: string;
  risk_level: string;
  activity_milestones: ActivityMilestone[];
}

// =============================================
// AI Assistant Types
// =============================================
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

// =============================================
// Weather Risk Types
// =============================================
export interface WeatherAlert {
  id: string;
  risk_name: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  affected_crops: string[];
  description: string;
  recommended_action: string;
}

export interface WeatherInput {
  temperature: number;
  humidity: number;
  rainfall: "none" | "light" | "moderate" | "heavy";
}

export interface WeatherResult {
  alerts: WeatherAlert[];
  risk_count: number;
  overall_risk: string;
  message: string;
}

// =============================================
// Government Schemes Types
// =============================================

export type GovernmentScheme = {
  id: string;
  name: string;
  full_name: string;
  ministry: string;
  category: string;
  benefit_summary: string;
  benefits: string[];
  eligibility: string[];
  official_website: string;
  last_updated: string;
};

export type SchemeResult = {
  schemes: GovernmentScheme[];
  categories: string[];
  total: number;
  page: number;
  total_pages: number;
  limit: number;
};

// =============================================
// UI Types
// =============================================
export interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface Crop {
  id: string;
  name: string;
  category: string;
  season: string;
  sow_month: number;
  harvest_month: number;
  duration_days: number;
  revenue_per_acre: number;
  cost_per_acre: number;
  profit_per_acre: number;
  water_need: string;
  risk_level: string;
  soil_types: string[];
  states: string[];
}
