const router = require('express').Router();
const {connectToDatabase} = require('../db/couchbase');
const {startTimer, stopTimer} = require("../dataLogger");

router.get('/get/init', async (req, res) => {
    const {cluster} = await connectToDatabase();

    try {
        const response =  await cluster.query(`SELECT _id FROM records GROUP BY _id;`);
        let dateList = [];
        response.rows.forEach(row => dateList.push(row["_id"]));
        res.json(dateList);
    } catch (e) {
        console.error(e)
    }
});

router.post('/', async (req, res) => {
    const {collection} = await connectToDatabase();

    try {
        startTimer("Couchbase-POST");
        await collection.insert(req.body._id, req.body)
            .then((response) => {
                stopTimer("Couchbase-POST");
                res.send(response)
            })
            .catch((error) => res.status(500).send({
                "message": `Query failed: ${error.message}`
            }))
    } catch (e) {
        console.error(e)
    }
});

router.get('/:id', async (req, res) => {
    const {collection} = await connectToDatabase();

    try {
        startTimer("Couchbase-GET");
        await collection.get(req.params.id)
            .then((response) => {
                stopTimer("Couchbase-GET");
                res.send(response.content)
            })
            .catch((error) => res.status(500).send({
                "message": `Query failed: ${error.message}`
            }))
    } catch (e) {
        console.error(e)
    }
});

router.put('/:id', async (req, res) => {
    const { collection } = await connectToDatabase();
    let doc;
    try {
        await collection.get(req.params.id)
            .then((response) => {
                doc = response.content;
            })
            .catch((error) => res.status(500).send({
                "message": `Query failed: ${error.message}`
            }))
    } catch (e) {
        console.error(e)
    }

    Object.keys(req.body).forEach(key => {
       doc[key] = req.body[key];
    });

    try {
        startTimer("Couchbase-PUT");
        await collection.replace(req.params.id, doc)
            .then((response) => {
                stopTimer("Couchbase-PUT");
                res.send(response)
            })
            .catch((error) => res.status(500).send({
                "message": `Query failed: ${error.message}`
            }))
    } catch (e) {
        console.error(e)
    }
});

module.exports = router;