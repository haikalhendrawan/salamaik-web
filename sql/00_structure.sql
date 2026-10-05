BEGIN;

ALTER TABLE user_ref add peraturan INTEGER DEFAULT NULL;

UPDATE user_ref SET peraturan = 1 WHERE id IS NOT NULL;

CREATE TABLE peraturan_ref (
	id SERIAL PRIMARY KEY,
	nomor VARCHAR(255) DEFAULT NULL,
	hal TEXT DEFAULT NULL,
	tahun INTEGER DEFAULT NULL,
	file VARCHAR (255) DEFAULT NULL,
	deleted TIMESTAMP DEFAULT NULL
);

INSERT INTO peraturan_ref (nomor, hal, tahun, file) VALUES (
	'PER-1/PB/2023', 
	'Perubahan Atas Peraturan Direktur Jenderal Perbendaharaan Nomor PER-24/PB/2019 tentang Pedoman Pembinaan dan Supervisi Pelaksanaan Tugas Kantor Pelayanan Perbendaharaan Negara',
	2023,
	'peraturan1.pdf'
);


INSERT INTO peraturan_ref(id, nomor, hal, tahun, file, deleted) 
VALUES (2, 'ND-635/PB.1/2026', 'Penyampaian Petunjuk Teknis Pelaksanaan Pembinaan dan Supervisi Kantor Pelayanan Perbendaharaan Negara', 2026, null, null);

ALTER TABLE komponen_ref
ADD COLUMN peraturan INT DEFAULT NULL,
ADD COLUMN deleted TIMESTAMP DEFAULT NULL;

UPDATE komponen_ref SET peraturan = 1 WHERE id IS NOT NULL;

ALTER TABLE subkomponen_ref ADD COLUMN deleted TIMESTAMP default NULL;

ALTER TABLE subsubkomponen_ref ADD COLUMN deleted TIMESTAMP default NULL;

INSERT INTO activity_ref (id, name, description, cluster)
VALUES(95, 'Get All Peraturan', 'User mengambil data peraturan', 90),
(96, 'Get Peraturan By Id', 'User mengambil data peraturan by id', 90),
(97, 'Add Peraturan By Id', 'User menambah data peraturan', 90),
(98, 'Edit Peraturan By Id', 'User mengedit data peraturan', 90),
(99, 'Delete Peraturan By Id', 'Delete peraturan by Id', 90);


ALTER TABLE opsi_ref ADD COLUMN deleted TIMESTAMP default NULL;

ALTER TABLE checklist_ref ADD COLUMN deleted TIMESTAMP default NULL;

ALTER TABLE checklist_ref ADD COLUMN critical_point TEXT DEFAULT NULL;

ALTER TABLE checklist_ref ADD COLUMN urut integer DEFAULT NULL;

UPDATE checklist_ref SET urut = id;

ALTER TABLE checklist_ref ADD COLUMN urut_huruf integer DEFAULT NULL;


ALTER TABLE worksheet_junction ADD COLUMN link_file TEXT DEFAULT NULL;


CREATE TABLE komponen_spml_ref (LIKE komponen_ref);
ALTER TABLE komponen_spml_ref
ADD CONSTRAINT komponen_spml_ref_pkey
PRIMARY KEY (id);
ALTER TABLE komponen_spml_ref ADD COLUMN urut TEXT DEFAULT NULL;
--
CREATE TABLE subkomponen_spml_ref (LIKE subkomponen_ref);
ALTER TABLE subkomponen_spml_ref ADD COLUMN urut TEXT DEFAULT NULL;
ALTER TABLE subkomponen_spml_ref RENAME COLUMN komponen_id TO komponen_spml_id;

ALTER TABLE subkomponen_spml_ref ADD constraint pk_subkomponen_spml_ref PRIMARY KEY (id);

ALTER TABLE subkomponen_spml_ref
ADD constraint fk_subkomponen_spml_komponen_spml 
FOREIGN KEY (komponen_spml_id)
REFERENCES komponen_spml_ref (id)
ON DELETE CASCADE
ON UPDATE CASCADE;
---
CREATE TABLE aspek_spml_ref (
	id SERIAL PRIMARY KEY,
	urut INT NOT NULL,
	urut_huruf TEXT,
	komponen_spml_id INT,
	subkomponen_spml_id INT,
	title TEXT,
	detail TEXT, 
	deleted TIMESTAMP WITHOUT TIME ZONE,
	
	CONSTRAINT fk_aspek_spml_komponen_spml
	FOREIGN KEY (komponen_spml_id)
	REFERENCES komponen_spml_ref (id)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	
	CONSTRAINT fk_aspek_spml_subkomponen_spml
	FOREIGN KEY (subkomponen_spml_id)
	REFERENCES subkomponen_spml_ref (id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
	
);
---
CREATE TABLE checklist_spml_ref(
	id SERIAL PRIMARY KEY,
	title TEXT,
	uraian TEXT,
	dokumen TEXT,
	komponen_spml_id INT,
	subkomponen_spml_id INT, 
	aspek_spml_id INT,
	deleted TIMESTAMP WITHOUT TIME ZONE,

	CONSTRAINT fk_checklist_spml_komponen_spml 
		FOREIGN KEY (komponen_spml_id)
		REFERENCES komponen_spml_ref(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	
	CONSTRAINT fk_checklist_spml_subkomponen_spml
		FOREIGN KEY (subkomponen_spml_id)
		REFERENCES subkomponen_spml_ref(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,

	CONSTRAINT fk_checklist_spml_aspek_spml
		FOREIGN KEY (aspek_spml_id)
		REFERENCES aspek_spml_ref(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);
---
CREATE TABLE worksheet_spml_junction (
	junction_id SERIAL PRIMARY KEY,
	worksheet_id UUID NOT NULL,
	checklist_spml_id INT NOT NULL,
	kanwil_score integer,
	kppn_score integer, 
	file_1 TEXT,
	kanwil_note TEXT, 
	kppn_id TEXT,
	last_update TIMESTAMP WITH TIME ZONE,
	updated_by TEXT,
	excluded integer DEFAULT 0,
	link_file TEXT
);

---


ALTER TABLE comment_data ADD COLUMN ws_spml_junction_id INTEGER DEFAULT NULL;


COMMIT;