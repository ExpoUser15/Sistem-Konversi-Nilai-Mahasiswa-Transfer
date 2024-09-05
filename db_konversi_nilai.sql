-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2024 at 09:25 PM
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
('File00000001', 'http://localhost:3000/file/transkrip-1725564043366.jpg', 'http://localhost:3000/file/kk-1725558190435.png', 'http://localhost:3000/file/ktp-1725564234910.jpg', 'http://localhost:3000/file/ijazah-1725564266754.jpg', 'http://localhost:3000/file/surat_pindah-1725563918764.jpg', 'MT00000001');

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
('003377b0-5863-44cd-95a0-e4d18f743d28', 'Mengakses halaman mahasiswa', '2024-07-14 16:57:31', 0),
('01847837-de6f-4d37-a16e-e7478fa7dd2d', 'Mengakses halaman konversi', '2024-07-17 23:19:45', 1),
('01ae21fd-54d6-4a20-8de6-9afb58b482b8', 'Mengakses halaman mahasiswa', '2024-07-11 18:39:19', 0),
('01d894a9-3ab5-4027-930c-8dae1acf5945', 'Mengakses halaman mata kuliah', '2024-07-10 22:28:54', 1),
('02316739-d538-4490-9c9f-cc3164f6fe6e', 'Berhasil menghapus hasil konversi', '2024-07-16 17:31:08', 0),
('02537a7b-e2a1-47f3-8e9b-067c2e70680c', 'Mengakses halaman log aktvitas', '2024-07-10 22:05:48', 1),
('02a0e0e1-6049-4106-bacd-4eaad5361ef7', 'Mengakses halaman konversi', '2024-07-17 23:50:47', 1),
('04875220-fc5e-48e1-b7b7-54b591beabe5', 'Mengakses halaman mahasiswa', '2024-07-14 16:58:07', 0),
('05409c74-b2a7-4769-b916-f674052e55f3', 'Menambahkan mahasiswa baru', '2024-07-14 16:33:42', 0),
('06a391b1-d276-483c-b2f8-ea701ebca6a8', 'Menambahkan mahasiswa baru', '2024-07-13 02:35:52', 0),
('06ede4fb-af73-46d7-9c68-96f643896d2b', 'Mengakses halaman konversi', '2024-07-17 23:04:39', 1),
('0b2a8587-f913-4d0d-8988-c8c113cd02fe', 'Menambahkan mahasiswa baru', '2024-07-13 14:30:39', 0),
('0bc0f89b-cda4-4d3a-b337-158cb216747b', 'Berhasil menyimpan hasil konversi', '2024-07-15 00:58:05', 1),
('0c1b6755-3677-4e98-abc1-cb9d4c0bb58a', 'Mengakses halaman mahasiswa', '2024-07-13 02:35:46', 0),
('0d3fc9ca-653a-40db-99e9-3a028f9d0666', 'Berhasil mengubah hasil konversi', '2024-07-15 00:49:50', 1),
('0d88a6d3-dcd3-4a88-a987-d9079781055d', 'Mengakses halaman konversi', '2024-07-15 01:19:57', 1),
('0e6dd003-fd0f-4252-a143-c1b1cdb13b8a', 'Berhasil menyimpan hasil konversi', '2024-07-15 00:57:27', 1),
('102645d3-5f3e-41bb-8ba0-32d25e9e5bed', 'Mengubah mata kuliah \'Matematika\'', '2024-07-10 22:18:28', 1),
('10c120a6-2d16-41b1-b5a3-41061bf481aa', 'Mengakses halaman mahasiswa', '2024-07-13 14:49:36', 0),
('1163ab9c-3e1b-4b3e-8486-fc844398582e', 'Mengakses halaman mahasiswa', '2024-07-14 17:08:14', 0),
('11c9e13e-9e03-4de9-b248-9d8e2f096eb5', 'Mengakses halaman konversi', '2024-07-15 00:16:26', 1),
('1210f99e-4c57-4f35-8ca8-5fb6f5be1e37', 'Mengubah gambar', '2024-07-13 19:17:47', 0),
('13163782-9c33-46b5-9019-2a12add9bc07', 'Mengakses halaman mahasiswa', '2024-07-13 02:36:34', 0),
('13539233-61e9-4dc7-910d-772532725f24', 'Mengakses halaman mahasiswa', '2024-07-13 13:58:30', 0),
('1527ab36-30a6-476b-ad2d-92a90d24997f', 'Mengakses halaman konversi', '2024-07-15 01:15:07', 1),
('15647315-0120-425b-872a-c489c98b843f', 'Mengakses halaman konversi', '2024-07-18 15:09:10', 1),
('172d4ecf-2419-420f-b6bd-51c3892eeee5', 'Mengakses halaman konversi', '2024-07-17 23:53:39', 1),
('191d4be8-49f3-4efd-b697-fa679e4162a7', 'Mengakses halaman mahasiswa', '2024-07-13 13:57:26', 0),
('1ae7716d-92bb-45c2-824c-7e459a932910', 'Mengakses halaman mahasiswa', '2024-07-13 14:34:15', 0),
('1b811ac3-3d0b-4a6a-9826-54fbe643a3fd', 'Berhasil melakukan login', '2024-07-11 13:26:34', 1),
('2043be3e-ba11-4362-831b-dd40332a46df', 'Mengakses halaman konversi', '2024-07-15 00:19:18', 1),
('23cf6999-73ce-4b72-a12f-058c5144c4d9', 'Berhasil menghapus hasil konversi', '2024-07-15 00:59:56', 0),
('2504824d-3c90-4f89-80fd-577761f9bd00', 'Berhasil mengubah hasil konversi', '2024-07-17 23:09:45', 0),
('2711a7cc-d21d-42d8-8757-f4228510b6fa', 'Menambahkan mahasiswa baru', '2024-07-13 14:49:17', 0),
('29885117-9b49-47df-b153-88c222173752', 'Mengakses halaman mata kuliah', '2024-07-10 22:21:21', 1),
('29ab422c-9c71-4b1c-bfd1-d145077728f4', 'Mengakses halaman konversi', '2024-07-15 00:26:58', 1),
('2b697706-ae67-4428-989a-faaaf9624901', 'Mengakses halaman mata kuliah', '2024-07-10 22:17:13', 1),
('2bbc46d9-679d-4f6d-af1f-28e9cbd2420b', 'Menambahkan mahasiswa baru', '2024-07-13 14:30:02', 0),
('2c941054-a347-49e0-a992-3b7c9b6337bc', 'Mengakses halaman mata kuliah', '2024-07-10 21:48:47', 1),
('2cbbd355-fff0-4504-aecf-4119c89c765e', 'Menambahkan mahasiswa baru', '2024-07-13 14:32:18', 0),
('2d908682-19d1-4225-ac49-00a1d48f2b57', 'Mengakses halaman users', '2024-07-10 22:34:47', 1),
('2e10a094-070e-4b81-8d74-fb5bfee9f7e4', 'Gagal mengubah mahasiswa baru', '2024-07-13 13:57:30', 0),
('2e258b4b-c311-4656-bedf-aa40e75417a3', 'Mengakses halaman users', '2024-07-10 22:37:17', 1),
('2fd1d4e8-ace5-4f5a-923a-25419139611a', 'Mengakses halaman konversi', '2024-07-17 22:46:49', 1),
('30f04b66-b731-4bc0-9dce-901c1278e368', 'Gagal menambahkan mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:10:21', 1),
('3150cfbd-a9bf-4841-9fdc-b03c798c20cb', 'Berhasil logout', '2024-07-14 18:01:31', 1),
('35544cc3-3410-4c2b-a512-0654d2ef5735', 'Mengakses halaman konversi', '2024-07-17 14:03:22', 1),
('35a986e1-de14-45b4-9c28-86e5fdfd7495', 'Menambahkan mahasiswa baru', '2024-07-14 16:58:11', 0),
('361ae743-f688-49f7-b9b6-d8289f596ac8', 'Mengakses halaman konversi', '2024-07-17 23:45:02', 1),
('3928747d-a329-4a95-8e3b-8a3f4db9a19d', 'Mengubah mata kuliah \'Kalkulus\'', '2024-07-10 22:17:19', 1),
('3bc7a5e1-6584-4a97-b609-7634ab673beb', 'Berhasil melakukan login', '2024-07-14 17:42:35', 0),
('3d548c21-8819-4555-9f33-a9d44acda16f', 'Mengakses halaman log aktvitas', '2024-07-11 12:49:10', 1),
('3da73e3f-0a7e-45ac-ba2d-4d48aa5640b5', 'Berhasil melakukan login', '2024-07-14 23:07:36', 1),
('3de7146a-cc80-4384-b0ae-7849514593de', 'Mengakses halaman mata kuliah', '2024-07-10 22:27:21', 1),
('3e0a0bcd-5c9d-4226-9dba-6dba0eead25c', 'Mengakses halaman konversi', '2024-07-17 23:44:35', 1),
('3ec5069b-c7b5-4489-b7b2-3e19466539dc', 'Mengakses halaman mahasiswa', '2024-07-13 14:50:47', 0),
('3f98bf26-d194-4708-bea3-ea795d4882fa', 'Mengakses halaman konversi', '2024-07-14 23:29:08', 1),
('409d8895-441b-491e-8d14-224a79310c06', 'Berhasil menyimpan hasil konversi', '2024-07-18 15:04:22', 1),
('41f8799f-6d81-4f4f-b8b3-5426433ef264', 'Berhasil melakukan login', '2024-07-13 00:48:48', 0),
('43fa3d88-1ce9-4e18-adfa-5c57c21e3af5', 'Mengakses halaman konversi', '2024-07-17 12:58:35', 1),
('4428857e-84de-4fb9-ba9f-0b631e58c6b6', 'Mengakses halaman konversi', '2024-07-15 01:20:48', 1),
('465767ec-5e28-409e-8fdf-f3008e40b133', 'Berhasil mengubah hasil konversi', '2024-07-16 17:06:44', 0),
('46786c4f-928e-46c6-b46a-91dc01da5175', 'Menghapus mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:10:49', 1),
('46e36936-0353-4ac6-91f7-24e73b38b0c5', 'Mengakses halaman mahasiswa', '2024-07-14 16:38:30', 0),
('46e43cc9-ebb4-440d-bf5d-0fe6886e1090', 'Mengakses halaman mahasiswa', '2024-07-13 14:47:03', 0),
('4770bff4-5897-4453-a65e-e9803e8e1ea3', 'Berhasil menyimpan hasil konversi', '2024-07-18 14:12:46', 1),
('47a94a9f-cba9-4716-9e96-9ccebc8d5600', 'Berhasil mengubah hasil konversi', '2024-07-17 23:26:23', 0),
('48ebad2b-d18f-4541-b10a-6013f7992ed2', 'Berhasil mengubah hasil konversi', '2024-07-15 00:59:02', 0),
('49e9c24d-fb5b-47f9-8ff8-c99387950cff', 'Mengakses halaman konversi', '2024-07-15 00:19:30', 1),
('4c578c2a-f1cc-4e7a-976b-4f6646d6cd41', 'Berhasil mengubah hasil konversi', '2024-07-16 17:04:59', 0),
('4cbb4403-6506-4080-b891-4141cce8f04e', 'Mengakses halaman mahasiswa', '2024-07-13 14:45:21', 0),
('4f8413fd-9541-4f93-b5df-751132482f32', 'Mengakses halaman mahasiswa', '2024-07-13 01:20:39', 0),
('4fbe7f07-43ec-465a-b926-589f9f486a83', 'Mengakses halaman mahasiswa', '2024-07-13 01:21:10', 0),
('51f129d6-dc73-4aa4-8a15-8ebafb98d2b9', 'Mengubah gambar', '2024-07-14 16:34:06', 0),
('51faae6f-b7be-4aca-818e-1a31675f0d9a', 'Mengakses halaman konversi', '2024-07-17 23:46:28', 1),
('5209c93a-15d0-4d23-bc4c-fa324a4e4639', 'Mengakses halaman konversi', '2024-07-17 23:09:33', 1),
('533f6565-fefb-467a-9b88-05168a48ff1e', 'Mengakses halaman mahasiswa', '2024-07-13 14:32:35', 0),
('55181f58-0ea2-4244-a772-c5583a490dda', 'Mengubah gambar', '2024-07-13 19:17:07', 0),
('551c2829-f4bd-422d-88ea-beae28a8e737', 'Gagal menambahkan mahasiswa baru', '2024-07-11 18:43:21', 0),
('566f934e-4797-400a-9f71-f4240c11a15b', 'Gagal mengubah hasil konversi', '2024-07-15 00:52:00', 0),
('57b205f8-3aa7-4745-a23f-2322a7cd3473', 'Mengakses halaman mahasiswa', '2024-07-13 14:49:08', 0),
('57bf39f5-7792-45f6-8b73-053f0a0992ae', 'Mengakses halaman konversi', '2024-07-17 23:22:13', 1),
('58d38cdc-e2f5-403b-bf15-1d1ab147cd90', 'Mengubah mata kuliah \'Statistik\'', '2024-07-10 22:21:35', 1),
('58f24cd6-5c69-4c5d-9adc-5339f0b681e6', 'Mengakses halaman konversi', '2024-07-17 23:05:11', 1),
('5a0dfef1-b429-4440-90ea-053ba4e861f0', 'Gagal menambahkan konversi baru', '2024-07-15 01:15:12', 1),
('5a4963b7-fef0-4658-955c-e8fad0d10fca', 'Mengakses halaman konversi', '2024-07-15 00:26:36', 1),
('5b23d5a0-4c55-4f6a-90fb-39792a7ae4f6', 'Menambahkan mahasiswa baru', '2024-07-13 14:50:51', 0),
('5be7aaf1-cd90-41b4-8070-e50566834b5d', 'Mengubah gambar', '2024-07-13 19:18:45', 0),
('5cc6cc42-95f0-47a6-8c66-70d5c4d0da75', 'Mengakses halaman mata kuliah', '2024-07-10 22:29:42', 1),
('5dcd4bba-5de4-4b38-8b62-fe6d5469f572', 'Mengakses halaman mahasiswa', '2024-07-14 16:44:05', 0),
('5ef6c896-c18c-40b9-a9dd-75f8560c2d57', 'Berhasil menghapus riwayat hasil konversi', '2024-07-18 15:09:37', 1),
('5fb3eb19-1dba-4e45-86ff-b7b6bad3cc88', 'Menambahkan mahasiswa baru', '2024-07-13 00:49:19', 0),
('603f775d-8389-4b2b-8a4a-8d804182154b', 'Mengakses halaman mahasiswa', '2024-07-13 01:18:29', 0),
('61fa541b-74b2-4024-9cb2-3221acb562fc', 'Gagal menghapus: mata kuliah tidak ada.', '2024-07-10 21:28:28', 1),
('62e16752-3c0f-4e09-8771-2b844e077e98', 'Berhasil melakukan login', '2024-07-10 21:59:22', 1),
('63192adc-6d5d-4f39-8588-7ef043215ff0', 'Mengakses halaman mata kuliah', '2024-07-10 22:34:32', 1),
('63ab08b7-715d-472a-b174-2283d41bd584', 'Mengakses halaman konversi', '2024-07-17 23:47:39', 1),
('63d33acb-20de-49ce-ae1d-66cc8ea75e41', 'Mengakses halaman konversi', '2024-07-16 01:10:10', 1),
('63f095fb-8eb5-48cd-a360-90e3e676345d', 'Mengakses halaman konversi', '2024-07-15 00:52:38', 1),
('64170b51-d47f-430f-b9be-c1fac409f07e', 'Menghapus mahasiswa', '2024-07-13 14:31:19', 0),
('641e08ff-1fb3-48b3-851b-c71df407a1b4', 'Mengakses halaman konversi', '2024-07-15 00:57:03', 1),
('646020f5-d8ea-4c1d-b18c-5cabf095e27f', 'Gagal mengubah berkas', '2024-07-13 19:13:40', 0),
('64705e74-0344-49fc-bf03-87492480542e', 'Mengakses halaman log aktvitas', '2024-07-10 22:07:21', 1),
('656586c3-3925-4b4a-b435-f0f02fcd22de', 'Gagal menambahkan konversi baru', '2024-07-15 01:20:02', 1),
('673af05b-7a1d-4e40-853d-4b3ab763a84d', 'Gagal menghapus: mata kuliah tidak ada.', '2024-07-10 22:11:34', 1),
('686f438f-dbe2-4b4f-9613-8e84fb04cb6a', 'Mengakses halaman mahasiswa', '2024-07-13 14:51:18', 0),
('69998c69-c737-413d-9947-26deb66e6515', 'Mengakses halaman konversi', '2024-07-14 23:26:13', 1),
('6c9b008c-e247-4a16-9102-0f2cd44a0b1f', 'Menambahkan mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:11:40', 1),
('6ded784b-6804-4427-a93a-ccf3d6824ed1', 'Menghapus mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:07:39', 1),
('6e6eae80-23f0-4732-8896-bc2114d14ab4', 'Mengakses halaman konversi', '2024-07-18 14:04:32', 1),
('710b641f-668d-4bea-9ae9-674cb15e3611', 'Berhasil melakukan login', '2024-07-11 18:35:43', 0),
('7200444e-03d1-488f-ac13-9f2746f8e11a', 'Mengakses halaman mata kuliah', '2024-07-10 21:28:20', 1),
('72869607-cfdb-4832-8efe-ac46359db75d', 'Mengubah mata kuliah \'Matematika\'', '2024-07-10 22:21:25', 1),
('7480281d-1f05-4657-9dba-2bb35eb9899c', 'Berhasil melakukan login', '2024-07-13 19:10:41', 0),
('74cb21d5-97f5-4ada-b88d-bfb6d1eb7888', 'Mengakses halaman mahasiswa', '2024-07-13 14:29:54', 0),
('750863a9-519e-4ac6-a4f3-bbb88bf4140d', 'Mengakses halaman users', '2024-07-10 22:41:41', 1),
('758a4cd7-7dc5-457c-bb29-55d5bb35cf5c', 'Berhasil melakukan login', '2024-07-13 13:07:47', 0),
('798a4e94-b3f9-45ca-abbb-489331b61545', 'Mengakses halaman konversi', '2024-07-17 23:49:25', 1),
('7a0af5e9-1fbe-403c-9e60-5f9903cd40f1', 'Berhasil melakukan login', '2024-07-14 18:00:11', 1),
('7b616d88-ef1a-4c5f-b085-325c88af12a5', 'Berhasil mengubah hasil konversi', '2024-07-15 00:52:31', 0),
('7ccab3ca-ba95-4da9-8bec-92821a9626dc', 'Berhasil menyimpan hasil konversi', '2024-07-16 00:43:12', 1),
('7cf71232-19c6-4ad0-95c4-0955d982e690', 'Mengakses halaman konversi', '2024-07-15 00:48:55', 1),
('7eac8cb4-793c-441f-8b51-511bc0edf6be', 'Berhasil melakukan login', '2024-07-13 00:07:13', 0),
('7ee187e1-227a-454e-9603-9fabbf3ffc85', 'Mengakses halaman mata kuliah', '2024-07-10 22:18:24', 1),
('7f928703-c9b0-48ce-a3da-69e837b859d2', 'Menambahkan mahasiswa baru', '2024-07-13 14:47:07', 0),
('80baafe7-b846-45eb-a6be-d225b11d9e5c', 'Berhasil menyimpan hasil konversi', '2024-07-15 00:27:01', 1),
('8100d0cc-e757-41e9-8deb-910a699a8373', 'Menambahkan mahasiswa baru', '2024-07-14 16:44:08', 0),
('82970021-0315-4a05-bdd2-ba4463f2519c', 'Mengakses halaman konversi', '2024-07-15 00:15:56', 1),
('83cffbfa-1122-475d-8fd1-9c001911991c', 'Mengakses halaman konversi', '2024-07-18 00:07:43', 1),
('83ebe3ec-b695-4452-8c0b-4cac77a66581', 'Menambahkan mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:10:54', 1),
('84bf5b5f-4ca9-4537-966d-a00eceb135b3', 'Mengakses halaman mata kuliah', '2024-07-10 22:11:30', 1),
('898393ab-bfd0-4178-abd0-5f345e6b3805', 'Mengakses halaman log aktvitas', '2024-07-11 12:44:14', 1),
('89f8962f-728d-432b-929d-06dad3f3751c', 'Mengakses halaman mata kuliah', '2024-07-10 22:34:22', 1),
('8a2958f7-4736-4b41-ba08-a19a0b6b6263', 'Berhasil melakukan login', '2024-07-14 17:45:44', 1),
('8cab167f-7b5f-4143-b5b5-9e2918e550cb', 'Berhasil melakukan login', '2024-07-17 22:46:42', 1),
('8cb715e3-358f-4ece-a5a0-d38d08cdd4d9', 'Berhasil melakukan login', '2024-07-10 21:54:52', 1),
('8cbd34de-b01c-4c3c-99cd-35ac33b4f3e1', 'Berhasil menyimpan hasil konversi', '2024-07-15 00:16:29', 1),
('8dc364df-55a8-4a2d-bef5-6583e5a59fd0', 'Mengakses halaman mahasiswa', '2024-07-13 02:21:19', 0),
('8efb90f4-1d2a-4d8f-890c-3449ec4fe141', 'Berhasil menyimpan hasil konversi', '2024-07-15 01:21:55', 1),
('8f348cf5-7d19-4f51-9e67-cc8fa8b01632', 'Mengakses halaman mahasiswa', '2024-07-13 00:49:07', 0),
('9179352a-1ce0-4d69-9fe7-dbc7d86c8c44', 'Mengakses halaman mahasiswa', '2024-07-14 17:05:30', 0),
('93e63e6f-610e-497c-bb63-d7cf1c9deb68', 'Berhasil mengubah hasil konversi', '2024-07-17 23:50:52', 0),
('945b44f7-0033-490d-adbb-458fadc30ac3', 'Berhasil melakukan login', '2024-07-14 16:33:26', 0),
('95baa1f8-e09e-45df-a6fd-87c0382e63b1', 'Mengakses halaman log aktvitas', '2024-07-10 21:13:06', 1),
('961bbd01-ff6f-4fbd-abeb-9e4fcead9a5c', 'Mengakses halaman mata kuliah', '2024-07-10 22:30:23', 1),
('9678de60-2f1f-4e75-8a1f-5f96cfb2c7d1', 'Mengakses halaman mahasiswa', '2024-07-13 14:51:37', 0),
('97610355-3eb8-477a-a10a-e3fbb8d97f57', 'Mengakses halaman konversi', '2024-07-17 23:58:29', 1),
('98f98551-0f97-4a3f-aed7-50b37a484cd4', 'Mengakses halaman log aktvitas', '2024-07-10 21:29:10', 1),
('99969125-aafe-4949-99fd-43563618e63d', 'Berhasil melakukan login', '2024-07-14 17:50:21', 1),
('9a66fe5e-90fc-4a7f-9898-fdae745f7634', 'Mengubah mata kuliah data \'Matematika Diskrit\'', '2024-07-10 22:29:46', 1),
('9acbcc78-dcec-44c9-b9c9-3bc38fef2cf5', 'Berhasil melakukan login', '2024-07-10 21:49:14', 1),
('9cf5678f-682f-42c1-8220-89c459b29386', 'Mengakses halaman mahasiswa', '2024-07-13 13:07:52', 0),
('a07c3a36-7193-4c28-b6ee-7dd9efd11e50', 'Berhasil menyimpan hasil konversi', '2024-07-17 23:04:54', 1),
('a0fb8994-03e7-4311-8306-c163d8e4e7e8', 'Mengakses halaman mahasiswa', '2024-07-13 01:21:31', 0),
('a1404866-38bd-47b3-96a5-b3d8a3ae9592', 'Mengakses halaman mahasiswa', '2024-07-13 01:22:48', 0),
('a162737f-f0dc-4a68-9e0f-29eaee9c8f59', 'Berhasil melakukan login', '2024-07-14 17:45:26', 0),
('a25745f1-bb7c-4354-b5d9-de07b2f94872', 'Mengakses halaman mahasiswa', '2024-07-13 01:21:58', 0),
('a377243b-ef37-4489-9021-4a20f2e9b179', 'Berhasil melakukan login', '2024-07-14 17:59:42', 1),
('a5574f45-1eb2-4e96-bbb3-eb1ab705ad96', 'Berhasil menyimpan hasil konversi', '2024-07-16 00:45:30', 1),
('a6a39242-f01c-4ead-8362-cf47d5db115d', 'Mengakses halaman mata kuliah', '2024-07-10 22:10:15', 1),
('a9a10b2f-13fd-468b-9d98-05e82d75d054', 'Gagal menambahkan mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 22:07:30', 1),
('aac3c1d5-8599-4502-b30b-d9c764c3d8ef', 'Mengakses halaman konversi', '2024-07-16 00:43:06', 1),
('aae674e1-a6e5-457b-89d3-e120b5cbcc7f', 'Mengakses halaman konversi', '2024-07-18 14:26:07', 1),
('abed9664-3dc5-42c0-b3c0-bea4209a607d', 'Mengakses halaman mahasiswa', '2024-07-13 02:39:27', 0),
('ad27131a-6d1f-4b6e-9c1c-25ff5986748e', 'Berhasil menghapus hasil konversi', '2024-07-17 23:56:26', 0),
('b2df2d18-b352-491a-bde1-1dda24c45a8b', 'Gagal mengubah hasil konversi', '2024-07-16 17:03:58', 0),
('b6fe71fb-e019-46a1-b335-ebb09d959e8a', 'Berhasil melakukan login', '2024-07-13 02:12:47', 0),
('b72da898-132f-4fa4-b444-a0ac809d5a8c', 'Mengakses halaman mahasiswa', '2024-07-14 16:38:44', 0),
('ba3b52ca-0b03-4355-a17d-1d21b56ee7a1', 'Berhasil melakukan login', '2024-07-16 00:34:33', 1),
('baac333e-cd7a-4b3a-9975-9d1d68260f90', 'Mengakses halaman konversi', '2024-07-15 00:48:42', 1),
('bafb7fb0-58bd-4cd8-904d-007deb0d8e24', 'Mengakses halaman users', '2024-07-10 22:01:25', 1),
('bbed6cba-dcde-47ae-b665-69f810be3572', 'Gagal mengubah berkas', '2024-07-13 19:12:55', 0),
('bc46a524-3006-4985-a64f-ce70d5d50d8e', 'Mengakses halaman mata kuliah', '2024-07-10 22:33:46', 1),
('bd717fff-49ba-4408-95e9-8df88554bb73', 'Mengakses halaman mata kuliah', '2024-07-10 22:05:31', 1),
('bf148fb2-6e13-4947-8275-85915ed7ddb1', 'Mengakses halaman konversi', '2024-07-16 00:45:26', 1),
('bfe0676b-58ce-4543-9944-91d5c529d1fe', 'Mengakses halaman mahasiswa', '2024-07-13 02:15:24', 0),
('bffe95da-0ad6-421a-94a4-5519b2791d03', 'Berhasil melakukan login', '2024-08-01 01:16:36', 1),
('c114cc25-b4d2-417e-b9d9-9a3d467505ba', 'Berhasil mengubah hasil konversi', '2024-07-18 14:04:49', 0),
('c2b396ab-7960-420d-bd49-2febbe15ae57', 'Berhasil menyimpan hasil konversi', '2024-07-16 01:10:22', 1),
('c337485d-30c4-4595-8050-0a12853b621f', 'Mengubah data user \'Dani\'', '2024-07-10 22:41:47', 1),
('c72a5dfd-400a-4fe6-a4a1-315c8d3724a8', 'Berhasil menyimpan hasil konversi', '2024-07-16 01:10:16', 1),
('c8ec0f5e-1495-4eb2-9df3-928d48e981e5', 'Mengubah mata kuliah data \'Matematika Diskrit\'', '2024-07-10 22:34:26', 1),
('c9223dd0-3761-4e7a-81b3-53693610d231', 'Menambahkan mahasiswa baru', '2024-07-13 14:30:52', 0),
('c9cb1e9b-3d2e-4261-9158-13970c029783', 'Berhasil melakukan login', '2024-07-10 22:01:12', 1),
('cb092b41-7192-4922-aaa1-df1da1ad61f3', 'Gagal mengubah berkas', '2024-07-13 19:13:30', 0),
('ccd7e056-18d0-4ed8-a46c-06b337c2e932', 'Mengakses halaman konversi', '2024-07-17 14:23:04', 1),
('cd23c224-b9f0-4faf-a16e-956557b87862', 'Berhasil melakukan login', '2024-07-14 18:01:26', 1),
('d2d34add-4cfc-4220-a506-4a20d50d5bf7', 'Berhasil menyimpan hasil konversi', '2024-07-15 00:19:22', 1),
('d2dd842e-81ee-4fef-9131-d246162435ff', 'Berhasil menyimpan hasil konversi', '2024-07-15 00:27:23', 1),
('d33828d9-c67a-4064-9a70-af71481a67e5', 'Gagal mengubah berkas', '2024-07-13 19:12:34', 0),
('d55d6403-1645-43b7-9105-af69bd95c0c0', 'Mengakses halaman konversi', '2024-07-18 14:14:37', 1),
('d5f564c2-2ec3-43fa-9e38-2db69607c0ef', 'Mengakses halaman users', '2024-07-10 22:35:47', 1),
('d602a8db-75cb-4a09-bec7-afcf45e9f0d9', 'Menambahkan mahasiswa baru', '2024-07-14 17:05:36', 0),
('d63c982e-ea55-4622-ab39-7498a416f897', 'Mengakses halaman log aktvitas', '2024-07-10 22:42:28', 1),
('d7c02ca6-19f1-4267-803f-8bcabbd97d43', 'Menambahkan mahasiswa baru', '2024-07-13 02:39:32', 0),
('d8b6336b-4233-462b-bf1a-a428aa8828ec', 'Berhasil menyimpan hasil konversi', '2024-07-17 14:23:10', 1),
('da2e70e8-6118-4be8-8137-eda9597b3006', 'Berhasil mengubah hasil konversi', '2024-07-15 00:48:50', 1),
('daa79ea6-ec96-43ba-baa1-5cb4a525e770', 'Mengakses halaman konversi', '2024-07-17 23:05:57', 1),
('dc7df76c-3518-4b65-9ed7-b7952b9b9131', 'Berhasil mengubah hasil konversi', '2024-07-17 23:25:28', 0),
('dcfeb1f5-c478-4845-aef3-8162a1064ae0', 'Gagal mengubah gambar', '2024-07-14 16:39:24', 0),
('dd5d9547-6f07-4eb0-ba85-24d6d340de1b', 'Berhasil menyimpan hasil konversi', '2024-07-18 14:14:41', 1),
('de549d61-0fac-48f9-8d84-3162ab22c3a5', 'Mengakses halaman mahasiswa', '2024-07-14 17:04:34', 0),
('dfa4f20d-5930-497c-ba43-b0c08d895d4e', 'Gagal menambahkan mata kuliah \'Pengantar Sistem dan Teknologi Informasi\'', '2024-07-10 21:12:29', 1),
('dfc4ed7c-221e-4a30-a59d-e2bf9c198fa6', 'Mengakses halaman mahasiswa', '2024-07-13 01:20:23', 0),
('e002c5cf-78d4-4bca-b030-f77b7832cf7b', 'Berhasil menyimpan hasil konversi', '2024-07-15 01:15:12', 1),
('e36090e9-e00b-4f51-a033-d4092e48743e', 'Berhasil melakukan login', '2024-07-10 21:56:34', 1),
('e3cde56d-970c-4c98-90fc-98cdcd3aaa21', 'Gagal mengubah berkas', '2024-07-13 19:12:16', 0),
('e4c1b154-0983-4f39-b057-aca508f45e22', 'Gagal mengubah mahasiswa baru', '2024-07-13 14:16:47', 0),
('e6e23fe9-988a-49fc-a90c-d229c4ea2c3e', 'Mengakses halaman konversi', '2024-07-18 14:26:40', 1),
('e7138526-b0aa-44ef-b6d7-7d68e11e345b', 'Mengakses halaman konversi', '2024-07-18 15:04:07', 1),
('ebbd0b22-2a97-4bcb-91d0-2cf2151dec7b', 'Gagal menambahkan mahasiswa baru', '2024-07-11 18:40:10', 0),
('ed9d3ef1-d843-4e06-918a-6fcd85752513', 'Mengakses halaman mahasiswa', '2024-07-14 16:39:21', 0),
('f1081b06-a063-48a9-9558-9bc4dcee5a3e', 'Mengakses halaman mahasiswa', '2024-07-13 14:34:28', 0),
('f1ff9f13-78ee-4d66-af9c-8b466e615689', 'Gagal menghapus: mata kuliah tidak ada.', '2024-07-10 22:05:38', 1),
('f41e1c2e-5df9-490e-829a-d5e7558c2f73', 'Berhasil mengubah hasil konversi', '2024-07-18 00:08:38', 0),
('f537dfbc-c91f-448a-b504-33e88baf6e56', 'Menambahkan mahasiswa baru', '2024-07-13 14:31:39', 0),
('f6c6b0e6-4f3e-4a89-85ee-fc35b5a3671c', 'Menambahkan mata kuliah \'Statistik\'', '2024-07-10 22:12:38', 1),
('f808d6f2-4701-4cec-b5db-eee7ae2fa432', 'Mengakses halaman mata kuliah', '2024-07-10 21:12:00', 1),
('f8b0dd3b-e32c-4eb0-ac75-f3f4c8c63db2', 'Mengakses halaman mahasiswa', '2024-07-14 16:33:36', 0),
('f8e72a2e-4ab6-4108-a3b2-94a761f1bd1b', 'Mengakses halaman konversi', '2024-07-15 00:20:16', 1),
('f918d28e-4491-4183-97fa-33c7b989b1bd', 'Mengakses halaman users', '2024-07-10 22:12:58', 1),
('fab43636-195b-483a-a206-b3a6e748f1d5', 'Mengakses halaman konversi', '2024-07-15 00:18:25', 1),
('fbf3626b-8026-440d-bee5-7e6b6743e58c', 'Gagal mengubah mahasiswa baru', '2024-07-13 14:16:57', 0),
('fc126460-2ad8-4e8f-9b0a-5c8db057b75e', 'Menambahkan mahasiswa baru', '2024-07-13 13:08:14', 0),
('fcec6d98-5729-4486-b87e-42066df9184a', 'Berhasil melakukan login', '2024-07-17 12:58:05', 1),
('fdd0fbc1-f41c-494c-9f9d-b38ab244ca26', 'Menambahkan mahasiswa baru', '2024-07-14 16:57:35', 0),
('fe04ca94-45c5-44e6-8e7f-bf1e17317dde', 'Mengakses halaman mahasiswa', '2024-07-13 13:08:26', 0),
('ff29b82d-dd3f-42ea-90da-9d3333818408', 'Mengubah gambar', '2024-07-13 19:14:32', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tb_recapitulations`
--

CREATE TABLE `tb_recapitulations` (
  `id_recap` varchar(255) NOT NULL,
  `sisa_mk` varchar(25) NOT NULL,
  `total_hasil_konversi` varchar(25) NOT NULL,
  `total_sks` varchar(35) NOT NULL,
  `semester` varchar(5) NOT NULL,
  `report` varchar(255) NOT NULL,
  `id_mahasiswa` varchar(255) NOT NULL,
  `tanggal` varchar(255) NOT NULL
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
('MT00000001', 'Gixx 123', '2020RB)%)^', 'gixxcuk@gmail.com', 'Kayangan ', 'Ilmu Hitam dan Gaib Awokaowkaw', 'Dukun Pro Banget', 'Pesulap Anjay', '2024-08-01', 'Pending');

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
