const { Router } = require('express');
const urlRoutes = require('./urlRoutes');
const resolveRoutes = require('./resolveRoutes');
const healthRoutes = require('./healthRoutes');

const router = Router();

router.use('/shorten', urlRoutes);
router.use('/resolve', resolveRoutes);
router.use('/health', healthRoutes);

module.exports = router;

