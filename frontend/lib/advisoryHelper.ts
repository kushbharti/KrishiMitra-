/**
 * Advisory Helper — lazy-loaded disease database
 *
 * Performance improvement: instead of statically importing the 316KB JSON
 * into the JS bundle (which bloated every disease-page chunk), we now fetch
 * it from /public/data/ at runtime as a plain HTTP request.
 *
 * Benefits:
 *   - The disease page JS bundle is ~300KB smaller
 *   - The JSON is fetched lazily, only when a prediction result exists
 *   - Browsers cache the JSON automatically (static file, long cache lifetime)
 *   - Compilation is faster because webpack/turbopack doesn't need to parse
 *     and serialize the entire 316KB JSON structure into the module graph
 */

export interface TreatmentRemedy {
  name: string;
  dosage: string;
  applicationMethod: string;
}

export interface DiseaseRecord {
  id: string;
  crop: string;
  diseaseName: string;
  pathogenType:
    | "Fungal"
    | "Bacterial"
    | "Viral"
    | "Pest"
    | "Deficiency"
    | "Healthy";
  severityLevel: "Low" | "Moderate" | "High" | "Critical" | "None";
  symptoms: string[];
  treatmentPlan: {
    immediateAction: string[];
    organicRemedies: TreatmentRemedy[];
    chemicalRemedies: TreatmentRemedy[];
  };
  prevention: string[];
}

// Module-level cache so the JSON is only fetched once per browser session
let dbCache: Record<string, Record<string, DiseaseRecord>> | null = null;
let dbFetchPromise: Promise<Record<string, Record<string, DiseaseRecord>>> | null = null;

/**
 * Loads the disease database from the public static file.
 * The result is cached in memory so subsequent calls are instant.
 */
export async function loadDiseaseDatabase(): Promise<Record<string, Record<string, DiseaseRecord>>> {
  if (dbCache) return dbCache;
  if (dbFetchPromise) return dbFetchPromise;

  dbFetchPromise = fetch("/data/crop_diseases_75.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load disease database");
      return res.json() as Promise<Record<string, Record<string, DiseaseRecord>>>;
    })
    .then((data) => {
      dbCache = data;
      dbFetchPromise = null;
      return data;
    })
    .catch((err) => {
      dbFetchPromise = null;
      throw err;
    });

  return dbFetchPromise;
}

/**
 * Looks up a disease advisory record by canonical disease key and language.
 * Returns a fallback record if the key is not found.
 */
export function getCropAdvisoryFromDb(
  db: Record<string, Record<string, DiseaseRecord>>,
  canonicalKey: string,
  lang: string = "en",
): DiseaseRecord {
  if (!canonicalKey) {
    return getFallbackRecord(canonicalKey, lang);
  }

  // 1. Normalize the incoming key (handles "Wheat___Brown_Rust", "wheat_brown_rust", "Brown Rust", etc.)
  const cleanKey = canonicalKey
    .toLowerCase()
    .replace(/___/g, "_")
    .replace(/\s+/g, "_")
    .replace(/[\s()/-]+/g, "_")
    .replace(/^_+|_+$/g, "");

  // 2. Direct match attempt
  if (db[cleanKey] && db[cleanKey][lang]) {
    return db[cleanKey][lang];
  }
  if (db[cleanKey] && db[cleanKey]["en"]) {
    return db[cleanKey]["en"];
  }

  // 3. Fuzzy/Substring matching fallback
  for (const dbKey of Object.keys(db)) {
    if (dbKey.includes(cleanKey) || cleanKey.includes(dbKey)) {
      if (db[dbKey][lang]) return db[dbKey][lang];
      if (db[dbKey]["en"]) return db[dbKey]["en"];
    }
  }

  // 4. Intercept healthy variations
  if (cleanKey.includes("healthy")) {
    if (db["crop_healthy"] && db["crop_healthy"][lang])
      return db["crop_healthy"][lang];
    if (db["crop_healthy"] && db["crop_healthy"]["en"])
      return db["crop_healthy"]["en"];
  }

  return getFallbackRecord(canonicalKey, lang);
}

/**
 * Synchronous wrapper that uses the cached database if available,
 * otherwise returns a fallback. Use `loadDiseaseDatabase()` first to ensure
 * the cache is populated.
 */
export function getCropAdvisory(
  canonicalKey: string,
  lang: string = "en",
): DiseaseRecord {
  if (dbCache) {
    return getCropAdvisoryFromDb(dbCache, canonicalKey, lang);
  }
  // Database not yet loaded — return fallback immediately
  return getFallbackRecord(canonicalKey, lang);
}

function getFallbackRecord(canonicalKey: string, lang: string): DiseaseRecord {
  return {
    id: canonicalKey || "unknown",
    crop: canonicalKey ? canonicalKey.split("_")[0] : "Crop",
    diseaseName: canonicalKey
      ? canonicalKey.replace(/_/g, " ")
      : "Unknown Condition",
    pathogenType: "Fungal",
    severityLevel: "Moderate",
    symptoms: [
      lang === "hi"
        ? "पत्तियों पर धब्बे या असामान्य वृद्धि के लक्षण देखे गए हैं।"
        : lang === "mr"
          ? "पानांवर डाग किंवा असामान्यता दिसून येत आहे."
          : "Round to oval bright orange-brown pustules or leaf spots observed.",
    ],
    treatmentPlan: {
      immediateAction: [
        lang === "hi"
          ? "संक्रमित पत्तियों को अलग करें।"
          : lang === "mr"
            ? "बाधित पाने वेगळी करा."
            : "Isolate infected foliage and monitor spread.",
      ],
      organicRemedies: [
        {
          name: "Neem Oil Extract",
          dosage: "5 ml/L",
          applicationMethod: "Foliar spray",
        },
      ],
      chemicalRemedies: [
        {
          name: "Propiconazole 25% EC",
          dosage: "1.0 ml/L",
          applicationMethod: "Foliar spray",
        },
      ],
    },
    prevention: [
      lang === "hi"
        ? "संतुलित उर्वरक का प्रयोग करें।"
        : lang === "mr"
          ? "समतोल खत व्यवस्थापन ठेवा."
          : "Maintain balanced soil nutrition and proper aeration.",
    ],
  };
}
