-- Migration: Update memories table to use 384-dimension vectors (for all-MiniLM-L6-v2)
-- Run this ONLY if you previously created the 768-dimension table

-- Step 1: Drop the old function first (it depends on the old vector size)
drop function if exists match_memories(vector(768), float, int, uuid);

-- Step 2: Alter the embedding column to new dimension
-- NOTE: This DELETES existing embeddings! OK for fresh setups.
alter table memories alter column embedding type vector(384);

-- Step 3: Recreate function with correct dimension
create or replace function match_memories (
  query_embedding vector(384),
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
