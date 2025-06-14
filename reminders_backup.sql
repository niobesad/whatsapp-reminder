PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

INSERT INTO knex_migrations VALUES(1,'00_create_users.js',1,1748339931549);
INSERT INTO knex_migrations VALUES(2,'01_create_reminders.js',1,1748339931550);
INSERT INTO knex_migrations VALUES(3,'02_create_custom_lists.js',1,1748339931551);
INSERT INTO knex_migrations VALUES(4,'03_create_reminder_tags.js',2,1748359704991);

INSERT INTO knex_migrations_lock VALUES(1,0);

INSERT INTO users (id, username, email, phone, password, created_at, updated_at, broadcast_mode) VALUES
(1, 'admin', 'admin@niobesad.com', '6281808903658', '$2b$10$PmqiGZIA6s1DYzTs0H/Rleo.ZMurufRKh7tFVMx5C7AgLpAUWcJ2S', '2025-05-27 09:59:09', '2025-05-27 09:59:09', 0);

INSERT INTO users (id, username, email, phone, password, created_at, updated_at, broadcast_mode) VALUES
(2, 'gummy', 'hansaljim@gmail.com', '6281228310627', '$2b$10$h0OnC0xuKNFpRBU1DznQte.IddieLWhpqK4njh7b.4xYlxhCZ8.cy', '2025-05-28 07:11:50', '2025-05-28 07:11:50',0);

INSERT INTO reminders VALUES(4,1,'Beli Oli','Beli oli buat motor jangan lupa','2025-05-28T11:12',1);
INSERT INTO reminders VALUES(5,1,'Makan','Jangan lupa makan, jangan ngoding mulu.','2025-05-28T12:17',1);
INSERT INTO reminders VALUES(6,1,'Bersyukur','Jangan lupa bersyukur','2025-05-28T12:55',1);
INSERT INTO reminders VALUES(8,2,'rapat1','apa aja','2025-05-28T15:15',1);
INSERT INTO reminders VALUES(9,2,'rapat2','yg lebih cepet','2025-05-28T14:45',1);
INSERT INTO reminders VALUES(11,1,'Makan','Makan yang bener jaga kesehatan','2025-05-28T17:05',1);
INSERT INTO reminders VALUES(12,1,'Motor Benerin','Benerin motor besok, banyak yang harus dicek.','2025-05-28T17:33',1);

INSERT INTO custom_lists VALUES(1,1,'Tugas Rumah');
INSERT INTO custom_lists VALUES(2,1,'Kesehatan');
INSERT INTO custom_lists VALUES(3,1,'Motor');
INSERT INTO custom_lists VALUES(4,2,'Rapat');

INSERT INTO reminder_tags VALUES(2,2);
INSERT INTO reminder_tags VALUES(3,3);
INSERT INTO reminder_tags VALUES(4,3);
INSERT INTO reminder_tags VALUES(5,2);
INSERT INTO reminder_tags VALUES(6,2);
INSERT INTO reminder_tags VALUES(7,4);
INSERT INTO reminder_tags VALUES(8,4);
INSERT INTO reminder_tags VALUES(9,4);
INSERT INTO reminder_tags VALUES(10,2);
INSERT INTO reminder_tags VALUES(11,2);
INSERT INTO reminder_tags VALUES(12,3);

DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('knex_migrations_lock',1);
INSERT INTO sqlite_sequence VALUES('knex_migrations',4);
INSERT INTO sqlite_sequence VALUES('users',2);
INSERT INTO sqlite_sequence VALUES('custom_lists',4);
INSERT INTO sqlite_sequence VALUES('reminders',12);

COMMIT;
