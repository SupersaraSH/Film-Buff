CREATE DATABASE film_buff;

-- DROP DATABASE film_buff;

USE film_buff;

CREATE TABLE user(
	user_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(60),
    email VARCHAR(60) UNIQUE NOT NULL,
    description VARCHAR(300),
    password VARCHAR(100) NOT NULL,
    avatar VARCHAR(100),
    user_is_deleted BOOLEAN NOT NULL DEFAULT 0
    
);

CREATE TABLE film( 
	film_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL, 
    title VARCHAR(100) NOT NULL,
    review VARCHAR(300), -- NOT NULL???
    rating TINYINT NOT NULL, -- CHAR(1),???
    format VARCHAR(30),
    release_year SMALLINT, -- CHAR(4),???
    poster VARCHAR(100),
    film_is_deleted BOOLEAN NOT NULL DEFAULT 0,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id)
    REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

select * from user;