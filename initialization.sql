CREATE TABLE lightnings (
    id SERIAL PRIMARY KEY,
    latitude NUMERIC(8,6),
    longitude NUMERIC(9,6)
);

INSERT INTO lightnings (latitude, longitude) VALUES (45.0428000, 41.9220877);
INSERT INTO lightnings (latitude, longitude) VALUES (44.9831639, 41.9468195);
