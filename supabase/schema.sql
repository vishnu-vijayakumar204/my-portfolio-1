create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  link text not null default '#',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table projects enable row level security;

-- Anyone (the public site) can read projects.
create policy "Public read access" on projects
  for select using (true);

-- No insert/update/delete policy is defined for anon/authenticated roles:
-- writes only happen server-side via the service_role key (used by the
-- /admin portal), which bypasses RLS entirely.

insert into projects (title, description, tags, link, sort_order) values
  ('Task Flow', 'A collaborative task management app with real-time updates, drag-and-drop boards, and team workspaces.', array['Next.js', 'TypeScript', 'Postgres'], '#', 0),
  ('Weather Now', 'A minimalist weather dashboard that surfaces hyper-local forecasts with clean, glanceable visuals.', array['React', 'Tailwind', 'API'], '#', 1),
  ('DevNotes', 'A markdown-based note-taking tool for developers, with code syntax highlighting and instant search.', array['Next.js', 'MDX', 'SQLite'], '#', 2);
