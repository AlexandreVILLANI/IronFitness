const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const multer = require('multer');
const fs = require('fs');

// Config .env
dotenv.config();
const app = express();

// Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'MyApp API',
            version: '1.0.0',
            description: 'Documentation de l\'API',
        },
        servers: [{ url: "http://localhost:3000" }],
    },
    apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware CORS
app.use(cors({
    origin: ['https://ironfitness-front.onrender.com', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'session-id', 'Authorization']
}));

// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Route pour récupérer tous les fichiers d'image dans /uploads (récursivement)
app.get('/api/images', (req, res) => {
    const dir = path.join(__dirname, 'uploads');

    try {
        const files = fs.readdirSync(dir);
        const imagePaths = files
            .filter(file => {
                const filePath = path.join(dir, file);
                const isFile = fs.statSync(filePath).isFile();
                const isImage = /\.(jpe?g|png|gif)$/i.test(file);
                return isFile && isImage;
            })
            .map(file => `/uploads/${file}`);

        res.json(imagePaths);
    } catch (err) {
        console.error('Erreur lors de la lecture du dossier uploads:', err);
        res.status(500).json({ error: 'Impossible de lire les fichiers' });
    }
});

const uploadDir = path.join(__dirname, 'uploads');

app.delete('/upload/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Erreur suppression fichier :', err);
            return res.status(500).json({ error: 'Erreur lors de la suppression du fichier' });
        }

        res.json({ message: 'Fichier supprimé avec succès' });
    });
});


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite à 5MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif)'));
        }
    }
});

// Middleware pour gérer les erreurs de Multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(500).json({ error: err.message });
    }
    next();
});

// Sessions & cookies
app.use(cookieParser());
app.use(session({
    secret: 'SuperSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    },
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Routes ===
const activiteRouter = require('./routes/activite.router');
const formuleRouter = require('./routes/formule.router');
const loginRoutes = require('./routes/authentification.router');
const usersRoutes = require('./routes/user.router');
const mailRoutes = require('./routes/mail.router');
const creneauRoutes = require('./routes/creneau.router');
const goodiesRoutes = require('./routes/goodies.router');

// Route simple pour l'upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier uploadé' });
    }

    res.status(200).json({
        message: 'Fichier uploadé avec succès',
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
    });
});

// Routes existantes
app.use('/activite', activiteRouter);
app.use('/formule', formuleRouter);
app.use('/login', loginRoutes);
app.use('/users', usersRoutes);
app.use('/mail', mailRoutes);
app.use('/creneau', creneauRoutes);
app.use('/goodies', goodiesRoutes);
app.use('/uploads', express.static('uploads'));

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});