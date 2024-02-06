 CREATE TABLE IF NOT EXISTS `user` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` ENUM ('USER', 'ADMIN') NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL
);

 CREATE TABLE IF NOT EXISTS `product` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `description` varchar(255),
  `image` varchar(255),
  `price_usd` DECIMAL UNSIGNED,
  `stock` int UNSIGNED
);

 CREATE TABLE IF NOT EXISTS `order` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` integer
);

 CREATE TABLE IF NOT EXISTS `product_order` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `amount` integer,
  `order_id` integer,
  `product_id` integer
);

 CREATE TABLE IF NOT EXISTS `review` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `stars` integer,
  `text` varchar(255),
  `user_id` integer,
  `product_id` integer
);

 CREATE TABLE IF NOT EXISTS `shopping_cart` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` integer UNIQUE
);

 CREATE TABLE IF NOT EXISTS `shopping_cart_item` (
  `id` integer PRIMARY KEY AUTO_INCREMENT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `shopping_cart_id` integer,
  `product_id` integer
);

ALTER TABLE `shopping_cart` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `shopping_cart_item` ADD FOREIGN KEY (`shopping_cart_id`) REFERENCES `shopping_cart` (`id`);

ALTER TABLE `shopping_cart_item` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_order` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `product_order` ADD FOREIGN KEY (`order_id`) REFERENCES `order` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `review` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `review` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `product_order` ADD FOREIGN KEY (`amount`) REFERENCES `product_order` (`order_id`);