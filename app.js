var express = require('express');
var path = require('path');
var bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection URL
const mongoUrl = "mongodb://localhost:27017";
const dbName = "testdb";
let db = null;
let eventsCollection = null;
let server = null;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db(dbName);
        eventsCollection = db.collection('events');
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // For development, we'll continue without MongoDB
        console.log("Continuing without MongoDB connection...");
    }
}

// Initialize MongoDB connection
connectToMongoDB();

//create express app, use public folder for static files
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

//is necessary for parsing POST request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handler to generate test data
app.get('/init', async function(req, res){
    if (!eventsCollection) {
        res.send("MongoDB not connected - using mock data");
        return;
    }
    
    try {
        // Clear existing data first
        await eventsCollection.deleteMany({});
        
        // Insert test events
        await eventsCollection.insertMany([
            {   
                text:"My test event A",   
                start_date: new Date(2018,8,1),
                end_date: new Date(2018,8,5)
            },
            {   
                text:"One more test event",   
                start_date: new Date(2018,8,3),
                end_date: new Date(2018,8,8),
                color: "#DD8616"
            },
            {   
                text:"Meeting with client",   
                start_date: new Date(2018,8,10),
                end_date: new Date(2018,8,11),
                color: "#00AA00"
            },
            {   
                text:"Weekly Review",   
                start_date: new Date(2018,8,15),
                end_date: new Date(2018,8,16),
                color: "#0066FF"
            }
        ]);
        
        res.send("Test events were added to the database");
    } catch (error) {
        console.error("Error initializing data:", error);
        res.status(500).send("Error initializing data");
    }
});

// Handler to load data from database
app.get('/data', async function(req, res){
    if (!eventsCollection) {
        // Return mock data if no database connection
        const mockData = [
            {
                id: "1",
                text: "Sample Event 1",
                start_date: new Date(2018, 8, 1),
                end_date: new Date(2018, 8, 2)
            },
            {
                id: "2", 
                text: "Sample Event 2",
                start_date: new Date(2018, 8, 5),
                end_date: new Date(2018, 8, 6),
                color: "#DD8616"
            }
        ];
        res.send(mockData);
        return;
    }
    
    try {
        const data = await eventsCollection.find({}).toArray();
        
        //set id property for all records
        for (var i = 0; i < data.length; i++) {
            data[i].id = data[i]._id.toString();
        }
        
        //output response
        res.send(data);
    } catch (error) {
        console.error("Error loading data:", error);
        res.status(500).send("Error loading data from database");
    }
});

// Handler for CRUD operations
app.post('/data', async function(req, res){
    if (!eventsCollection) {
        res.status(500).send("Database not connected");
        return;
    }
    
    var data = req.body;
    
    //get operation type
    var mode = data["!nativeeditor_status"];
    //get id of record
    var sid = data.id;
    var tid = sid;
    
    //remove properties which we do not want to save in DB
    delete data.id;
    delete data["!nativeeditor_status"];
    
    try {
        let result;
        
        //run db operation
        if (mode == "updated") {
            result = await eventsCollection.updateOne(
                { _id: new ObjectId(sid) }, 
                { $set: data }
            );
        } else if (mode == "inserted") {
            result = await eventsCollection.insertOne(data);
            tid = result.insertedId.toString();
        } else if (mode == "deleted") {
            result = await eventsCollection.deleteOne({ _id: new ObjectId(sid) });
        } else {
            res.send("Not supported operation");
            return;
        }
        
        res.setHeader("Content-Type","application/json");
        res.send({action: mode, sid: sid, tid: tid});
        
    } catch (error) {
        console.error("Database operation error:", error);
        res.setHeader("Content-Type","application/json");
        res.send({action: "error", sid: sid, tid: tid});
    }
});

const port = process.env.PORT || 3000;

// Check if port is available before starting
function checkPort(port) {
    return new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        exec(`lsof -ti :${port}`, (error, stdout, stderr) => {
            if (stdout.trim()) {
                reject(new Error(`Port ${port} is already in use by process(es): ${stdout.trim().split('\n').join(', ')}`));
            } else {
                resolve();
            }
        });
    });
}

async function startServer() {
    try {
        await checkPort(port);
        
        server = app.listen(port, function() {
            console.log(`Server running on port ${port}`);
            console.log(`Visit http://localhost:${port} to view the calendar`);
            console.log(`Visit http://localhost:${port}/init to initialize test data`);
        });
    } catch (error) {
        console.error(`❌ ${error.message}`);
        console.log(`💡 Try running: npm run cleanup`);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown handling
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown(signal) {
    console.log(`\nReceived ${signal}. Graceful shutdown starting...`);
    
    if (server) {
        server.close(() => {
            console.log('HTTP server closed.');
            
            if (db) {
                db.close().then(() => {
                    console.log('MongoDB connection closed.');
                    process.exit(0);
                }).catch((err) => {
                    console.error('Error closing MongoDB:', err);
                    process.exit(1);
                });
            } else {
                process.exit(0);
            }
        });
    } else {
        process.exit(0);
    }
}

module.exports = app; 