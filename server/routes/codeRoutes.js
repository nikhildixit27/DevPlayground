// routes/codeRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getCode,
    setCode,
    updateCode,
    deleteCode,
} = require('../controllers/codeController');

router.route('/').get(protect, getCode).post(protect, setCode);
router.route('/:id').delete(protect, deleteCode).put(protect, updateCode);

module.exports = router;
