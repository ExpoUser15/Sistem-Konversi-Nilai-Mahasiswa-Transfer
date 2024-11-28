-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2024 at 01:58 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_konversi_nilai`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_conversions`
--

CREATE TABLE `tb_conversions` (
  `id_konversi` varchar(255) NOT NULL,
  `mk_asal` varchar(100) NOT NULL,
  `sks_asal` int(10) NOT NULL,
  `nilai_asal` varchar(5) NOT NULL,
  `id_mk` varchar(10) NOT NULL,
  `nilai_tujuan` varchar(15) NOT NULL,
  `id_mahasiswa` varchar(255) NOT NULL,
  `tanggal` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_courses`
--

CREATE TABLE `tb_courses` (
  `id_mk` varchar(10) NOT NULL,
  `mata_kuliah` varchar(255) NOT NULL,
  `sks` int(4) NOT NULL,
  `semester` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_courses`
--

INSERT INTO `tb_courses` (`id_mk`, `mata_kuliah`, `sks`, `semester`) VALUES
('SI-101', 'Pendidikan Agama', 2, '1'),
('SI-102', 'Pendidikan Pancasila', 2, '1'),
('SI-103', 'Bahasa Indonesia', 2, '1'),
('SI-104', 'Bahasa Inggris Dasar', 2, '1'),
('SI-105', 'Matematika', 3, '1'),
('SI-106', 'Ilmu Sosial Dasar', 2, '1'),
('SI-107', 'Dasar-Dasar Pemrograman', 3, '1'),
('SI-108', 'Pengantar Sistem dan Teknologi Informasi', 3, '1'),
('SI-201', 'Etika Kristen', 2, '2'),
('SI-202', 'Bahasa Inggris Profesi I', 2, '2'),
('SI-203', 'Pendidikan Kewarganegaraan', 2, '2'),
('SI-204', 'Etika Komputer', 3, '2'),
('SI-205', 'Matematika Diskrit', 3, '2'),
('SI-206', 'Algoritma dan Struktur Data', 3, '2'),
('SI-207', 'Organisasi Komputer', 3, '2'),
('SI-208', 'Pendidikan Karakter', 2, '2'),
('SI-301', 'Bahasa Inggris Profesi II', 2, '3'),
('SI-302', 'Manajemen dan Bisnis', 2, '3'),
('SI-303', 'Algoritma dan Struktur Data Lanjutan', 3, '3'),
('SI-304', 'Keamanan Komputer', 3, '3'),
('SI-305', 'Sistem Operasi', 3, '3'),
('SI-306', 'Konsep Sistem Informasi', 3, '3'),
('SI-307', 'Jaringan Komputer', 3, '3'),
('SI-308', 'Sistem Berkas', 3, '3'),
('SI-402', 'Statistik', 2, '4'),
('SI-403', 'Sistem Informasi Manajemen', 3, '4'),
('SI-404', 'Pengantar Basis Data', 3, '4'),
('SI-405', 'Riset Operasi', 3, '4'),
('SI-406', 'Multimedia', 3, '4'),
('SI-407', 'Interaksi Manusia dan Komputer', 3, '4'),
('SI-408', 'Sistem Terdistribusi', 3, '4'),
('SI-501', 'Pengelolaan Sistem Informasi', 3, '5'),
('SI-502', 'Pemrograman Web', 3, '5'),
('SI-503', 'Rekayasa Perangkat Lunak', 3, '5'),
('SI-504', 'Pemrograman Visual', 3, '5'),
('SI-505', 'Sistem Basis Data', 3, '5'),
('SI-506', 'Sistem Informasi Geografis', 3, '5'),
('SI-507', 'Sistem Pendukung Keputusan', 3, '5'),
('SI-601', 'Metode Penelitian', 3, '6'),
('SI-602', 'Semantik Web', 3, '6'),
('SI-603', 'Pengelolaan Proyek Sistem Informasi', 3, '6'),
('SI-604', 'Technopreneurship', 3, '6'),
('SI-605', 'Pemrograman Berbasis Objek', 3, '6'),
('SI-606', 'Sistem Pakar', 3, '6'),
('SI-607', 'Data Mining', 3, '6'),
('SI-701', 'Knowledge Management', 3, '7'),
('SI-702', 'Kerja Praktek', 3, '7'),
('SI-703', 'Audit SI', 3, '7'),
('SI-704', 'Manajemen Layanan IT', 3, '7'),
('SI-801', 'Kuliah Kerja Nyata', 3, '8'),
('SI-802', 'Skripsi', 6, '8');

-- --------------------------------------------------------

--
-- Table structure for table `tb_files`
--

CREATE TABLE `tb_files` (
  `id_berkas` varchar(20) NOT NULL,
  `transkrip_nilai` varchar(255) NOT NULL,
  `kk` varchar(255) NOT NULL,
  `ktp` varchar(255) NOT NULL,
  `ijazah` varchar(255) NOT NULL,
  `surat_pindah` varchar(255) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_files`
--

INSERT INTO `tb_files` (`id_berkas`, `transkrip_nilai`, `kk`, `ktp`, `ijazah`, `surat_pindah`, `id_mahasiswa`) VALUES
('File00000001', 'http://localhost:3000/file/transkrip-1732592582927.jpeg', 'http://localhost:3000/file/kk-1732592582879.jpg', 'http://localhost:3000/file/ktp-1732592582890.jpeg', 'http://localhost:3000/file/ijazah-1732592582899.jpg', 'http://localhost:3000/file/surat_pindah-1732592582930.jpeg', 'MT00000001'),
('File00000002', 'http://localhost:3000/file/transkrip-1732798392294.jpeg', 'http://localhost:3000/file/kk-1732798392279.jpg', 'http://localhost:3000/file/ktp-1732798392292.jpeg', 'http://localhost:3000/file/ijazah-1732798392282.jpg', 'http://localhost:3000/file/surat_pindah-1732798392293.jpeg', 'MT00000002');

-- --------------------------------------------------------

--
-- Table structure for table `tb_leaders`
--

CREATE TABLE `tb_leaders` (
  `kode` varchar(5) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `jabatan` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_leaders`
--

INSERT INTO `tb_leaders` (`kode`, `nama`, `jabatan`) VALUES
('1', 'Frits G. J. Rupilele, ST.,M.Cs', 'Ketua Program Studi'),
('2', 'Iriene S. Rajagukguk, S.Si.,M.Cs', 'Dekan'),
('3', 'Sherly Gaspersz, S.Pd.,M.Pd', 'Wakil Rektor'),
('4', 'S. Haurissa, SE', 'Akademik');

-- --------------------------------------------------------

--
-- Table structure for table `tb_recapitulations`
--

CREATE TABLE `tb_recapitulations` (
  `id_recap` varchar(255) NOT NULL,
  `sisa_mk` varchar(25) NOT NULL,
  `total_hasil_konversi` varchar(25) NOT NULL,
  `total_sks_asal` int(10) NOT NULL,
  `total_sks_tujuan` int(10) NOT NULL,
  `semester` varchar(5) NOT NULL,
  `report` varchar(255) NOT NULL,
  `formulir` varchar(255) NOT NULL,
  `upload` varchar(255) DEFAULT NULL,
  `id_mahasiswa` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_semesters`
--

CREATE TABLE `tb_semesters` (
  `id_semester` varchar(20) NOT NULL,
  `id_mk` varchar(20) NOT NULL,
  `penempatan` varchar(20) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_students`
--

CREATE TABLE `tb_students` (
  `id_mahasiswa` varchar(10) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nim` varchar(10) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `pt_asal` varchar(100) NOT NULL,
  `fakultas` varchar(100) NOT NULL,
  `prodi` varchar(100) NOT NULL,
  `prodi_tujuan` varchar(100) NOT NULL,
  `tanggal` varchar(20) NOT NULL,
  `status` enum('Pending','Converted') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_students`
--

INSERT INTO `tb_students` (`id_mahasiswa`, `nama`, `nim`, `email`, `pt_asal`, `fakultas`, `prodi`, `prodi_tujuan`, `tanggal`, `status`) VALUES
('MT00000001', 'Lino', '2020RB0020', 'jeff@gmail.com', 'ssaddsa', 'Teknik', 'Informatika', 'Sistem Informasi', '2024-11-26', 'Pending'),
('MT00000002', 'Gideon', '202010i2', 'marchellmanobi@gmail.com', 'Universitas Komputer', 'Teknik', 'Informatika', 'Sistem Informasi', '2024-11-28', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `tb_users`
--

CREATE TABLE `tb_users` (
  `id_pengguna` varchar(10) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user` enum('Akademik','Kaprodi') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_users`
--

INSERT INTO `tb_users` (`id_pengguna`, `username`, `password`, `user`) VALUES
('K00000011', 'Jeff', '$2b$10$rZqauYWqt1fyFfTKjZz8LOrU7G6wKKPQieB4MTnLem/w7xAjD8Vdy', 'Akademik'),
('K002', 'Doni', '$2b$10$rZqauYWqt1fyFfTKjZz8LOrU7G6wKKPQieB4MTnLem/w7xAjD8Vdy', 'Kaprodi');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_conversions`
--
ALTER TABLE `tb_conversions`
  ADD PRIMARY KEY (`id_konversi`);

--
-- Indexes for table `tb_courses`
--
ALTER TABLE `tb_courses`
  ADD PRIMARY KEY (`id_mk`);

--
-- Indexes for table `tb_files`
--
ALTER TABLE `tb_files`
  ADD PRIMARY KEY (`id_berkas`),
  ADD KEY `id_mahasiswa` (`id_mahasiswa`);

--
-- Indexes for table `tb_leaders`
--
ALTER TABLE `tb_leaders`
  ADD PRIMARY KEY (`kode`);

--
-- Indexes for table `tb_recapitulations`
--
ALTER TABLE `tb_recapitulations`
  ADD PRIMARY KEY (`id_recap`);

--
-- Indexes for table `tb_semesters`
--
ALTER TABLE `tb_semesters`
  ADD PRIMARY KEY (`id_semester`);

--
-- Indexes for table `tb_students`
--
ALTER TABLE `tb_students`
  ADD PRIMARY KEY (`id_mahasiswa`);

--
-- Indexes for table `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`id_pengguna`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_files`
--
ALTER TABLE `tb_files`
  ADD CONSTRAINT `tb_files_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `tb_students` (`id_mahasiswa`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
