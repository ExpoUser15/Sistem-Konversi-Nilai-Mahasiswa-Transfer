-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 26, 2024 at 10:49 AM
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
  `sks_tujuan` int(5) NOT NULL,
  `nilai_tujuan` varchar(15) NOT NULL,
  `id_mahasiswa` varchar(255) NOT NULL,
  `tanggal` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_conversions`
--

INSERT INTO `tb_conversions` (`id_konversi`, `mk_asal`, `sks_asal`, `nilai_asal`, `id_mk`, `sks_tujuan`, `nilai_tujuan`, `id_mahasiswa`, `tanggal`) VALUES
('K00000006', 'Mdfdf', 3, 'A', 'SI-105', 3, 'A', 'MT00000002', '2024-09-04'),
('K00000007', 'Algoritma', 3, 'B', 'SI-206', 2, 'B', 'MT00000003', '2024-09-04'),
('K00000008', 'Matematika', 3, 'A', 'SI-105', 3, 'A', 'MT00000001', '2024-09-04');

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
-- Table structure for table `tb_documents`
--

CREATE TABLE `tb_documents` (
  `id_dokumen` varchar(20) NOT NULL,
  `dokumen` varchar(255) DEFAULT NULL,
  `formulir` varchar(255) DEFAULT NULL,
  `daftar_konversi` varchar(255) DEFAULT NULL,
  `id_mahasiswa` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_documents`
--

INSERT INTO `tb_documents` (`id_dokumen`, `dokumen`, `formulir`, `daftar_konversi`, `id_mahasiswa`) VALUES
('Doc00000002', NULL, NULL, NULL, 'MT00000002'),
('Doc00000003', NULL, NULL, NULL, 'MT00000003'),
('Doc00000004', NULL, NULL, NULL, 'MT00000001');

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
('File00000001', 'http://localhost:3000/file/transkrip-1729530409936.jpeg', 'http://localhost:3000/file/kk-1729510084077.jpg', 'http://localhost:3000/file/ktp-1729527866489.jpg', 'http://localhost:3000/file/ijazah-1729509070859.jpeg', 'http://localhost:3000/file/surat_pindah-1727544578697.jpeg', 'MT00000001'),
('File00000002', 'http://localhost:3000/file/transkrip-1727857098148.jpeg', 'http://localhost:3000/file/kk-1727857098107.jpg', 'http://localhost:3000/file/ktp-1727857098152.jpeg', 'http://localhost:3000/file/ijazah-1727857098110.jpg', 'http://localhost:3000/file/surat_pindah-1727857098150.jpeg', 'MT00000002'),
('File00000003', 'http://localhost:3000/file/transkrip-1729530446606.jpeg', 'http://localhost:3000/file/kk-1727878475813.jpg', 'http://localhost:3000/file/ktp-1727878475871.jpeg', 'http://localhost:3000/file/ijazah-1727878475823.jpg', 'http://localhost:3000/file/surat_pindah-1727878475870.jpeg', 'MT00000003'),
('File00000004', 'http://localhost:3000/file/transkrip-1729530259668.jpeg', 'http://localhost:3000/file/kk-1729529977511.jpg', 'http://localhost:3000/file/ktp-1729529099849.jpeg', 'http://localhost:3000/file/ijazah-1729508975290.jpg', 'http://localhost:3000/file/surat_pindah-1729508975309.jpeg', 'MT00000004');

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
  `id_mahasiswa` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_recapitulations`
--

INSERT INTO `tb_recapitulations` (`id_recap`, `sisa_mk`, `total_hasil_konversi`, `total_sks_asal`, `total_sks_tujuan`, `semester`, `report`, `id_mahasiswa`, `tanggal`) VALUES
('Recap00000002', '50 MK', '1 MK', 3, 3, '', 'http://localhost:3000/file/report/Test-Laporan_Konversi_Nilai-1729931216853.pdf', 'MT00000003', '2024-09-26'),
('Recap00000003', '50 MK', '1 MK', 3, 3, '', 'http://localhost:3000/file/report/Gideon Marchell-Laporan_Konversi_Nilai-1728009192812.pdf', 'MT00000001', '2024-09-04');

-- --------------------------------------------------------

--
-- Table structure for table `tb_semesters`
--

CREATE TABLE `tb_semesters` (
  `id_semester` varchar(20) NOT NULL,
  `id_mk` varchar(20) NOT NULL,
  `semester` varchar(20) NOT NULL,
  `id_mahasiswa` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_semesters`
--

INSERT INTO `tb_semesters` (`id_semester`, `id_mk`, `semester`, `id_mahasiswa`) VALUES
('S00000001', 'SI-303', '3', 'MT00000001'),
('S00000002', 'SI-306', '1', 'MT00000001'),
('S00000003', 'SI-207', '2', 'MT00000001'),
('S00000004', 'SI-203', '3', 'MT00000001'),
('S00000005', 'SI-204', '3', 'MT00000001'),
('S00000006', 'SI-101', '5', 'MT00000001'),
('S00000007', 'SI-201', '3', 'MT00000003'),
('S00000008', 'SI-203', '4', 'MT00000003');

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
('MT00000001', 'Gideon Marchell', '11111111', 'marchellmanobi@gmail.com', 'Universitas Komputer', 'Teknik', 'Informatika', 'Sistem Informasi', '2024-08-29', 'Converted'),
('MT00000002', 'Doni', '2020rb0506', 'marchellmanobi@gmail.com', 'Universitas Komputer', 'Teknik', 'Informatika', 'Sistem Informasi', '2024-09-02', 'Converted'),
('MT00000003', 'Test', '2-0021n12', 'marchellmanobi@gmail.com', 'Universitas Komputer', 'Teknik', 'Informatika', 'Sistem Informasi', '2024-09-02', 'Converted'),
('MT00000004', 'Jeff', '202000301', 'jeff@gmail.com', 'Universitas Komputer', 'Teknik', 'Informatika', 'Sistem Informasi', '2024-09-21', 'Pending');

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
-- Indexes for table `tb_documents`
--
ALTER TABLE `tb_documents`
  ADD PRIMARY KEY (`id_dokumen`);

--
-- Indexes for table `tb_files`
--
ALTER TABLE `tb_files`
  ADD PRIMARY KEY (`id_berkas`),
  ADD KEY `id_mahasiswa` (`id_mahasiswa`);

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
