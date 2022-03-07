const router = require('express').Router();

router.post('/create', (req, res) => {
   res.send("Create endpoint for Couchbase");
});

router.get('/get', (req, res) => {
    res.send("Get endpoint for Couchbase");
});

router.put('/update', (req, res) => {
    res.send("Update endpoint for Couchbase");
});

router.delete('/create', (req, res) => {
    res.send("Delete endpoint for Couchbase");
});

module.exports = router;