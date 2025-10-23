"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugCode, setDebugCode] = useState<string | null>(null);

  useEffect(() => {
    const p = params.get("phone");
    if (p) setPhone(p);
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDebugCode(null);
    try {
      const res = await fetch(
        "https://doitdubby.visionadvertisingsolutions.com/api/admin-auth/send-login-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send OTP");
      setDebugCode(data.otp || null);
      // Store debug OTP in sessionStorage for auto-fill (more secure than URL)
      if (data.otp) {
        sessionStorage.setItem('debugOtp', data.otp);
      }
      router.push(`/otp?phone=${encodeURIComponent(phone)}`);
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
            🔐
          </div>
        </div>
        <div className="title">Welcome back</div>
        <div className="subtitle muted">Enter your phone number to continue</div>
        <form onSubmit={onSubmit} className="stack">
          <div style={{ position: 'relative' }}>
            <input
              placeholder="Phone Number"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ paddingLeft: '48px' }}
            />
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px'
            }}>
              📱
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        {/* <p className="muted" style={{ marginTop: 24, textAlign: 'center' }}>
          New here? <a href="/signup" style={{ fontWeight: '600' }}>Create an account</a>
        </p> */}
        {debugCode && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'rgba(81, 207, 102, 0.1)',
            border: '1px solid rgba(81, 207, 102, 0.2)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p className="success" style={{ margin: 0 }}>
              Debug OTP: <strong>{debugCode}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

