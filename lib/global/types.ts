export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
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
				Relationships: [];
			};
			Event: {
				Row: {
					data: Json;
					name: string;
					resultDuosmiumId: string;
				};
				Insert: {
					data: Json;
					name: string;
					resultDuosmiumId: string;
				};
				Update: {
					data?: Json;
					name?: string;
					resultDuosmiumId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Event_resultDuosmiumId_fkey';
						columns: ['resultDuosmiumId'];
						referencedRelation: 'Result';
						referencedColumns: ['duosmiumId'];
					}
				];
			};
			Histogram: {
				Row: {
					data: Json;
					resultDuosmiumId: string;
				};
				Insert: {
					data: Json;
					resultDuosmiumId: string;
				};
				Update: {
					data?: Json;
					resultDuosmiumId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Histogram_resultDuosmiumId_fkey';
						columns: ['resultDuosmiumId'];
						referencedRelation: 'Result';
						referencedColumns: ['duosmiumId'];
					}
				];
			};
			Location: {
				Row: {
					city: string;
					country: string;
					name: string;
					state: string;
				};
				Insert: {
					city?: string;
					country?: string;
					name: string;
					state: string;
				};
				Update: {
					city?: string;
					country?: string;
					name?: string;
					state?: string;
				};
				Relationships: [];
			};
			Penalty: {
				Row: {
					data: Json;
					resultDuosmiumId: string;
					teamNumber: number;
				};
				Insert: {
					data: Json;
					resultDuosmiumId: string;
					teamNumber: number;
				};
				Update: {
					data?: Json;
					resultDuosmiumId?: string;
					teamNumber?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Penalty_resultDuosmiumId_fkey';
						columns: ['resultDuosmiumId'];
						referencedRelation: 'Result';
						referencedColumns: ['duosmiumId'];
					},
					{
						foreignKeyName: 'Penalty_resultDuosmiumId_teamNumber_fkey';
						columns: ['resultDuosmiumId', 'teamNumber'];
						referencedRelation: 'Team';
						referencedColumns: ['resultDuosmiumId', 'number'];
					}
				];
			};
			Placing: {
				Row: {
					data: Json;
					eventName: string;
					resultDuosmiumId: string;
					teamNumber: number;
				};
				Insert: {
					data: Json;
					eventName: string;
					resultDuosmiumId: string;
					teamNumber: number;
				};
				Update: {
					data?: Json;
					eventName?: string;
					resultDuosmiumId?: string;
					teamNumber?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Placing_resultDuosmiumId_eventName_fkey';
						columns: ['resultDuosmiumId', 'eventName'];
						referencedRelation: 'Event';
						referencedColumns: ['resultDuosmiumId', 'name'];
					},
					{
						foreignKeyName: 'Placing_resultDuosmiumId_fkey';
						columns: ['resultDuosmiumId'];
						referencedRelation: 'Result';
						referencedColumns: ['duosmiumId'];
					},
					{
						foreignKeyName: 'Placing_resultDuosmiumId_teamNumber_fkey';
						columns: ['resultDuosmiumId', 'teamNumber'];
						referencedRelation: 'Team';
						referencedColumns: ['resultDuosmiumId', 'number'];
					}
				];
			};
			Result: {
				Row: {
					color: string;
					createdAt: string;
					date: string;
					duosmiumId: string;
					fullShortTitle: string;
					fullTitle: string;
					locationCity: string;
					locationCountry: string;
					locationName: string;
					locationState: string;
					logo: string;
					official: boolean;
					preliminary: boolean;
					shortTitle: string;
					title: string;
					updatedAt: string;
				};
				Insert: {
					color: string;
					createdAt?: string;
					date: string;
					duosmiumId: string;
					fullShortTitle: string;
					fullTitle: string;
					locationCity?: string;
					locationCountry?: string;
					locationName: string;
					locationState: string;
					logo: string;
					official?: boolean;
					preliminary?: boolean;
					shortTitle: string;
					title: string;
					updatedAt: string;
				};
				Update: {
					color?: string;
					createdAt?: string;
					date?: string;
					duosmiumId?: string;
					fullShortTitle?: string;
					fullTitle?: string;
					locationCity?: string;
					locationCountry?: string;
					locationName?: string;
					locationState?: string;
					logo?: string;
					official?: boolean;
					preliminary?: boolean;
					shortTitle?: string;
					title?: string;
					updatedAt?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Result_locationName_locationCity_locationState_locationCou_fkey';
						columns: ['locationName', 'locationCity', 'locationState', 'locationCountry'];
						referencedRelation: 'Location';
						referencedColumns: ['name', 'city', 'state', 'country'];
					}
				];
			};
			Team: {
				Row: {
					city: string;
					country: string;
					data: Json;
					name: string;
					number: number;
					resultDuosmiumId: string;
					state: string;
					track: string | null;
				};
				Insert: {
					city?: string;
					country?: string;
					data: Json;
					name: string;
					number: number;
					resultDuosmiumId: string;
					state: string;
					track?: string | null;
				};
				Update: {
					city?: string;
					country?: string;
					data?: Json;
					name?: string;
					number?: number;
					resultDuosmiumId?: string;
					state?: string;
					track?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Team_name_city_state_country_fkey';
						columns: ['name', 'city', 'state', 'country'];
						referencedRelation: 'Location';
						referencedColumns: ['name', 'city', 'state', 'country'];
					},
					{
						foreignKeyName: 'Team_resultDuosmiumId_fkey';
						columns: ['resultDuosmiumId'];
						referencedRelation: 'Result';
						referencedColumns: ['duosmiumId'];
					}
				];
			};
			Tournament: {
				Row: {
					data: Json;
					resultDuosmiumId: string;
				};
				Insert: {
					data: Json;
					resultDuosmiumId: string;
				};
				Update: {
					data?: Json;
					resultDuosmiumId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Tournament_resultDuosmiumId_fkey';
						columns: ['resultDuosmiumId'];
						referencedRelation: 'Result';
						referencedColumns: ['duosmiumId'];
					}
				];
			};
			Track: {
				Row: {
					data: Json;
					name: string;
					resultDuosmiumId: string;
				};
				Insert: {
					data: Json;
					name: string;
					resultDuosmiumId: string;
				};
				Update: {
					data?: Json;
					name?: string;
					resultDuosmiumId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Track_resultDuosmiumId_fkey';
						columns: ['resultDuosmiumId'];
						referencedRelation: 'Result';
						referencedColumns: ['duosmiumId'];
					}
				];
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
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | null;
					avif_autodetection: boolean | null;
					created_at: string | null;
					file_size_limit: number | null;
					id: string;
					name: string;
					owner: string | null;
					public: boolean | null;
					updated_at: string | null;
				};
				Insert: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id: string;
					name: string;
					owner?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Update: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id?: string;
					name?: string;
					owner?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'buckets_owner_fkey';
						columns: ['owner'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			migrations: {
				Row: {
					executed_at: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Insert: {
					executed_at?: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Update: {
					executed_at?: string | null;
					hash?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			objects: {
				Row: {
					bucket_id: string | null;
					created_at: string | null;
					id: string;
					last_accessed_at: string | null;
					metadata: Json | null;
					name: string | null;
					owner: string | null;
					path_tokens: string[] | null;
					updated_at: string | null;
					version: string | null;
				};
				Insert: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Update: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'objects_bucketId_fkey';
						columns: ['bucket_id'];
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'objects_owner_fkey';
						columns: ['owner'];
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			can_insert_object: {
				Args: {
					bucketid: string;
					name: string;
					owner: string;
					metadata: Json;
				};
				Returns: undefined;
			};
			extension: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			filename: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			foldername: {
				Args: {
					name: string;
				};
				Returns: unknown;
			};
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>;
				Returns: {
					size: number;
					bucket_id: string;
				}[];
			};
			search: {
				Args: {
					prefix: string;
					bucketname: string;
					limits?: number;
					levels?: number;
					offsets?: number;
					search?: string;
					sortcolumn?: string;
					sortorder?: string;
				};
				Returns: {
					name: string;
					id: string;
					updated_at: string;
					created_at: string;
					last_accessed_at: string;
					metadata: Json;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
