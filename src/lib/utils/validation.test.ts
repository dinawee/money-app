/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { validateAmount, validateAccountId } from './validation';

describe('validation utilities', () => {
	describe('validateAmount', () => {
		it('should accept valid decimal strings', () => {
			expect(validateAmount('100.50')).toBe(true);
			expect(validateAmount('0.01')).toBe(true);
			expect(validateAmount('1000')).toBe(true);
			expect(validateAmount('999.99')).toBe(true);
		});
		
		it('should reject invalid formats', () => {
			expect(validateAmount('')).toBe(false);
			expect(validateAmount('   ')).toBe(false);
			expect(validateAmount('abc')).toBe(false);
			expect(validateAmount('100.50.25')).toBe(false);
			expect(validateAmount('100.')).toBe(false);
			expect(validateAmount('.50')).toBe(false);
			expect(validateAmount('0')).toBe(false);
		});

		it('should reject negative amounts', () => {
			expect(validateAmount('-100.50')).toBe(false);
			expect(validateAmount('-1')).toBe(false);
		});

		it('should reject non-string inputs', () => {
			expect(validateAmount(100.5 as any)).toBe(false);
			expect(validateAmount(null as any)).toBe(false);
			expect(validateAmount(undefined as any)).toBe(false);
		});

		it('should reject infinity and NaN', () => {
			expect(validateAmount('Infinity')).toBe(false);
			expect(validateAmount('NaN')).toBe(false);
		});
	});

	describe('validateAccountId', () => {
		it('should accept positive integers', () => {
			expect(validateAccountId(1)).toBe(true);
			expect(validateAccountId(100)).toBe(true);
			expect(validateAccountId(999)).toBe(true);
		});

		it('should reject invalid account IDs', () => {
			expect(validateAccountId(0)).toBe(false);
			expect(validateAccountId(-1)).toBe(false);
			expect(validateAccountId(1.5)).toBe(false);
			expect(validateAccountId(NaN)).toBe(false);
			expect(validateAccountId(Infinity)).toBe(false);
		});
	});
});
