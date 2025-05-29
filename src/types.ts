export type Chat = {
	id: string;
	ref: {
		id: string;
		collection: string;
	}
	messages: Array<ChatMessage>;
}
export type ChatMessage = {
	id: string;
	sender: User;
	content: string;
	timestamp: Date;
}

export type User = {
	id: string;
	name: string;
	role: "admin" | "client";
	photo?: string;
}

// Enum-style literal union for better clarity
export type RequestStatus =
	| "pending"
	| "accepted"
	| "ready"
	| "completed";

// Base Request type
export interface RequestBase {
	id: string;
	userId: string;
	status: RequestStatus;
	createdAt?: Date;
	updatedAt?: Date;
	description?: string;
}

// Design-specific request
export interface DesignRequest extends RequestBase {
	type: "design";
	name: string;
	size: string;
	theme: string;
	reference?: string[]; // URLs or IDs
	revision: Array<{
		number: number;
		description?: string;
	}>;
	image?: string;
	executorId?: string;
}

// Production-specific request
export interface ProductionRequest extends RequestBase {
	type: "production";
	location: string;
	cluster: string;
	allocation: string;
	quantity: number;
	design?: {
		type: "design" | "custom";
		design: string; // design ID or URL
	};
}

// Unified request union for processing or filtering
export type AnyRequest = DesignRequest | ProductionRequest;