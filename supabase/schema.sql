-- CampusConnect Production PostgreSQL / Supabase Schema
-- Covers: Colleges & Profiles, Home Feed, Explore & Projects, Campus Marketplace, Chats & Notifications

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================= 1. COLLEGES & STUDENT PROFILES =================

CREATE TABLE IF NOT EXISTS colleges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  city TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  college_id TEXT REFERENCES colleges(id),
  course_or_branch TEXT,
  graduation_year TEXT,
  college_verification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (college_verification_status IN ('pending', 'verified', 'rejected')),
  expo_push_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================= 2. HOME FEED & DISCUSSIONS =================

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  college_id TEXT NOT NULL REFERENCES colleges(id),
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'campus-life'
    CHECK (category IN ('academic', 'campus-life', 'research', 'events', 'clubs')),
  visibility TEXT NOT NULL DEFAULT 'campus'
    CHECK (visibility IN ('campus', 'public', 'connections')),
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  likes_count INT NOT NULL DEFAULT 0,
  comments_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_college_created ON posts (college_id, created_at DESC);

CREATE TABLE IF NOT EXISTS post_likes (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_saves (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  college_id TEXT NOT NULL REFERENCES colleges(id),
  title TEXT NOT NULL,
  media_url TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================= 3. EXPLORE, PROJECTS & COMMUNITIES =================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  college_id TEXT NOT NULL REFERENCES colleges(id),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  is_seeking_teammates BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id TEXT NOT NULL REFERENCES colleges(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_official_society BOOLEAN NOT NULL DEFAULT FALSE,
  member_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_memberships (
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (community_id, user_id)
);

-- ================= 4. CAMPUS MARKETPLACE =================

CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  college_id TEXT NOT NULL REFERENCES colleges(id),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 4 AND 80),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 1000),
  category TEXT NOT NULL CHECK (
    category IN ('books', 'electronics', 'accessories', 'hostel_essentials', 'stationery', 'free_items', 'other')
  ),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sell', 'exchange', 'free')),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair')),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0 AND price <= 10000),
  currency TEXT NOT NULL DEFAULT '$',
  exchange_for TEXT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'reserved', 'sold', 'removed', 'under_review')),
  views_count INT NOT NULL DEFAULT 0,
  saved_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_college_status_created
  ON marketplace_listings (college_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_marketplace_search
  ON marketplace_listings USING GIN (to_tsvector('english', title || ' ' || description));

CREATE TABLE IF NOT EXISTS marketplace_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS marketplace_bookmarks (
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (listing_id, user_id)
);

CREATE TABLE IF NOT EXISTS marketplace_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewed', 'dismissed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (listing_id, reporter_id)
);

CREATE TABLE IF NOT EXISTS blocked_sellers (
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_seller_id)
);

-- ================= 5. PEER CHATS & NOTIFICATIONS =================

CREATE TABLE IF NOT EXISTS chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'marketplace' CHECK (category IN ('marketplace', 'academic')),
  listing_id UUID REFERENCES marketplace_listings(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_participants (
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  unread_count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_thread_created
  ON chat_messages (thread_id, created_at ASC);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('marketplace', 'social', 'system')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  target_route TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================= 6. ROW-LEVEL SECURITY (CAMPUS ISOLATION) =================

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (Supabase auth.uid() compatible)
CREATE POLICY "Campus-scoped active marketplace visibility"
  ON marketplace_listings FOR SELECT
  USING (
    status IN ('active', 'reserved', 'sold')
    AND college_id = (SELECT college_id FROM profiles WHERE id = auth.uid())
    AND seller_id NOT IN (
      SELECT blocked_seller_id FROM blocked_sellers WHERE blocker_id = auth.uid()
    )
    OR seller_id = auth.uid()
  );

CREATE POLICY "Only verified owners can modify listings"
  ON marketplace_listings FOR ALL
  USING (seller_id = auth.uid())
  WITH CHECK (
    seller_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND college_verification_status = 'verified'
    )
  );
