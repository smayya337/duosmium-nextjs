export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
      }
      Event: {
        Row: {
          data: Json
          name: string
          resultDuosmiumId: string
        }
        Insert: {
          data: Json
          name: string
          resultDuosmiumId: string
        }
        Update: {
          data?: Json
          name?: string
          resultDuosmiumId?: string
        }
      }
      Histogram: {
        Row: {
          data: Json
          resultDuosmiumId: string
        }
        Insert: {
          data: Json
          resultDuosmiumId: string
        }
        Update: {
          data?: Json
          resultDuosmiumId?: string
        }
      }
      Location: {
        Row: {
          city: string
          country: string
          name: string
          state: string
        }
        Insert: {
          city?: string
          country?: string
          name: string
          state: string
        }
        Update: {
          city?: string
          country?: string
          name?: string
          state?: string
        }
      }
      Penalty: {
        Row: {
          data: Json
          resultDuosmiumId: string
          teamNumber: number
        }
        Insert: {
          data: Json
          resultDuosmiumId: string
          teamNumber: number
        }
        Update: {
          data?: Json
          resultDuosmiumId?: string
          teamNumber?: number
        }
      }
      Placing: {
        Row: {
          data: Json
          eventName: string
          resultDuosmiumId: string
          teamNumber: number
        }
        Insert: {
          data: Json
          eventName: string
          resultDuosmiumId: string
          teamNumber: number
        }
        Update: {
          data?: Json
          eventName?: string
          resultDuosmiumId?: string
          teamNumber?: number
        }
      }
      Result: {
        Row: {
          color: string
          createdAt: string
          duosmiumId: string
          logo: string
          official: boolean
          preliminary: boolean
          updatedAt: string
        }
        Insert: {
          color: string
          createdAt?: string
          duosmiumId: string
          logo: string
          official?: boolean
          preliminary?: boolean
          updatedAt: string
        }
        Update: {
          color?: string
          createdAt?: string
          duosmiumId?: string
          logo?: string
          official?: boolean
          preliminary?: boolean
          updatedAt?: string
        }
      }
      Team: {
        Row: {
          data: Json
          number: number
          resultDuosmiumId: string
        }
        Insert: {
          data: Json
          number: number
          resultDuosmiumId: string
        }
        Update: {
          data?: Json
          number?: number
          resultDuosmiumId?: string
        }
      }
      Tournament: {
        Row: {
          data: Json
          resultDuosmiumId: string
        }
        Insert: {
          data: Json
          resultDuosmiumId: string
        }
        Update: {
          data?: Json
          resultDuosmiumId?: string
        }
      }
      Track: {
        Row: {
          data: Json
          name: string
          resultDuosmiumId: string
        }
        Insert: {
          data: Json
          name: string
          resultDuosmiumId: string
        }
        Update: {
          data?: Json
          name?: string
          resultDuosmiumId?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
