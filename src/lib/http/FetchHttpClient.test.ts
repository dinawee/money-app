import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FetchHttpClient } from './FetchHttpClient';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('FetchHttpClient', () => {
	let client: FetchHttpClient;

	beforeEach(() => {
		client = new FetchHttpClient();
		mockFetch.mockClear();
	});

	it('should be able to instantiate FetchHttpClient class', () => {
		expect(client).toBeDefined();
		expect(client).toBeInstanceOf(FetchHttpClient);
	});

	it('should implement get method that makes fetch GET request', async () => {
		const mockResponse = { data: 'test' };
		mockFetch.mockResolvedValue({
			ok: true,
			json: async () => mockResponse
		});

		const result = await client.get('/test');

		expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		expect(result).toEqual(mockResponse);
	});

	it('should handle 200 responses and return parsed JSON data', async () => {
		const mockData = { account_id: 1, balance: '100.50' };
		mockFetch.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => mockData
		});

		const result = await client.get('/api/accounts/1');

		expect(result).toEqual(mockData);
		expect(typeof result.balance).toBe('string');
	});

	it('should handle POST requests with JSON body', async () => {
		const requestBody = { account_id: 1, initial_balance: '50.00' };
		const responseBody = { account_id: 1, balance: '50.00' };

		mockFetch.mockResolvedValue({
			ok: true,
			status: 201,
			json: async () => responseBody
		});

		const result = await client.post('/api/accounts', requestBody);

		expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/api/accounts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestBody)
		});
		expect(result).toEqual(responseBody);
	});

	it('should handle 400 Bad Request errors', async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 400,
			statusText: 'Bad Request',
			json: async () => ({ error: 'Invalid account_id' })
		});

		await expect(client.get('/api/accounts/invalid')).rejects.toThrow('Invalid data');
	});

	it('should handle 404 Not Found errors', async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 404,
			statusText: 'Not Found'
		});

		await expect(client.get('/api/accounts/999')).rejects.toThrow('HTTP 404: Not Found');
	});

	it('should handle 500 Internal Server Error', async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 500,
			statusText: 'Internal Server Error'
		});

		await expect(client.post('/api/accounts', {})).rejects.toThrow('Server error occurred');
	});

	it('should handle network connection failures', async () => {
		mockFetch.mockRejectedValue(new Error('Failed to fetch'));

		await expect(client.get('/api/accounts')).rejects.toThrow('Network request failed');
	});
});
