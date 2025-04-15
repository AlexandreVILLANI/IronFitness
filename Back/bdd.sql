DROP TYPE IF EXISTS type_activite CASCADE ;
DROP TABLE IF EXISTS Activite CASCADE;
DROP TABLE IF EXISTS Formule CASCADE ;


CREATE TYPE type_activite AS ENUM('Culture', 'Loisir', 'Concert', 'Sport', 'Restauration');

CREATE TABLE Activite (
    id_activite SERIAL PRIMARY KEY,
    nom_activite VARCHAR(255) NOT NULL,
    image_activite VARCHAR(255),
    description_activite VARCHAR(1000),
    type_activite type_activite NOT NULL

);

CREATE TABLE Formule (
    id_formule SERIAL PRIMARY KEY,
    nom_formule VARCHAR(255),
    prix_formule DECIMAL(5,2),
    unite VARCHAR(20) --ex 'mois', 'seance', 'heure'
);


