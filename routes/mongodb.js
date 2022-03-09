const router = require('express').Router();
const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb://localhost", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

client.connect(function (err, db) {
    if (err || !db) console.log(err)
    dbConnection = db.db('examensarbetet-pilot');
    console.log('Successfully connected to MongoDB.');
});

router.get('/', (req, res) => {

    dbConnection.collection("records").find(req.body).toArray(function (err, result) {
        if (err) console.log(err)
        else return res.status(200).json(result);
    });
})

router.post('/create', (req, res) => {

    dbConnection.collection("records").insertOne(req.body);
    return res.send("Record added")
});

router.put('/update', (req, res) => {
    dbConnection.collection("records").updateOne(
        { "_id": ObjectId(req.params.id) },
        {
            $set: req.body
        },
        {upsert: true}
    )
});

router.delete('/:id', (req, res) => {
    dbConnection.collection("records").delete({ "_id": ObjectId(req.params.id) })
    return res.send("Document removed.");
});

module.exports = router;