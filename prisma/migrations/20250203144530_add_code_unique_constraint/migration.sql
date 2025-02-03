/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `projects_code_key` ON `projects`(`code`);
