"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Leaf,
  Bot,
  CloudRain,
  Building2,
  CalendarDays,
  TrendingUp,
  User,
  Search,
  CheckCircle2,
  Settings,
  LogOut,
  Sprout,
  Menu,
  X,
  HelpCircle,
  MessageSquarePlus,
  Globe,
} from "lucide-react";
import { useTranslation, Language } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

export default function TopBar() {
  const { language, setLanguage, t } = useTranslation();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smart scroll state tracking
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns automatically on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
  }, [pathname]);

  // Close dropdowns when clicking outside the header
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smart-Scroll Engine: Transparent at top, hides on scroll down, reveals on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Transparency check: 100% transparent at top, frosted glass when scrolled
      if (currentScrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Directional check: Hide when scrolling down, reveal when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setIsHidden(true);
        setShowProfileMenu(false); // Close popovers when sliding away
      } else if (currentScrollY < lastScrollY.current) {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Primary Navigation Modules
  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      label: t.nav?.dashboard || "Dashboard",
      icon: LayoutDashboard,
    },
    { href: "/disease", label: t.nav?.disease || "Disease", icon: Leaf },
    {
      href: "/assistant",
      label: t.nav?.assistant || "AI Assistant",
      icon: Bot,
    },
    { href: "/weather", label: t.nav?.weather || "Weather", icon: CloudRain },
    { href: "/schemes", label: t.nav?.schemes || "Schemes", icon: Building2 },
    {
      href: "/calendar",
      label: t.nav?.calendar || "Calendar",
      icon: CalendarDays,
    },
    {
      href: "/income",
      label: t.nav?.income || "Profit Advisor",
      icon: TrendingUp,
    },
  ];

  // Language mapping for profile menu
  const languages: { code: Language; short: string; full: string }[] = [
    { code: "en", short: "EN", full: "English" },
    { code: "hi", short: "हिं", full: "हिन्दी" },
    { code: "mr", short: "मरा", full: "मराठी" },
  ];

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isHidden
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      } ${
        isScrolled
          ? "bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
          : "bg-transparent border-b border-transparent shadow-none backdrop-blur-none"
      }`}
    >
      {/* Expanded container width to max-w-[1440px] to guarantee zero text crowding */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 lg:gap-4 xl:gap-6">
        {/* Left: KrishiMitra Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#1a5354] via-[#216869] to-[#49A078] border border-white/20 flex items-center justify-center text-white shadow-md shadow-[#49A078]/25 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <Sprout className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-[#2B2118] leading-none">
                Krishi
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#216869] to-[#49A078]">
                  Mitra
                </span>
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#475B63] mt-0.5">
                AI Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Center: True Glass Pill Dock (Replaces opaque slate fills with translucent white/40 glass) */}
        <nav
          aria-label="Primary Navigation"
          className={`hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 p-1.5 rounded-full transition-all duration-300 max-w-fit mx-auto ${
            isScrolled
              ? "bg-slate-100/80 border border-slate-200/80 backdrop-blur-xl shadow-inner"
              : "bg-white/40 border border-white/60 backdrop-blur-md shadow-2xs"
          }`}
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 xl:px-4 py-1.5 rounded-full text-xs xl:text-[13px] font-bold tracking-tight whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-[#216869] to-[#49A078] text-white font-extrabold shadow-md shadow-[#49A078]/25 scale-[1.02]"
                    : "text-[#475B63] hover:text-[#2B2118] hover:bg-white/80"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Compact Search & Profile Glass Controls (Locked with shrink-0) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Frosted Glass User Profile Button (Guaranteed Zero Crop with shrink-0) */}
          <div className="relative pl-1 border-l border-slate-200/60 shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setIsMobileMenuOpen(false);
              }}
              aria-label="User Profile Menu"
              className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-white border transition-all hover:scale-[1.02] active:scale-98 focus:outline-none shadow-2xs backdrop-blur-md shrink-0 ${
                isScrolled
                  ? "bg-slate-100/70 border-slate-200/80 hover:border-[#9CC5A1]/60"
                  : "bg-white/40 border-white/60 hover:border-white/90"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#216869] to-[#49A078] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#49A078]/25 shrink-0 overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="hidden sm:block text-left shrink-0">
                <p className="text-xs font-black text-[#2B2118] leading-none whitespace-nowrap">
                  {user?.name || "User"}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-[#49A078] shrink-0" />
                  <span className="text-[9px] font-extrabold text-[#475B63] uppercase tracking-wider whitespace-nowrap">
                    Verified {user?.role || "Farmer"}
                  </span>
                </div>
              </div>
            </button>

            {/* Glassmorphic Profile Popover Menu (Language Switcher Integrated Here) */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-3 w-64 rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] p-3.5 z-50 space-y-2"
                >
                  {/* Account Status Card */}
                  <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-[#2B2118] truncate max-w-[140px]">
                        {user?.name || "User"}
                      </p>
                      <span className="px-2 py-0.5 rounded-full bg-[#EBEFC9] text-[#216869] text-[9px] font-black uppercase shrink-0">
                        Active
                      </span>
                    </div>
                    {user?.email && (
                      <p className="text-[11px] text-[#475B63] font-mono mt-1 truncate">
                        {user.email}
                      </p>
                    )}
                    <p className="text-[10px] text-[#729B79] font-medium mt-0.5 truncate">
                      {user?.district ? `${user.district}, ${user.state || ""}` : "Location not specified"}
                    </p>
                  </div>

                  {/* Integrated Language Switcher Card */}
                  <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-[#2B2118]">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#49A078]" />
                        <span>Language / भाषा</span>
                      </span>
                      <span className="text-[10px] font-extrabold uppercase text-[#475B63]">
                        {language}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1">
                      {languages.map((lang) => {
                        const isLangActive = language === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => setLanguage(lang.code)}
                            title={lang.full}
                            className={`py-1.5 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center ${
                              isLangActive
                                ? "bg-[#49A078] text-white shadow-sm scale-[1.02]"
                                : "bg-white text-[#475B63] hover:text-[#2B2118] border border-slate-200/60 hover:bg-slate-100/50"
                            }`}
                          >
                            <span>{isLangActive ? lang.full : lang.short}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Profile Utility Links */}
                  <div className="space-y-1 pt-1">
                    <Link
                      href="/profile"
                      prefetch={true}
                      className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-[#475B63] hover:text-[#216869] hover:bg-white hover:shadow-2xs transition-all"
                    >
                      <User className="w-4 h-4 text-[#49A078]" />
                      <span>Profile Setting</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black text-red-600 hover:bg-red-50/80 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Hamburger Toggle (< 1024px) */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              setShowProfileMenu(false);
            }}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-[#475B63] hover:text-[#216869] hover:scale-105 active:scale-95 transition-all shrink-0 ml-1 backdrop-blur-md"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Top-Down Frosted Glass Dropdown for Tablet & Mobile (< 1024px) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-t border-slate-200/80 bg-white/85 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">
              {/* Search Bar inside Mobile Dropdown */}
              <div className="md:hidden relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475B63]" />
                <input
                  type="text"
                  placeholder="Search crops, schemes, or ask AI..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 text-xs font-bold text-[#2B2118] placeholder-[#475B63] focus:outline-none focus:ring-2 focus:ring-[#49A078]/40 focus:bg-white transition-all shadow-inner"
                />
              </div>

              {/* Language Switcher for Mobile */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#2B2118]">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#49A078]" />
                    <span>Select Language / भाषा</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {languages.map((lang) => {
                    const isLangActive = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setLanguage(lang.code)}
                        className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                          isLangActive
                            ? "bg-[#49A078] text-white shadow-sm"
                            : "bg-white text-[#475B63] border border-slate-200/60"
                        }`}
                      >
                        <span>{lang.full}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Grid */}
              <div className="space-y-1.5">
                <p className="px-2 text-[10px] font-black uppercase tracking-wider text-[#475B63]/70 mb-2">
                  Navigation Modules
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-[#216869] to-[#49A078] text-white font-extrabold shadow-md shadow-[#49A078]/25"
                            : "text-[#475B63] hover:bg-white/80 hover:text-[#2B2118] border border-transparent hover:border-slate-200/60"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#49A078]"}`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Quick Utility Actions */}
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2.5">
                <Link
                  href="/profile"
                  prefetch={true}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100/80 hover:bg-white border border-slate-200/80 text-xs font-bold text-[#475B63] hover:text-[#216869] transition-all shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-[#49A078]" />
                  <span>Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50/90 hover:bg-red-100/90 border border-red-200/60 text-red-600 font-extrabold text-xs transition-all shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
