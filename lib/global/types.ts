export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          data: Json
          name: string
          result_duosmium_id: string
        }
        Insert: {
          data: Json
          name: string
          result_duosmium_id: string
        }
        Update: {
          data?: Json
          name?: string
          result_duosmium_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_result_duosmium_id_results_duosmium_id_fk"
            columns: ["result_duosmium_id"]
            referencedRelation: "results"
            referencedColumns: ["duosmium_id"]
          }
        ]
      }
      histograms: {
        Row: {
          data: Json
          result_duosmium_id: string
        }
        Insert: {
          data: Json
          result_duosmium_id: string
        }
        Update: {
          data?: Json
          result_duosmium_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "histograms_result_duosmium_id_results_duosmium_id_fk"
            columns: ["result_duosmium_id"]
            referencedRelation: "results"
            referencedColumns: ["duosmium_id"]
          }
        ]
      }
      locations: {
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
        Relationships: []
      }
      penalties: {
        Row: {
          data: Json
          result_duosmium_id: string
          team_number: number
        }
        Insert: {
          data: Json
          result_duosmium_id: string
          team_number: number
        }
        Update: {
          data?: Json
          result_duosmium_id?: string
          team_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "penalties_result_duosmium_id_results_duosmium_id_fk"
            columns: ["result_duosmium_id"]
            referencedRelation: "results"
            referencedColumns: ["duosmium_id"]
          }
        ]
      }
      placings: {
        Row: {
          data: Json
          event_name: string
          result_duosmium_id: string
          team_number: number
        }
        Insert: {
          data: Json
          event_name: string
          result_duosmium_id: string
          team_number: number
        }
        Update: {
          data?: Json
          event_name?: string
          result_duosmium_id?: string
          team_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "placings_result_duosmium_id_results_duosmium_id_fk"
            columns: ["result_duosmium_id"]
            referencedRelation: "results"
            referencedColumns: ["duosmium_id"]
          }
        ]
      }
      results: {
        Row: {
          color: string
          created_at: string
          date: string
          duosmium_id: string
          full_short_title: string
          full_title: string
          location_city: string
          location_country: string
          location_name: string
          location_state: string
          logo: string
          official: boolean
          preliminary: boolean
          short_title: string
          title: string
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          date: string
          duosmium_id: string
          full_short_title: string
          full_title: string
          location_city?: string
          location_country?: string
          location_name: string
          location_state: string
          logo: string
          official?: boolean
          preliminary?: boolean
          short_title: string
          title: string
          updated_at: string
        }
        Update: {
          color?: string
          created_at?: string
          date?: string
          duosmium_id?: string
          full_short_title?: string
          full_title?: string
          location_city?: string
          location_country?: string
          location_name?: string
          location_state?: string
          logo?: string
          official?: boolean
          preliminary?: boolean
          short_title?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          city: string
          country: string
          data: Json | null
          name: string
          number: number
          result_duosmium_id: string
          state: string
          track: string | null
        }
        Insert: {
          city?: string
          country?: string
          data?: Json | null
          name: string
          number: number
          result_duosmium_id: string
          state: string
          track?: string | null
        }
        Update: {
          city?: string
          country?: string
          data?: Json | null
          name?: string
          number?: number
          result_duosmium_id?: string
          state?: string
          track?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_result_duosmium_id_results_duosmium_id_fk"
            columns: ["result_duosmium_id"]
            referencedRelation: "results"
            referencedColumns: ["duosmium_id"]
          }
        ]
      }
      tournaments: {
        Row: {
          data: Json
          result_duosmium_id: string
        }
        Insert: {
          data: Json
          result_duosmium_id: string
        }
        Update: {
          data?: Json
          result_duosmium_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_result_duosmium_id_results_duosmium_id_fk"
            columns: ["result_duosmium_id"]
            referencedRelation: "results"
            referencedColumns: ["duosmium_id"]
          }
        ]
      }
      tracks: {
        Row: {
          data: Json
          name: string
          result_duosmium_id: string
        }
        Insert: {
          data: Json
          name: string
          result_duosmium_id: string
        }
        Update: {
          data?: Json
          name?: string
          result_duosmium_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_result_duosmium_id_results_duosmium_id_fk"
            columns: ["result_duosmium_id"]
            referencedRelation: "results"
            referencedColumns: ["duosmium_id"]
          }
        ]
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
}
