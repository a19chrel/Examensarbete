const couchbase = require("couchbase");
const router = require('express').Router();
const {connectToDatabase} = require('../db/couchbase');
const {startTimer, stopTimer} = require("../dataLogger");


router.post('/', async (req, res) => {
    const {cluster} = await connectToDatabase();

    try {
        startTimer("Couchbase-POST");
        await cluster.query(`INSERT INTO records (KEY, VALUE)
                             VALUES ("${req.body._id}", ${JSON.stringify(req.body)});`)
            .then((response) => {
                stopTimer("Couchbase-POST");
                res.send(response.rows)
            })
            .catch((error) => res.status(500).send({
                "message": `Query failed: ${error.message}`
            }))
    } catch (e) {
        console.error(e)
    }
});

router.get('/:date', async (req, res) => {
    const {cluster} = await connectToDatabase();

    try {
        startTimer("Couchbase-GET");
        await cluster.query(`SELECT r.*
                             FROM records r
                             WHERE r.cdc_case_earliest_dt = "${req.params.date}";`)
            .then((response) => {
                stopTimer("Couchbase-GET");
                res.send(response.rows)
            })
            .catch((error) => res.status(500).send({
                "message": `Query failed: ${error.message}`
            }))
    } catch (e) {
        console.error(e)
    }
});

router.put('/:date', async (req, res) => {
    const {cluster} = await connectToDatabase();

    //Query builder
    let changesString = "";
    Object.keys(req.body).forEach(key => {
        changesString += `${key} = "${req.body[key]}"`;
        if (Object.keys(req.body)[Object.keys(req.body).length - 1] !== key) changesString += `, `;
    })
    let query = `UPDATE records._default._default set ${changesString} WHERE cdc_case_earliest_dt = "${req.params.date}";`
    console.log(query);

    try {
        startTimer("Couchbase-PUT");
        await cluster.query(query)
            .then((response) => {
                stopTimer("Couchbase-PUT");
                res.send(response.rows)
            })
            .catch((error) => res.status(500).send({
                "message": `Query failed: ${error.message}`
            }))
    } catch (e) {
        console.error(e)
    }
});

module.exports = router;