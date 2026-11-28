-- MySQL schema for when the JSON file database is replaced.
CREATE TABLE IF NOT EXISTS registrations (
  id            VARCHAR(24)  NOT NULL PRIMARY KEY,           -- IND<timestamp>
  event         ENUM('IND','BATTLE') NOT NULL DEFAULT 'IND',
  status        ENUM('PENDING_PAYMENT','COMPLETED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  name          VARCHAR(60)  NOT NULL,
  dob           DATE         NOT NULL,
  age           TINYINT UNSIGNED NOT NULL,
  city          VARCHAR(40)  NOT NULL,
  mobile        CHAR(10)     NOT NULL,
  alt_mobile    CHAR(10)     NULL,
  email         VARCHAR(120) NOT NULL,
  category      ENUM('Kids','Teen','Adults','Group') NULL,           -- NULL for Battle
  crew_size     TINYINT UNSIGNED NULL,                          -- Battle only (1 = solo)
  style         VARCHAR(20)  NOT NULL,
  style_other   VARCHAR(40)  NULL,
  link          VARCHAR(300) NULL,                              -- IND only
  photo         VARCHAR(200) NOT NULL,
  amount        INT UNSIGNED NOT NULL,
  consent       TINYINT(1)   NOT NULL,
  consent_at    DATETIME     NOT NULL,
  order_id      VARCHAR(40)  NULL,
  payment_id    VARCHAR(40)  NULL,
  payment_mode  ENUM('razorpay','mock') NULL,
  paid_at       DATETIME     NULL,
  emailed_at    DATETIME     NULL,
  ip            VARCHAR(45)  NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_status (status),
  KEY idx_mobile (mobile),
  KEY idx_city_category (city, category),
  UNIQUE KEY uq_order (order_id),
  UNIQUE KEY uq_payment (payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
