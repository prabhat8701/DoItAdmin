"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function OtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const p = params.get("phone");
    if (p) setPhone(p);
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const verifyRes = await fetch(
        "https://doitdubby.visionadvertisingsolutions.com/api/admin-auth/verify-login-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, otp }),
        }
      );
      const verify = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verify?.message || verify?.error || "Verification failed");
      
      // Set session cookie with JWT token and admin data
      const sessionRes = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: verify.token,
          admin: verify.admin,
          phone: verify.admin.phone
        }),
      });
      
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) {
        throw new Error(sessionData?.error || "Failed to create session");
      }
      
      // Force a small delay to ensure session is set before redirect
      await new Promise(resolve => setTimeout(resolve, 100));
      router.replace("/home");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🔢
          </div>
        </div>
        <div className="title">Enter OTP</div>
        <div className="subtitle muted">We sent a 4-digit code to your phone</div>
        <form onSubmit={onSubmit} className="stack">
          <div style={{ position: 'relative' }}>
            <input
              placeholder="4-digit code"
              className="input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{ paddingLeft: '48px', textAlign: 'center', letterSpacing: '8px', fontSize: '20px' }}
              maxLength={4}
            />
            <div style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              fontSize: '18px'
            }}>
              🔐
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 24, textAlign: 'center' }}>
          Didn't get the code? <a href={`/login?phone=${encodeURIComponent(phone)}`} style={{ fontWeight: '600' }}>Resend</a>
        </p>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={
      <div className="container">
        <div className="card">
          <div className="title">Loading...</div>
        </div>
      </div>
    }>
      <OtpForm />
    </Suspense>
  );
}

