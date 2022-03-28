const router = require('express').Router();
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb://localhost", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const {startTimer, stopTimer} = require("../dataLogger");

let dbConnection;

client.connect(function (err, db) {
    if (err || !db) console.log(err)
    dbConnection = db.db('examensarbete-pilot');
    console.log('Successfully connected to MongoDB.');
});
router.get('/get/init', (req, res) => {

    dbConnection.collection("records").distinct('cdc_case_earliest_dt', {}, {}, function (err, result) {
        if (err) console.log(err)
        else return res.status(200).json(result)
    });
})

router.get('/:date', (req, res) => {
    console.log(req.params.id)
    startTimer("MongoDB-GET");
    dbConnection.collection("records").find({"cdc_case_earliest_dt": req.params.date}).toArray(function (err, result) {
        if (err) console.log(err)
        else {
            stopTimer("MongoDB-GET");
            return res.status(200).json(result)
        }
    });
})

router.post('/', (req, res) => {
    startTimer("MongoDB-POST");
    dbConnection.collection("records").insertOne(req.body, function (err, result) {
        if (err) console.log(err)
        else {
            stopTimer("MongoDB-POST");
            return res.status(200).json(result)
        }
    });
});

router.put('/:date', async (req, res) => {
    startTimer("MongoDB-PUT");
    dbConnection.collection("records").updateMany({"cdc_case_earliest_dt": req.params.date }, {$set: req.body}, function (error, result) {
        if (error) console.log(error)
        else {
            stopTimer("MongoDB-PUT");
            return res.status(200).json(result)
        }
    });
});

module.exports = router;