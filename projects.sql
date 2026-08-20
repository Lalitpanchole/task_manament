-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2026 at 05:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ablespace_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `priority` enum('No Priority','Urgent','High','Medium','Low') NOT NULL DEFAULT 'Medium',
  `status` enum('Active','Completed','On Hold','Archived') NOT NULL DEFAULT 'Active',
  `dueDate` varchar(191) DEFAULT NULL,
  `leadId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `priority`, `status`, `dueDate`, `leadId`, `createdAt`, `updatedAt`) VALUES
('4de98ec6-731b-4085-85ed-f27ed2c8f907', 'mern stack', 'hello how are you doing', 'Medium', 'Active', '2026-09-17', 'm-3', '2026-08-20 02:56:24.390', '2026-08-20 02:56:24.390'),
('proj-1', 'Design Homepage', 'Redesign main landing page and high converting call to actions.', 'High', 'Active', '2026-09-12', 'm-2', '2026-08-18 16:19:54.114', '2026-08-18 16:19:54.114'),
('proj-2', 'Develop Login Feature', 'Frontend authentication and workspace guest entry flows.', 'Low', 'Active', '2026-09-15', 'm-5', '2026-08-18 16:19:54.128', '2026-08-18 16:19:54.128'),
('proj-3', 'Test Payment Gateway', 'Integrate payment provider sandbox and test checkout webhooks.', 'Medium', 'Active', '2026-09-18', 'm-6', '2026-08-18 16:19:54.140', '2026-08-18 16:19:54.140');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projects_leadId_fkey` (`leadId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
