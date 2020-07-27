const {create, store, remove} = require('./controller');
const express = require('express');
const router = express.Router();
router.get('/add', create);
router.post('/add', store);
router.get('/delete/:id', remove);
module.exports = router;
