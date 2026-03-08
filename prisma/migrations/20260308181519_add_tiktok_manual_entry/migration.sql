-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "platformUsername" TEXT,
    "platformId" TEXT,
    "isManualEntry" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_accounts" ("access_token", "expires_at", "id", "id_token", "platformId", "platformUsername", "provider", "providerAccountId", "refresh_token", "scope", "session_state", "token_type", "type", "userId") SELECT "access_token", "expires_at", "id", "id_token", "platformId", "platformUsername", "provider", "providerAccountId", "refresh_token", "scope", "session_state", "token_type", "type", "userId" FROM "accounts";
DROP TABLE "accounts";
ALTER TABLE "new_accounts" RENAME TO "accounts";
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");
CREATE TABLE "new_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "rawData" TEXT,
    "followerGrowth" INTEGER NOT NULL DEFAULT 0,
    "viewGrowth" INTEGER NOT NULL DEFAULT 0,
    "isManualEntry" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "metrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_metrics" ("date", "followerGrowth", "followers", "id", "platform", "rawData", "userId", "viewGrowth", "views") SELECT "date", "followerGrowth", "followers", "id", "platform", "rawData", "userId", "viewGrowth", "views" FROM "metrics";
DROP TABLE "metrics";
ALTER TABLE "new_metrics" RENAME TO "metrics";
CREATE INDEX "metrics_userId_platform_date_idx" ON "metrics"("userId", "platform", "date");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
