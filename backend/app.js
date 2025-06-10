const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const commandeRoutes = require('./routes/commande');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // ← /agent et /transitaire
app.use('/api/commandes', commandeRoutes);

module.exports = app;
