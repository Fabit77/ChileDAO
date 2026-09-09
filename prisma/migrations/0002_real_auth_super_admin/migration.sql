-- Real Supabase identities and an explicit platform-owner role.
ALTER TYPE "public"."MembershipRole" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';

ALTER TABLE "public"."User"
ADD COLUMN "authId" TEXT NOT NULL,
ADD COLUMN "githubUsername" TEXT;

-- No data is deleted here. On a non-empty legacy database, PostgreSQL will
-- stop this migration instead of inventing identities or removing users.
CREATE UNIQUE INDEX "User_authId_key" ON "public"."User"("authId");
CREATE UNIQUE INDEX "User_githubUsername_key" ON "public"."User"("githubUsername");
