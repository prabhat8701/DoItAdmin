"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://doitdubby.visionadvertisingsolutions.com/api/admin-auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Signup failed");
      router.push(`/login?phone=${encodeURIComponent(phone)}`);
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
            🚀
          </div>
        </div>
        <div className="title">Create your admin account</div>
        <div className="subtitle muted">Join our platform and start managing</div>
        <form onSubmit={onSubmit} className="stack">
          <div style={{ position: 'relative' }}>
            <input
              placeholder="Full Name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              👤
            </div>
          </div>
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
          <div style={{ position: 'relative' }}>
            <input
              placeholder="Email Address"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              ✉️
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 24, textAlign: 'center' }}>
          Already have an account? <a href="/login" style={{ fontWeight: '600' }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}

