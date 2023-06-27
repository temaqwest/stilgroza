CREATE TABLE lightnings (
    id SERIAL PRIMARY KEY,
    latitude NUMERIC(8,6),
    longitude NUMERIC(9,6),
    time TIMESTAMP
);

INSERT INTO lightnings (latitude, longitude, time) VALUES (45.0428000, 41.9220877, NOW());
INSERT INTO lightnings (latitude, longitude, time) VALUES (44.9831639, 41.9468195, NOW());
INSERT INTO lightnings (latitude, longitude, time) VALUES (45.0557135, 41.7397022, NOW());
INSERT INTO lightnings (latitude, longitude, time) VALUES (45.0110953, 41.6470538, NOW());
INSERT INTO lightnings (latitude, longitude, time) VALUES (48.1711489, 29.8518174, NOW());
