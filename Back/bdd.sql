DROP TYPE IF EXISTS type_activite CASCADE;
DROP TABLE IF EXISTS Reservation CASCADE;
DROP TABLE IF EXISTS Creneau CASCADE;
DROP TABLE IF EXISTS Utilisateur CASCADE;
DROP TABLE IF EXISTS Role CASCADE;
DROP TABLE IF EXISTS Activite CASCADE;
DROP TABLE IF EXISTS Formule CASCADE;


CREATE TYPE type_activite AS ENUM ('Culture', 'Loisir', 'Concert', 'Sport', 'Restauration');


CREATE TABLE Activite (
    id_activite SERIAL PRIMARY KEY,
    nom_activite VARCHAR(255) NOT NULL,
    image_activite VARCHAR(255),
    description_activite VARCHAR(1000),
    type_activite type_activite NOT NULL
);


CREATE TABLE Formule (
    id_formule SERIAL PRIMARY KEY,
    nom_formule VARCHAR(255) NOT NULL,
    prix_formule DECIMAL(5,2) NOT NULL,
    unite VARCHAR(20) NOT NULL -- ex : 'mois', 'séance', 'heure'
);


CREATE TABLE Role (
    id_role SERIAL PRIMARY KEY,
    nom_role VARCHAR(50) NOT NULL
);


CREATE TABLE Utilisateur (
    id_utilisateur SERIAL PRIMARY KEY,
    nom_utilisateur VARCHAR(50) NOT NULL,
    prenom_utilisateur VARCHAR(50) NOT NULL,
    adresse_mail VARCHAR(50) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(250) NOT NULL,
    id_role INT NOT NULL,
    FOREIGN KEY (id_role) REFERENCES Role(id_role) ON DELETE RESTRICT
);


CREATE TABLE Creneau (
    id_creneau SERIAL PRIMARY KEY,
    id_activite INT NOT NULL,
    date_activite DATE NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    places_disponibles INT NOT NULL CHECK (places_disponibles >= 0),
    FOREIGN KEY (id_activite) REFERENCES Activite(id_activite) ON DELETE CASCADE
);

CREATE TABLE Reservation (
    id_reservation SERIAL PRIMARY KEY,
    id_creneau INT NOT NULL,
    id_utilisateur INT NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_creneau) REFERENCES Creneau(id_creneau) ON DELETE CASCADE
);



INSERT INTO Role (nom_role) VALUES
    ('Administrateur'),
    ('Client');


INSERT INTO Utilisateur (nom_utilisateur, prenom_utilisateur, adresse_mail, mot_de_passe, id_role) VALUES
    ('Durand', 'Alice', 'alice.durand@example.com', 'mdp123', 2),
    ('Martin', 'Lucas', 'lucas.martin@example.com', 'mdp456', 2);


INSERT INTO Activite (nom_activite, image_activite, description_activite, type_activite) VALUES
    ('Atelier Peinture', 'peinture.jpg', 'Atelier créatif pour apprendre la peinture.', 'Culture'),
    ('Match de Foot', 'foot.jpg', 'Rencontre amicale au stade municipal.', 'Sport'),
    ('Concert Jazz', 'jazz.jpg', 'Soirée de jazz en plein air.', 'Concert');


INSERT INTO Formule (nom_formule, prix_formule, unite) VALUES
    ('Abonnement mensuel', 29.99, 'mois'),
    ('Séance unique', 9.99, 'séance'),
    ('Forfait 10 séances', 79.90, 'séance'),
    ('Coaching personnalisé',70.00,'heure');


INSERT INTO Creneau (id_activite, date_activite, heure_debut, heure_fin, places_disponibles) VALUES
    (1, '2025-05-01', '14:00', '16:00', 15),
    (2, '2025-05-03', '18:00', '20:00', 22),
    (3, '2025-05-05', '20:00', '23:00', 50);


INSERT INTO Reservation (id_creneau, id_utilisateur) VALUES
    (1, 1),
    (2, 2),
    (3, 1),
    (2,2);

