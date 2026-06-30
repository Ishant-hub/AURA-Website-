"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Shield, Eye, EyeOff, Lock, Mail, User as UserIcon, AlertCircle, CheckCircle, Music } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, user } = useAuth();

  // Switch between Login and Signup modes
  const [isSignUp, setIsSignUp] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(callbackUrl);
      }
    }
  }, [user, callbackUrl, router]);

  const validateEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg("Authorization successful. Redirecting...");
        // Redirect is handled in useEffect
      } else {
        setErrorMsg(res.message || "Invalid credentials.");
      }
    } catch (e) {
      setErrorMsg("An unexpected server error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName || !email || !password || !confirmPassword || !username) {
      setErrorMsg("All registration fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signup(fullName, email, password);
      if (res.success) {
        setSuccessMsg("Registration successful! Redirecting...");
        // Redirect is handled in useEffect
      } else {
        setErrorMsg(res.message || "Failed to create account. Email may already be in use.");
      }
    } catch (e) {
      setErrorMsg("An unexpected server error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your email address to request a reset link.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("A password recovery invitation has been sent to " + email);
  };

  return (
    <main className="mt-32 px-4 md:px-margin-desktop max-w-5xl mx-auto min-h-[80vh] pb-24 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
      
      {/* Left side: Premium Branding & Illustration */}
      <div className="flex-1 text-center lg:text-left space-y-8 max-w-md reveal-animation visible">
        <div className="inline-flex w-16 h-16 rounded-full border border-primary/30 items-center justify-center text-primary bg-primary/5 shadow-inner mb-2">
          <Music className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <span className="font-label-caps text-xs text-primary tracking-[0.4em] font-semibold block mb-3 uppercase">
            AURA LUXURY AUDIO
          </span>
          <h1 className="font-display-lg text-4xl md:text-5xl text-white font-extralight tracking-tight leading-tight">
            Hear the Purest <span className="text-primary font-normal">Acoustic Art</span>
          </h1>
        </div>
        <p className="font-body-md text-on-surface-variant/80 font-light leading-relaxed">
          Create an account to curate your private soundscapes, coordinate white-glove listener events, and track custom speaker build milestones.
        </p>

        {/* Music-themed Interactive Illustration (Turntable) */}
        <div className="relative w-64 h-64 mx-auto lg:mx-0 flex items-center justify-center">
          {/* Glowing Aura Outer circle */}
          <div className="absolute inset-0 rounded-full border border-primary/10 bg-primary/[0.02] blur-xl animate-pulse"></div>
          {/* Vinyl Record */}
          <div className="absolute w-48 h-48 rounded-full bg-neutral-900 border-4 border-neutral-850 flex items-center justify-center shadow-2xl animate-[spin_20s_linear_infinite]">
            {/* Grooves */}
            <div className="absolute inset-2 rounded-full border border-neutral-800/40"></div>
            <div className="absolute inset-6 rounded-full border border-neutral-800/40"></div>
            <div className="absolute inset-10 rounded-full border border-neutral-800/40"></div>
            <div className="absolute inset-14 rounded-full border border-neutral-800/40"></div>
            {/* Center label */}
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900"></div>
            </div>
          </div>
          {/* Tonearm */}
          <div className="absolute top-8 right-6 w-20 h-28 pointer-events-none transform origin-top-right -rotate-12">
            <svg width="80" height="110" viewBox="0 0 80 110" fill="none">
              <path d="M70 10 L40 10 L40 70 L25 90" stroke="#f2ca50" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="18" y="85" width="14" height="20" rx="2" transform="rotate(15 25 95)" fill="#e5e2e1" />
              <circle cx="70" cy="10" r="6" fill="#f2ca50" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right side: Stylish Login/Signup Card */}
      <div className="w-full max-w-md flex-shrink-0">
        <div className="glass-panel p-8 md:p-10 rounded-3xl border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          
          {/* Toggle Tabs */}
          <div className="flex border-b border-white/5 mb-8">
            <button
              onClick={() => { setIsSignUp(false); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 pb-4 text-xs font-label-caps tracking-widest font-bold border-b-2 transition-all ${
                !isSignUp ? "text-primary border-primary" : "text-on-surface-variant/40 border-transparent hover:text-on-surface-variant"
              }`}
            >
              LOG IN
            </button>
            <button
              onClick={() => { setIsSignUp(true); setErrorMsg(""); setSuccessMsg(""); }}
              className={`flex-1 pb-4 text-xs font-label-caps tracking-widest font-bold border-b-2 transition-all ${
                isSignUp ? "text-primary border-primary" : "text-on-surface-variant/40 border-transparent hover:text-on-surface-variant"
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Error and Success Banners */}
          {errorMsg && (
            <div className="flex gap-3 items-center bg-error-container/10 border border-error/20 p-4 rounded-xl text-error mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-[11px] font-label-caps tracking-wider uppercase font-semibold leading-relaxed">
                {errorMsg}
              </p>
            </div>
          )}

          {successMsg && (
            <div className="flex gap-3 items-center bg-primary/10 border border-primary/20 p-4 rounded-xl text-primary mb-6">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-[11px] font-label-caps tracking-wider uppercase font-semibold leading-relaxed">
                {successMsg}
              </p>
            </div>
          )}

          {/* Form Component */}
          {!isSignUp ? (
            /* Log In Form */
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
                  EMAIL OR USERNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                    placeholder="name@example.com"
                  />
                  <Mail className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-[17px]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block uppercase">
                    SECRET PASSWORD
                  </label>
                  <a
                    href="#"
                    onClick={handleForgotPassword}
                    className="font-label-caps text-[9px] text-on-surface-variant/60 hover:text-primary transition-colors tracking-widest uppercase font-bold"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 pr-10 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                    placeholder="••••••••"
                  />
                  <Lock className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-[17px]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[17px] text-on-surface-variant/40 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 bg-white/5 text-primary focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer accent-primary"
                  />
                  <span className="font-label-caps text-[10px] text-on-surface-variant/60 group-hover:text-white transition-colors tracking-widest uppercase">
                    Remember Me
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.01] active:scale-95 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {isSubmitting ? "AUTHORIZING..." : "LOG IN TO GALLERY"}
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
                  FULL NAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                    placeholder="Aura Collector"
                  />
                  <UserIcon className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-[17px]" />
                </div>
              </div>

              <div>
                <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
                  CHOOSE USERNAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                    placeholder="aura_collector"
                  />
                  <UserIcon className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-[17px]" />
                </div>
              </div>

              <div>
                <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                    placeholder="collector@aura.com"
                  />
                  <Mail className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-[17px]" />
                </div>
              </div>

              <div>
                <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
                  CREATE PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 pr-10 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                    placeholder="Min. 6 characters"
                  />
                  <Lock className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-[17px]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[17px] text-on-surface-variant/40 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-label-caps text-[10px] text-primary tracking-widest font-bold block mb-2 uppercase">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-11 pr-10 focus:border-primary focus:outline-none transition-colors text-white text-sm"
                    placeholder="Repeat password"
                  />
                  <Lock className="w-4 h-4 text-on-surface-variant/40 absolute left-4 top-[17px]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-caps text-xs tracking-widest font-bold hover:scale-[1.01] active:scale-95 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {isSubmitting ? "CREATING PROFILE..." : "REGISTER PROFILE"}
              </button>
            </form>
          )}

          <div className="text-center mt-8 pt-6 border-t border-white/5">
            <p className="text-[10px] text-on-surface-variant/40 font-label-caps tracking-widest uppercase font-semibold leading-relaxed">
              SECURE REGISTRY. DEFAULT SEED USER ADMIN AVAILABLE.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
