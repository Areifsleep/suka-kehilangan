/*
  Warnings:

  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `role_permissions` DROP FOREIGN KEY `role_permissions_permission_id_fkey`;

-- DropForeignKey
ALTER TABLE `role_permissions` DROP FOREIGN KEY `role_permissions_role_id_fkey`;

-- AlterTable
ALTER TABLE `reports` ADD COLUMN `additional_notes` TEXT NULL,
    ADD COLUMN `approved_at` TIMESTAMP(6) NULL,
    ADD COLUMN `approved_by_user_id` VARCHAR(255) NULL,
    ADD COLUMN `lost_date` DATE NULL,
    ADD COLUMN `lost_time` VARCHAR(5) NULL,
    ADD COLUMN `rejection_reason` TEXT NULL,
    ADD COLUMN `specific_location` VARCHAR(255) NULL,
    ADD COLUMN `verified_at` TIMESTAMP(6) NULL,
    ADD COLUMN `verified_by_user_id` VARCHAR(255) NULL,
    MODIFY `report_status` ENUM('OPEN', 'CLAIMED', 'CLOSED', 'PENDING_VERIFICATION', 'REJECTED') NOT NULL DEFAULT 'PENDING_VERIFICATION';

-- AlterTable
ALTER TABLE `user_profiles` ADD COLUMN `phone_number` VARCHAR(20) NULL;

-- DropTable
DROP TABLE `permissions`;

-- DropTable
DROP TABLE `role_permissions`;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_verified_by_user_id_fkey` FOREIGN KEY (`verified_by_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_approved_by_user_id_fkey` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
