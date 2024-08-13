-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 13, 2024 at 07:53 AM
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
  `sks_asal` varchar(10) NOT NULL,
  `nilai_asal` varchar(5) NOT NULL,
  `id_mk` varchar(10) NOT NULL,
  `sks_tujuan` varchar(5) NOT NULL,
  `nilai_tujuan` int(5) NOT NULL,
  `file` varchar(255) NOT NULL,
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
  `sks` varchar(2) NOT NULL,
  `semester` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_courses`
--

INSERT INTO `tb_courses` (`id_mk`, `mata_kuliah`, `sks`, `semester`) VALUES
('MK001', 'Matematika', '3', '1'),
('MK003', 'Pengantar Sistem dan Teknologi Informasi', '3', '1'),
('MK006', 'Matematika Diskrit', '3', '2');

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
('File001', 'http://localhost:3000/file/transkrip-1723528291693.jpg', 'http://localhost:3000/file/kk-1723528291669.jpg', 'http://localhost:3000/file/ktp-1723528291672.PNG', 'http://localhost:3000/file/ijazah-1723528291679.PNG', 'http://localhost:3000/file/surat_pindah-1723528291682.jpg', 'MT001');

-- --------------------------------------------------------

--
-- Table structure for table `tb_log_activities`
--

CREATE TABLE `tb_log_activities` (
  `id_aktivitas` varchar(255) NOT NULL,
  `keterangan` varchar(255) NOT NULL,
  `tanggal` varchar(20) NOT NULL,
  `id_pengguna` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_log_activities`
--

INSERT INTO `tb_log_activities` (`id_aktivitas`, `keterangan`, `tanggal`, `id_pengguna`) VALUES
('00006bd9-4b0c-4261-b6a6-76c8b285fad1', 'Menambahkan mahasiswa baru', '2024-07-13 14:51:31', 0),
('01ae21fd-54d6-4a20-8de6-9afb58b482b8', 'Mengakses halaman mahasiswa', '2024-07-11 18:39:19', 0),
('01d894a9-3ab5-4027-930c-8dae1acf5945', 'Mengakses halaman mata kuliah', '2024-07-10 22:28:54', 1),
('02537a7b-e2a1-47f3-8e9b-067c2e70680c', 'Mengakses halaman log aktvitas', '2024-07-10 22:05:48', 1),
('06a391b1-d276-483c-b2f8-ea701ebca6a8', 'Menambahkan mahasiswa baru', '2024-07-13 02:35:52', 0),
('0b2a8587-f913-4d0d-8988-c8c113cd02fe', 'Menambahkan mahasiswa baru', '2024-07-13 14:30:39', 0),
('0c1b6755-3677-4e98-abc1-cb9d4c0bb58a', 'Mengakses halaman mahasiswa', '2024-07-13 02:35:46', 0),
('102645d3-5f3e-41bb-8ba0-32d25e9e5bed', 'Mengubah mata kuliah \'Matematika\'', '2024-07-10 22:18:28', 1),
('10c120a6-2d16-41b1-b5a3-41061bf481aa', 'Mengakses halaman mahasiswa', '2024-07-13 14:49:36', 0),
('13163782-9c33-46b5-9019-2a12add9bc07', 'Mengakses halaman mahasiswa', '2024-07-13 02:36:34', 0),
('13539233-61e9-4dc7-910d-772532725f24', 'Mengakses halaman mahasiswa', '2024-07-13 13:58:30', 0),
('191d4be8-49f3-4efd-b697-fa679e4162a7', 'Mengakses halaman mahasiswa', '2024-07-13 13:57:26', 0),
('1ae7716d-92bb-45c2-824c-7e459a932910', 'Mengakses halaman mahasiswa', '2024-07-13 14:34:15', 0),
('1b811ac3-3d0b-4a6a-9826-54fbe643a3fd', 'Berhasil melakukan login', '2024-07-11 13:26:34', 1),
('2711a7cc-d21d-42d8-8757-f4228510b6fa', 'Menambahkan mahasiswa baru', '2024-07-13 14:49:17', 0),
('29885117-9b49-47df-b153-88c222173752', 'Mengakses halaman mata kuliah', '2024-07-10 22:21:21', 1),
('2b697706-ae67-4428-989a-faaaf9624901', 'Mengakses halaman mata kuliah', '2024-07-10 22:17:13', 1),
('2bbc46d9-679d-4f6d-af1f-28e9cbd2420b', 'Menambahkan mahasiswa baru', '2024-07-13 14:30:02', 0),
('2c941054-a347-49e0-a992-3b7c9b6337bc', 'Mengakses halaman mata kuliah', '2024-07-10 21:48:47', 1),
('2cbbd355-fff0-4504-aecf-4119c89c765e', 'Menambahkan mahasiswa baru', '2024-07-13 14:32:18', 0),
('2d908682-19d1-4225-ac49-00a1d48f2b57', 'Mengakses halaman users', '2024-07-10 22:34:47', 1),
('2e10a094-070e-4b81-8d74-fb5bfee9f7e4', 'Gagal mengubah mahasiswa baru', '2024-07-13 13:57:30', 0),
('2e258b4b-c311-4656-bedf-aa40e75417a3', 'Mengakses halaman users', '2024-07-10 22:37:17', 1),
('30f04b66-b731-4bc0-9dce-901c1278e368', 'Gagal menambahkan mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:10:21', 1),
('3928747d-a329-4a95-8e3b-8a3f4db9a19d', 'Mengubah mata kuliah \'Kalkulus\'', '2024-07-10 22:17:19', 1),
('3d548c21-8819-4555-9f33-a9d44acda16f', 'Mengakses halaman log aktvitas', '2024-07-11 12:49:10', 1),
('3de7146a-cc80-4384-b0ae-7849514593de', 'Mengakses halaman mata kuliah', '2024-07-10 22:27:21', 1),
('3ec5069b-c7b5-4489-b7b2-3e19466539dc', 'Mengakses halaman mahasiswa', '2024-07-13 14:50:47', 0),
('41f8799f-6d81-4f4f-b8b3-5426433ef264', 'Berhasil melakukan login', '2024-07-13 00:48:48', 0),
('46786c4f-928e-46c6-b46a-91dc01da5175', 'Menghapus mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:10:49', 1),
('46e43cc9-ebb4-440d-bf5d-0fe6886e1090', 'Mengakses halaman mahasiswa', '2024-07-13 14:47:03', 0),
('4cbb4403-6506-4080-b891-4141cce8f04e', 'Mengakses halaman mahasiswa', '2024-07-13 14:45:21', 0),
('4f8413fd-9541-4f93-b5df-751132482f32', 'Mengakses halaman mahasiswa', '2024-07-13 01:20:39', 0),
('4fbe7f07-43ec-465a-b926-589f9f486a83', 'Mengakses halaman mahasiswa', '2024-07-13 01:21:10', 0),
('533f6565-fefb-467a-9b88-05168a48ff1e', 'Mengakses halaman mahasiswa', '2024-07-13 14:32:35', 0),
('551c2829-f4bd-422d-88ea-beae28a8e737', 'Gagal menambahkan mahasiswa baru', '2024-07-11 18:43:21', 0),
('57b205f8-3aa7-4745-a23f-2322a7cd3473', 'Mengakses halaman mahasiswa', '2024-07-13 14:49:08', 0),
('58d38cdc-e2f5-403b-bf15-1d1ab147cd90', 'Mengubah mata kuliah \'Statistik\'', '2024-07-10 22:21:35', 1),
('5b23d5a0-4c55-4f6a-90fb-39792a7ae4f6', 'Menambahkan mahasiswa baru', '2024-07-13 14:50:51', 0),
('5cc6cc42-95f0-47a6-8c66-70d5c4d0da75', 'Mengakses halaman mata kuliah', '2024-07-10 22:29:42', 1),
('5fb3eb19-1dba-4e45-86ff-b7b6bad3cc88', 'Menambahkan mahasiswa baru', '2024-07-13 00:49:19', 0),
('603f775d-8389-4b2b-8a4a-8d804182154b', 'Mengakses halaman mahasiswa', '2024-07-13 01:18:29', 0),
('61fa541b-74b2-4024-9cb2-3221acb562fc', 'Gagal menghapus: mata kuliah tidak ada.', '2024-07-10 21:28:28', 1),
('62e16752-3c0f-4e09-8771-2b844e077e98', 'Berhasil melakukan login', '2024-07-10 21:59:22', 1),
('63192adc-6d5d-4f39-8588-7ef043215ff0', 'Mengakses halaman mata kuliah', '2024-07-10 22:34:32', 1),
('64170b51-d47f-430f-b9be-c1fac409f07e', 'Menghapus mahasiswa', '2024-07-13 14:31:19', 0),
('64705e74-0344-49fc-bf03-87492480542e', 'Mengakses halaman log aktvitas', '2024-07-10 22:07:21', 1),
('673af05b-7a1d-4e40-853d-4b3ab763a84d', 'Gagal menghapus: mata kuliah tidak ada.', '2024-07-10 22:11:34', 1),
('686f438f-dbe2-4b4f-9613-8e84fb04cb6a', 'Mengakses halaman mahasiswa', '2024-07-13 14:51:18', 0),
('6c9b008c-e247-4a16-9102-0f2cd44a0b1f', 'Menambahkan mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:11:40', 1),
('6ded784b-6804-4427-a93a-ccf3d6824ed1', 'Menghapus mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:07:39', 1),
('710b641f-668d-4bea-9ae9-674cb15e3611', 'Berhasil melakukan login', '2024-07-11 18:35:43', 0),
('7200444e-03d1-488f-ac13-9f2746f8e11a', 'Mengakses halaman mata kuliah', '2024-07-10 21:28:20', 1),
('72869607-cfdb-4832-8efe-ac46359db75d', 'Mengubah mata kuliah \'Matematika\'', '2024-07-10 22:21:25', 1),
('74cb21d5-97f5-4ada-b88d-bfb6d1eb7888', 'Mengakses halaman mahasiswa', '2024-07-13 14:29:54', 0),
('750863a9-519e-4ac6-a4f3-bbb88bf4140d', 'Mengakses halaman users', '2024-07-10 22:41:41', 1),
('758a4cd7-7dc5-457c-bb29-55d5bb35cf5c', 'Berhasil melakukan login', '2024-07-13 13:07:47', 0),
('7eac8cb4-793c-441f-8b51-511bc0edf6be', 'Berhasil melakukan login', '2024-07-13 00:07:13', 0),
('7ee187e1-227a-454e-9603-9fabbf3ffc85', 'Mengakses halaman mata kuliah', '2024-07-10 22:18:24', 1),
('7f928703-c9b0-48ce-a3da-69e837b859d2', 'Menambahkan mahasiswa baru', '2024-07-13 14:47:07', 0),
('83ebe3ec-b695-4452-8c0b-4cac77a66581', 'Menambahkan mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:10:54', 1),
('84bf5b5f-4ca9-4537-966d-a00eceb135b3', 'Mengakses halaman mata kuliah', '2024-07-10 22:11:30', 1),
('898393ab-bfd0-4178-abd0-5f345e6b3805', 'Mengakses halaman log aktvitas', '2024-07-11 12:44:14', 1),
('89f8962f-728d-432b-929d-06dad3f3751c', 'Mengakses halaman mata kuliah', '2024-07-10 22:34:22', 1),
('8cb715e3-358f-4ece-a5a0-d38d08cdd4d9', 'Berhasil melakukan login', '2024-07-10 21:54:52', 1),
('8dc364df-55a8-4a2d-bef5-6583e5a59fd0', 'Mengakses halaman mahasiswa', '2024-07-13 02:21:19', 0),
('8f348cf5-7d19-4f51-9e67-cc8fa8b01632', 'Mengakses halaman mahasiswa', '2024-07-13 00:49:07', 0),
('95baa1f8-e09e-45df-a6fd-87c0382e63b1', 'Mengakses halaman log aktvitas', '2024-07-10 21:13:06', 1),
('961bbd01-ff6f-4fbd-abeb-9e4fcead9a5c', 'Mengakses halaman mata kuliah', '2024-07-10 22:30:23', 1),
('9678de60-2f1f-4e75-8a1f-5f96cfb2c7d1', 'Mengakses halaman mahasiswa', '2024-07-13 14:51:37', 0),
('98f98551-0f97-4a3f-aed7-50b37a484cd4', 'Mengakses halaman log aktvitas', '2024-07-10 21:29:10', 1),
('9a66fe5e-90fc-4a7f-9898-fdae745f7634', 'Mengubah mata kuliah data \'Matematika Diskrit\'', '2024-07-10 22:29:46', 1),
('9acbcc78-dcec-44c9-b9c9-3bc38fef2cf5', 'Berhasil melakukan login', '2024-07-10 21:49:14', 1),
('9cf5678f-682f-42c1-8220-89c459b29386', 'Mengakses halaman mahasiswa', '2024-07-13 13:07:52', 0),
('a0fb8994-03e7-4311-8306-c163d8e4e7e8', 'Mengakses halaman mahasiswa', '2024-07-13 01:21:31', 0),
('a1404866-38bd-47b3-96a5-b3d8a3ae9592', 'Mengakses halaman mahasiswa', '2024-07-13 01:22:48', 0),
('a25745f1-bb7c-4354-b5d9-de07b2f94872', 'Mengakses halaman mahasiswa', '2024-07-13 01:21:58', 0),
('a6a39242-f01c-4ead-8362-cf47d5db115d', 'Mengakses halaman mata kuliah', '2024-07-10 22:10:15', 1),
('a9a10b2f-13fd-468b-9d98-05e82d75d054', 'Gagal menambahkan mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:07:30', 1),
('abed9664-3dc5-42c0-b3c0-bea4209a607d', 'Mengakses halaman mahasiswa', '2024-07-13 02:39:27', 0),
('b6fe71fb-e019-46a1-b335-ebb09d959e8a', 'Berhasil melakukan login', '2024-07-13 02:12:47', 0),
('bafb7fb0-58bd-4cd8-904d-007deb0d8e24', 'Mengakses halaman users', '2024-07-10 22:01:25', 1),
('bc46a524-3006-4985-a64f-ce70d5d50d8e', 'Mengakses halaman mata kuliah', '2024-07-10 22:33:46', 1),
('bd717fff-49ba-4408-95e9-8df88554bb73', 'Mengakses halaman mata kuliah', '2024-07-10 22:05:31', 1),
('bfe0676b-58ce-4543-9944-91d5c529d1fe', 'Mengakses halaman mahasiswa', '2024-07-13 02:15:24', 0),
('c337485d-30c4-4595-8050-0a12853b621f', 'Mengubah data user \'Dani\'', '2024-07-10 22:41:47', 1),
('c8ec0f5e-1495-4eb2-9df3-928d48e981e5', 'Mengubah mata kuliah data \'Matematika Diskrit\'', '2024-07-10 22:34:26', 1),
('c9223dd0-3761-4e7a-81b3-53693610d231', 'Menambahkan mahasiswa baru', '2024-07-13 14:30:52', 0),
('c9cb1e9b-3d2e-4261-9158-13970c029783', 'Berhasil melakukan login', '2024-07-10 22:01:12', 1),
('d5f564c2-2ec3-43fa-9e38-2db69607c0ef', 'Mengakses halaman users', '2024-07-10 22:35:47', 1),
('d63c982e-ea55-4622-ab39-7498a416f897', 'Mengakses halaman log aktvitas', '2024-07-10 22:42:28', 1),
('d7c02ca6-19f1-4267-803f-8bcabbd97d43', 'Menambahkan mahasiswa baru', '2024-07-13 02:39:32', 0),
('dfa4f20d-5930-497c-ba43-b0c08d895d4e', 'Gagal menambahkan mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 21:12:29', 1),
('dfc4ed7c-221e-4a30-a59d-e2bf9c198fa6', 'Mengakses halaman mahasiswa', '2024-07-13 01:20:23', 0),
('e36090e9-e00b-4f51-a033-d4092e48743e', 'Berhasil melakukan login', '2024-07-10 21:56:34', 1),
('e4c1b154-0983-4f39-b057-aca508f45e22', 'Gagal mengubah mahasiswa baru', '2024-07-13 14:16:47', 0),
('ebbd0b22-2a97-4bcb-91d0-2cf2151dec7b', 'Gagal menambahkan mahasiswa baru', '2024-07-11 18:40:10', 0),
('f1081b06-a063-48a9-9558-9bc4dcee5a3e', 'Mengakses halaman mahasiswa', '2024-07-13 14:34:28', 0),
('f1ff9f13-78ee-4d66-af9c-8b466e615689', 'Gagal menghapus: mata kuliah tidak ada.', '2024-07-10 22:05:38', 1),
('f537dfbc-c91f-448a-b504-33e88baf6e56', 'Menambahkan mahasiswa baru', '2024-07-13 14:31:39', 0),
('f6c6b0e6-4f3e-4a89-85ee-fc35b5a3671c', 'Menambahkan mata kuliah \'Statistik\'', '2024-07-10 22:12:38', 1),
('f808d6f2-4701-4cec-b5db-eee7ae2fa432', 'Mengakses halaman mata kuliah', '2024-07-10 21:12:00', 1),
('f918d28e-4491-4183-97fa-33c7b989b1bd', 'Mengakses halaman users', '2024-07-10 22:12:58', 1),
('fbf3626b-8026-440d-bee5-7e6b6743e58c', 'Gagal mengubah mahasiswa baru', '2024-07-13 14:16:57', 0),
('fc126460-2ad8-4e8f-9b0a-5c8db057b75e', 'Menambahkan mahasiswa baru', '2024-07-13 13:08:14', 0),
('fe04ca94-45c5-44e6-8e7f-bf1e17317dde', 'Mengakses halaman mahasiswa', '2024-07-13 13:08:26', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tb_recapitulations`
--

CREATE TABLE `tb_recapitulations` (
  `id_recap` varchar(255) NOT NULL,
  `total_hasil_konversi` int(5) NOT NULL,
  `total_sks` int(5) NOT NULL,
  `semester` varchar(5) NOT NULL,
  `id_mahasiswa` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_students`
--

CREATE TABLE `tb_students` (
  `id_mahasiswa` varchar(10) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nim` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `pt_asal` varchar(100) NOT NULL,
  `fakultas` varchar(100) NOT NULL,
  `prodi` varchar(100) NOT NULL,
  `prodi_tujuan` varchar(100) NOT NULL,
  `tanggal` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_students`
--

INSERT INTO `tb_students` (`id_mahasiswa`, `nama`, `nim`, `email`, `pt_asal`, `fakultas`, `prodi`, `prodi_tujuan`, `tanggal`) VALUES
('MT001', 'Gideon', '-', 'example@gmail.com', 'Victory', 'Komputer', 'Informatika', 'Sistem Informasi', '2024-07-13');

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
('1', 'Gideon', '$2b$10$IR2p1mIDwJ8kfkpAoNfs.evstSRMKEj0PZRugMPxgjFLHl4e/8eGW', 'Kaprodi'),
('A001', 'Damian', '$2b$10$gRA37pi1XJy6qnKa591xWO5dvZ/tk0ayMpTf45HvsxEnVZQg555wO', 'Akademik'),
('A003', 'Dani', '$2b$10$djaaC3Ju33Jgo3XC1gemvO00pmW5rj/X4qlaEVTuFvXeQjFvmvi5u', 'Akademik'),
('A004', 'Jack', '$2b$10$keF5MFYVovucSOGgTgkFxOkqrq4qrfdyFEZW/E2SF3hc76/IPorm2', 'Akademik'),
('A010', 'Doni', '$2b$10$M1D960o4l904u/.e5W5ImuPDQQ8/vDP4ewsqfpY4Tu0OsCo.lrYr2', 'Akademik');

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
-- Indexes for table `tb_log_activities`
--
ALTER TABLE `tb_log_activities`
  ADD PRIMARY KEY (`id_aktivitas`);

--
-- Indexes for table `tb_recapitulations`
--
ALTER TABLE `tb_recapitulations`
  ADD PRIMARY KEY (`id_recap`);

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
