/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `brands`;
CREATE TABLE `brands` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image` varchar(200) DEFAULT NULL,
  `tag_line` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `status` enum('active','inactive','deleted') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_id` varchar(36) NOT NULL,
  `attribute` varchar(150) NOT NULL,
  `quantity` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `upa` (`user_id`,`product_id`,`attribute`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `image` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `position` int DEFAULT '0',
  `parent_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` enum('active','inactive','deleted') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` varchar(36) NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `cloud_name` varchar(50) NOT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `size` int DEFAULT NULL,
  `status` enum('uploaded','used') DEFAULT 'uploaded',
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `order_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `attribute` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image` varchar(200) DEFAULT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `opa` (`order_id`,`product_id`,`attribute`) USING BTREE,
  KEY `product_id` (`product_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `shipping_city` varchar(80) DEFAULT NULL,
  `shipping_method` enum('free','standard') DEFAULT 'free',
  `payment_method` enum('cod','zalo_pay') DEFAULT NULL,
  `payment_status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
  `recipient_first_name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `recipient_last_name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `recipient_phone` varchar(50) DEFAULT NULL,
  `recipient_email` varchar(50) DEFAULT NULL,
  `tracking_number` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` enum('pending','confirmed','processing','shipping','delivered','completed','canceled','refunded','deleted') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tracking_number` (`tracking_number`) USING BTREE,
  KEY `payment_status` (`payment_status`) USING BTREE,
  KEY `status` (`status`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `product_likes`;
CREATE TABLE `product_likes` (
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`product_id`,`user_id`),
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `product_ratings`;
CREATE TABLE `product_ratings` (
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `product_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`product_id`,`user_id`),
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `gender` enum('male','femail','unisex') DEFAULT 'unisex',
  `images` json DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `colors` varchar(100) DEFAULT NULL,
  `quantity` int NOT NULL,
  `brand_id` varchar(36) NOT NULL,
  `category_id` varchar(36) NOT NULL,
  `content` text,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `rating` float DEFAULT '0',
  `sale_count` int unsigned DEFAULT '0',
  `status` enum('active','inactive','deleted') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`) USING BTREE,
  KEY `brand_id` (`brand_id`) USING BTREE,
  KEY `gender` (`gender`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `user_identities`;
CREATE TABLE `user_identities` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `identifier` varchar(150) NOT NULL,
  `password` varchar(200) NOT NULL,
  `salt` varchar(50) NOT NULL,
  `type` enum('email_password','facebook','google') NOT NULL,
  `status` enum('active','pending','inactive','banned','deleted') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE `user_sessions` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `identity_id` varchar(36) NOT NULL,
  `expired_at` timestamp NOT NULL,
  `ip` varchar(15) NOT NULL,
  `geo` varchar(100) DEFAULT NULL,
  `device` varchar(150) DEFAULT NULL,
  `type` enum('access_token','refresh') NOT NULL,
  `status` enum('active','pending','inactive','banned','deleted') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_sessions_user_id` (`user_id`),
  KEY `idx_user_sessions_identity_id` (`identity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `salt` varchar(29) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` enum('male','female','unknown') NOT NULL DEFAULT 'male',
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `status` enum('active','pending','inactive','banned','deleted') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING BTREE,
  KEY `status` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `brands` (`id`, `name`, `image`, `tag_line`, `description`, `status`, `created_at`, `updated_at`) VALUES
('018c1fa0-aaaa-7c2a-9f1b-6c8d4e2f7b01', 'TechNova', 'https://example.com/images/brands/technova.jpg', 'Innovating the future', 'Leading electronics brand with cutting-edge gadgets and devices.', 'active', '2025-09-06 10:00:00', '2025-09-06 10:00:00'),
('018c1fa0-aaab-7c2a-9f1b-6c8d4e2f7b02', 'Smartify', 'https://example.com/images/brands/smartify.jpg', 'Smarter living', 'Brand specializing in smartphones and smart home devices.', 'active', '2025-09-06 10:10:00', '2025-09-06 10:10:00'),
('018c1fa0-aaac-7c2a-9f1b-6c8d4e2f7b03', 'UrbanWear', 'https://example.com/images/brands/urbanwear.jpg', 'Style for the city', 'Trendy fashion for men and women in urban areas.', 'active', '2025-09-06 10:20:00', '2025-09-06 10:20:00'),
('018c1fa0-aaad-7c2a-9f1b-6c8d4e2f7b04', 'ClassicFit', 'https://example.com/images/brands/classicfit.jpg', 'Timeless elegance', 'Premium clothing brand focusing on classic styles.', 'active', '2025-09-06 10:30:00', '2025-09-06 10:30:00'),
('018c1fa0-aaae-7c2a-9f1b-6c8d4e2f7b05', 'Chronos', 'https://example.com/images/brands/chronos.jpg', 'Time redefined', 'Luxury watch brand combining tradition and technology.', 'active', '2025-09-06 10:40:00', '2025-09-06 10:40:00'),
('018c1fa0-aaaf-7c2a-9f1b-6c8d4e2f7b06', 'ShineOn', 'https://example.com/images/brands/shineon.jpg', 'Sparkle everyday', 'Accessories and jewelry brand for modern lifestyles.', 'active', '2025-09-06 10:50:00', '2025-09-06 10:50:00'),
('018c1fa0-aab0-7c2a-9f1b-6c8d4e2f7b07', 'BytePro', 'https://example.com/images/brands/bytepro.jpg', 'Power in your hands', 'Brand offering laptops and high-performance computers.', 'active', '2025-09-06 11:00:00', '2025-09-06 11:00:00'),
('018c1fa0-aab1-7c2a-9f1b-6c8d4e2f7b08', 'NeoTech', 'https://example.com/images/brands/neotech.jpg', 'Work smarter', 'Affordable yet powerful laptops for professionals.', 'active', '2025-09-06 11:10:00', '2025-09-06 11:10:00'),
('018c1fa0-aab2-7c2a-9f1b-6c8d4e2f7b09', 'ComfortNest', 'https://example.com/images/brands/comfortnest.jpg', 'Living made cozy', 'Furniture brand focused on comfort and modern design.', 'active', '2025-09-06 11:20:00', '2025-09-06 11:20:00'),
('018c1fa0-aab3-7c2a-9f1b-6c8d4e2f7b0a', 'WoodCraft', 'https://example.com/images/brands/woodcraft.jpg', 'Crafted for life', 'Handcrafted wooden furniture and home décor.', 'active', '2025-09-06 11:30:00', '2025-09-06 11:30:00'),
('018c1fa0-aab4-7c2a-9f1b-6c8d4e2f7b0b', 'FitZone', 'https://example.com/images/brands/fitzone.jpg', 'Stronger everyday', 'Fitness equipment and activewear brand.', 'active', '2025-09-06 11:40:00', '2025-09-06 11:40:00'),
('018c1fa0-aab5-7c2a-9f1b-6c8d4e2f7b0c', 'ProSports', 'https://example.com/images/brands/prosports.jpg', 'Play like a pro', 'Sports gear and accessories for athletes.', 'active', '2025-09-06 11:50:00', '2025-09-06 11:50:00'),
('018c1fa0-aab6-7c2a-9f1b-6c8d4e2f7b0d', 'BookHive', 'https://example.com/images/brands/bookhive.jpg', 'Where stories live', 'Publishing brand with a wide range of literature.', 'active', '2025-09-06 12:00:00', '2025-09-06 12:00:00'),
('018c1fa0-aab7-7c2a-9f1b-6c8d4e2f7b0e', 'EduPrint', 'https://example.com/images/brands/eduprint.jpg', 'Knowledge for all', 'Educational books and materials for students.', 'active', '2025-09-06 12:10:00', '2025-09-06 12:10:00'),
('018c1fa0-aab8-7c2a-9f1b-6c8d4e2f7b0f', 'FunLand', 'https://example.com/images/brands/funland.jpg', 'Play. Imagine. Grow.', 'Toy brand inspiring creativity and fun for kids.', 'active', '2025-09-06 12:20:00', '2025-09-06 12:20:00'),
('018c1fa0-aab9-7c2a-9f1b-6c8d4e2f7b10', 'GameSphere', 'https://example.com/images/brands/gamesphere.jpg', 'Fun never ends', 'Board games and family entertainment brand.', 'active', '2025-09-06 12:30:00', '2025-09-06 12:30:00'),
('018c1fa0-aaba-7c2a-9f1b-6c8d4e2f7b11', 'GlowUp', 'https://example.com/images/brands/glowup.jpg', 'Shine inside out', 'Skincare and cosmetic products brand.', 'active', '2025-09-06 12:40:00', '2025-09-06 12:40:00'),
('018c1fa0-aabb-7c2a-9f1b-6c8d4e2f7b12', 'PureCare', 'https://example.com/images/brands/purecare.jpg', 'Natural beauty', 'Organic and eco-friendly beauty brand.', 'active', '2025-09-06 12:50:00', '2025-09-06 12:50:00'),
('018c1fa0-aabc-7c2a-9f1b-6c8d4e2f7b13', 'CookEase', 'https://example.com/images/brands/cookease.jpg', 'Cooking made easy', 'Kitchenware and cooking tools brand.', 'active', '2025-09-06 13:00:00', '2025-09-06 13:00:00'),
('018c1fa0-aabd-7c2a-9f1b-6c8d4e2f7b14', 'HomeGenie', 'https://example.com/images/brands/homegenie.jpg', 'Smart living', 'Smart appliances and home automation solutions.', 'active', '2025-09-06 13:10:00', '2025-09-06 13:10:00'),
('0199698a-b05e-731a-980e-19a998b0fbf5', 'abce', 'https://example.com/images/electronics.jpg', NULL, 'Category for electronic devices like phones', 'active', '2025-09-20 23:52:00', '2025-09-20 23:52:00'),
('0199a086-f5e8-722c-870c-4faedfb5852a', 'abcef', 'https://example.com/images/brands/technova.jpg', NULL, 'Category for electronic devices like phones', 'active', '2025-10-01 16:07:03', '2025-10-01 16:07:03');
INSERT INTO `carts` (`id`, `user_id`, `product_id`, `attribute`, `quantity`, `created_at`, `updated_at`) VALUES
('019a7d6f-a2d4-7241-b5e2-e722423e46a3', '01996f8a-7402-75ee-919d-d7d6154bcb0b', '0195ae4b-1616-7a5a-bb09-f1adbbdc5b1f', '', 5, '2025-11-13 13:37:39', '2025-11-13 14:21:40');
INSERT INTO `categories` (`id`, `name`, `image`, `description`, `position`, `parent_id`, `status`, `created_at`, `updated_at`) VALUES
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1b', 'Electronics', 'https://example.com/images/electronics.jpg', 'Devices and gadgets', 1, NULL, 'active', '2025-09-01 10:00:00', '2025-09-01 10:00:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1c', 'Smartphones', 'https://example.com/images/smartphones.jpg', 'Mobile phones', 2, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1b', 'active', '2025-09-01 12:00:00', '2025-09-01 12:00:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1d', 'Laptops', 'https://example.com/images/laptops.jpg', 'Portable computers', 3, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1b', 'active', '2025-09-01 14:30:00', '2025-09-01 14:30:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1e', 'Clothing', 'https://example.com/images/clothing.jpg', 'Apparel and fashion', 4, NULL, 'active', '2025-09-02 09:15:00', '2025-09-02 09:15:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1f', 'Men\'s Clothing', 'https://example.com/images/mens_clothing.jpg', 'Men\'s fashion', 5, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1e', 'active', '2025-09-02 11:20:00', '2025-09-02 11:20:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a20', 'Women\'s Clothing', 'https://example.com/images/womens_clothing.jpg', 'Women\'s fashion', 6, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1e', 'inactive', '2025-09-02 13:45:00', '2025-09-03 08:00:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a21', 'Accessories', 'https://example.com/images/accessories.jpg', 'Bags and jewelry', 7, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1c', 'active', '2025-09-03 15:10:00', '2025-09-03 15:10:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a22', 'Watches', 'https://example.com/images/watches.jpg', 'Timepieces', 8, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a21', 'active', '2025-09-03 16:25:00', '2025-09-03 16:25:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a23', 'Home Appliances', 'https://example.com/images/home_appliances.jpg', 'Household gadgets', 9, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1d', 'deleted', '2025-09-04 10:30:00', '2025-09-05 09:00:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a24', 'Kitchenware', 'https://example.com/images/kitchenware.jpg', 'Kitchen tools', 10, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a23', 'active', '2025-09-04 12:50:00', '2025-09-04 12:50:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a25', 'Furniture', 'https://example.com/images/furniture.jpg', 'Home furnishings', 11, NULL, 'active', '2025-09-04 14:00:00', '2025-09-04 14:00:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a26', 'Sofas', 'https://example.com/images/sofas.jpg', 'Living room seating', 12, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a25', 'active', '2025-09-04 15:15:00', '2025-09-04 15:15:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a27', 'Books', 'https://example.com/images/books.jpg', 'Literature and novels', 13, NULL, 'active', '2025-09-05 09:45:00', '2025-09-05 09:45:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a28', 'Fiction', 'https://example.com/images/fiction.jpg', 'Fictional books', 14, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a27', 'active', '2025-09-05 11:00:00', '2025-09-05 11:00:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a29', 'Non-Fiction', 'https://example.com/images/nonfiction.jpg', 'Educational books', 15, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a27', 'inactive', '2025-09-05 11:30:00', '2025-09-05 12:00:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a2a', 'Sports', 'https://example.com/images/sports.jpg', 'Sporting goods', 16, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a2d', 'active', '2025-09-05 12:15:00', '2025-09-11 03:49:05'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a2b', 'Fitness Equipment', 'https://example.com/images/fitness.jpg', 'Gym gear', 17, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a2a', 'active', '2025-09-05 12:30:00', '2025-09-05 12:30:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a2c', 'Toys', 'https://example.com/images/toys.jpg', 'Children\'s toys', 18, NULL, 'active', '2025-09-05 12:45:00', '2025-09-05 12:45:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a2d', 'Board Games', 'https://example.com/images/board_games.jpg', 'Family games', 19, '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a2c', 'active', '2025-09-05 12:46:00', '2025-09-05 12:46:00'),
('018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a2e', 'Beauty', 'https://example.com/images/beauty.jpg', 'Cosmetics and skincare', 20, NULL, 'active', '2025-09-05 12:46:00', '2025-09-05 12:46:00'),
('019937b3-a3ed-743d-914e-de93341aed15', 'A14', 'https://example.com/images/electronics.jpg', 'Category for electronic devices like phones', 0, NULL, 'active', '2025-09-11 07:35:43', '2025-09-11 07:35:43'),
('019998c1-8241-7069-889d-6cb75b9dbb61', 'A15', 'https://example.com/images/electronics.jpg', 'Category for electronic devices like phones', 0, NULL, 'active', '2025-09-30 03:54:02', '2025-09-30 03:54:02'),
('019998c6-c4ad-7294-adf7-ded82bce1773', 'A16', 'https://example.com/images/electronics.jpg', 'Category for electronic devices like phones', 0, NULL, 'active', '2025-09-30 03:59:47', '2025-09-30 03:59:47');

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `attribute`, `image`, `name`, `quantity`, `price`) VALUES
('019a7df1-7821-712e-bbde-82213ca34728', '019a7df1-781f-71ca-81a9-5fddf187d6a4', '0195ae4b-1616-7a5a-bb09-f1adbbdc5b1f', '', NULL, 'Smartphone X100 Pro', 5, '899.99');
INSERT INTO `orders` (`id`, `user_id`, `shipping_address`, `shipping_city`, `shipping_method`, `payment_method`, `payment_status`, `recipient_first_name`, `recipient_last_name`, `recipient_phone`, `recipient_email`, `tracking_number`, `status`, `created_at`, `updated_at`) VALUES
('019a7df1-781f-71ca-81a9-5fddf187d6a4', '01996f8a-7402-75ee-919d-d7d6154bcb0b', 'test address', 'test city', 'standard', 'zalo_pay', 'pending', 'John', 'Doe', '0123456789', 'test@example.com', 'TRK-20251113-8223EA3A', 'pending', '2025-11-13 15:59:28', '2025-11-13 15:59:28');


INSERT INTO `products` (`id`, `name`, `gender`, `images`, `price`, `sale_price`, `colors`, `quantity`, `brand_id`, `category_id`, `content`, `description`, `rating`, `sale_count`, `status`, `created_at`, `updated_at`) VALUES
('0195ae4b-1616-7a5a-bb09-f1adbbdc5b1f', 'Smartphone X100 Pro', 'unisex', '[\"https://example.com/img1.jpg\", \"https://example.com/img2.jpg\"]', '999.99', '899.99', 'Black, Silver, Blue', 5, '018c1fa0-aaaa-7c2a-9f1b-6c8d4e2f7b01', '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1b', 'This is the content/detail of Smartphone X100 Pro: features, specs, etc.', 'Latest flagship from TechNova with high performance, multi-camera system, long battery life.', 4.5, 120, 'active', '2025-09-18 08:30:00', '2025-10-08 08:33:40'),
('01996999-7e78-7604-89c8-d2136e8cc76b', 'Apple1', 'unisex', NULL, '30000.00', '2000.00', NULL, 20, '018c1fa0-aaaa-7c2a-9f1b-6c8d4e2f7b01', '018c1e9f-4b3a-7c2a-9f1b-6c8d4e2f7a1b', NULL, 'Category for electronic devices like phones', 0, 0, 'deleted', '2025-09-21 00:08:11', '2025-09-21 00:10:16');


INSERT INTO `users` (`id`, `avatar`, `first_name`, `last_name`, `email`, `password`, `salt`, `phone`, `address`, `birthday`, `gender`, `role`, `status`, `created_at`, `updated_at`) VALUES
('01996f8a-7402-75ee-919d-d7d6154bcb0b', NULL, 'Xuan', 'Le', 'dinhxuandx123456@gmail.com', '$2b$15$/puCjmhIIpT6NWjiMdA3Xe2tiuqzoNbjDNQ/.HPBSQzN6uCr3Gm72', '$2b$15$/puCjmhIIpT6NWjiMdA3Xe', NULL, NULL, NULL, 'unknown', 'admin', 'active', '2025-09-22 03:49:28', '2025-09-30 03:57:20'),
('019994ad-4db5-751b-817d-d929bc742bcc', NULL, 'Vicktor', 'Le', 'dinhxuandx1234567@gmail.com', '$2b$15$rNAakx.DIITPNxy1BXAK4eSmwH6WkFBNMIRUR4z7BFQHsRsN472s.', '$2b$15$rNAakx.DIITPNxy1BXAK4e', NULL, NULL, NULL, 'unknown', 'admin', 'active', '2025-09-29 08:53:29', '2025-09-30 03:59:15');


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;