// PRIMITIVE TYPE

export type Branch = {
	id: string;
	address: string;
	city: string;
	name: string;
}

export type Cluster = Branch;

export type Allocation = {
	value: string;
	label: string;
}

export type DesignType = {
	id: string;
	name: string;
}
export type DesignSize = {
	name: string;
	value: string;
}



export type ApiResponse<T = unknown> = {
	status: boolean;
	message: string;
	data?: T
}
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
	| "complete"
	| "finished";

// Base Request type
export interface RequestBase {
	id: string;
	createdBy: string;
	status: RequestStatus;
	createdAt: Date;
	updatedAt?: Date;
	description?: string;
	executedBy?: string;
}

// Design-specific request
export interface DesignRequest extends RequestBase {
	type: "design";
	name: string;
	size: string;
	theme: string;
	images: string[];
	executorId?: string;
}

// Production-specific request
export interface ProductionRequest extends RequestBase {
	type: "production";
	title: string;
	branch: string;
	cluster: string;
	allocation: string;
	quantity: number;
	design?: {
		type: 'design' | 'upload';
		value: string;
	};
	designType: string;
	designSize: string;
}

// Unified request union for processing or filtering
export type AnyRequest = DesignRequest | ProductionRequest;


export type Completion = {
	id: string;
	image: string;
	message: string;
	completedAt?: Date;
	updatedAt?: Date;
	status: "pending" | "rejected" | "accepted";
	rejectMessage?: string;
};