DROP TABLE IF EXISTS Session CASCADE;
DROP TABLE IF EXISTS Reservation CASCADE;
DROP TABLE IF EXISTS Creneau CASCADE;
DROP TABLE IF EXISTS Formule_Utilisateur CASCADE;
DROP TABLE IF EXISTS Formule_Activite CASCADE;
DROP TABLE IF EXISTS Utilisateur CASCADE;
DROP TABLE IF EXISTS Role CASCADE;
DROP TABLE IF EXISTS Formule CASCADE;
DROP TABLE IF EXISTS Activite CASCADE;
DROP TABLE IF EXISTS Taille_goodies CASCADE;
DROP TABLE IF EXISTS Taille CASCADE;
DROP TYPE IF EXISTS type_activite, unite CASCADE;
DROP TABLE IF EXISTS Goodies CASCADE;

CREATE TYPE type_activite AS ENUM ('En groupe', 'Personnel');
CREATE TYPE unite AS ENUM ('mois','séance','heure');

CREATE TABLE Activite (
    id_activite SERIAL PRIMARY KEY,
    nom_activite VARCHAR(255) NOT NULL,
    image_activite VARCHAR(255),
    description_activite VARCHAR(1000),
    type_activite type_activite NOT NULL,
    sur_rendezvous BOOLEAN DEFAULT FALSE
);


CREATE TABLE Formule (
    id_formule SERIAL PRIMARY KEY,
    nom_formule VARCHAR(255) NOT NULL,
    prix_formule DECIMAL(5,2) NOT NULL,
    unite unite NOT NULL, -- ex : 'mois', 'séance', 'heure'
    sur_rendezvous BOOLEAN DEFAULT FALSE
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

CREATE TABLE Goodies(
    id_goodies SERIAL PRIMARY KEY,
    nom_goodies varchar(255),
    image_goodies VARCHAR(255),
    prix_goodies DECIMAL(5,2) NOT NULL
);

CREATE TABLE Taille(
    id_taille SERIAL PRIMARY KEY ,
    valeur_taille VARCHAR(255)
);

CREATE TABLE Taille_goodies(
    id_goodies INT NOT NULL,
    id_taille INT NOT NULL,
    quantite_stock BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_goodies,id_taille),
    FOREIGN KEY (id_goodies) REFERENCES Goodies(id_goodies) ON DELETE CASCADE ,
    FOREIGN KEY (id_taille) REFERENCES Taille(id_taille) ON DELETE CASCADE
);



INSERT INTO Activite (nom_activite, image_activite, description_activite, type_activite,sur_rendezvous) VALUES
    ('Coaching personnel', 'coachingperso', 'Atteignez vos objectifs avec un accompagnement sur mesure ! Que vous souhaitiez perdre du poids, gagner en masse musculaire ou simplement retrouver la forme, nos séances de coaching individuel sont adaptées à votre niveau, votre rythme et vos besoins. Profitez d’un suivi motivant, de conseils professionnels et de programmes personnalisés pour progresser efficacement.', 'Personnel',false),
    ('Remise en forme', 'remiseforme', 'Reprenez le contrôle de votre forme physique ! Grâce à un accompagnement personnalisé, retrouvez tonus, endurance et motivation à votre rythme. Idéal après une pause, une blessure ou simplement pour reprendre de bonnes habitudes.','En groupe',false),
    ('Sport santé', 'sportsante', 'Bougez mieux, vivez mieux ! Nos séances de coaching sport santé visent à améliorer votre forme physique en douceur, tout en prévenant les douleurs et les déséquilibres. Un accompagnement personnalisé, adapté à vos capacités, pour retrouver bien-être, énergie et mobilité au quotidien.', 'En groupe',true),
    ('Cross-training','crosstraining','Un entraînement complet et intense pour repousser vos limites ! Le cross training combine renforcement musculaire, cardio et mobilité pour améliorer votre condition physique globale. Accessible à tous niveaux, chaque séance est variée, dynamique et ultra motivante.','En groupe',false),
    ('Cardio-boxing','cardioboxing','Défoulez-vous tout en brûlant un max de calories ! Le cardio boxing mêle mouvements de boxe et exercices de cardio pour renforcer le corps, améliorer l’endurance et libérer le stress. Une séance rythmée, sans contact, accessible à tous.','En groupe',false),
    ('Réathlétisation','reathletisation','Retrouvez vos capacités physiques en toute sécurité après une blessure ou un arrêt prolongé. La réathlétisation vous aide à reconstruire force, mobilité et confiance grâce à un programme progressif, adapté à vos besoins et encadré par un professionnel.','Personnel',false),
    ('Biking','biking','Un entraînement cardio ultra dynamique sur vélo indoor ! Enchaînez les phases d’intensité sur fond de musique motivante pour brûler des calories, renforcer les jambes et booster votre endurance. Accessible à tous, ambiance garantie !','En groupe',true),
    ('Musculation','musculation','Développez votre force, votre masse musculaire et votre endurance avec des séances de musculation adaptées à votre niveau. Encadré par nos coachs, progressez en toute sécurité et atteignez vos objectifs grâce à des programmes variés et efficaces.','En groupe',false),
    ('Boxe Anglaise','boxeanglaise','Apprenez les techniques de la boxe anglaise dans un cadre encadré et sécurisé. Travail du cardio, de la coordination, de la précision et de la puissance, le tout dans une ambiance dynamique et respectueuse. Ouvert à tous niveaux.','En groupe',false),
    ('Kick Boxing','kickboxing','Alliez puissance et agilité avec le kick boxing ! Ce sport de combat complet mêle coups de poing et coups de pied dans un entraînement intense qui développe force, souplesse et endurance. Idéal pour se défouler tout en apprenant à se défendre.','En groupe',false),
    ('MMA','mma','Découvrez le Mixed Martial Arts (MMA), un sport de combat complet combinant plusieurs disciplines : boxe, lutte, jiu-jitsu, et plus encore. Travail technique, physique et mental garanti dans un cadre sécurisé et encadré par des professionnels.','En groupe',false);



INSERT INTO Formule (nom_formule, prix_formule, unite,sur_rendezvous) VALUES
    ('Cours collectif', 30.90, 'mois',false),
    ('Boxing', 59.90, 'mois',false),
    ('Sport santé', 19.90, 'séance',true),
    ('Réathlétisation',34.90,'séance',true),
    ('Coaching personnalisé',69.90,'heure',true);

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
    ('Durand', 'Alice', 'alice.durand@example.com', '2f81cba8c3e6f76972a8a3991fd5980eb77515f1fc9d05e5e094e1b82f457776', 1),--mdp123
    ('Martin', 'Lucas', 'lucas.martin@example.com', '7cb1398717b8459e431ccb042a1c3c9825392898b354828141f093709137f2dc', 1), --mdp456
    ('Administrateur','William','villalex405@gmail.com','89e0bc8bfa515d4d8da38e46400a3e724638dead9dcd085a0dd56300798de6a3',2);
-- faudra pas oublié de remettre son email : fitboxing70@gmail.com
--pour faire des test sur une adresse mail : https://www.mail-tester.com/?lang=fr

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


INSERT INTO Goodies(nom_goodies, image_goodies,prix_goodies) VALUES
    ('Short','short',35),
    ('T-Shirt','t-shirt',25),
    ('Débardeur','debardeur',25),
    ('Gants','gants',35),
    ('Ensemble','ensemble',80);

INSERT INTO Taille(valeur_taille) VALUES
    ('XXXS'),
    ('XXS'),
    ('XS'),
    ('S'),
    ('M'),
    ('L'),
    ('XL');


INSERT INTO Taille_goodies(id_goodies, id_taille, quantite_stock) VALUES
    -- Short (id_goodies = 1)
    (1, 1, FALSE), -- Short, XXXS
    (1, 2, FALSE), -- Short, XXS
    (1, 3, FALSE), -- Short, XS
    (1, 4, FALSE), -- Short, S
    (1, 5, FALSE), -- Short, M
    (1, 6, FALSE), -- Short, L
    (1, 7, FALSE), -- Short, XL

    -- T-Shirt (id_goodies = 2)
    (2, 1, FALSE), -- T-Shirt, XXXS
    (2, 2, FALSE), -- T-Shirt, XXS
    (2, 3, FALSE), -- T-Shirt, XS
    (2, 4, FALSE), -- T-Shirt, S
    (2, 5, FALSE), -- T-Shirt, M
    (2, 6, FALSE), -- T-Shirt, L
    (2, 7, FALSE), -- T-Shirt, XL

    -- Débardeur (id_goodies = 3)
    (3, 1, FALSE), -- Débardeur, XXXS
    (3, 2, FALSE), -- Débardeur, XXS
    (3, 3, FALSE), -- Débardeur, XS
    (3, 4, FALSE), -- Débardeur, S
    (3, 5, FALSE), -- Débardeur, M
    (3, 6, FALSE), -- Débardeur, L
    (3, 7, FALSE), -- Débardeur, XL

    -- Gants (id_goodies = 4)
    (4, 1, FALSE), -- Gants, XXXS
    (4, 2, FALSE), -- Gants, XXS
    (4, 3, FALSE), -- Gants, XS
    (4, 4, FALSE), -- Gants, S
    (4, 5, FALSE), -- Gants, M
    (4, 6, FALSE), -- Gants, L
    (4, 7, FALSE), -- Gants, XL

    -- Ensemble (id_goodies = 5)
    (5, 1, FALSE), -- Ensemble, XXXS
    (5, 2, FALSE), -- Ensemble, XXS
    (5, 3, FALSE), -- Ensemble, XS
    (5, 4, FALSE), -- Ensemble, S
    (5, 5, FALSE), -- Ensemble, M
    (5, 6, FALSE), -- Ensemble, L
    (5, 7, FALSE); -- Ensemble, XL


