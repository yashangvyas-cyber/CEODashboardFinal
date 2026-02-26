-- CollabCRM CEO Dashboard - Database Schema

-- Drop tables if they exist to allow clean rebuilds
drop table if exists invoices cascade;
drop table if exists deals cascade;
drop table if exists projects cascade;
drop table if exists employees cascade;
drop table if exists candidates cascade;
drop table if exists job_requisitions cascade;

-- 1. Employees Table
create table employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  department text not null,
  business_unit text not null,
  hire_date date not null,
  status text not null,
  exit_date date,
  exit_reason text,
  exit_type text,
  salary numeric,
  skills text[] default '{}',
  performance_score numeric,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Deals Table (Sales Pipeline)
create table deals (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  deal_value numeric not null,
  stage text not null,
  probability_percent numeric not null,
  loss_reason text,
  owner text not null,
  business_unit text not null,
  created_date date not null,
  close_date date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Invoices Table
create table invoices (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid references deals(id),
  client_name text not null,
  amount numeric not null,
  status text not null,
  issue_date date not null,
  due_date date not null,
  payment_date date,
  business_unit text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Projects Table
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  status text not null,
  budget_hours numeric not null,
  spent_hours numeric not null,
  billed_hours numeric not null,
  business_unit text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Job Requisitions Table
create table job_requisitions (
  id uuid primary key default gen_random_uuid(),
  role_title text not null,
  status text not null,
  department text not null,
  priority text not null,
  posted_date date not null,
  closed_date date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Candidates Table
create table candidates (
  id uuid primary key default gen_random_uuid(),
  req_id uuid references job_requisitions(id),
  name text not null,
  current_stage text not null,
  offer_status text,
  offer_date date,
  join_date date,
  source text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- NOTE: Row Level Security (RLS) is intentionally NOT enabled on these tables 
-- to allow the frontend prototype to insert mock data and query easily.
-- In a production app, you would enable RLS and write policies.
