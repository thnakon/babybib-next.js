/*
  Warnings:

  - You are about to drop the column `isLISStudent` on the `User` table. All the data in the column will be lost.
  - Made the column `orgType` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `isLISStudent`,
    ADD COLUMN `isLisStudent` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `otherOrgType` VARCHAR(191) NULL,
    MODIFY `orgType` VARCHAR(191) NOT NULL,
    MODIFY `province` VARCHAR(191) NOT NULL;
