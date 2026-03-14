# Architecture

## Overview

This project is a small full-stack journaling system built around three core capabilities:

- Persist a user’s journal entries
- Analyze entry text with an LLM
- Aggregate stored analysis into lightweight user insights

The current architecture is synchronous and simple:

1. The React frontend sends requests to the FastAPI backend
2. The FastAPI backend writes journal entries to PostgreSQL through SQLAlchemy
3. On entry creation, the backend calls the Groq LLM API
4. The backend stores the structured analysis result in `journal_analysis`
5. The insights endpoint reads stored rows and computes totals, dominant emotion, ambience usage, and recent keywords

## Components

### Frontend

- React + TypeScript SPA
- Calls backend endpoints directly with `fetch`
- Renders entry history and aggregated insights

### Backend API

- FastAPI app with route modules for entries, analysis, and insights
- Pydantic schemas for request and response validation
- Shared analysis service to centralize LLM interaction

### Database

Two main tables:

- `journal_entries`
- `journal_analysis`

Each journal entry has a one-to-one optional relationship with an analysis record.

## Request Flow

### Save Entry

1. Frontend calls `POST /api/journal`
2. Backend analyzes the text through the shared analysis service
3. Backend stores both the entry and the analysis result
4. Frontend refreshes entries and insights

### Preview Analysis

1. Frontend calls `POST /api/journal/analyze`
2. Backend sends the text to the same shared analysis service
3. Backend returns the structured result without storing an entry

### Fetch Insights

1. Frontend calls `GET /api/journal/insights/{user_id}`
2. Backend queries stored entries and analysis rows
3. Backend returns:
   - total entries
   - top emotion
   - most used ambience
   - recent keywords

## How would you scale this to 100k users?

For 100k users, the main shift is from a synchronous single-service design to a more decoupled and operationally safe system.

- Move the app behind a load balancer and run multiple stateless FastAPI instances
- Put PostgreSQL on a managed instance with connection pooling, backups, and read replicas
- Replace synchronous analysis during entry creation with an async pipeline:
  - save entry immediately
  - publish an analysis job to a queue such as Redis Streams, RabbitMQ, or SQS
  - process jobs with background workers
- Add indexes on `user_id`, `created_at`, and frequently filtered analysis fields
- Paginate entry history instead of returning all entries
- Precompute or incrementally update insights instead of recalculating everything on each request
- Add observability:
  - request metrics
  - queue depth
  - LLM latency
  - DB query timings
- Introduce rate limiting and abuse protection on write-heavy endpoints

The key principle is to separate user writes from LLM latency so the core journaling workflow stays fast under load.

## How would you reduce LLM cost?

There are several practical levers:

- Analyze only on save, not on every keystroke or repeated preview
- Use a smaller, cheaper model for routine classification tasks like emotion and keywords
- Keep prompts short and structured so token usage is predictable
- Enforce output schema tightly to avoid verbose responses
- Store analysis results permanently and reuse them instead of re-analyzing the same text
- Add thresholds:
  - skip analysis for extremely short or low-signal entries
  - defer analysis for low-priority users or batch workloads
- Separate tasks by cost:
  - cheap model for emotion + keywords
  - larger model only when advanced summaries are actually needed

For this use case, prompt discipline and avoiding duplicate analysis will cut cost more than anything else.

## How would you cache repeated analysis?

The safest pattern is content-based caching.

Recommended approach:

1. Normalize the journal text
   - trim whitespace
   - collapse repeated spaces
   - optionally lowercase if that does not change semantics for your use case
2. Compute a hash of the normalized text, such as SHA-256
3. Check a cache table or Redis entry by that hash before calling the LLM
4. If a cached result exists, reuse it
5. If not, call the LLM, store the result, and write it back to the cache

A good design is:

- Redis for fast hot-cache lookups
- PostgreSQL cache table for durable reuse across deploys and restarts

Important detail: include the model name and prompt version in the cache key. If you change either, old cached results may no longer match the intended behavior.

Example cache key:

```text
analysis:{model}:{prompt_version}:{sha256(normalized_text)}
```

## How would you protect sensitive journal data?

This is the most important non-functional requirement in the system.

At minimum:

- Encrypt all traffic with HTTPS
- Encrypt database storage and backups at rest
- Never log raw journal text in application logs, traces, or analytics
- Enforce authentication and authorization so users can only access their own entries
- Use least-privilege database credentials
- Add audit logging for access to sensitive records
- Define retention and deletion policies so users can remove their data

For stronger protection:

- Encrypt journal content at the application layer before storage
- Separate personally identifying data from journal content
- Use row-level security or tenant isolation in the database
- Redact journal text before sending it to non-essential observability tools
- Evaluate whether full raw text must be sent to the LLM, or whether some preprocessing can reduce exposure
- Sign a data processing agreement and verify vendor security posture if using third-party LLM providers