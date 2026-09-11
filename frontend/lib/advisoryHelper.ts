import database from "../public/data/crop_diseases_75.json";

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

export function getCropAdvisory(
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

  const db = database as Record<string, Record<string, DiseaseRecord>>;

  // 2. Direct match attempt
  if (db[cleanKey] && db[cleanKey][lang]) {
    return db[cleanKey][lang];
  }
  if (db[cleanKey] && db[cleanKey]["en"]) {
    return db[cleanKey]["en"];
  }

  // 3. Fuzzy/Substring matching fallback (e.g., matching "brown_rust" inside "wheat_brown_rust")
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
