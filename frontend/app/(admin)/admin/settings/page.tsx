"use client";

import React, { useState, useEffect } from "react";
import {
  Settings, Shield, Bell, Database, Globe, Palette,
  Save, RefreshCw, AlertTriangle, CheckCircle2, ChevronRight,
  Server, Key, Lock, Eye, EyeOff, Leaf, Mail, Smartphone
} from "lucide-react";

type Section = "general" | "security" | "notifications" | "system";

const SECTION_META = [
  { id: "general" as const, label: "General", icon: Settings, desc: "Platform name, language & display" },
  { id: "security" as const, label: "Security", icon: Shield, desc: "Auth, roles & access control" },
  { id: "notifications" as const, label: "Notifications", icon: Bell, desc: "Alert thresholds & channels" },
  { id: "system" as const, label: "System", icon: Server, desc: "API keys, DB & integrations" },
];

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  desc?: string;
}

function Toggle({ checked, onChange, label, desc }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#216869]" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

interface SystemStatus {
  db_status: string;
  uptime: string;
  total_users: number;
  total_farmers: number;
  total_admins: number;
  provider: string;
  region: string;
}

export default function SystemSettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("general");
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    if (activeSection === "system" && !systemStatus) {
      setStatusLoading(true);
      fetch("/api/admin/system-status")
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setSystemStatus(data); })
        .catch(() => {})
        .finally(() => setStatusLoading(false));
    }
  }, [activeSection]);

  const [settings, setSettings] = useState({
    platformName: "KrishiMitra",
    defaultLanguage: "hi",
    theme: "light",
    timezone: "Asia/Kolkata",
    // security
    sessionTimeout: 7,
    requireMFA: false,
    allowSelfRegistration: true,
    adminOnlyRegistration: false,
    // notifications
    criticalAlerts: true,
    weeklyDigest: true,
    emailAlerts: true,
    smsAlerts: false,
    alertThreshold: "High",
    // system
    maintenanceMode: false,
    debugLogging: false,
    apiKey: "km_prod_x1z9a8b7c6d5e4f3g2h1i0j",
    weatherApiKey: "owm_••••••••••••••••",
  });

  const update = (key: keyof typeof settings, val: any) =>
    setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">System Settings</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Platform configuration, security policies & integrations
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-lg transition-all ${
            saved
              ? "bg-green-600 hover:bg-green-700"
              : "bg-[#216869] hover:bg-[#1a5354]"
          }`}
        >
          {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Warning Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-900">Restricted Access Zone</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Changes to system settings affect all farmers and operators. Modifications are logged and audited.
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-56 shrink-0 space-y-1">
          {SECTION_META.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                activeSection === id
                  ? "bg-[#216869]/10 border border-[#216869]/20"
                  : "hover:bg-slate-100 border border-transparent"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                activeSection === id
                  ? "bg-[#216869] text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
              }`}>
                <Icon size={16} />
              </div>
              <div>
                <p className={`text-sm font-bold ${activeSection === id ? "text-[#216869]" : "text-slate-700"}`}>{label}</p>
                <p className="text-xs text-slate-500 leading-tight">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Panel */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* General */}
          {activeSection === "general" && (
            <div>
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Settings size={14} /> General Settings
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Platform Name</label>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#216869] to-[#49A078] flex items-center justify-center">
                      <Leaf size={14} className="text-white" />
                    </div>
                    <input
                      type="text"
                      value={settings.platformName}
                      onChange={e => update("platformName", e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#49A078] font-bold text-slate-900 bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                      <Globe size={12} className="inline mr-1" />Default Language
                    </label>
                    <select
                      value={settings.defaultLanguage}
                      onChange={e => update("defaultLanguage", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#49A078] bg-white text-slate-700 font-medium"
                    >
                      <option value="hi">Hindi (हिन्दी)</option>
                      <option value="mr">Marathi (मराठी)</option>
                      <option value="en">English</option>
                      <option value="te">Telugu (తెలుగు)</option>
                      <option value="ta">Tamil (தமிழ்)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={e => update("timezone", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#49A078] bg-white text-slate-700 font-medium"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="Asia/Dubai">Asia/Dubai</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                    <Palette size={12} className="inline mr-1" />Display Theme
                  </label>
                  <div className="flex gap-3">
                    {["light", "dark", "system"].map(t => (
                      <button
                        key={t}
                        onClick={() => update("theme", t)}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg border transition-all capitalize ${
                          settings.theme === t
                            ? "border-[#216869] bg-[#216869]/5 text-[#216869]"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <div>
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Shield size={14} /> Security & Access
                </h2>
              </div>
              <div className="p-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                    <Key size={12} className="inline mr-1" />Session Duration (days)
                  </label>
                  <input
                    type="number"
                    min={1} max={30}
                    value={settings.sessionTimeout}
                    onChange={e => update("sessionTimeout", Number(e.target.value))}
                    className="w-32 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#49A078] font-bold text-slate-900 bg-slate-50 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">JWT access token expiry duration for authenticated farmers.</p>
                </div>

                <div className="mt-5 divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-4">
                    <Toggle
                      checked={settings.requireMFA}
                      onChange={() => update("requireMFA", !settings.requireMFA)}
                      label="Require Multi-Factor Authentication"
                      desc="Force all admin accounts to use 2FA"
                    />
                  </div>
                  <div className="p-4">
                    <Toggle
                      checked={settings.allowSelfRegistration}
                      onChange={() => update("allowSelfRegistration", !settings.allowSelfRegistration)}
                      label="Allow Self-Registration"
                      desc="Farmers can create accounts via the public login page"
                    />
                  </div>
                  <div className="p-4">
                    <Toggle
                      checked={settings.adminOnlyRegistration}
                      onChange={() => update("adminOnlyRegistration", !settings.adminOnlyRegistration)}
                      label="Admin-Only Account Creation"
                      desc="New farmer accounts must be manually created by an admin"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <div>
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Bell size={14} /> Alert & Notification Settings
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Alert Severity Threshold</label>
                  <div className="flex gap-2">
                    {["Low", "Medium", "High", "Critical"].map(level => (
                      <button
                        key={level}
                        onClick={() => update("alertThreshold", level)}
                        className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                          settings.alertThreshold === level
                            ? level === "Critical" ? "border-red-500 bg-red-50 text-red-700"
                            : level === "High" ? "border-orange-400 bg-orange-50 text-orange-700"
                            : level === "Medium" ? "border-amber-400 bg-amber-50 text-amber-700"
                            : "border-blue-400 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Only send alerts for events at or above this severity level.</p>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-4">
                    <Toggle
                      checked={settings.criticalAlerts}
                      onChange={() => update("criticalAlerts", !settings.criticalAlerts)}
                      label="Critical Disease Alerts"
                      desc="Notify immediately when critical crop disease is detected"
                    />
                  </div>
                  <div className="p-4">
                    <Toggle
                      checked={settings.weeklyDigest}
                      onChange={() => update("weeklyDigest", !settings.weeklyDigest)}
                      label="Weekly Telemetry Digest"
                      desc="Summary email every Monday morning"
                    />
                  </div>
                  <div className="p-4">
                    <Toggle
                      checked={settings.emailAlerts}
                      onChange={() => update("emailAlerts", !settings.emailAlerts)}
                      label={<span className="flex items-center gap-1.5"><Mail size={12} />Email Notifications</span> as any}
                      desc="Receive alerts via email"
                    />
                  </div>
                  <div className="p-4">
                    <Toggle
                      checked={settings.smsAlerts}
                      onChange={() => update("smsAlerts", !settings.smsAlerts)}
                      label={<span className="flex items-center gap-1.5"><Smartphone size={12} />SMS Notifications</span> as any}
                      desc="Receive critical alerts via SMS (carrier charges may apply)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System */}
          {activeSection === "system" && (
            <div>
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Server size={14} /> System & Integrations
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {/* API Key */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                    <Key size={12} className="inline mr-1" />Internal API Key
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 font-mono text-xs text-slate-600 overflow-hidden">
                      <span className="truncate">
                        {showApiKey ? settings.apiKey : "km_prod_••••••••••••••••••••••••"}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowApiKey(v => !v)}
                      className="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors">
                      <RefreshCw size={12} />
                      Regenerate
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">Used for server-to-server communication. Never expose publicly.</p>
                </div>

                {/* DB Status */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                      <Database size={12} /> Database Connection
                    </h3>
                    {statusLoading ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full animate-pulse">
                        Checking…
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                        systemStatus?.db_status === "connected"
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          systemStatus?.db_status === "connected" ? "bg-green-500 animate-pulse" : "bg-red-500"
                        }`} />
                        {systemStatus?.db_status === "connected" ? "Connected" : "Error"}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { label: "Provider", value: systemStatus?.provider || "MongoDB Atlas" },
                      { label: "Region", value: systemStatus?.region || "ap-south-1 (Mumbai)" },
                      { label: "Uptime", value: systemStatus?.uptime || "—" },
                      { label: "Total Users", value: systemStatus ? String(systemStatus.total_users) : "—" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col">
                        <span className="text-slate-500 font-medium">{label}</span>
                        <span className="text-slate-800 font-bold mt-0.5">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-4">
                    <Toggle
                      checked={settings.maintenanceMode}
                      onChange={() => update("maintenanceMode", !settings.maintenanceMode)}
                      label="🔧 Maintenance Mode"
                      desc="Blocks all farmer logins — only admins can access the platform"
                    />
                  </div>
                  <div className="p-4">
                    <Toggle
                      checked={settings.debugLogging}
                      onChange={() => update("debugLogging", !settings.debugLogging)}
                      label="Verbose Debug Logging"
                      desc="Log detailed request/response traces — impacts performance"
                    />
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-red-50 border-b border-red-200">
                    <h3 className="text-xs font-bold text-red-700 uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle size={12} /> Danger Zone
                    </h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Clear Audit Cache</p>
                        <p className="text-xs text-slate-500 mt-0.5">Purges temporary log cache. Does not delete permanent records.</p>
                      </div>
                      <button className="px-3 py-2 text-xs font-bold border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                        Clear Cache
                      </button>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-red-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Reset Platform Settings</p>
                        <p className="text-xs text-slate-500 mt-0.5">Resets all settings to factory defaults. Cannot be undone.</p>
                      </div>
                      <button className="px-3 py-2 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
