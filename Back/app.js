const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
    servers: [{ url: "http://localhost:3000" }],
    //    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE','PUT'],  // Ajoutez 'PATCH' ici
    allowedHeaders: ['Content-Type', 'session-id'] // <-- ajoute ton header ici
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
        secure: process.env.NODE_ENV === 'production', // Assurez-vous d'utiliser HTTPS en prod
        sameSite: 'lax',
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
const creneauRoutes = require('./routes/creneau.router')

app.use('/activite', activiteRouter);
app.use('/formule', formuleRouter);
app.use('/login',loginRoutes);
app.use('/users', usersRoutes);
app.use('/mail',mailRoutes);
app.use('/creneau',creneauRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
