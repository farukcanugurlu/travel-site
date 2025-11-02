// src/utils/auth.ts
export const AUTH_STORAGE_KEY = "lexor_auth_v1";

/** localStorage → boolean */
export function detectAuthFromStorage(): boolean {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw === "1";
  } catch {
    return false;
  }
}

/** boolean → localStorage */
export function setAuthToStorage(isAuthed: boolean) {
  try {
    if (isAuthed) localStorage.setItem(AUTH_STORAGE_KEY, "1");
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* no-op */
  }
}

/** temizleyici */
export function clearAuthFromStorage() {
  setAuthToStorage(false);
}
