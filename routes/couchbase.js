const couchbase = require("couchbase");
const router = require('express').Router();
const {connectToDatabase} = require('../db/couchbase');


router.post('/', async (req, res) => {
    const {cluster} = await connectToDatabase();

    try {
        await cluster.query(`INSERT INTO records (KEY, VALUE)
                             VALUES ("${req.body._id}", ${JSON.stringify(req.body)});`)
            .then((response) => {
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
        await cluster.query(`SELECT r.*
                             FROM records r
                             WHERE r.cdc_case_earliest_dt = "${req.params.date}";`)
            .then((response) => {
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
        await cluster.query(query)
            .then((response) => {
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