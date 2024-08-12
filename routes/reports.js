const express = require('express');
const multer = require('multer');
const path = require('path');
const Report = require('../models/Report');

const router = express.Router();

// Middleware per verificare se l'utente è un amministratore
const adminMiddleware = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send({ message: 'Access denied' });
  }
  next();
};


// Route per inviare una segnalazione
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).send({ message: 'Title and description are required' });
  }

  try {
    const report = new Report({
      title,
      description,
      image: req.file ? req.file.path : null,
      status: 'pending' // Imposta lo stato iniziale su 'pending'
    });

    await report.save();
    res.status(201).send(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).send({ message: 'Failed to create report', error });
  }
});


// Route per ottenere tutte le segnalazioni
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.send(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).send({ message: 'Failed to fetch reports', error });
  }
});

// Route per ottenere solo le segnalazioni con stato 'pending' (solo per admin)
router.get('/pending', adminMiddleware, async (req, res) => {
  try {
    // Restituisci solo le segnalazioni con stato 'pending'
    const reports = await Report.find({ status: 'pending' });
    res.send(reports);
  } catch (error) {
    console.error('Error fetching pending reports:', error);
    res.status(500).send({ message: 'Failed to fetch pending reports', error });
  }
});

// Route per aggiornare lo stato di una segnalazione (solo per admin)
router.patch('/:id', adminMiddleware, async (req, res) => {
  const { status } = req.body;

  if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).send({ message: 'Valid status is required' });
  }

  try {
    // Trova il report per id
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).send({ message: 'Report not found' });
    }

    // Verifica se il report è in stato 'pending'
    if (report.status !== 'pending') {
      return res.status(400).send({ message: 'Cannot update a report that is not pending' });
    }

    // Aggiorna lo stato del report
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });

    res.send(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).send({ message: 'Failed to update report', error });
  }
});



module.exports = router;
