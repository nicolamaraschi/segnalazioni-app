// Importa il modulo Express per gestire le richieste HTTP
const express = require('express');

// Importa bcryptjs per gestire la crittografia delle password
const bcrypt = require('bcryptjs');

// Importa jsonwebtoken per gestire la generazione e verifica dei token JWT
const jwt = require('jsonwebtoken');

// Importa il modello User per interagire con il database degli utenti
const User = require('../models/User');

// Crea un router Express per definire le route
const router = express.Router();

const argon2 = require('argon2');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send({ message: 'Username and password are required' });

  try {
    const hashedPassword = await argon2.hash(password);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).send({ message: 'User registered' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ message: 'Failed to register user', error });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const match = await argon2.verify(user.password, password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

      // Salva l'utente nella sessione
      req.session.user = {
        _id: user._id,
        username: user.username,
        role: user.role
      };
      

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Route per il logout
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).send({ message: 'Failed to logout' });
      }
      res.send({ message: 'Logout successful' });
    });
  } else {
    res.status(400).send({ message: 'No session found' });
  }
});


// Route per verificare lo stato di autenticazione
router.get('/status', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, isAdmin: req.session.user.role === 'admin' });
  } else {
    res.send({ loggedIn: false, isAdmin: false });
  }
});



// Esporta il router per essere utilizzato in altri file
module.exports = router;
