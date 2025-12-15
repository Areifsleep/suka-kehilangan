-- CreateTable
CREATE TABLE `faculties` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `abbreviation` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `faculties_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `study_programs` (
    `id` VARCHAR(191) NOT NULL,
    `faculty_id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `level` ENUM('S1', 'S2', 'S3') NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `study_programs_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(255) NOT NULL,
    `role_id` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `last_update_password` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    INDEX `idx_username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profiles` (
    `user_id` VARCHAR(255) NOT NULL,
    `study_program_id` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `nim` VARCHAR(255) NULL,
    `nip` VARCHAR(255) NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `lokasi_pos` ENUM('POS_BARAT', 'POS_TIMUR') NULL,
    `phone_number` VARCHAR(20) NULL,

    UNIQUE INDEX `user_profiles_email_key`(`email`),
    UNIQUE INDEX `user_profiles_nim_key`(`nim`),
    UNIQUE INDEX `user_profiles_nip_key`(`nip`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(255) NOT NULL,
    `jti` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `hashed_refresh_token` VARCHAR(255) NOT NULL,
    `expires_at` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `sessions_jti_key`(`jti`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `revoked_jwts` (
    `jti` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`jti`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori_barang` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `deskripsi` TEXT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,

    UNIQUE INDEX `kategori_barang_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `barang_temuan` (
    `id` VARCHAR(191) NOT NULL,
    `pencatat_id` VARCHAR(255) NOT NULL,
    `penyerah_id` VARCHAR(255) NULL,
    `kategori_id` VARCHAR(255) NOT NULL,
    `nama_barang` VARCHAR(255) NOT NULL,
    `status` ENUM('BELUM_DIAMBIL', 'SUDAH_DIAMBIL') NOT NULL DEFAULT 'BELUM_DIAMBIL',
    `deskripsi` TEXT NULL,
    `lokasi_ditemukan` VARCHAR(255) NOT NULL,
    `tanggal_ditemukan` DATE NOT NULL,
    `lokasi_umum` VARCHAR(255) NULL,
    `lokasi_spesifik` VARCHAR(255) NULL,
    `perkiraan_waktu_ditemukan` VARCHAR(255) NULL,
    `nama_penemu` VARCHAR(255) NOT NULL,
    `nomor_hp_penemu` VARCHAR(50) NOT NULL,
    `identitas_penemu` VARCHAR(100) NULL,
    `email_penemu` VARCHAR(255) NULL,
    `catatan_penemu` TEXT NULL,
    `waktu_diambil` TIMESTAMP(6) NULL,
    `nama_pengambil` VARCHAR(255) NULL,
    `identitas_pengambil` VARCHAR(100) NULL,
    `kontak_pengambil` VARCHAR(50) NULL,
    `keterangan_klaim` TEXT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foto_barang` (
    `id` VARCHAR(191) NOT NULL,
    `barang_temuan_id` VARCHAR(255) NOT NULL,
    `url_gambar` VARCHAR(255) NOT NULL,
    `nama_file_asli` VARCHAR(255) NULL,
    `mime_type` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foto_bukti_klaim` (
    `id` VARCHAR(191) NOT NULL,
    `barang_temuan_id` VARCHAR(255) NOT NULL,
    `url_gambar` VARCHAR(255) NOT NULL,
    `nama_file_asli` VARCHAR(255) NULL,
    `mime_type` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `study_programs` ADD CONSTRAINT `study_programs_faculty_id_fkey` FOREIGN KEY (`faculty_id`) REFERENCES `faculties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_study_program_id_fkey` FOREIGN KEY (`study_program_id`) REFERENCES `study_programs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barang_temuan` ADD CONSTRAINT `barang_temuan_pencatat_id_fkey` FOREIGN KEY (`pencatat_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barang_temuan` ADD CONSTRAINT `barang_temuan_penyerah_id_fkey` FOREIGN KEY (`penyerah_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barang_temuan` ADD CONSTRAINT `barang_temuan_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_barang`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foto_barang` ADD CONSTRAINT `foto_barang_barang_temuan_id_fkey` FOREIGN KEY (`barang_temuan_id`) REFERENCES `barang_temuan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foto_bukti_klaim` ADD CONSTRAINT `foto_bukti_klaim_barang_temuan_id_fkey` FOREIGN KEY (`barang_temuan_id`) REFERENCES `barang_temuan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
