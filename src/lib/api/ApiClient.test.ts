import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient } from './ApiClient';
import type { HttpClient } from '../http/HttpClient';
import { NetworkError, BadRequestError, ServerError } from '../http/errors';

describe('ApiClient', () => {
	let apiClient: ApiClient;
	let mockHttpClient: HttpClient;

	beforeEach(() => {
		mockHttpClient = {
			get: vi.fn(),
			post: vi.fn()
		};
		apiClient = new ApiClient(mockHttpClient);
	});

	it('should be able to instantiate ApiClient class', () => {
		expect(apiClient).toBeDefined();
		expect(apiClient).toBeInstanceOf(ApiClient);
	});

	it('should accept HttpClient dependency in constructor', () => {
		const client = new ApiClient(mockHttpClient);
		expect(client).toBeDefined();
	});

	describe('getAccount', () => {
		it('should make GET request to correct URL', async () => {
			const mockAccount = { account_id: 1, balance: '100.50' };
			vi.mocked(mockHttpClient.get).mockResolvedValue(mockAccount);

			const result = await apiClient.getAccount(1);

			expect(mockHttpClient.get).toHaveBeenCalledWith('/accounts/1');
			expect(result).toEqual(mockAccount);
		});

		it('should handle network errors', async () => {
			const networkError = new NetworkError('Connection failed');
			vi.mocked(mockHttpClient.get).mockRejectedValue(networkError);

			await expect(apiClient.getAccount(1)).rejects.toThrow('Connection failed');
		});
	});

	describe('createAccount', () => {
		it('should make POST request with correct data', async () => {
			const request = { account_id: 1, initial_balance: '50.00' };
			const response = { account_id: 1, balance: '50.00' };
			vi.mocked(mockHttpClient.post).mockResolvedValue(response);

			const result = await apiClient.createAccount(request);

			expect(mockHttpClient.post).toHaveBeenCalledWith('/accounts', request);
			expect(result).toEqual(response);
		});

		it('should handle validation errors', async () => {
			const request = { account_id: 1, initial_balance: 'invalid' };
			const validationError = new BadRequestError('Bad Request');
			vi.mocked(mockHttpClient.post).mockRejectedValue(validationError);

			await expect(apiClient.createAccount(request)).rejects.toThrow('Invalid data');
		});
	});

	describe('createTransaction', () => {
		it('should make POST request with correct data', async () => {
			const request = { source_account_id: 1, destination_account_id: 2, amount: '25.75' };
			const response = {
				transaction_id: 1,
				source_account_id: 1,
				destination_account_id: 2,
				amount: '25.75',
				timestamp: '2023-01-01T00:00:00Z'
			};
			vi.mocked(mockHttpClient.post).mockResolvedValue(response);

			const result = await apiClient.createTransaction(request);

			expect(mockHttpClient.post).toHaveBeenCalledWith('/transactions', request);
			expect(result).toEqual(response);
		});

		it('should handle server errors', async () => {
			const request = { source_account_id: 1, destination_account_id: 2, amount: '25.75' };
			const serverError = new ServerError(500, 'Internal Server Error');
			vi.mocked(mockHttpClient.post).mockRejectedValue(serverError);

			await expect(apiClient.createTransaction(request)).rejects.toThrow('Server error occurred');
		});
	});
});
