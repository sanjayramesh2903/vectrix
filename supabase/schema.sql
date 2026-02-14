-- ============================================================
-- Vectrix database schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- Projects table: each monitored repository
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  repo_url text,
  ecosystem text not null default 'npm',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(user_id, name)
);

-- Scans table: each scan run against a project
create table if not exists scans (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  branch text default 'main',
  total_deps int default 0,
  critical_count int default 0,
  warning_count int default 0,
  info_count int default 0,
  clean_count int default 0,
  started_at timestamptz default now() not null,
  completed_at timestamptz,
  error_message text
);

-- Findings table: individual issues found during a scan
create table if not exists findings (
  id uuid default gen_random_uuid() primary key,
  scan_id uuid references scans(id) on delete cascade not null,
  severity text not null check (severity in ('critical', 'warning', 'info')),
  package_name text not null,
  package_version text not null,
  ecosystem text not null default 'npm',
  title text not null,
  description text not null,
  recommendation text not null,
  cve text,
  source text not null default 'osv' check (source in ('osv', 'health', 'anomaly', 'license')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- Dependencies table: full resolved dependency tree for a scan
create table if not exists dependencies (
  id uuid default gen_random_uuid() primary key,
  scan_id uuid references scans(id) on delete cascade not null,
  package_name text not null,
  package_version text not null,
  ecosystem text not null default 'npm',
  is_direct boolean default true,
  health_score real,
  license text,
  metadata jsonb default '{}'::jsonb
);

-- ============================================================
-- Row Level Security: users can only access their own data
-- ============================================================

alter table projects enable row level security;
alter table scans enable row level security;
alter table findings enable row level security;
alter table dependencies enable row level security;

-- Projects: users see only their own
create policy "Users can view own projects"
  on projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects"
  on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects"
  on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects"
  on projects for delete using (auth.uid() = user_id);

-- Scans: users see only their own
create policy "Users can view own scans"
  on scans for select using (auth.uid() = user_id);
create policy "Users can insert own scans"
  on scans for insert with check (auth.uid() = user_id);
create policy "Users can update own scans"
  on scans for update using (auth.uid() = user_id);

-- Findings: users see findings from their scans
create policy "Users can view own findings"
  on findings for select using (
    scan_id in (select id from scans where user_id = auth.uid())
  );
create policy "Users can insert own findings"
  on findings for insert with check (
    scan_id in (select id from scans where user_id = auth.uid())
  );

-- Dependencies: users see deps from their scans
create policy "Users can view own dependencies"
  on dependencies for select using (
    scan_id in (select id from scans where user_id = auth.uid())
  );
create policy "Users can insert own dependencies"
  on dependencies for insert with check (
    scan_id in (select id from scans where user_id = auth.uid())
  );

-- ============================================================
-- Indexes for performance
-- ============================================================

create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_scans_project_id on scans(project_id);
create index if not exists idx_scans_user_id on scans(user_id);
create index if not exists idx_findings_scan_id on findings(scan_id);
create index if not exists idx_findings_severity on findings(severity);
create index if not exists idx_dependencies_scan_id on dependencies(scan_id);
