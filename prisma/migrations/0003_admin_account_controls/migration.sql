-- Accounts are deactivated instead of being destructively removed so moderation
-- actions remain auditable and can be reversed by another superadmin.
ALTER TABLE "public"."User"
ADD COLUMN "deactivatedAt" TIMESTAMP(3);

CREATE INDEX "User_deactivatedAt_idx" ON "public"."User"("deactivatedAt");
