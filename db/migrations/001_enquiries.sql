-- MQT lead capture: enquiries table
-- Provider: Neon serverless Postgres (or any Postgres 13+).
-- Run once in the target database before deploying the /api/enquiries route.
-- Then set DATABASE_URL in the Vercel project env vars.

CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Visitor-supplied (PII — treat as sensitive)
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,

  -- Trip context
  package_slug TEXT,
  package_name TEXT,
  travel_date DATE,
  travellers INTEGER,
  message TEXT,

  -- Attribution (never contains user-entered text)
  source_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT,

  -- Ops
  status TEXT NOT NULL DEFAULT 'new',           -- new | contacted | booked | spam | closed
  whatsapp_notified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries (status);
