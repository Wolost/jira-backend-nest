/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Projects_code_key` ON `Projects`(`code`);
