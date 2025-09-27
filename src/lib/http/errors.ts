export class HttpError extends Error {
	constructor(
		public status: number,
		public statusText: string,
		message?: string
	) {
		super(message || `HTTP ${status}: ${statusText}`);
		this.name = 'HttpError';
	}
}

export class BadRequestError extends HttpError {
	constructor(
		statusText: string,
		public errors?: Record<string, string[]>
	) {
		super(400, statusText, 'Invalid data');
		this.name = 'BadRequestError';
	}
}

export class ServerError extends HttpError {
	constructor(status: number, statusText: string) {
		super(status, statusText, 'Server error occurred');
		this.name = 'ServerError';
	}
}

export class NetworkError extends Error {
	constructor(
		message: string,
		public originalError?: Error
	) {
		super(message);
		this.name = 'NetworkError';
	}
}
