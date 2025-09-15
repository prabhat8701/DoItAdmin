"use client";

export default function ActionButtons() {
  const handleSettings = () => {
    window.location.href = '/admin/settings';
  };

  const handleManageUsers = () => {
    window.location.href = '/admin/users';
  };

  return (
    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
      <button 
        className="button" 
        style={{ flex: 1 }}
        onClick={handleSettings}
      >
        Settings
      </button>
      <button 
        className="button" 
        style={{ flex: 1 }}
        onClick={handleManageUsers}
      >
        Manage Users
      </button>
    </div>
  );
}
