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
    review VARCHAR(300), 
    rating TINYINT NOT NULL, 
    format VARCHAR(30),
    release_year SMALLINT,
    poster VARCHAR(100),
    film_is_deleted BOOLEAN NOT NULL DEFAULT 0,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id)
    REFERENCES user(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

select * from user;
select * from film;

INSERT INTO `film_buff`.`film` (`film_id`, `user_id`, `title`, `review`, `rating`, `format`, `release_year`) VALUES ('1', '1', 'titanic', 'llorar', '4', 'dvd', '2003');

SELECT film_id, title, poster FROM film WHERE film_is_deleted = 0 order by title asc;
SELECT rating, title
FROM film
WHERE film_is_deleted = 0
ORDER BY rating ASC, title ASC;
