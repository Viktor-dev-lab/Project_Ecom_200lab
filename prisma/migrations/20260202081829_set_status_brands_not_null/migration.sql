/*
  Warnings:

  - You are about to drop the column `tracking_number` on the `orders` table. All the data in the column will be lost.
  - The primary key for the `product_likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `product_id` on the `product_likes` table. All the data in the column will be lost.
  - The values [femail] on the enum `users_gender` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[trackingNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Made the column `status` on table `brands` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `created_id` to the `product_likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `tracking_number` ON `orders`;

-- AlterTable
ALTER TABLE `brands` MODIFY `status` ENUM('active', 'inactive', 'deleted') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `tracking_number`,
    ADD COLUMN `trackingNumber` VARCHAR(25) NULL,
    MODIFY `payment_method` ENUM('cod', 'zalo_pay') NULL DEFAULT 'cod';

-- AlterTable
ALTER TABLE `product_likes` DROP PRIMARY KEY,
    DROP COLUMN `product_id`,
    ADD COLUMN `created_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`created_id`, `user_id`);

-- AlterTable
ALTER TABLE `products` MODIFY `gender` ENUM('male', 'female', 'unisex', 'unknown') NULL DEFAULT 'unisex';

-- AlterTable
ALTER TABLE `users` MODIFY `gender` ENUM('male', 'female', 'unisex', 'unknown') NOT NULL DEFAULT 'male';

-- CreateIndex
CREATE UNIQUE INDEX `tracking_number` ON `orders`(`trackingNumber`);
