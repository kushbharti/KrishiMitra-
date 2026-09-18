import { auth } from "./firebase";
import {
  IncomeRequest,
  IncomeResult,
  CropRecommendation,
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

/** Calls the real backend /api/income/calculate endpoint with full crops.json data. */
export const calculateIncome = async (request: IncomeRequest): Promise<IncomeResult> => {
  const res = await fetchWithAuth("/api/income/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return handleResponse<IncomeResult>(res);
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

// ─── Farmer Dashboard Stats ────────────────────────────────────────────────
export interface DashboardStats {
  scan_count: number;
  disease_count: number;
  ai_consultation_count: number;
  eligible_schemes_count: number;
  last_updated: string;
}

export interface RecentScan {
  id: string;
  crop: string;
  disease: string;
  confidence: number;
  severity: string;
  timestamp: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetchWithAuth("/api/dashboard/stats");
  return handleResponse<DashboardStats>(res);
}

export async function getRecentScans(limit = 4): Promise<RecentScan[]> {
  const res = await fetchWithAuth(`/api/dashboard/recent-scans?limit=${limit}`);
  return handleResponse<RecentScan[]>(res);
}
