const router = require('express').Router();
const fs = require('fs');


router.get('/postdata', async (req, res) => {
    console.log("Starting get")
    const data = await fs.readFileSync(`input/data.json`)
    res.json(data);
});

module.exports = router;