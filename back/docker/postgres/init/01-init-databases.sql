-- Provisionne une base et un utilisateur dédiés par microservice (database-per-service).
-- Ce script n'est exécuté qu'une seule fois, à la création initiale du volume Postgres
-- (répertoire /docker-entrypoint-initdb.d de l'image officielle postgres).
--
-- Chaque service est OWNER de sa base : il a tous les droits sur son schéma public,
-- et aucun droit sur les bases des autres services.

CREATE USER auth_service WITH PASSWORD 'auth_service_pwd';
CREATE DATABASE authdb OWNER auth_service;

CREATE USER vehicle_service WITH PASSWORD 'vehicle_service_pwd';
CREATE DATABASE vehicledb OWNER vehicle_service;

CREATE USER booking_service WITH PASSWORD 'booking_service_pwd';
CREATE DATABASE bookingdb OWNER booking_service;
