DROP TYPE IF EXISTS type_activite CASCADE;
DROP TABLE IF EXISTS Reservation CASCADE;
DROP TABLE IF EXISTS Creneau CASCADE;
DROP TABLE IF EXISTS Utilisateur CASCADE;
DROP TABLE IF EXISTS Role CASCADE;
DROP TABLE IF EXISTS Activite CASCADE;
DROP TABLE IF EXISTS Formule CASCADE;

CREATE TYPE type_activite AS ENUM ('Groupe', 'Perso');


CREATE TABLE Activite (
    id_activite SERIAL PRIMARY KEY,
    nom_activite VARCHAR(255) NOT NULL,
    image_activite VARCHAR(255),
    description_activite VARCHAR(1000),
    type_activite type_activite NOT NULL
);


CREATE TABLE Formule (
    id_formule SERIAL PRIMARY KEY,
    id_activite INT NOT NULL,
    nom_formule VARCHAR(255) NOT NULL,
    prix_formule DECIMAL(5,2) NOT NULL,
    unite VARCHAR(20) NOT NULL, -- ex : 'mois', 'séance', 'heure'
    FOREIGN KEY (id_activite) REFERENCES Activite(id_activite) ON DELETE CASCADE
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
    id_formule INT,
    FOREIGN KEY (id_role) REFERENCES Role(id_role) ON DELETE RESTRICT,
    FOREIGN KEY (id_formule) REFERENCES Formule(id_formule) ON DELETE RESTRICT
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



INSERT INTO Activite (nom_activite, image_activite, description_activite, type_activite) VALUES
    ('Coaching personnel', 'coachingperso.jpg', 'Atteignez vos objectifs avec un accompagnement sur mesure ! Que vous souhaitiez perdre du poids, gagner en masse musculaire ou simplement retrouver la forme, nos séances de coaching individuel sont adaptées à votre niveau, votre rythme et vos besoins. Profitez d’un suivi motivant, de conseils professionnels et de programmes personnalisés pour progresser efficacement.', 'Perso'),
    ('Remise en forme', 'remiseforme.jpg', 'Reprenez le contrôle de votre forme physique ! Grâce à un accompagnement personnalisé, retrouvez tonus, endurance et motivation à votre rythme. Idéal après une pause, une blessure ou simplement pour reprendre de bonnes habitudes.', 'Groupe'),
    ('Sport santé', 'sportsanté.jpg', 'Reprenez le contrôle de votre forme physique ! Grâce à un accompagnement personnalisé, retrouvez tonus, endurance et motivation à votre rythme. Idéal après une pause, une blessure ou simplement pour reprendre de bonnes habitudes.', 'Groupe'),
    ('Cross-training','crosstraining.jpg','Un entraînement complet et intense pour repousser vos limites ! Le cross training combine renforcement musculaire, cardio et mobilité pour améliorer votre condition physique globale. Accessible à tous niveaux, chaque séance est variée, dynamique et ultra motivante.','Groupe'),
    ('Cardio-boxing','cardioboxing','Défoulez-vous tout en brûlant un max de calories ! Le cardio boxing mêle mouvements de boxe et exercices de cardio pour renforcer le corps, améliorer l’endurance et libérer le stress. Une séance rythmée, sans contact, accessible à tous.','Groupe'),
    ('Réathlétisation','reathletisation.jpg','Retrouvez vos capacités physiques en toute sécurité après une blessure ou un arrêt prolongé. La réathlétisation vous aide à reconstruire force, mobilité et confiance grâce à un programme progressif, adapté à vos besoins et encadré par un professionnel.','Perso'),
    ('Biking','biking.jpg','Un entraînement cardio ultra dynamique sur vélo indoor ! Enchaînez les phases d’intensité sur fond de musique motivante pour brûler des calories, renforcer les jambes et booster votre endurance. Accessible à tous, ambiance garantie !','Groupe');


INSERT INTO Formule (id_activite,nom_formule, prix_formule, unite) VALUES
    (2,'Abonnement mensuel', 29.99, 'mois'),
    (2,'Séance unique', 9.99, 'séance'),
    (2,'Forfait 10 séances', 79.90, 'séance'),
    (2,'Coaching personnalisé',70.00,'heure');

INSERT INTO Utilisateur (nom_utilisateur, prenom_utilisateur, adresse_mail, mot_de_passe, id_role,id_formule) VALUES
    ('Durand', 'Alice', 'alice.durand@example.com', 'mdp123', 2,2),
    ('Martin', 'Lucas', 'lucas.martin@example.com', 'mdp456', 2,2),
    ('Admin','Admin','admin@domain.com','test',1,NULL);



INSERT INTO Creneau (id_activite, date_activite, heure_debut, heure_fin, places_disponibles) VALUES
    (1, '2025-05-01', '14:00', '16:00', 15),
    (2, '2025-05-03', '18:00', '20:00', 22),
    (3, '2025-05-05', '20:00', '23:00', 50);


INSERT INTO Reservation (id_creneau, id_utilisateur) VALUES
    (1, 1),
    (2, 2),
    (3, 1),
    (2,2);

