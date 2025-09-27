import { describe, it, expect } from 'vitest';
import type { HttpClient } from './HttpClient';

describe('HttpClient Interface', () => {
	it('should define HttpClient interface', () => {
		const mockClient: HttpClient = {} as HttpClient;
		expect(mockClient).toBeDefined();
	});

	it('should have get method with correct signature', () => {
		const mockClient: HttpClient = {
			get: async <T>(path: string): Promise<T> => {
				return {} as T;
			}
		} as HttpClient;

		expect(typeof mockClient.get).toBe('function');
		expect(mockClient.get).toBeDefined();
	});

	it('should have post method with correct signature', () => {
		const mockClient: HttpClient = {
			get: async <T>(path: string): Promise<T> => {
				return {} as T;
			},
			post: async <T, B>(path: string, body: B): Promise<T> => {
				return {} as T;
			}
		};

		expect(typeof mockClient.post).toBe('function');
		expect(mockClient.post).toBeDefined();
	});
});
