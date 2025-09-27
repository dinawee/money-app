/**
 * HTTP Client
 */
export interface HttpClient {
	/**
	 * Perform GET request
	 * @param path - The path to request
	 * @returns Promise resolving to response data
	 */
	get<T>(path: string): Promise<T>;

	/**
	 * Perform POST request
	 * @param path - The path to request
	 * @param body - Request body data
	 * @returns Promise resolving to response data
	 */
	post<T, B>(path: string, body: B): Promise<T>;
}
