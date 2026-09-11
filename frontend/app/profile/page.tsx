"use client";

/**
 * Farmer Profile Page
 *
 * Architecture:
 *   ProfilePage  →  updateProfile (lib/api.ts)  →  PATCH /api/profile/me
 *
 * - All data is sourced from AuthContext (user authenticated via JWT cookie).
 * - Profile is fetched once on mount via GET /api/profile/me to ensure we
 *   display the latest persisted data, not just the auth-sync snapshot.
 * - Updates use confirmed (not optimistic) state: UI reflects the
 *   backend-confirmed value from the response, with rollback on error.
 * - Every async operation has idle → loading → success/error states.
 * - Double-submission is prevented by disabling the Save button while saving.
 * - Email is read-only and excluded from the PATCH payload.
 */

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProfile, updateProfile } from "@/lib/api";
import PageTitle from "@/components/shared/PageTitle";
import type { AuthUser, ProfileUpdatePayload } from "@/types";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Sprout,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type SaveState = "idle" | "saving" | "success" | "error";

interface FormState {
  full_name: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  primary_crop: string;
  land_size_acres: string; // stored as string for input; coerced on submit
  farming_experience_years: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function profileToForm(profile: AuthUser): FormState {
  return {
    full_name: profile.name ?? "",
    phone: profile.phone ?? "",
    state: profile.state ?? "",
    district: profile.district ?? "",
    village: profile.village ?? "",
    primary_crop: profile.primary_crop ?? "",
    land_size_acres: profile.land_size_acres != null ? String(profile.land_size_acres) : "",
    farming_experience_years:
      profile.farming_experience_years != null
        ? String(profile.farming_experience_years)
        : "",
  };
}

function buildPayload(form: FormState): ProfileUpdatePayload {
  const payload: ProfileUpdatePayload = {};

  if (form.full_name.trim()) payload.full_name = form.full_name.trim();
  if (form.phone.trim()) payload.phone = form.phone.trim();
  if (form.state.trim()) payload.state = form.state.trim();
  if (form.district.trim()) payload.district = form.district.trim();
  if (form.village.trim()) payload.village = form.village.trim();
  if (form.primary_crop.trim()) payload.primary_crop = form.primary_crop.trim();

  const acres = parseFloat(form.land_size_acres);
  if (!isNaN(acres) && acres > 0) payload.land_size_acres = acres;

  const exp = parseInt(form.farming_experience_years, 10);
  if (!isNaN(exp) && exp >= 0) payload.farming_experience_years = exp;

  return payload;
}

function friendlyError(message: string): string {
  if (message.includes("10 digits")) return "Phone number must be exactly 10 digits.";
  if (message.includes("min_length") || message.includes("at least 2"))
    return "Full name must be at least 2 characters.";
  if (message.includes("401") || message.toLowerCase().includes("expired")) return "Your session has expired. Please sign in again.";
  if (message.includes("Network")) return "Unable to reach the server. Check your connection.";
  return message || "An unexpected error occurred. Please try again.";
}

// ─── Sub-components ─────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  icon?: React.ReactNode;
  hint?: string;
}

function FormField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  readOnly,
  icon,
  hint,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-bold text-[#475B63] uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#49A078] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border text-sm font-medium text-[#2B2118] placeholder-[#475B63]/50 focus:outline-none focus:ring-2 focus:ring-[#49A078]/40 transition-all ${
            readOnly
              ? "bg-slate-100 border-slate-200/80 cursor-not-allowed text-[#475B63]"
              : "bg-white border-slate-200/80 hover:border-[#49A078]/50"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        />
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-[#475B63]/70 font-medium">
          {hint}
        </p>
      )}
    </div>
  );
}

// ─── Skeleton Loading Component ──────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-12 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 rounded-xl" />
        <div className="h-4 w-72 bg-slate-100 rounded-lg" />
      </div>

      {/* Identity Card Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-200 shrink-0" />
        <div className="flex-1 w-full space-y-4">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-7 w-48 bg-slate-200 rounded-lg" />
          <div className="h-4 w-64 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-5 w-32 bg-slate-200 rounded pt-2" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, loading: authLoading, logout, refreshUser } = useAuth();

  // Profile fetch state — we fetch once on mount to get the latest persisted data
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [form, setForm] = useState<FormState>({
    full_name: "",
    phone: "",
    state: "",
    district: "",
    village: "",
    primary_crop: "",
    land_size_acres: "",
    farming_experience_years: "",
  });

  // Save state
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // ── Fetch profile on mount ─────────────────────────────────────────────
  const loadProfile = useCallback(async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      const data = await getProfile();
      setProfile(data);
      setForm(profileToForm(data));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load profile.";
      setFetchError(friendlyError(message));
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    // Rely on the backend's HttpOnly cookie rather than AuthContext's Firebase client state.
    // If the backend returns 401, we know they are truly unauthenticated.
    if (!authLoading) {
      loadProfile();
    }
  }, [authLoading, loadProfile]);

  useEffect(() => {
    if (fetchError === "Your session has expired. Please sign in again.") {
      router.push("/?auth=login&from=/profile");
    }
  }, [fetchError, router]);

  // ── Form field setter (immutable update) ──────────────────────────────
  const setField = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ── Submit handler ────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saveState === "saving") return; // prevent double-submission

    const payload = buildPayload(form);
    if (Object.keys(payload).length === 0) {
      setSaveError("No changes to save.");
      setSaveState("error");
      return;
    }

    setSaveState("saving");
    setSaveError(null);
    setSaveMessage(null);

    try {
      const response = await updateProfile(payload);
      // Confirmed update: use backend response as source of truth
      setProfile(response.user);
      setForm(profileToForm(response.user));
      refreshUser(response.user); // keep TopBar/AuthContext in sync
      setSaveMessage(response.message);
      setSaveState("success");
      // Auto-clear success banner after 4 s
      setTimeout(() => setSaveState("idle"), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save profile.";
      setSaveError(friendlyError(message));
      setSaveState("error");
    }
  };

  // ─── Loading / Error states ─────────────────────────────────────────────

  if (authLoading || fetchLoading) {
    return <ProfileSkeleton />;
  }

  // Removed `if (!user) return null;` which caused the blank page bug when Firebase auth was out of sync.

  if (fetchError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <PageTitle title="Farmer Profile" />
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-bold text-sm">Could not load profile</p>
            <p className="text-xs mt-0.5">{fetchError}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadProfile}
          className="px-5 py-2.5 rounded-xl bg-[#49A078] text-white font-bold text-sm hover:bg-[#3d8664] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const isSaving = saveState === "saving";

  // ─── Page render ────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <PageTitle
        title="Farmer Profile"
        subtitle="Manage your personal details and farm information."
      />

      {/* ── Identity Card (read-only) ──────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#49A078]/8 to-transparent rounded-bl-[100px] pointer-events-none" aria-hidden="true" />

        <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden shadow-inner"
              aria-label="Profile picture"
            >
              {profile?.picture ? (
                <img
                  src={profile.picture}
                  alt={profile.name || "Profile Picture"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-[#475B63]/40" aria-hidden="true" />
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              Verified {profile?.role ?? "Farmer"}
            </span>
          </div>

          {/* Read-only identity fields */}
          <div className="flex-1 w-full space-y-3">
            <div>
              <p className="text-xs font-bold text-[#475B63] uppercase tracking-wider mb-1">
                Display Name
              </p>
              <p className="text-xl font-black text-[#2B2118] tracking-tight">
                {profile?.name || "—"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#475B63] font-medium">
              <Mail className="w-4 h-4 text-[#49A078] shrink-0" aria-hidden="true" />
              <span>{profile?.email}</span>
              <span className="text-xs text-[#475B63]/60 font-normal">(managed by your sign-in provider)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Editable Profile Form ──────────────────────────────────────── */}
      <form
        onSubmit={handleSave}
        aria-label="Edit farmer profile"
        noValidate
      >
        <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-black text-[#2B2118] flex items-center gap-2">
            <User className="w-4 h-4 text-[#49A078]" aria-hidden="true" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="full_name"
              label="Full Name"
              value={form.full_name}
              onChange={setField("full_name")}
              placeholder="e.g. Ramesh Kumar"
              disabled={isSaving}
              icon={<User className="w-4 h-4" />}
            />
            <FormField
              id="phone"
              label="Mobile Number"
              value={form.phone}
              onChange={setField("phone")}
              placeholder="10-digit mobile number"
              type="tel"
              disabled={isSaving}
              icon={<Phone className="w-4 h-4" />}
              hint="10 digits, Indian format"
            />
          </div>

          <h2 className="text-base font-black text-[#2B2118] flex items-center gap-2 pt-2 border-t border-slate-100">
            <MapPin className="w-4 h-4 text-[#49A078]" aria-hidden="true" />
            Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              id="state"
              label="State"
              value={form.state}
              onChange={setField("state")}
              placeholder="e.g. Maharashtra"
              disabled={isSaving}
              icon={<MapPin className="w-4 h-4" />}
            />
            <FormField
              id="district"
              label="District"
              value={form.district}
              onChange={setField("district")}
              placeholder="e.g. Pune"
              disabled={isSaving}
            />
            <FormField
              id="village"
              label="Village / Town"
              value={form.village}
              onChange={setField("village")}
              placeholder="e.g. Baramati"
              disabled={isSaving}
            />
          </div>

          <h2 className="text-base font-black text-[#2B2118] flex items-center gap-2 pt-2 border-t border-slate-100">
            <Sprout className="w-4 h-4 text-[#49A078]" aria-hidden="true" />
            Farm Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              id="primary_crop"
              label="Primary Crop"
              value={form.primary_crop}
              onChange={setField("primary_crop")}
              placeholder="e.g. Tomato"
              disabled={isSaving}
              icon={<Sprout className="w-4 h-4" />}
            />
            <FormField
              id="land_size_acres"
              label="Land Size (acres)"
              value={form.land_size_acres}
              onChange={setField("land_size_acres")}
              placeholder="e.g. 5.5"
              type="number"
              disabled={isSaving}
              hint="Positive number"
            />
            <FormField
              id="farming_experience_years"
              label="Experience (years)"
              value={form.farming_experience_years}
              onChange={setField("farming_experience_years")}
              placeholder="e.g. 12"
              type="number"
              disabled={isSaving}
            />
          </div>

          {/* ── Status banners ────────────────────────────────────────── */}
          {saveState === "success" && saveMessage && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              {saveMessage}
            </div>
          )}
          {saveState === "error" && saveError && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              {saveError}
            </div>
          )}

          {/* ── Save button ───────────────────────────────────────────── */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              aria-disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#49A078] hover:bg-[#3d8664] active:scale-95 text-white font-extrabold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-[#49A078]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#49A078] focus-visible:ring-offset-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" aria-hidden="true" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ── Account Actions ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-black text-[#2B2118] mb-4">Account Actions</h2>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-50 text-red-600 font-bold text-sm border border-red-100 hover:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Sign Out Securely
        </button>
      </div>
    </div>
  );
}
