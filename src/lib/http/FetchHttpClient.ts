import type { HttpClient } from './HttpClient';
import { HttpError, BadRequestError, ServerError, NetworkError } from './errors';

/**
 * HTTP client implementation with Fetch api
 */
export class FetchHttpClient implements HttpClient {
	async get<T>(path: string): Promise<T> {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			return await this.handleResponse<T>(response);
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new NetworkError('Network request failed', error as Error);
		}
	}

	async post<T, B>(path: string, body: B): Promise<T> {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			return await this.handleResponse<T>(response);
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			throw new NetworkError('Network request failed', error as Error);
		}
	}

	private async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			const { status, statusText } = response;

			if (status === 400) {
				throw new BadRequestError(statusText);
			}

			if (status >= 500) {
				throw new ServerError(status, statusText);
			}

			throw new HttpError(status, statusText);
		}

		return await response.json();
	}
}
