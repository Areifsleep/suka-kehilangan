/*
  Warnings:

  - You are about to drop the column `lokasi_ditemukan` on the `barang_temuan` table. All the data in the column will be lost.
  - Made the column `lokasi_umum` on table `barang_temuan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `barang_temuan` DROP COLUMN `lokasi_ditemukan`,
    MODIFY `lokasi_umum` VARCHAR(255) NOT NULL;
