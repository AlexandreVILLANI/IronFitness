DROP TABLE IF EXISTS Session CASCADE;
DROP TYPE IF EXISTS type_activite, unite CASCADE;
DROP TABLE IF EXISTS Reservation CASCADE;
DROP TABLE IF EXISTS Creneau CASCADE;
DROP TABLE IF EXISTS Utilisateur CASCADE;
DROP TABLE IF EXISTS Role CASCADE;
DROP TABLE IF EXISTS Activite CASCADE;
DROP TABLE IF EXISTS Formule CASCADE;
DROP TABLE IF EXISTS Formule_Activite CASCADE;
DROP TABLE IF EXISTS Formule_Utilisateur CASCADE;


CREATE TYPE type_activite AS ENUM ('Groupe', 'Perso');
CREATE TYPE unite AS ENUM ('mois','séance','heure');

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
    unite unite NOT NULL -- ex : 'mois', 'séance', 'heure'
);

-- table de liaison, une formule à plusieurs activite inclus
CREATE TABLE Formule_Activite (
    id_formule INT NOT NULL,
    id_activite INT NOT NULL,
    PRIMARY KEY (id_formule, id_activite),
    FOREIGN KEY (id_formule) REFERENCES Formule(id_formule) ON DELETE CASCADE,
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
    FOREIGN KEY (id_role) REFERENCES Role(id_role) ON DELETE RESTRICT
);

-- table de liaison, un utilisateur peut avoir plusieurs formule
CREATE TABLE Formule_Utilisateur (
    id_formule INT NOT NULL,
    id_utilisateur INT NOT NULL,
    PRIMARY KEY (id_formule, id_utilisateur),
    FOREIGN KEY (id_formule) REFERENCES Formule(id_formule) ON DELETE CASCADE,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
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


CREATE TABLE Session(
    id_session VARCHAR(255),
    id_utilisateur INT PRIMARY KEY ,
    timeLimit TIMESTAMP,
    FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);


INSERT INTO Activite (nom_activite, image_activite, description_activite, type_activite) VALUES
    ('Coaching personnel', 'coachingperso', 'Atteignez vos objectifs avec un accompagnement sur mesure ! Que vous souhaitiez perdre du poids, gagner en masse musculaire ou simplement retrouver la forme, nos séances de coaching individuel sont adaptées à votre niveau, votre rythme et vos besoins. Profitez d’un suivi motivant, de conseils professionnels et de programmes personnalisés pour progresser efficacement.', 'Perso'),
    ('Remise en forme', 'remiseforme', 'Reprenez le contrôle de votre forme physique ! Grâce à un accompagnement personnalisé, retrouvez tonus, endurance et motivation à votre rythme. Idéal après une pause, une blessure ou simplement pour reprendre de bonnes habitudes.', 'Groupe'),
    ('Sport santé', 'sportsante', 'Bougez mieux, vivez mieux ! Nos séances de coaching sport santé visent à améliorer votre forme physique en douceur, tout en prévenant les douleurs et les déséquilibres. Un accompagnement personnalisé, adapté à vos capacités, pour retrouver bien-être, énergie et mobilité au quotidien.', 'Groupe'),
    ('Cross-training','crosstraining','Un entraînement complet et intense pour repousser vos limites ! Le cross training combine renforcement musculaire, cardio et mobilité pour améliorer votre condition physique globale. Accessible à tous niveaux, chaque séance est variée, dynamique et ultra motivante.','Groupe'),
    ('Cardio-boxing','cardioboxing','Défoulez-vous tout en brûlant un max de calories ! Le cardio boxing mêle mouvements de boxe et exercices de cardio pour renforcer le corps, améliorer l’endurance et libérer le stress. Une séance rythmée, sans contact, accessible à tous.','Groupe'),
    ('Réathlétisation','reathletisation','Retrouvez vos capacités physiques en toute sécurité après une blessure ou un arrêt prolongé. La réathlétisation vous aide à reconstruire force, mobilité et confiance grâce à un programme progressif, adapté à vos besoins et encadré par un professionnel.','Perso'),
    ('Biking','biking','Un entraînement cardio ultra dynamique sur vélo indoor ! Enchaînez les phases d’intensité sur fond de musique motivante pour brûler des calories, renforcer les jambes et booster votre endurance. Accessible à tous, ambiance garantie !','Groupe'),
    ('Musculation','musculation','A faire','Groupe'),
    ('Boxe Anglaise','boxeanglaise','A faire','Groupe'),
    ('Kick Boxing','kickboxing','A faire','Groupe'),
    ('MMA','mma','A faire','Groupe');


INSERT INTO Formule (nom_formule, prix_formule, unite) VALUES
    ('Cours collectif', 30.90, 'mois'),
    ('Boxing', 59.90, 'mois'),
    ('Sport santé', 19.90, 'séance'),
    ('Réathlétisation',34.90,'séance'),
    ('Coaching personnalisé',69.90,'heure');

INSERT INTO Formule_Activite(id_formule, id_activite) VALUES
    --Cours collectif
    (1,7),--biking
    (1,4),--cross-training
    (1,5),--cardio-boxing
    (1,8),--musculation

    --Boxing
    (2,9),--boxe anglaise
    (2,10),--kick boxing
    (2,11),--mma
    (2,8),--musculation

    --Sport santé
    (3,3),--sport santé

    --Réathlétisation
    (4,6),--réathlétisation

    --Coaching personnalisé
    (5,1);--coaching personnalisé


INSERT INTO Utilisateur (nom_utilisateur, prenom_utilisateur, adresse_mail, mot_de_passe, id_role) VALUES
    ('Durand', 'Alice', 'alice.durand@example.com', 'mdp123', 2),
    ('Martin', 'Lucas', 'lucas.martin@example.com', 'mdp456', 2),
    ('Admin','Admin','admin@domain.com','test',1);



INSERT INTO Creneau (id_activite, date_activite, heure_debut, heure_fin, places_disponibles) VALUES
    (1, '2025-05-01', '14:00', '16:00', 15),
    (2, '2025-05-03', '18:00', '20:00', 22),
    (3, '2025-05-05', '20:00', '23:00', 50);


INSERT INTO Reservation (id_creneau, id_utilisateur) VALUES
    (1, 1),
    (2, 2),
    (3, 1),
    (2,2);

INSERT INTO Formule_Utilisateur (id_formule, id_utilisateur) VALUES
    --Utilisateur 1
     (1,1), --Cours co
     (3,1), --sport santé

     --Utilisateur 2
     (2,2); --boxing




