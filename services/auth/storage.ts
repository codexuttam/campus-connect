import { IAuthStorage } from './types';
import { UserSession } from '../../types/auth';

/**
 * Universal Session Storage Adapter
 *
 * Implements persistent token & profile caching.
 * Uses localStorage on web or runtime memory store on native
 * with hooks ready for expo-secure-store.
 */
class UniversalAuthStorage implements IAuthStorage {
  private memoryCache: UserSession | null = null;
  private readonly STORAGE_KEY = 'campusconnect.auth.session.v1';

  async getSession(): Promise<UserSession | null> {
    if (this.memoryCache) {
      return this.memoryCache;
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(this.STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as UserSession;
          this.memoryCache = parsed;
          return parsed;
        }
      }
    } catch {
      // Storage access blocked or unavailable
    }

    return this.memoryCache;
  }

  async saveSession(session: UserSession): Promise<void> {
    this.memoryCache = session;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
      }
    } catch {
      // Ignore write errors in restricted sandboxes
    }
  }

  async clearSession(): Promise<void> {
    this.memoryCache = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }
}

export const authStorage = new UniversalAuthStorage();

