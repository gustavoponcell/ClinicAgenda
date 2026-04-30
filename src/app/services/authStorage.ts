export type SessionType = 'patient' | 'admin';

const tokenKeys = {
  patient: 'patientToken',
  admin: 'adminToken',
};

const userKeys = {
  patient: 'user',
  admin: 'adminUser',
};

export function getToken(type: SessionType) {
  return localStorage.getItem(tokenKeys[type]);
}

export function saveSession(type: SessionType, token: string, user: unknown) {
  localStorage.setItem(tokenKeys[type], token);
  localStorage.setItem(userKeys[type], JSON.stringify(user));
}

export function getStoredUser<T = any>(type: SessionType): T | null {
  const raw = localStorage.getItem(userKeys[type]);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession(type: SessionType) {
  localStorage.removeItem(tokenKeys[type]);
  localStorage.removeItem(userKeys[type]);
}
