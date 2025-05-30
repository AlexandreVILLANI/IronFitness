const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const pool = require('./database/db'); 

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
        servers: [{ url: "https://ironfitness.onrender.com" }],
    },
    apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware CORS
app.use(cors({
    origin: ['https://ironfitness-front.onrender.com', 'http://localhost:5173','https://ironfitness.fr'],
    servers: [{ url: "http://localhost:3000" }],
    //    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE','PUT'],  
    allowedHeaders: ['Content-Type', 'session-id'] 
}));


// Sessions & cookies
app.use(cookieParser());
app.use(session({
    secret: 'SuperSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,//process.env.NODE_ENV === 'production', 
        sameSite: 'none',
    },
}));


// Body parser
app.use(express.json());

// === Routes ===
const activiteRouter = require('./routes/activite.router');
const formuleRouter = require('./routes/formule.router');
const loginRoutes = require('./routes/authentification.router');
const usersRoutes = require('./routes/user.router');
const mailRoutes = require('./routes/mail.router');
const creneauRoutes = require('./routes/creneau.router');
const goodiesRoutes = require('./routes/goodies.router')

app.use('/activite', activiteRouter);
app.use('/formule', formuleRouter);
app.use('/login',loginRoutes);
app.use('/users', usersRoutes);
app.use('/mail',mailRoutes);

try {
    const activiteRouter = require('./routes/activite.router');
    app.use('/activite', activiteRouter);
    console.log('✅ Route /activite chargée');
} catch (err) {
    console.error('❌ Problème lors du chargement de la route /activite:', err);
}

app.get('/ping', (req, res) => {
    res.send('pong');
});

// test pour render
app.get('/api/test', (req, res) => {
    res.json({ message: 'Le backend fonctionne 🔥' });
});
//test 2 pour render
app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT NOW() AS now');
        res.json({ time: rows[0].now });
    } catch (err) {
        console.error('Erreur DB :', err);
        res.status(500).json({ error: 'Connexion DB échouée' });
    }
});

app.use('/mail',mailRoutes);
app.use('/creneau',creneauRoutes);
app.use('/goodies',goodiesRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
