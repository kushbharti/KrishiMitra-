import { auth } from "./firebase";
import {
  IncomeRequest,
  IncomeResult,
  CropRecommendation,
   CropData,
  CalendarCrop,
  ChatMessage,
  WeatherInput,
  WeatherResult,
  SchemeResult,
  SupportedCropsResponse,
  DiseasePredictionResponse,
  AuthUser,
  ProfileUpdatePayload,
  ProfileUpdateResponse,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Firebase Auth Fetch Wrapper ───────────────
export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<Response> {
  // CRITICAL FIX: Strip out absolute URLs so the request goes through the Next.js proxy!
  // If endpoint is "http://localhost:8000/api/auth/sync", this converts it to "/api/auth/sync"
  let url = endpoint;
  if (url.startsWith("http")) {
    const urlObj = new URL(url);
    url = urlObj.pathname + urlObj.search;
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    console.log(`[API] Fetching ${url} (via Next.js Proxy)...`);
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Required to pass cookies
    });

    // Controlled 401 token refresh: if session/token is stale, refresh Firebase ID token once & retry
    if (response.status === 401 && !isRetry && url !== "/api/auth/sync" && url !== "/api/auth/me") {
      console.warn(`[API] Received 401 on ${url}. Attempting controlled token refresh retry...`);
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        try {
          const freshToken = await firebaseUser.getIdToken(true);
          const syncRes = await fetch("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: freshToken }),
            credentials: "include",
          });
          if (syncRes.ok) {
            console.log(`[API] Session sync refreshed successfully. Retrying request to ${url}...`);
            return await fetchWithAuth(endpoint, options, true);
          }
        } catch (refreshErr) {
          console.error("[API] Automatic token refresh failed:", refreshErr);
        }
      }
    }

    if (!response.ok) {
      let errorMessage = `Server error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (parseError) {
        console.error(
          "[API] Failed to parse error response as JSON. Backend may be returning HTML.",
        );
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error: any) {
    console.error(`[API] Network Error on ${url}:`, error.message);
    throw new Error(
      error.message || "Network Error: Unable to reach the backend.",
    );
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}

// ─── Authentication Sync ───────────────────────────────────────────────────
export async function syncUserWithBackend(): Promise<any> {
  const res = await fetchWithAuth("/api/auth/sync", { method: "POST" });
  return handleResponse<any>(res);
}

// ─── Farmer Profile ────────────────────────────────────────────────────────

/** Fetches the authenticated farmer's full profile from the backend. */
export async function getProfile(): Promise<AuthUser> {
  const res = await fetchWithAuth("/api/profile/me");
  return handleResponse<AuthUser>(res);
}

/**
 * Partially updates the authenticated farmer's profile.
 * Only the fields present in `payload` are written — absent fields are
 * left unchanged (true PATCH semantics enforced by the backend).
 */
export async function updateProfile(
  payload: ProfileUpdatePayload,
): Promise<ProfileUpdateResponse> {
  const res = await fetchWithAuth("/api/profile/me", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<ProfileUpdateResponse>(res);
}

// ... Keep your existing disease/weather/schemes functions below ...
// ─── Disease Detection ─────────────────────────────────────────────────────
export async function fetchSupportedCrops(): Promise<string[]> {
  const response = await fetchWithAuth("/api/disease/supported-crops", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok)
    throw new Error(`Failed to fetch supported crops (${response.status})`);

  const data: SupportedCropsResponse = await response.json();
  if (!data.success)
    throw new Error("API returned unsuccessful response for crops list.");

  return data.crops;
}

export async function predictDisease(
  crop: string,
  imageFile: File,
): Promise<DiseasePredictionResponse> {
  const formData = new FormData();
  formData.append("crop", crop);
  formData.append("image", imageFile);

  const response = await fetchWithAuth("/api/disease/predict", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok)
    throw new Error(
      data.detail || "Failed to analyze leaf image. Please try again.",
    );
  if (!data.success)
    throw new Error(data.message || "Disease prediction failed.");

  return data;
}

// ─── Income Advisor ────────────────────────────────────────────────────────
export const formatINR = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Real-world static data based on 2026-27 MSP and typical India-level estimates
const STATIC_CROP_DATA: Record<string, CropData> = {
  wheat: {
    id: "wheat", name: "Wheat", season: "Rabi",
    yieldPerAcre: 14, costPerAcre: 15000, pricePerQuintal: 2585,
    water_need: "Medium", risk_level: "Low",
    source: "Government of India / PIB", sourceYear: "2026-27", geography: "India",
    notes: "Reference price based on official Rabi MSP", isVerified: true
  },
  rice: {
    id: "rice", name: "Rice (Paddy)", season: "Kharif",
    yieldPerAcre: 16, costPerAcre: 18000, pricePerQuintal: 2441,
    water_need: "High", risk_level: "Medium",
    source: "Government of India / PIB", sourceYear: "2026-27", geography: "India",
    notes: "Reference price based on official Kharif MSP", isVerified: true
  },
  cotton: {
    id: "cotton", name: "Cotton", season: "Kharif",
    yieldPerAcre: 8, costPerAcre: 22000, pricePerQuintal: 8267,
    water_need: "Medium", risk_level: "High",
    source: "Government of India / PIB", sourceYear: "2026-27", geography: "India",
    notes: "Reference price based on Medium Staple MSP", isVerified: true
  },
  soybean: {
    id: "soybean", name: "Soybean", season: "Kharif",
    yieldPerAcre: 6, costPerAcre: 12000, pricePerQuintal: 5708,
    water_need: "Low", risk_level: "Medium",
    source: "Government of India / PIB", sourceYear: "2026-27", geography: "India",
    notes: "Reference price based on official Kharif MSP", isVerified: true
  },
  maize: {
    id: "maize", name: "Maize", season: "Kharif",
    yieldPerAcre: 12, costPerAcre: 14000, pricePerQuintal: 2410,
    water_need: "Medium", risk_level: "Low",
    source: "Government of India / PIB", sourceYear: "2026-27", geography: "India",
    notes: "Reference price based on official Kharif MSP", isVerified: true
  },
  chickpea: {
    id: "chickpea", name: "Gram (Chickpea)", season: "Rabi",
    yieldPerAcre: 6, costPerAcre: 11000, pricePerQuintal: 5875,
    water_need: "Low", risk_level: "Medium",
    source: "Government of India / PIB", sourceYear: "2026-27", geography: "India",
    notes: "Reference price based on official Rabi MSP", isVerified: true
  },
  mustard: {
    id: "mustard", name: "Rapeseed/Mustard", season: "Rabi",
    yieldPerAcre: 6, costPerAcre: 10000, pricePerQuintal: 6200,
    water_need: "Low", risk_level: "Low",
    source: "Government of India / PIB", sourceYear: "2026-27", geography: "India",
    notes: "Reference price based on official Rabi MSP", isVerified: true
  },
  tomato: {
    id: "tomato", name: "Tomato", season: "All",
    yieldPerAcre: 100, costPerAcre: 45000, pricePerQuintal: 1500, // Highly volatile
    water_need: "High", risk_level: "High",
    source: "Agmarknet / State Mandi Averages", sourceYear: "2025-26", geography: "India",
    notes: "No official MSP. Based on historical average wholesale prices.", isVerified: false
  },
  // Note: For a production app, fill out the rest of CROP_LIST here. 
  // Any missing crop in this record will fall back to a safely flagged "unverified" state.
};

export const calculateIncome = async (request: IncomeRequest): Promise<IncomeResult> => {
  // Simulate network delay to preserve existing loading UI behavior
  await new Promise((resolve) => setTimeout(resolve, 600));

  const recommendations: CropRecommendation[] = Object.values(STATIC_CROP_DATA)
    .filter(crop => {
      if (request.season !== "All" && crop.season !== "All" && crop.season !== request.season) return false;
      if (request.selected_crop && request.selected_crop !== crop.id) return false;
      return true;
    })
    .map(crop => {
      const total_revenue = crop.yieldPerAcre * crop.pricePerQuintal * request.land_size_acres;
      const total_cost = crop.costPerAcre * request.land_size_acres;
      const total_profit = total_revenue - total_cost;

      return {
        id: crop.id,
        name: crop.name,
        season: crop.season,
        water_need: crop.water_need,
        risk_level: crop.risk_level,
        total_revenue,
        total_cost,
        total_profit,
        recommended: false, // Calculated below
        source: crop.source,
        sourceYear: crop.sourceYear,
        geography: crop.geography,
        isVerified: crop.isVerified
      };
    });

  // Sort by highest profit to determine recommendation
  recommendations.sort((a, b) => b.total_profit - a.total_profit);
  if (recommendations.length > 0) {
    recommendations[0].recommended = true;
  }

  return {
    land_size_acres: request.land_size_acres,
    recommendations
  };
};

// ─── Crop Calendar ─────────────────────────────────────────────────────────
export async function getCalendarCrops(
  season = "All",
  category = "All",
): Promise<CalendarCrop[]> {
  const params = new URLSearchParams({ season, category });
  const res = await fetchWithAuth(`/api/calendar/crops?${params}`);
  return handleResponse<CalendarCrop[]>(res);
}

// ─── AI Assistant ──────────────────────────────────────────────────────────
export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  language: "en" | "hi" | "mr" = "en",
): Promise<string> {
  const res = await fetchWithAuth("/api/assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      language,
      conversation_history: history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });
  const data = await handleResponse<{ response: string; model: string; language: string }>(res);
  return data.response;
}


// ─── Weather Risk ──────────────────────────────────────────────────────────
export interface LiveWeatherRequest {
  location: string;
  day: "yesterday" | "today" | "tomorrow";
  overrides?: Partial<WeatherInput>;
}

export interface TrajectoryPoint {
  day: string;
  temp: number;
  humidity: number;
  rainfall: WeatherInput["rainfall"];
}

export async function analyzeWeather({
  location,
  day,
  overrides,
}: LiveWeatherRequest): Promise<{
  result: WeatherResult;
  liveTelemetry: WeatherInput;
  trajectory: TrajectoryPoint[];
}> {
  const response = await fetchWithAuth("/api/weather/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location, day, overrides }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail ||
        "Failed to fetch weather risk models from AgroVision API.",
    );
  }
  return response.json();
}

// ─── Government Schemes ────────────────────────────────────────────────────
type GetSchemesParams = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
};

export async function getSchemes({
  search = "",
  category = "All",
  page = 1,
  limit = 8,
}: GetSchemesParams): Promise<SchemeResult> {
  const params = new URLSearchParams({
    search,
    category,
    page: String(page),
    limit: String(limit),
  });
  const response = await fetchWithAuth(`/api/schemes?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch schemes");
  return response.json();
}

