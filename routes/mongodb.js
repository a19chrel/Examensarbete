const router = require('express').Router();
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb://localhost", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

client.connect(function (err, db) {
    if (err || !db) console.log(err)
    dbConnection = db.db('examensarbete-pilot');
    console.log('Successfully connected to MongoDB.');
});

router.get('/:date', (req, res) => {
    console.log(req.params.id)
    dbConnection.collection("records").find({"cdc_case_earliest_dt": req.params.date}).toArray(function (err, result) {
        if (err) console.log(err)
        else {
            return res.status(200).json(result)
        }
    });
})

router.post('/', (req, res) => {
    dbConnection.collection("records").insertOne(req.body, function (err, result) {
        if (err) console.log(err)
        else {
            return res.status(200).json(result)
        }
    });
});

router.put('/:date', async (req, res) => {
    dbConnection.collection("records").updateMany({"cdc_case_earliest_dt": req.params.date }, {$set: req.body}, function (error, result) {
        if (error) console.log(error)
        else {
            return res.status(200).json(result)
        }
    });
});

module.exports = router;