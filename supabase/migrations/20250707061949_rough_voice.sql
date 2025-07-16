/*
  # Complete NoteNexus Database Schema

  1. New Tables
    - `notes` - Main notes table with all note types and metadata
    - `note_versions` - Version history for notes
    - `labels` - User-defined labels for organization
    - `note_labels` - Many-to-many relationship between notes and labels
    - `workspaces` - Separate workspaces for organizing notes
    - `collaborators` - Note sharing and collaboration
    - `comments` - Inline comments on notes
    - `user_analytics` - User activity tracking for analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for collaboration features

  3. Features
    - Full note management with version control
    - Real-time collaboration
    - Advanced analytics
    - Workspace organization
    - Label-based filtering
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'checklist', 'image', 'audio', 'video')),
  color text NOT NULL DEFAULT '#ffffff',
  is_pinned boolean NOT NULL DEFAULT false,
  is_archived boolean NOT NULL DEFAULT false,
  is_trashed boolean NOT NULL DEFAULT false,
  is_encrypted boolean NOT NULL DEFAULT false,
  workspace_id uuid,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reminder_date timestamptz,
  image_url text,
  audio_url text,
  video_url text,
  checklist_items jsonb DEFAULT '[]'::jsonb,
  position bigint DEFAULT extract(epoch from now()),
  version integer DEFAULT 1
);

-- Note versions for history tracking
CREATE TABLE IF NOT EXISTS note_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  version integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Labels for organization
CREATE TABLE IF NOT EXISTS labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, user_id)
);

-- Many-to-many relationship between notes and labels
CREATE TABLE IF NOT EXISTS note_labels (
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  label_id uuid NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, label_id)
);

-- Workspaces for organizing notes
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  color text NOT NULL DEFAULT '#3B82F6',
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  is_default boolean DEFAULT false,
  UNIQUE(name, user_id)
);

-- Collaborators for note sharing
CREATE TABLE IF NOT EXISTS collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  permission text NOT NULL DEFAULT 'view' CHECK (permission IN ('view', 'edit', 'admin')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(note_id, user_id)
);

-- Comments for collaboration
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  position integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User analytics for dashboard
CREATE TABLE IF NOT EXISTS user_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for workspace
ALTER TABLE notes ADD CONSTRAINT fk_notes_workspace 
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_workspace_id ON notes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
CREATE INDEX IF NOT EXISTS idx_notes_position ON notes(position);
CREATE INDEX IF NOT EXISTS idx_note_versions_note_id ON note_versions(note_id);
CREATE INDEX IF NOT EXISTS idx_labels_user_id ON labels(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_note_id ON collaborators(note_id);
CREATE INDEX IF NOT EXISTS idx_comments_note_id ON comments(note_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notes
CREATE POLICY "Users can manage their own notes"
  ON notes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view shared notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM collaborators 
      WHERE collaborators.note_id = notes.id 
      AND collaborators.user_id = auth.uid()
    )
  );

-- RLS Policies for note_versions
CREATE POLICY "Users can manage versions of their notes"
  ON note_versions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for labels
CREATE POLICY "Users can manage their own labels"
  ON labels
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for note_labels
CREATE POLICY "Users can manage labels on their notes"
  ON note_labels
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM notes 
      WHERE notes.id = note_labels.note_id 
      AND notes.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM notes 
      WHERE notes.id = note_labels.note_id 
      AND notes.user_id = auth.uid()
    )
  );

-- RLS Policies for workspaces
CREATE POLICY "Users can manage their own workspaces"
  ON workspaces
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for collaborators
CREATE POLICY "Note owners can manage collaborators"
  ON collaborators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM notes 
      WHERE notes.id = collaborators.note_id 
      AND notes.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM notes 
      WHERE notes.id = collaborators.note_id 
      AND notes.user_id = auth.uid()
    )
  );

CREATE POLICY "Collaborators can view their collaborations"
  ON collaborators
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Users can manage comments on accessible notes"
  ON comments
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM notes 
      WHERE notes.id = comments.note_id 
      AND notes.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM collaborators 
      WHERE collaborators.note_id = comments.note_id 
      AND collaborators.user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM notes 
      WHERE notes.id = comments.note_id 
      AND notes.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM collaborators 
      WHERE collaborators.note_id = comments.note_id 
      AND collaborators.user_id = auth.uid()
      AND collaborators.permission IN ('edit', 'admin')
    )
  );

-- RLS Policies for user_analytics
CREATE POLICY "Users can manage their own analytics"
  ON user_analytics
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON notes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
  BEFORE UPDATE ON comments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create default workspace for new users
CREATE OR REPLACE FUNCTION create_default_workspace()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO workspaces (name, description, color, user_id, is_default)
  VALUES ('Personal', 'Your personal workspace', '#3B82F6', NEW.id, true);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create default workspace for new users
CREATE TRIGGER create_user_default_workspace
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_workspace();