use IMCT_DEMO

CREATE TABLE [MasterData] (
    valueID bigint IDENTITY(1,1) PRIMARY KEY NOT NULL,
    Reference VARCHAR(225),
    valueData FLOAT,
    valueDatetime DATETIME
);

CREATE TABLE [XBarChart] (
    id bigint IDENTITY(1,1) PRIMARY KEY NOT NULL,
    Reference VARCHAR(225),
    valueArray VARCHAR(225),
    valueDatetime DATETIME,
);

CREATE TABLE [KanBan] (
    id bigint IDENTITY(1,1) PRIMARY KEY NOT NULL,
    reference VARCHAR(225),
    phaseArray VARCHAR(225),
    content VARCHAR(225) UNIQUE,
	phase INT,
	color VARCHAR(225),
    position INT,
    showStatus INT,
);