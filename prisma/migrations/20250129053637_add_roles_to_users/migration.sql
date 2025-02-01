/*
  Warnings:

  - A unique constraint covering the columns `[taskId]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `FK_a396efb8f415c1b4970cdea6d4f`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `FK_b6146961ce2699a63b5bd227a95`;

-- AlterTable
ALTER TABLE `projects` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `code` VARCHAR(191) NOT NULL,
    MODIFY `title` VARCHAR(191) NOT NULL,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `isCompleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `tasks` ALTER COLUMN `updatedAt` DROP DEFAULT,
    MODIFY `taskId` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'team_member';

-- CreateIndex
CREATE UNIQUE INDEX `tasks_taskId_key` ON `tasks`(`taskId`);

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `lovs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_priorityId_fkey` FOREIGN KEY (`priorityId`) REFERENCES `lovs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
