
// Client-side auth utilities
export function getSessionFromClient() {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(cookie => 
    cookie.trim().startsWith('session_data=')
  );
  
  if (!sessionCookie) return null;
  
  try {
    const sessionData = sessionCookie.split('=')[1];
    const decoded = decodeURIComponent(sessionData);
    const { admin } = JSON.parse(decoded);
    return admin;
  } catch {
    return null;
  }
}

export function getTokenFromClient() {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(cookie => 
    cookie.trim().startsWith('session_data=')
  );
  
  if (!sessionCookie) return null;
  
  try {
    const sessionData = sessionCookie.split('=')[1];
    const decoded = decodeURIComponent(sessionData);
    const { token } = JSON.parse(decoded);
    return token;
  } catch {
    return null;
  }
}

export function clearSessionFromClient() {
  if (typeof window === 'undefined') return;
  
  document.cookie = 'session_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

