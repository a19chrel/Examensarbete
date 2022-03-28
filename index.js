const express = require('express');
const app = express();
const cors = require('cors');

/** Cross-Origin Resource Sharing (CORS) */
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

/** Import routes */
const mongodbRoute = require('./routes/mongodb');
const couchbaseRoute = require('./routes/couchbase');
const generalRoute = require('./routes/general');

/** Middleware */
app.use(express.json());

/** Routes Middlewares*/
app.use('/mongodb', mongodbRoute);
app.use('/couchbase', couchbaseRoute);
app.use('/general', generalRoute);

// Start server
app.listen(3000, () => console.log(`[HTTP] Webserver is listening on port 3000`))

