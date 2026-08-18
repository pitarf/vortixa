import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import { authConfig } from '@/auth.config';

describe('Auth Security and Hashing Tests', () => {
  it('should hash and verify passwords correctly via bcryptjs', async () => {
    const password = 'SuperSecretPassword123';
    const hash = await bcrypt.hash(password, 12);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);

    const matches = await bcrypt.compare(password, hash);
    expect(matches).toBe(true);

    const wrongMatch = await bcrypt.compare('wrong_password', hash);
    expect(wrongMatch).toBe(false);
  });

  it('should validate middleware routing configurations and access matchers', () => {
    const matcher = authConfig.pages?.signIn;
    expect(matcher).toBe('/login');
  });

  it('should correctly block or authorize routes based on session details', () => {
    const authorizeCallback = authConfig.callbacks?.authorized;
    expect(authorizeCallback).toBeDefined();

    if (authorizeCallback) {
      // 1. Not logged in, accessing dashboard
      const resDashboardAnon = authorizeCallback({
        auth: null,
        request: { nextUrl: new URL('http://localhost:3000/dashboard') } as any,
      });
      expect(resDashboardAnon).toBe(false);

      // 2. Logged in USER, accessing dashboard
      const resDashboardUser = authorizeCallback({
        auth: { user: { name: 'User' }, expires: '' },
        request: { nextUrl: new URL('http://localhost:3000/dashboard') } as any,
      });
      expect(resDashboardUser).toBe(true);

      // 3. Logged in USER, trying to access admin
      const resAdminUser = authorizeCallback({
        auth: { user: { name: 'User', role: 'USER' } as any, expires: '' },
        request: { nextUrl: new URL('http://localhost:3000/admin') } as any,
      });
      expect(resAdminUser).toBe(false);

      // 4. Logged in ADMIN, accessing admin
      const resAdminAdmin = authorizeCallback({
        auth: { user: { name: 'Admin', role: 'ADMIN' } as any, expires: '' },
        request: { nextUrl: new URL('http://localhost:3000/admin') } as any,
      });
      expect(resAdminAdmin).toBe(true);
    }
  });
});
