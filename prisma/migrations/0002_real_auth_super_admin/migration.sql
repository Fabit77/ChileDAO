-- Real Supabase identities and an explicit platform-owner role.
ALTER TYPE "public"."MembershipRole" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';

ALTER TABLE "public"."User"
ADD COLUMN "authId" TEXT,
ADD COLUMN "githubUsername" TEXT;

-- Existing demo rows are intentionally removed before authId becomes required.
-- This migration is for the production cut-over requested by the product owner.
TRUNCATE TABLE "public"."User" CASCADE;

ALTER TABLE "public"."User" ALTER COLUMN "authId" SET NOT NULL;
CREATE UNIQUE INDEX "User_authId_key" ON "public"."User"("authId");
CREATE UNIQUE INDEX "User_githubUsername_key" ON "public"."User"("githubUsername");
