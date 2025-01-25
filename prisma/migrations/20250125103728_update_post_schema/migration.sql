/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Post` table. All the data in the column will be lost.
  - Added the required column `imageURL` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mealCycleVariant` to the `Post` table without a default value. This is not possible if the table is not empty.
  - The required column `postId` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `timestamp` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Post_name_idx";

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "imageURL" TEXT NOT NULL,
ADD COLUMN     "mealCycleVariant" TEXT NOT NULL,
ADD COLUMN     "postId" VARCHAR(30) NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("postId");
