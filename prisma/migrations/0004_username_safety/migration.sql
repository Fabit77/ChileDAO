ALTER TABLE "public"."Profile"
ADD COLUMN "usernameChangedAt" TIMESTAMP(3);

ALTER TABLE "public"."User"
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "privacyAcceptedAt" TIMESTAMP(3);

CREATE TABLE "public"."ProfileUsernameHistory" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfileUsernameHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProfileUsernameHistory_username_key"
ON "public"."ProfileUsernameHistory"("username");

CREATE INDEX "ProfileUsernameHistory_profileId_idx"
ON "public"."ProfileUsernameHistory"("profileId");

ALTER TABLE "public"."ProfileUsernameHistory"
ADD CONSTRAINT "ProfileUsernameHistory_profileId_fkey"
FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
