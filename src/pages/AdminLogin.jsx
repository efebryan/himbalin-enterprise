import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiMail, FiLock, FiEye, FiEyeOff,
  FiShield, FiLogIn, FiAlertCircle, FiLoader
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "../components/PageLoader";
import { useAdminAuth } from "../context/AdminAuthContext";

// ─── Security constants ────────────────────────────────────────────────────────
const MAX_ATTEMPTS       = 5;       // lock out after N consecutive failures
const LOCKOUT_SECONDS    = 300;     // 5 minute lockout
const BASE_THROTTLE_MS   = 500;     // artificial delay per attempt (anti-timing)
const STORAGE_KEY        = "himbalin_login_attempts";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function loadAttemptData() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: null };
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function saveAttemptData(data) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearAttemptData() {
  sessionStorage.removeItem(STORAGE_KEY);
}

// Basic sanitise — strips control chars & trims
function sanitise(str) {
  return str.replace(/[\x00-\x1F\x7F]/g, "").trim();
}

// ─── Component ────────────────────────────────────────────────────────────────
const AdminLogin = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { signIn, isAuthenticated, loading: authLoading } = useAdminAuth();

  // Where to redirect after login (supports ?redirect= or from= state)
  const destination = location.state?.from?.pathname || "/admin";

  // ── Page-load animation ───────────────────────────────────────────────────
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // ── If already authenticated, skip to dashboard ───────────────────────────
  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate(destination, { replace: true });
  }, [isAuthenticated, authLoading, navigate, destination]);

  // ── Form state ────────────────────────────────────────────────────────────
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);

  // ── Security state ────────────────────────────────────────────────────────
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState("");
  const [lockSeconds,  setLockSeconds]  = useState(0);
  const lockTimer = useRef(null);

  // ── Init lockout countdown from storage ───────────────────────────────────
  useEffect(() => {
    const data = loadAttemptData();
    if (data.lockedUntil) {
      const remaining = Math.ceil((data.lockedUntil - Date.now()) / 1000);
      if (remaining > 0) startLockoutCountdown(remaining);
      else clearAttemptData(); // lock expired
    }
    return () => clearInterval(lockTimer.current);
  }, []);

  function startLockoutCountdown(seconds) {
    setLockSeconds(seconds);
    clearInterval(lockTimer.current);
    lockTimer.current = setInterval(() => {
      setLockSeconds(prev => {
        if (prev <= 1) {
          clearInterval(lockTimer.current);
          clearAttemptData();
          setError("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Check lockout
    const attempts = loadAttemptData();
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      const secs = Math.ceil((attempts.lockedUntil - Date.now()) / 1000);
      setError(`Too many failed attempts. Try again in ${secs}s.`);
      return;
    }

    // 2. Sanitise inputs
    const cleanEmail    = sanitise(email);
    const cleanPassword = sanitise(password);

    if (!cleanEmail || !cleanPassword) {
      setError("Please enter your email and password.");
      return;
    }

    // Basic email shape check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    // 3. Artificial throttle (prevents rapid brute-force timing attacks)
    await new Promise(r => setTimeout(r, BASE_THROTTLE_MS));

    try {
      await signIn(cleanEmail, cleanPassword);

      // Success — clear attempts, navigate
      clearAttemptData();
      navigate(destination, { replace: true });
    } catch (err) {
      // 4. Increment attempt counter
      const fresh = loadAttemptData();
      const newCount = (fresh.count || 0) + 1;

      if (newCount >= MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCKOUT_SECONDS * 1000;
        saveAttemptData({ count: newCount, lockedUntil });
        startLockoutCountdown(LOCKOUT_SECONDS);
        setError(
          `Account temporarily locked after ${MAX_ATTEMPTS} failed attempts. ` +
          `Try again in ${Math.ceil(LOCKOUT_SECONDS / 60)} minutes.`
        );
      } else {
        saveAttemptData({ count: newCount, lockedUntil: null });
        const remaining = MAX_ATTEMPTS - newCount;

        // 5. Normalise error messages (don't leak account existence)
        const msg = err.message || "";
        if (
          msg.includes("Invalid login credentials") ||
          msg.includes("invalid_credentials") ||
          msg.includes("Access denied")
        ) {
          setError(
            `Invalid email or password. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
          );
        } else if (msg.includes("Email not confirmed")) {
          setError("This email address has not been confirmed.");
        } else if (msg.includes("rate limit") || msg.includes("429")) {
          setError("Too many requests. Please wait a moment and try again.");
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLocked   = lockSeconds > 0;
  const canSubmit  = !submitting && !isLocked && email && password;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <AnimatePresence mode="wait">
        {pageLoading && <PageLoader key="loader" />}
      </AnimatePresence>

      <div className="h-[100dvh] bg-[#f5f0eb] flex flex-col font-sans antialiased overflow-hidden">
        <main className="flex-grow flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1,    y:  0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-full max-w-[360px] bg-white rounded-[20px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-white/80"
          >
            {/* ── Hero banner ─────────────────────────────────────────── */}
            <div className="relative h-[130px] overflow-hidden">
              <img
                src="/images/admin_login_bg.png"
                alt="Admin access"
                className="w-full h-full object-cover grayscale brightness-[0.3]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 flex flex-col justify-end p-5 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <FiShield className="text-[#F5A623]" size={14} />
                  <p className="text-[#F5A623] text-[9px] font-black tracking-[0.12em] uppercase">
                    Secured Admin Portal
                  </p>
                </div>
                <h1 className="text-white text-xl font-serif font-bold leading-tight">
                  Himbalin Enterprise
                </h1>
              </div>
            </div>

            {/* ── Form section ────────────────────────────────────────── */}
            <div className="p-6 pt-5 bg-white">
              <div className="mb-4">
                <h2 className="text-[#2B1A12] text-lg font-bold">Welcome Back</h2>
                <p className="text-gray-400 text-[12px] -mt-0.5">
                  Sign in with your admin credentials
                </p>
              </div>

              {/* ── Error banner ──────────────────────────────────────── */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y:  0, height: "auto" }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-3 flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5"
                    role="alert"
                    aria-live="assertive"
                  >
                    <FiAlertCircle className="text-red-500 shrink-0 mt-0.5" size={13} />
                    <p className="text-red-600 text-[11px] leading-snug">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Lockout progress bar ───────────────────────────────── */}
              {isLocked && (
                <div className="mb-3">
                  <div className="h-1 w-full bg-red-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-400 rounded-full"
                      initial={{ width: "100%" }}
                      animate={{ width: `${(lockSeconds / LOCKOUT_SECONDS) * 100}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                  <p className="text-red-400 text-[10px] text-right mt-1">
                    {Math.floor(lockSeconds / 60)}:{String(lockSeconds % 60).padStart(2, "0")} remaining
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[#2B1A12] text-xs font-bold block" htmlFor="admin-email">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FiMail size={13} />
                    </span>
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="username email"
                      placeholder="admin@himbalin.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      disabled={isLocked || submitting}
                      className="w-full bg-[#f9fafb] border border-gray-100 rounded-lg py-2.5 pl-9 pr-4 text-xs
                                 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623]
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[#2B1A12] text-xs font-bold" htmlFor="admin-password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {/* future: forgot password modal */}}
                      className="text-[#F5A623] text-[10px] font-bold hover:underline focus:outline-none focus:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <FiLock size={13} />
                    </span>
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      disabled={isLocked || submitting}
                      className="w-full bg-[#f9fafb] border border-gray-100 rounded-lg py-2.5 pl-9 pr-10 text-xs
                                 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/20 focus:border-[#F5A623]
                                 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      disabled={submitting || isLocked}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
                                 focus:outline-none focus:text-[#F5A623] transition-colors p-0.5"
                    >
                      {showPassword ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2 py-0.5">
                  <button
                    type="button"
                    id="remember-me"
                    role="checkbox"
                    aria-checked={rememberMe}
                    onClick={() => setRememberMe(v => !v)}
                    className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center shrink-0
                                ${rememberMe ? "bg-[#F5A623] border-[#F5A623]" : "bg-[#f9fafb] border-gray-200"}`}
                  >
                    {rememberMe && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.15 }}>
                        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={6} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </button>
                  <label
                    htmlFor="remember-me"
                    className="text-gray-400 text-[11px] cursor-pointer select-none font-medium"
                    onClick={() => setRememberMe(v => !v)}
                  >
                    Keep me signed in for 7 days
                  </label>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={canSubmit ? { scale: 1.01 } : {}}
                  whileTap={canSubmit  ? { scale: 0.99 } : {}}
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-[#F5A623] text-white rounded-xl py-3.5 font-bold
                             flex items-center justify-center gap-2 mt-3 uppercase tracking-wider text-[11px]
                             shadow-[0_5px_15px_rgba(245,166,35,0.25)] hover:bg-[#e0951a]
                             disabled:opacity-60 disabled:cursor-not-allowed
                             focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:ring-offset-2
                             transition-all"
                >
                  {submitting ? (
                    <>
                      <FiLoader size={13} className="animate-spin" />
                      Verifying…
                    </>
                  ) : isLocked ? (
                    <>
                      <FiShield size={13} />
                      Locked
                    </>
                  ) : (
                    <>
                      Sign In <FiLogIn size={13} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Security badge */}
              <div className="mt-5">
                <div className="w-full h-px bg-gray-50 mb-4" />
                <div className="flex items-center justify-center gap-2 text-gray-300">
                  <FiShield size={11} />
                  <span className="text-[9px] tracking-wide">
                    256-bit TLS encryption · Supabase Auth · Role-based access
                  </span>
                  <FiShield size={11} />
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        <footer className="w-full p-4 px-8 flex justify-between items-center text-gray-400/60 text-[10px] font-medium">
          <p>© {new Date().getFullYear()} Himbalin Enterprise.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-500 transition-colors">Support</a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AdminLogin;
