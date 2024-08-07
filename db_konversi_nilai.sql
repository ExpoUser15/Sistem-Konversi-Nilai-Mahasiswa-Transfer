-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2024 at 06:02 PM
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
('0e05af10-f117-4c0b-91cd-c471226e544d', 'Menambahkan user baru', '2024-07-08 00:55:19', 1),
('d2ca3a52-889a-4967-8d69-763e54e8e742', 'Menghapus user Jefri', '2024-07-08 00:56:21', 1),
('df1ac0af-88d6-4520-8abe-fbe934c6bd3f', 'Mengubah user Danny', '2024-07-08 00:54:30', 1),
('eb7bbbef-fb72-4543-80d1-a9abc0bd1678', 'Mengakses Halaman Users', '2024-07-08 00:54:50', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_users`
--

CREATE TABLE `tb_users` (
  `id_pengguna` int(5) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user` enum('Akademik','Kaprodi') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_users`
--

INSERT INTO `tb_users` (`id_pengguna`, `username`, `password`, `user`) VALUES
(1, 'Gideon', '$2b$10$IR2p1mIDwJ8kfkpAoNfs.evstSRMKEj0PZRugMPxgjFLHl4e/8eGW', 'Akademik'),
(15, 'Danny', '$2b$10$Sk7eMxclA9theWNLcjfB6ed/x6NxjXOLuDGrdyr8O5EXBgKwZzbhm', 'Akademik'),
(20, 'Damian', '$2b$10$fG1LkRozNZotxZU2DvJ46.dH7fEyMo0xSBCJriLCMrvrTg7leT/2q', 'Akademik');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_log_activities`
--
ALTER TABLE `tb_log_activities`
  ADD PRIMARY KEY (`id_aktivitas`);

--
-- Indexes for table `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`id_pengguna`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_users`
--
ALTER TABLE `tb_users`
  MODIFY `id_pengguna` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
