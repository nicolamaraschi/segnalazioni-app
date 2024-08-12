require('dotenv').config(); // Carica le variabili di ambiente dal file .env
const mongoose = require('mongoose');
const argon2 = require('argon2'); // Usa argon2
const User = require('./models/User'); // Assicurati che il path al tuo modello User sia corretto

// Configura la connessione a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createAdmin();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Funzione per creare l'utente admin
const createAdmin = async () => {
  try {
    const username = 'x'; // Username dell'admin
    const password = 'x'; // Password dell'admin

    // Hash della password
    const hashedPassword = await argon2.hash(password);

    // Crea un nuovo utente admin
    const admin = new User({
      username,
      password: hashedPassword,
      role: 'admin'
    });

    // Salva l'utente nel database
    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
};
