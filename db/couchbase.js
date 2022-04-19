const couchbase = require('couchbase');

const CB_USER = "admin"
const CB_PASS = "password"
const CB_URL = "localhost"
const CB_BUCKET = "records"

if (!CB_USER) {
    throw new Error(
        'Please define the CB_USER environment variable inside dev.env'
    )
}

if (!CB_PASS) {
    throw new Error(
        'Please define the CB_PASS environment variable inside dev.env'
    )
}

if (!CB_URL) {
    throw new Error(
        'Please define the CB_URL environment variable inside dev.env'
    )
}

if (!CB_BUCKET) {
    throw new Error(
        'Please define the CB_BUCKET environment variable inside dev.env'
    )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.couchbase

if (!cached) {
    cached = global.couchbase = { conn: null }
}

async function createCouchbaseCluster() {
    if (cached.conn) {
        return cached.conn
    }

    cached.conn = await couchbase.connect('couchbase://' + CB_URL, {
        username: CB_USER,
        password: CB_PASS,
    })

    return cached.conn
}

async function connectToDatabase() {
    const cluster = await createCouchbaseCluster()
    const bucket = cluster.bucket(CB_BUCKET);
    const collection = bucket.defaultCollection();
    const recordsCollection = bucket.collection('records');

    let dbConnection = {
        cluster,
        bucket,
        collection,
        recordsCollection,
    }

    return dbConnection;
}
module.exports = { connectToDatabase };