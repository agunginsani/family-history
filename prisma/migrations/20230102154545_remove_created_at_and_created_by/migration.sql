/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `RoleMenu` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `RoleMenu` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `User` table. All the data in the column will be lost.
  - The required column `id` was added to the `RoleMenu` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `RolePermission` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "createdAt",
DROP COLUMN "createdBy";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "createdAt",
DROP COLUMN "createdBy";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "createdAt",
DROP COLUMN "createdBy";

-- AlterTable
ALTER TABLE "RoleMenu" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "RoleMenu_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "createdBy";
