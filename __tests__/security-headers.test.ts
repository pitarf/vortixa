import { describe, it, expect } from 'vitest';
import nextConfig from '../next.config';

describe('HTTP Security Headers Audit & Snyk A+ Verification', () => {
  it('should explicitly disable poweredByHeader to suppress X-Powered-By fingerprinting', () => {
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it('should define an async headers function returning rules for all routes /(.*)', async () => {
    expect(nextConfig.headers).toBeDefined();
    expect(typeof nextConfig.headers).toBe('function');

    const rules = await nextConfig.headers!();
    expect(Array.isArray(rules)).toBe(true);

    const globalRule = rules.find((rule: any) => rule.source === '/(.*)');
    expect(globalRule).toBeDefined();
    expect(Array.isArray(globalRule!.headers)).toBe(true);
  });

  it('should export all 8 mandatory security headers with exact hardened values', async () => {
    const rules = await nextConfig.headers!();
    const globalRule = rules.find((rule: any) => rule.source === '/(.*)')!;
    const headersMap = new Map<string, string>();

    for (const header of globalRule.headers) {
      headersMap.set(header.key.toLowerCase(), header.value);
    }

    // 1. Anti-Clickjacking
    expect(headersMap.get('x-frame-options')).toBe('DENY');

    // 2. MIME Sniffing Prevention
    expect(headersMap.get('x-content-type-options')).toBe('nosniff');

    // 3. Referrer Privacy
    expect(headersMap.get('referrer-policy')).toBe('strict-origin-when-cross-origin');

    // 4. Strict Transport Security (HSTS Preload)
    expect(headersMap.get('strict-transport-security')).toBe(
      'max-age=31536000; includeSubDomains; preload'
    );

    // 5. Content Security Policy (Frame Ancestors None)
    expect(headersMap.get('content-security-policy')).toBe("frame-ancestors 'none';");

    // 6. Permissions Policy (Snyk requirement: camera, mic, geolocation, browsing-topics, payment)
    expect(headersMap.get('permissions-policy')).toBe(
      'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(self)'
    );

    // 7. Cross-Origin Opener Policy (COOP)
    expect(headersMap.get('cross-origin-opener-policy')).toBe('same-origin');

    // 8. Cross-Origin Resource Policy (CORP)
    expect(headersMap.get('cross-origin-resource-policy')).toBe('same-origin');
  });

  it('should enforce granular restrictions in Permissions-Policy', async () => {
    const rules = await nextConfig.headers!();
    const globalRule = rules.find((rule: any) => rule.source === '/(.*)')!;
    const permissionsPolicy = globalRule.headers.find(
      (h: any) => h.key === 'Permissions-Policy'
    )?.value;

    expect(permissionsPolicy).toBeDefined();

    // Verify critical hardware access is completely denied
    expect(permissionsPolicy).toContain('camera=()');
    expect(permissionsPolicy).toContain('microphone=()');
    expect(permissionsPolicy).toContain('geolocation=()');

    // Verify behavioral tracking (Google Topics) is blocked
    expect(permissionsPolicy).toContain('browsing-topics=()');

    // Verify payments are strictly bounded to origin
    expect(permissionsPolicy).toContain('payment=(self)');
  });
});

describe('Security Headers Mutation QA (False Positive Immunity)', () => {
  function validateSecurityConfig(config: typeof nextConfig, rules: any[]) {
    if (config.poweredByHeader !== false) {
      throw new Error('poweredByHeader must be explicitly false to eliminate X-Powered-By');
    }

    const globalRule = rules.find((r: any) => r.source === '/(.*)');
    if (!globalRule) {
      throw new Error('Global rule /(.*) is missing');
    }

    const map = new Map<string, string>(
      globalRule.headers.map((h: any) => [h.key.toLowerCase(), h.value])
    );

    const requiredKeys = [
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy',
      'strict-transport-security',
      'content-security-policy',
      'permissions-policy',
      'cross-origin-opener-policy',
      'cross-origin-resource-policy',
    ];

    for (const key of requiredKeys) {
      if (!map.has(key)) {
        throw new Error(`Missing mandatory security header: ${key}`);
      }
    }

    const pp = map.get('permissions-policy') || '';
    if (!pp.includes('camera=()') || pp.includes('camera=*')) {
      throw new Error('Permissions-Policy permits camera access');
    }

    return true;
  }

  it('should confirm real configuration passes strict validation', async () => {
    const rules = await nextConfig.headers!();
    expect(validateSecurityConfig(nextConfig, rules)).toBe(true);
  });

  it('should fail validation if poweredByHeader is inadvertently enabled or removed', () => {
    expect(() =>
      validateSecurityConfig({ ...nextConfig, poweredByHeader: true as any }, [])
    ).toThrow(/poweredByHeader must be explicitly false/);

    expect(() =>
      validateSecurityConfig({ ...nextConfig, poweredByHeader: undefined }, [])
    ).toThrow(/poweredByHeader must be explicitly false/);
  });

  it('should fail validation if Permissions-Policy or COOP/CORP is omitted', async () => {
    const rules = await nextConfig.headers!();
    const mutatedWithoutPP = rules.map((r: any) => ({
      ...r,
      headers: r.headers.filter((h: any) => h.key !== 'Permissions-Policy'),
    }));

    expect(() => validateSecurityConfig(nextConfig, mutatedWithoutPP)).toThrow(
      /Missing mandatory security header: permissions-policy/
    );

    const mutatedWithoutCOOP = rules.map((r: any) => ({
      ...r,
      headers: r.headers.filter((h: any) => h.key !== 'Cross-Origin-Opener-Policy'),
    }));

    expect(() => validateSecurityConfig(nextConfig, mutatedWithoutCOOP)).toThrow(
      /Missing mandatory security header: cross-origin-opener-policy/
    );
  });

  it('should fail validation if Permissions-Policy is altered to be permissive', async () => {
    const rules = await nextConfig.headers!();
    const mutatedRelaxed = rules.map((r: any) => ({
      ...r,
      headers: r.headers.map((h: any) =>
        h.key === 'Permissions-Policy' ? { key: h.key, value: 'camera=*' } : h
      ),
    }));

    expect(() => validateSecurityConfig(nextConfig, mutatedRelaxed)).toThrow(
      /Permissions-Policy permits camera access/
    );
  });
});
