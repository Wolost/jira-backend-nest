-- CreateTable
CREATE TABLE `lovs` (
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('TASK_TYPE', 'TASK_PRIORITY') NOT NULL,
    `value` TEXT NOT NULL,
    `text` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` TEXT NOT NULL,
    `title` TEXT NOT NULL,
    `description` TEXT NULL,
    `isCompleted` TINYINT NOT NULL DEFAULT 0,
    `createdBy` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tasks` (
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taskId` TEXT NULL,
    `title` TEXT NOT NULL,
    `description` TEXT NULL,
    `reporterId` INTEGER NOT NULL,
    `assigneeId` INTEGER NULL,
    `projectId` INTEGER NOT NULL,
    `typeId` INTEGER NULL,
    `priorityId` INTEGER NULL,

    INDEX `FK_a396efb8f415c1b4970cdea6d4f`(`priorityId`),
    INDEX `FK_b6146961ce2699a63b5bd227a95`(`typeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` TEXT NOT NULL,
    `lastName` TEXT NOT NULL,
    `email` TEXT NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `language` VARCHAR(10) NOT NULL DEFAULT 'en-US',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `FK_a396efb8f415c1b4970cdea6d4f` FOREIGN KEY (`priorityId`) REFERENCES `lovs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `FK_b6146961ce2699a63b5bd227a95` FOREIGN KEY (`typeId`) REFERENCES `lovs`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

