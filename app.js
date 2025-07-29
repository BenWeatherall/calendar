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
let mongoClient = null;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        mongoClient = new MongoClient(mongoUrl, { useUnifiedTopology: true });
        await mongoClient.connect();
        console.log("Connected to MongoDB");
        db = mongoClient.db(dbName);
        eventsCollection = db.collection('events');
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // For development, we'll continue without MongoDB
        console.log("Continuing without MongoDB connection...");
    }
}

// Close database connection
async function closeDatabaseConnection() {
    if (mongoClient) {
        try {
            await mongoClient.close();
            console.log('MongoDB connection closed.');
        } catch (error) {
            console.error('Error closing MongoDB:', error);
        }
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
        
        // Insert test events with additional fields (using current month dates)
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        
        await eventsCollection.insertMany([
            {   
                text:"Project Planning Meeting",   
                start_date: new Date(currentYear, currentMonth, 1, 9, 0),
                end_date: new Date(currentYear, currentMonth, 1, 10, 30),
                location: "Conference Room A",
                priority: "high",
                category: "meeting",
                tags: "project, planning, strategy",
                attendees: "John, Sarah, Mike"
            },
            {   
                text:"Complete Budget Report",   
                start_date: new Date(currentYear, currentMonth, 5, 10, 0),
                end_date: new Date(currentYear, currentMonth, 7, 17, 0),
                location: "Home Office",
                priority: "urgent",
                category: "task",
                tags: "finance, deadline, quarterly",
                attendees: "Finance Team"
            },
            {   
                text:"Client Presentation",   
                start_date: new Date(currentYear, currentMonth, 10, 14, 0),
                end_date: new Date(currentYear, currentMonth, 10, 16, 0),
                location: "Client Office - Downtown",
                priority: "high",
                category: "meeting",
                tags: "presentation, sales, client",
                attendees: "Sales Team, Client Stakeholders"
            },
            {   
                text:"Team Building Event",   
                start_date: new Date(currentYear, currentMonth, 15, 12, 0),
                end_date: new Date(currentYear, currentMonth, 15, 17, 0),
                location: "City Park",
                priority: "medium",
                category: "event",
                tags: "team building, social, outdoor",
                attendees: "All Staff"
            },
            {   
                text:"Doctor Appointment",   
                start_date: new Date(currentYear, currentMonth, 20, 15, 0),
                end_date: new Date(currentYear, currentMonth, 20, 16, 0),
                location: "Medical Center",
                priority: "medium",
                category: "appointment",
                tags: "health, personal",
                attendees: "Personal"
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
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
        
        const mockData = [
            {
                id: "1",
                text: "Project Planning Meeting",
                start_date: `${currentYear}-${currentMonth}-01 09:00`,
                end_date: `${currentYear}-${currentMonth}-01 10:30`,
                location: "Conference Room A",
                priority: "high",
                category: "meeting",
                tags: "project, planning, strategy",
                attendees: "John, Sarah, Mike"
            },
            {
                id: "2", 
                text: "Complete Budget Report",
                start_date: `${currentYear}-${currentMonth}-05 10:00`,
                end_date: `${currentYear}-${currentMonth}-07 17:00`,
                location: "Home Office",
                priority: "urgent",
                category: "task",
                tags: "finance, deadline, quarterly",
                attendees: "Finance Team"
            },
            {
                id: "3",
                text: "Client Presentation",
                start_date: `${currentYear}-${currentMonth}-10 14:00`,
                end_date: `${currentYear}-${currentMonth}-10 16:00`,
                location: "Client Office - Downtown",
                priority: "high",
                category: "meeting",
                tags: "presentation, sales, client",
                attendees: "Sales Team, Client Stakeholders"
            }
        ];
        res.send(mockData);
        return;
    }
    
    try {
        const data = await eventsCollection.find({}).toArray();
        
        //set id property and format dates for all records
        for (var i = 0; i < data.length; i++) {
            data[i].id = data[i]._id.toString();
            
            // Format dates as strings for dhtmlxScheduler
            if (data[i].start_date instanceof Date) {
                data[i].start_date = data[i].start_date.toISOString().slice(0, 16).replace('T', ' ');
            }
            if (data[i].end_date instanceof Date) {
                data[i].end_date = data[i].end_date.toISOString().slice(0, 16).replace('T', ' ');
            }
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
    
    // Convert date strings back to Date objects for MongoDB storage
    if (data.start_date && typeof data.start_date === 'string') {
        data.start_date = new Date(data.start_date.replace(' ', 'T'));
    }
    if (data.end_date && typeof data.end_date === 'string') {
        data.end_date = new Date(data.end_date.replace(' ', 'T'));
    }
    
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

// Only start server if this file is run directly (not imported for testing)
if (require.main === module) {
    startServer();
}

// Graceful shutdown handling
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown(signal) {
    console.log(`\nReceived ${signal}. Graceful shutdown starting...`);
    
    if (server) {
        server.close(async () => {
            console.log('HTTP server closed.');
            await closeDatabaseConnection();
            process.exit(0);
        });
    } else {
        closeDatabaseConnection().then(() => {
            process.exit(0);
        }).catch(() => {
            process.exit(1);
        });
    }
}

// Export app and cleanup function for testing
module.exports = app;
module.exports.closeDatabaseConnection = closeDatabaseConnection; 