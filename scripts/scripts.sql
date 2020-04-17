/*

CREATE TABLE delivery.value_list (
  dbid bigint(20) NOT NULL AUTO_INCREMENT,
  discriminator varchar(100) NOT NULL,
  name varchar(300) NOT NULL,
  description varchar(600) DEFAULT NULL,
  PRIMARY KEY (dbid)
);

CREATE TABLE delivery.shop (
  dbid bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(800) NOT NULL,
  category bigint(20) NOT NULL,
  description varchar(3000) DEFAULT NULL,
  whatsapp bigint(20) DEFAULT NULL,
  facebook varchar(100) DEFAULT NULL,
  messenger varchar(100) DEFAULT NULL,
  webpage varchar(100) DEFAULT NULL,
  lat varchar(20) NOT NULL,
  lng varchar(20) NOT NULL,
  delivery tinyint(1) DEFAULT 0,
  code varchar(10) DEFAULT NULL,
  status bigint(20) NOT NULL,
  PRIMARY KEY (dbid),
  CONSTRAINT shop_category_fk FOREIGN KEY (category) REFERENCES value_list (dbid),
  CONSTRAINT shop_status_fk FOREIGN KEY (status) REFERENCES value_list (dbid)
);

CREATE TABLE delivery.shop_image (
  dbid bigint(20) NOT NULL AUTO_INCREMENT,
  image LONGBLOB,
  principal tinyint(1) DEFAULT 0,
  shop bigint(20) NOT NULL,
  PRIMARY KEY (dbid),
  CONSTRAINT shop_image_shop_fk FOREIGN KEY (shop) REFERENCES shop (dbid)
);

CREATE TABLE delivery.payment_method (
  dbid bigint(20) NOT NULL AUTO_INCREMENT,
  payment bigint(20) NOT NULL,
  shop bigint(20) NOT NULL,
  PRIMARY KEY (dbid),
  CONSTRAINT payment_method_shop_fk FOREIGN KEY (shop) REFERENCES shop (dbid),
  CONSTRAINT payment_method_payment_fk FOREIGN KEY (payment) REFERENCES value_list (dbid)
);

*/

select s.*, si.image, si.mime_type as mimeType, si.name as imageName, si.size_image as sizeImage  from delivery.shop s 
left join delivery.shop_image si on si.shop = s.dbid
where s.category = 6
and si.principal = 1
;
select * from delivery.payment_method;
select * from delivery.shop	;
select * from delivery.shop_image;


select * from delivery.shop where name LIKE CONCAT('%', 'tienda',  '%') OR description LIKE CONCAT('%', 'teinda',  '%');
select pm.dbid, pm.shop, vl.discriminator, vl.name, vl.description from delivery.payment_method pm
inner join delivery.value_list vl on vl.dbid = pm.payment
where pm.dbid = 9
;

select * from delivery.value_list;
