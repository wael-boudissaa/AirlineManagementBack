use flightmanagement ; 
drop database if exists flightmanagement ; 
create database flightmanagement; 
alter database flightmanagement charset = utf8; 
use flightmanagement ; 


create table agence (
idagence varchar(40) primary key
);
create table airplane(
idairplane varchar(40) primary key , 
nom varchar(45) , 
idagence varchar(40), 
foreign key (idagence) references agence (idagence) 
);
create table pilot (
idpilot varchar(40 )  primary key  , 
nom varchar (45) , 
email varchar(45) 
);


create table flightinfo(
idflightinfo varchar(40) primary key ,
duration time  ,
destination varchar(40) , 
description varchar(800),
flightfrom varchar(40) 
);
create table flight (
idflight varchar(40) primary key , 
dateflight date , -- //difference between datetime and date
idairplane varchar(40) , 
idflightinfo varchar(40)   ,
foreign key (idflightinfo) references flightinfo (idflightinfo),
foreign key (idairplane) references airplane(idairplane) 
); 
create table airplanepilot (
idairplane varchar(40) , 
idpilot varchar(40) , 
primary key (idairplane,idpilot) ,
foreign key (idairplane) references airplane (idairplane) ,
foreign key (idpilot) references pilot (idpilot)  

);

 create table profile (
 idprofile varchar(40) primary key, 
first_name varchar (40) , 
 last_name varchar (40) , 
 adresse varchar (40) , 
 email varchar(40) , 
 last_login time ,
 refreshToken varchar(255) , 
 password varchar(255)
 );
 create table superuser  (
adminid varchar (40) primary key ,
 idprofile varchar(40) , 
 foreign key (idprofile ) references profile (idprofile)
); 
 create table employe (
idemploye varchar(40)  primary key ,
 idprofile varchar(40) , 
   foreign key (idprofile ) references profile (idprofile) 
 );
 
 create table groupes (
 idgroupe varchar(40) primary key , 
 name_groupe varchar(40) 
 );
--  create table employehasgroupe (
--  idemploye varchar(40)  ,
--  idgroupe varchar(40), 
--  foreign key (idemploye) references employe (idemploye ) ,
-- primary key (idemploye,idgroupe)
--  );
 
 create table employehasflight (
 idflight varchar(40) ,
 idemploye varchar(40) ,
 primary key (idflight,idemploye) , 
foreign key (idflight) references flight (idflight)  ,
foreign key (idemploye )  references employe(idemploye) 
 );
 
 create table ticket (
 idticket varchar(40) primary key , 
 title varchar (25) , 
 idemploye varchar(40) , 
 adminid varchar(40) , 
 foreign key (idemploye )  references employe(idemploye) , 
 foreign key (adminid) references superuser(adminid)
 );
create table message (
idmessage varchar(40) primary key , 
text varchar(500), 
source varchar(40), 
idticket varchar(40) , 
messagetime TIMESTAMP,
foreign key (idticket) references ticket(idticket) 
);
-- Insert data into the 'agence' table
-- Insert data into the 'agence' table
-- Insert data into the 'agence' table

-- Insert data into agence table
INSERT INTO agence (idagence) VALUES
('agence1'),
('agence2'),
('agence3');

-- Insert data into airplane table
INSERT INTO airplane (idairplane, nom, idagence) VALUES
('airplane1', 'Airplane 1', 'agence1'),
('airplane2', 'Airplane 2', 'agence2'),
('airplane3', 'Airplane 3', 'agence3');

-- Insert data into pilot table
INSERT INTO pilot (idpilot, nom, email) VALUES
('pilot1', 'Pilot 1', 'pilot1@example.com'),
('pilot2', 'Pilot 2', 'pilot2@example.com'),
('pilot3', 'Pilot 3', 'pilot3@example.com');


-- Insert data into flightinfo table with detailed descriptions
INSERT INTO flightinfo (idflightinfo, duration, destination, description, flightfrom) VALUES
('flightinfo1', '04:00:00', 'New York', 'Experience a comfortable and enjoyable flight from New York to Los Angeles. Our state-of-the-art airplane offers in-flight entertainment, delicious meals, and friendly staff.', 'Los Angeles'),
('flightinfo2', '03:30:00', 'Paris', 'Travel in style and luxury on our flight from Paris to Rome. Enjoy breathtaking views, gourmet cuisine, and a relaxing journey across Europe.', 'Rome'),
('flightinfo3', '05:15:00', 'Tokyo', 'Explore the vibrant culture and history of Tokyo with our flight from Tokyo to Bangkok. Discover ancient temples, bustling markets, and delicious street food.', 'Bangkok');

-- Insert data into flight table
INSERT INTO flight (idflight, dateflight, idairplane, idflightinfo) VALUES
('flight1', CURDATE(), 'airplane1', 'flightinfo1'),
('flight2', CURDATE(), 'airplane2', 'flightinfo2'),
('flight3', CURDATE(), 'airplane3', 'flightinfo3');

-- Insert data into flightpilot table
INSERT INTO airplanepilot (idairplane, idpilot) VALUES
('airplane1', 'pilot1'),
('airplane1', 'pilot2'),
('airplane1', 'pilot3'),
('airplane2', 'pilot2'),
('airplane3', 'pilot3');

-- Insert data into profile table
INSERT INTO profile (idprofile, first_name, last_name, adresse, email, last_login, password) VALUES
('profile1', 'John', 'Doe', '123 Main St', 'john@example.com', NOW(), 'password1'),
('profile2', 'Alice', 'Smith', '456 Elm St', 'alice@example.com', NOW(), 'password2'),
('profile3', 'Bob', 'Johnson', '789 Oak St', 'bob@example.com', NOW(), 'password3');

-- Insert data into superuser table
INSERT INTO superuser (adminid, idprofile) VALUES
('admin1', 'profile1'),
('admin2', 'profile2'),
('admin3', 'profile3');

-- Insert data into employe table
INSERT INTO employe (idemploye, idprofile) VALUES
('employe1', 'profile1'),
('employe2', 'profile2'),
('employe3', 'profile3');

-- Insert data into groupes table


-- Insert data into employehasflight table
INSERT INTO employehasflight (idflight, idemploye) VALUES
('flight1', 'employe1'),
('flight2', 'employe2'),
('flight3', 'employe3');

-- Insert data into ticket table
INSERT INTO ticket (idticket, title, idemploye, adminid) VALUES
('ticket1', 'Ticket 1', 'employe1', 'admin1'),
('ticket2', 'Ticket 2', 'employe2', 'admin2'),
('ticket3', 'Ticket 3', 'employe3', 'admin3');

-- Insert data into message table
-- Insert data into message table with messagetime
INSERT INTO message (idmessage, text, source, idticket, messagetime) VALUES
('message4', 'Message 4', 'Source 4', 'ticket1', NOW()),
('message5', 'Message 5', 'Source 5', 'ticket2', NOW()),
('message6', 'Message 6', 'Source 6', 'ticket3', NOW());


