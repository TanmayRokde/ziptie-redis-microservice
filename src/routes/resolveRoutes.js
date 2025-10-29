const { Router } = require('express');
const resolveController = require('../controllers/resolveController');

const router = Router();

router.post('/', resolveController.resolveShortUrl);

module.exports = router;