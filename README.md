# Segnalazioni App

Segnalazioni App è un'applicazione web che permette agli utenti di inviare segnalazioni e agli amministratori di gestirle. Gli utenti possono visualizzare tutte le segnalazioni (accettate, rifiutate o in attesa), mentre gli amministratori possono gestire solo quelle in attesa.

## Funzionalità principali

- **Registrazione e Login:** Gli utenti possono registrarsi e accedere all'applicazione.
- **Gestione delle Segnalazioni:** Gli utenti possono creare segnalazioni, mentre gli amministratori possono accettare o rifiutare le segnalazioni in sospeso.
- **Logout:** Gli utenti possono disconnettersi dalla sessione.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Autenticazione**: Sessioni gestite con Express-Session e Argon2 per la crittografia delle password.
- **Frontend**: HTML, CSS, JavaScript
- **Middleware**: Admin middleware per proteggere le rotte riservate agli amministratori.


## Requisiti

- Node.js
- MongoDB

## Installazione

1. Clona questo repository:
    ```bash
    git clone https://github.com/tuo-username/segnalazioni-app.git
    cd segnalazioni-app
    ```

2. Installa le dipendenze:
    ```bash
    npm install
    ```

3. Configura le variabili d'ambiente:
    Crea un file `.env` nella directory principale e aggiungi le seguenti variabili:
    ```
    MONGODB_URI=your-mongodb-uri
    SESSION_SECRET=your-session-secret
    ```

4. Avvia l'applicazione:
   ```bash
    node server.js
    ```

    Il server sarà in esecuzione su `http://localhost:3000`.

## Struttura del Progetto

- **`server.js`**: File principale del server.
- **`/routes`**: Contiene le route per l'autenticazione e la gestione delle segnalazioni.
- **`/models`**: Modelli Mongoose per MongoDB.
- **`/public`**: Contiene i file statici (HTML, CSS, JS).

- ```bash
segnalazioni-app/
│
├── models/
│   ├── User.js          # Modello Mongoose per gli utenti
│   ├── Report.js        # Modello Mongoose per le segnalazioni
│
├── routes/
│   ├── auth.js          # Rotte per l'autenticazione
│   ├── reports.js       # Rotte per la gestione delle segnalazioni
│
├── public/
│   ├── index.html       # Pagina principale
│   ├── admin.html       # Pagina per gli amministratori
│   ├── js/
│       ├── main.js      # Logica lato client
│
├── .env                 # Variabili d'ambiente
├── server.js            # Configurazione del server Express
├── README.md            # Documentazione del progetto
└── package.json         # Dipendenze del progetto


## API Endpoints

### Autenticazione

#### `POST /api/auth/register`
Registra un nuovo utente.

**Richiesta:**
```json
{
  "username": "esempio",
  "password": "password123"
}

