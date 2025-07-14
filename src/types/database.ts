export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          title: string;
          content: string;
          type: 'text' | 'checklist' | 'image' | 'audio' | 'video';
          color: string;
          is_pinned: boolean;
          is_archived: boolean;
          is_trashed: boolean;
          is_encrypted: boolean;
          workspace_id: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
          reminder_date: string | null;
          image_url: string | null;
          audio_url: string | null;
          video_url: string | null;
          checklist_items: any[] | null;
          position: number;
          version: number;
        };
        Insert: Omit<Database['public']['Tables']['notes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['notes']['Insert']>;
      };
      note_versions: {
        Row: {
          id: string;
          note_id: string;
          title: string;
          content: string;
          version: number;
          created_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['note_versions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['note_versions']['Insert']>;
      };
      labels: {
        Row: {
          id: string;
          name: string;
          color: string;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['labels']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['labels']['Insert']>;
      };
      note_labels: {
        Row: {
          note_id: string;
          label_id: string;
        };
        Insert: Database['public']['Tables']['note_labels']['Row'];
        Update: Partial<Database['public']['Tables']['note_labels']['Insert']>;
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string;
          user_id: string;
          created_at: string;
          is_default: boolean;
        };
        Insert: Omit<Database['public']['Tables']['workspaces']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['workspaces']['Insert']>;
      };
      collaborators: {
        Row: {
          id: string;
          note_id: string;
          user_id: string;
          email: string;
          permission: 'view' | 'edit' | 'admin';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['collaborators']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['collaborators']['Insert']>;
      };
      comments: {
        Row: {
          id: string;
          note_id: string;
          user_id: string;
          content: string;
          position: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
      user_analytics: {
        Row: {
          id: string;
          user_id: string;
          event_type: string;
          event_data: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_analytics']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_analytics']['Insert']>;
      };
    };
  };
}