export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			_prisma_migrations: {
				Row: {
					applied_steps_count: number;
					checksum: string;
					finished_at: string | null;
					id: string;
					logs: string | null;
					migration_name: string;
					rolled_back_at: string | null;
					started_at: string;
				};
				Insert: {
					applied_steps_count?: number;
					checksum: string;
					finished_at?: string | null;
					id: string;
					logs?: string | null;
					migration_name: string;
					rolled_back_at?: string | null;
					started_at?: string;
				};
				Update: {
					applied_steps_count?: number;
					checksum?: string;
					finished_at?: string | null;
					id?: string;
					logs?: string | null;
					migration_name?: string;
					rolled_back_at?: string | null;
					started_at?: string;
				};
			};
			Event: {
				Row: {
					data: Json;
					id: number;
					name: string;
					resultDuosmiumId: string;
				};
				Insert: {
					data: Json;
					id?: number;
					name: string;
					resultDuosmiumId: string;
				};
				Update: {
					data?: Json;
					id?: number;
					name?: string;
					resultDuosmiumId?: string;
				};
			};
			Histogram: {
				Row: {
					data: Json;
					id: number;
					resultDuosmiumId: string;
				};
				Insert: {
					data: Json;
					id?: number;
					resultDuosmiumId: string;
				};
				Update: {
					data?: Json;
					id?: number;
					resultDuosmiumId?: string;
				};
			};
			Penalty: {
				Row: {
					data: Json;
					id: number;
					resultDuosmiumId: string;
					teamNumber: number;
				};
				Insert: {
					data: Json;
					id?: number;
					resultDuosmiumId: string;
					teamNumber: number;
				};
				Update: {
					data?: Json;
					id?: number;
					resultDuosmiumId?: string;
					teamNumber?: number;
				};
			};
			Placing: {
				Row: {
					data: Json;
					eventName: string;
					id: number;
					resultDuosmiumId: string;
					teamNumber: number;
				};
				Insert: {
					data: Json;
					eventName: string;
					id?: number;
					resultDuosmiumId: string;
					teamNumber: number;
				};
				Update: {
					data?: Json;
					eventName?: string;
					id?: number;
					resultDuosmiumId?: string;
					teamNumber?: number;
				};
			};
			Result: {
				Row: {
					color: string;
					createdAt: string;
					duosmiumId: string;
					id: number;
					logo: string;
					updatedAt: string;
				};
				Insert: {
					color: string;
					createdAt?: string;
					duosmiumId: string;
					id?: number;
					logo: string;
					updatedAt: string;
				};
				Update: {
					color?: string;
					createdAt?: string;
					duosmiumId?: string;
					id?: number;
					logo?: string;
					updatedAt?: string;
				};
			};
			Team: {
				Row: {
					data: Json;
					id: number;
					number: number;
					resultDuosmiumId: string;
				};
				Insert: {
					data: Json;
					id?: number;
					number: number;
					resultDuosmiumId: string;
				};
				Update: {
					data?: Json;
					id?: number;
					number?: number;
					resultDuosmiumId?: string;
				};
			};
			Tournament: {
				Row: {
					data: Json;
					id: number;
					resultDuosmiumId: string;
				};
				Insert: {
					data: Json;
					id?: number;
					resultDuosmiumId: string;
				};
				Update: {
					data?: Json;
					id?: number;
					resultDuosmiumId?: string;
				};
			};
			Track: {
				Row: {
					data: Json;
					id: number;
					name: string;
					resultDuosmiumId: string;
				};
				Insert: {
					data: Json;
					id?: number;
					name: string;
					resultDuosmiumId: string;
				};
				Update: {
					data?: Json;
					id?: number;
					name?: string;
					resultDuosmiumId?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
