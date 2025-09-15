"use client";

import { clearSessionFromClient } from "@/lib/auth";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch('/api/session', { method: 'DELETE' });
      clearSessionFromClient();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button 
      className="button" 
      type="button"
      onClick={handleLogout}
      style={{ 
        background: 'rgba(255, 107, 107, 0.2)',
        border: '1px solid rgba(255, 107, 107, 0.3)',
        width: '100%'
      }}
    >
      Logout
    </button>
  );
}
