"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginScreen() {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(name, email, password);
      }
      router.push("/");
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Authentication failed.";
      if (msg.includes("auth/invalid-credential")) setError("Invalid email or password.");
      else if (msg.includes("auth/email-already-in-use")) setError("Email is already registered.");
      else setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err) {
      setError("Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const loginStyles = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes floatParticle {
      0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
      50% { opacity: 0.6; transform: translateY(-50px) translateX(20px) scale(1.5); }
      100% { transform: translateY(-100px) translateX(-20px) scale(0.5); opacity: 0; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
      to { opacity: 1; transform: translateY(0); filter: blur(0); }
    }
    @keyframes orbFloat {
      0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
      33% { transform: translate(30px, -50px) scale(1.2); opacity: 0.5; }
      66% { transform: translate(-20px, 20px) scale(0.8); opacity: 0.2; }
      100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
    }

    .split-layout {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      background: var(--base);
      overflow: hidden;
      font-family: var(--fM);
    }

    /* Left Side: Illustration & Branding */
    .hero-side {
      position: relative;
      flex: 1.2;
      display: none;
      align-items: center;
      justify-content: center;
      background: #000;
      overflow: hidden;
    }
    @media (min-width: 900px) {
      .hero-side {
        display: flex;
      }
    }
    
    .hero-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.7;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(20,5,10,0.8) 0%, rgba(178,58,72,0.2) 100%);
      z-index: 1;
    }
    .hero-scanline {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 50%, rgba(254, 208, 187, 0.05) 51%, transparent 51%);
      background-size: 100% 4px;
      z-index: 2;
      pointer-events: none;
    }

    .particles {
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
    }
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--red);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--red);
      animation: floatParticle 8s linear infinite;
    }

    .hero-content {
      position: relative;
      z-index: 10;
      text-align: left;
      padding: 60px;
      width: 100%;
      max-width: 600px;
    }
    .hero-content h1 {
      font-family: var(--fB);
      font-size: 48px;
      color: var(--text-hi);
      letter-spacing: -1px;
      line-height: 1.1;
      margin-bottom: 16px;
      text-shadow: 0 4px 20px rgba(0,0,0,0.8);
    }
    .hero-content p {
      font-size: 18px;
      color: rgba(254, 208, 187, 0.8);
      max-width: 400px;
      line-height: 1.5;
    }
    .hero-badge {
      display: inline-block;
      padding: 6px 12px;
      background: rgba(178,58,72,0.2);
      border: 1px solid rgba(178,58,72,0.5);
      color: var(--text-hi);
      border-radius: 20px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 24px;
      backdrop-filter: blur(4px);
    }

    /* Right Side: Form */
    .form-side {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: linear-gradient(-45deg, var(--wine), var(--base), var(--rust), var(--wine));
      background-size: 400% 400%;
      animation: gradientShift 10s ease infinite;
      overflow: hidden;
    }
    .form-side::before, .form-side::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
    }
    .form-side::before {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(178,58,72,0.3) 0%, transparent 70%);
      animation: orbFloat 15s infinite ease-in-out;
      top: -100px;
      left: -100px;
    }
    .form-side::after {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(254, 208, 187, 0.1) 0%, transparent 70%);
      animation: orbFloat 20s infinite ease-in-out reverse;
      animation-delay: -5s;
      bottom: -150px;
      right: -150px;
    }

    .form-glass-container {
      width: 100%;
      max-width: 440px;
      padding: 48px;
      background: rgba(20, 5, 12, 0.65);
      backdrop-filter: blur(40px);
      border-radius: 24px;
      border: 1px solid rgba(254, 208, 187, 0.15);
      box-shadow: 0 30px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(178,58,72,0.1);
      animation: slideInRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      z-index: 10;
    }
    
    /* Staggered Element Entrances */
    .form-glass-container > * {
      opacity: 0;
      animation: slideUpFade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    .form-glass-container > :nth-child(1) { animation-delay: 0.1s; }
    .form-glass-container > :nth-child(2) { animation-delay: 0.2s; }
    .form-glass-container > :nth-child(3) { animation-delay: 0.3s; }
    .form-glass-container > :nth-child(4) { animation-delay: 0.4s; }
    .form-glass-container > :nth-child(5) { animation-delay: 0.5s; }
    .form-glass-container > :nth-child(6) { animation-delay: 0.6s; }

    .form-header {
      margin-bottom: 32px;
    }
    .form-header h2 {
      font-size: 28px;
      font-weight: 600;
      color: var(--text-hi);
      margin-bottom: 8px;
    }
    .form-header p {
      font-size: 14px;
      color: var(--text-mid);
    }

    /* Floating Labels */
    .input-wrapper {
      position: relative;
      margin-bottom: 20px;
    }
    .input-wrapper input {
      width: 100%;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(254, 208, 187, 0.1);
      border-radius: 12px;
      padding: 22px 16px 8px 16px;
      color: var(--text-hi);
      font-family: var(--fM);
      font-size: 15px;
      transition: all 0.3s ease;
      outline: none;
    }
    .input-wrapper label {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: var(--text-mid);
      pointer-events: none;
      transition: all 0.2s ease-out;
    }
    
    .input-wrapper input:focus,
    .input-wrapper input:not(:placeholder-shown) {
      border-color: rgba(178, 58, 72, 0.6);
      background: rgba(178, 58, 72, 0.05);
      box-shadow: 0 0 15px rgba(178, 58, 72, 0.15);
    }
    
    /* Fix Chrome Autocomplete overriding background */
    .input-wrapper input:-webkit-autofill,
    .input-wrapper input:-webkit-autofill:hover, 
    .input-wrapper input:-webkit-autofill:focus, 
    .input-wrapper input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px #1c0911 inset !important;
      -webkit-text-fill-color: var(--text-hi) !important;
      transition: background-color 5000s ease-in-out 0s;
    }
    
    .input-wrapper input:focus ~ label,
    .input-wrapper input:not(:placeholder-shown) ~ label,
    .input-wrapper input:-webkit-autofill ~ label {
      top: 12px;
      font-size: 10px;
      color: var(--peach);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .password-toggle {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-mid);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      transition: color 0.2s;
    }
    .password-toggle:hover { color: var(--text-hi); }
    .password-toggle svg { width: 18px; height: 18px; fill: currentColor; }

    .options-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-mid);
      cursor: pointer;
    }
    .checkbox-label input { accent-color: var(--red); cursor: pointer; width: 16px; height: 16px; }
    .forgot-link { font-size: 13px; color: var(--red); text-decoration: none; cursor: pointer; transition: color 0.2s; }
    .forgot-link:hover { color: var(--text-hi); }

    .btn-submit {
      width: 100%;
      padding: 16px;
      font-family: var(--fM);
      font-size: 15px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #7a3a44;
      font-weight: 700;
      background: linear-gradient(135deg, var(--cream), var(--peach));
      border: 1px solid var(--cream);
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(254, 208, 187, 0.2);
      transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 24px;
      position: relative;
      overflow: hidden;
    }
    .btn-submit::after {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 50%; height: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
      transform: skewX(-20deg);
      transition: 0.5s;
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 18px rgba(254, 208, 187, 0.45);
      background: var(--cream);
    }
    .btn-submit:hover:not(:disabled)::after {
      left: 150%;
    }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--text-mid);
      font-size: 11px;
      margin-bottom: 24px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .divider::before, .divider::after {
      content: ''; flex: 1; border-bottom: 1px solid rgba(254, 208, 187, 0.1);
    }
    .divider::before { margin-right: 12px; }
    .divider::after { margin-left: 12px; }

    .btn-google {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      padding: 14px;
      font-family: var(--fM);
      font-size: 14px;
      color: var(--text-hi);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 28px;
    }
    .btn-google:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .btn-google:disabled { opacity: 0.6; cursor: not-allowed; }

    .toggle-view {
      text-align: center;
      font-size: 14px;
      color: var(--text-mid);
    }
    .toggle-view span {
      color: var(--red);
      cursor: pointer;
      font-weight: 600;
      transition: color 0.2s;
    }
    .toggle-view span:hover { color: var(--text-hi); }
    
    .error-msg {
      background: rgba(178, 58, 72, 0.15);
      border-left: 3px solid var(--red);
      color: #ffbaba;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 13px;
      margin-bottom: 24px;
      animation: slideInRight 0.3s ease-out;
    }
    .spinner {
      width: 22px;
      height: 22px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  `;

  // Generate some random particles for the background
  const particles = isMounted ? Array.from({ length: 15 }).map((_, i) => (
    <div 
      key={i} 
      className="particle" 
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${5 + Math.random() * 5}s`,
        opacity: Math.random() * 0.5
      }} 
    />
  )) : null;

  return (
    <div className="split-layout">
      <style>{loginStyles}</style>

      {/* Left Side: Hero Illustration */}
      <div className="hero-side">
        <img 
          src="/holographic_ai_core.png" 
          alt="AI Reactor Core" 
          className="hero-image" 
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="hero-overlay"></div>
        <div className="hero-scanline"></div>
        <div className="particles">{particles}</div>

        <div className="hero-content">
          <div className="hero-badge">AI Intelligence System</div>
          <h1>GESTURE.AI <br/> Next-Gen AI Experience </h1>
          <p>
            Experience the next generation of human-computer interaction. 
            Authenticate your neural signature to access the mainframe.
          </p>
        </div>
      </div>

      {/* Right Side: Authentication Form */}
      <div className="form-side">
        <div className="form-glass-container brackets">
          
          <div className="form-header">
            <h2>{isLogin ? "Welcome Back" : "Initialize Link"}</h2>
            <p>{isLogin ? "Authenticate to access the dashboard." : "Create your unique neural signature."}</p>
          </div>

          {error && <div className="error-msg">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder=" "
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
                <label>Full Name</label>
              </div>
            )}

            <div className="input-wrapper">
              <input 
                type="email" 
                placeholder=" "
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <label>Email Address</label>
            </div>

            <div className="input-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder=" "
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <label>Password</label>
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                )}
              </button>
            </div>

            {!isLogin && (
              <div className="input-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder=" "
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <label>Confirm Password</label>
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
                  )}
                </button>
              </div>
            )}

            {isLogin && (
              <div className="options-row">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                    disabled={loading}
                  />
                  Remember Me
                </label>
                <a className="forgot-link">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <div className="spinner"></div> : (isLogin ? "Authenticate" : "Initialize Link")}
            </button>
          </form>

          <div className="divider">or</div>

          <button type="button" className="btn-google" onClick={handleGoogleAuth} disabled={loading}>
            <svg viewBox="0 0 24 24" style={{ width: "18px", height: "18px" }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="toggle-view">
            {isLogin ? "Don't have a signature? " : "Already initialized? "}
            <span onClick={() => { setIsLogin(!isLogin); setError(""); }}>
              {isLogin ? "Register now" : "Log in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
