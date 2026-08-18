import { describe, it, expect } from 'vitest';
import prisma from '@/lib/prisma';

describe('Basic Setup Test', () => {
  it('should pass a basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('should import the prisma client successfully', () => {
    expect(prisma).toBeDefined();
  });
});
