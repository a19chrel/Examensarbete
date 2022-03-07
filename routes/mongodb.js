const router = require('express').Router();

router.post('/create', (req, res) => {
    res.send("Create endpoint for MongoDB");
});

router.get('/get', (req, res) => {
    res.send("Get endpoint for MongoDB");
});

router.put('/update', (req, res) => {
    res.send("Update endpoint for MongoDB");
});

router.delete('/create', (req, res) => {
    res.send("Delete endpoint for MongoDB");
});

module.exports = router;