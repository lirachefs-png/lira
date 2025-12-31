-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists memories (
  id bigserial primary key,
  content text, -- The text content of the memory
  user_id uuid references auth.users not null, -- Linked to the authenticated user
  embedding vector(768), -- Google Gemini embedding-001 has 768 dimensions
  created_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb -- For extra info like source, tags, etc.
);

-- Create a function to search for memories
create or replace function match_memories (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
returns table (
  id bigint,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    memories.id,
    memories.content,
    1 - (memories.embedding <=> query_embedding) as similarity
  from memories
  where 1 - (memories.embedding <=> query_embedding) > match_threshold
  and memories.user_id = p_user_id
  order by memories.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create an index for faster queries (IVFFlat)
-- Note: You normally create this after you have some data, but good to have ready.
-- create index on memories using ivfflat (embedding vector_cosine_ops)
-- with (lists = 100);
