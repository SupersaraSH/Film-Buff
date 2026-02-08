CREATE DATABASE club;
USE club;

-- DROP DATABASE club;


CREATE TABLE user(
	user_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(50),
    lastname varchar(50),
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(200)
); 

SELECT * FROM user;

INSERT INTO `club`.`user` (`user_id`, `name`, `lastname`, `email`, `password`) VALUES ('1', 'pepe', 'pota', 'pepe@gmail.com', '1234');
INSERT INTO `club`.`user` (`user_id`, `name`, `lastname`, `email`, `password`) VALUES ('2', 'ana', 'nana', 'ana@gmail.com', '1234');
