import type { HttpClient } from './HttpClient';
import { HttpError, BadRequestError, ServerError, NetworkError } from './errors';

/**
 * HTTP client implementation with Fetch api
 */
export class FetchHttpClient implements HttpClient {
	async get<T>(path: string): Promise<T> {
		try {
			const response = await fetch(path, {
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
			const response = await fetch(path, {
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
		const responseText = await response.text();
		if (!response.ok) {
			const { status, statusText } = response;

			if (status === 400) {
				throw new BadRequestError(responseText);
			}

			if (status >= 500) {
				throw new ServerError(status, statusText);
			}

			throw new HttpError(status, statusText);
		}

		if (!responseText) {
			return null as T;
		}

		const data = JSON.parse(responseText);
		return data as T;
	}
}
