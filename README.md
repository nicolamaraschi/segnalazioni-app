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


Ecco la sezione delle API nel formato `README.md`:

```markdown
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
```

**Risposta:**
- `201 Created`: Se la registrazione ha successo.
- `400 Bad Request`: Se mancano username o password.
- `500 Internal Server Error`: In caso di errore del server.

#### `POST /api/auth/login`
Effettua il login di un utente.

**Richiesta:**
```json
{
  "username": "esempio",
  "password": "password123"
}
```

**Risposta:**
- `200 OK`: Se il login ha successo.
- `401 Unauthorized`: Se le credenziali sono errate.
- `500 Internal Server Error`: In caso di errore del server.

#### `POST /api/auth/logout`
Effettua il logout dell'utente.

**Risposta:**
- `200 OK`: Se il logout ha successo.

#### `GET /api/auth/status`
Verifica lo stato di autenticazione dell'utente.

**Risposta:**
- `200 OK`: Con lo stato di autenticazione e ruolo dell'utente (`loggedIn: true/false`, `isAdmin: true/false`).

### Segnalazioni

#### `POST /api/reports`
Crea una nuova segnalazione.

**Richiesta:**
```json
{
  "title": "Titolo della segnalazione",
  "description": "Descrizione della segnalazione",
  "image": "path/alla/immagine" // opzionale
}
```

**Risposta:**
- `201 Created`: Se la segnalazione è stata creata con successo.
- `400 Bad Request`: Se mancano titolo o descrizione.
- `500 Internal Server Error`: In caso di errore del server.

#### `GET /api/reports`
Ottiene tutte le segnalazioni (visibile a tutti gli utenti).

**Risposta:**
- `200 OK`: Restituisce un array di tutte le segnalazioni.
- `500 Internal Server Error`: In caso di errore nel recupero delle segnalazioni.

#### `GET /api/reports/pending`
Ottiene solo le segnalazioni con stato `pending` (solo per amministratori).

**Risposta:**
- `200 OK`: Restituisce un array di segnalazioni con stato `pending`.
- `403 Forbidden`: Se l'utente non è un amministratore.
- `500 Internal Server Error`: In caso di errore nel recupero delle segnalazioni.

#### `PATCH /api/reports/:id`
Aggiorna lo stato di una segnalazione (solo per amministratori).

**Richiesta:**
```json
{
  "status": "accepted" // o "rejected" o "pending"
}
```

**Risposta:**
- `200 OK`: Se lo stato della segnalazione è stato aggiornato con successo.
- `400 Bad Request`: Se lo stato fornito non è valido o mancante.
- `404 Not Found`: Se la segnalazione con l'ID specificato non è stata trovata.
- `403 Forbidden`: Se l'utente non è un amministratore.
- `500 Internal Server Error`: In caso di errore nel processo di aggiornamento.
```

Puoi copiare e incollare questo codice nel tuo file `README.md`.

