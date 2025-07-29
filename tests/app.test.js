const request = require('supertest');
const app = require('../app');

describe('Calendar Application', () => {
    let server;

    beforeAll((done) => {
        server = app.listen(0, done);
    });

    afterAll(async (done) => {
        if (server) {
            server.close(async () => {
                try {
                    // Clean up database connections if they exist
                    if (app.closeDatabaseConnection) {
                        await app.closeDatabaseConnection();
                    }
                } catch (error) {
                    console.log('Cleanup error (expected in tests):', error.message);
                }
                done();
            });
        } else {
            done();
        }
    });

    describe('GET /', () => {
        it('should serve the main HTML page', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.type).toBe('text/html');
            expect(response.text).toContain('dhtmlxScheduler');
            expect(response.text).toContain('scheduler_here');
        });
    });

    describe('GET /data', () => {
        it('should return calendar data', async () => {
            const response = await request(app).get('/data');
            expect(response.status).toBe(200);
            expect(response.type).toBe('application/json');
            expect(Array.isArray(response.body)).toBe(true);
            
            // Should return mock data when no DB connection
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('text');
            expect(response.body[0]).toHaveProperty('start_date');
            expect(response.body[0]).toHaveProperty('end_date');
        });

        it('should return properly formatted event data', async () => {
            const response = await request(app).get('/data');
            const events = response.body;
            
            events.forEach(event => {
                expect(event).toHaveProperty('id');
                expect(event).toHaveProperty('text');
                expect(event).toHaveProperty('start_date');
                expect(event).toHaveProperty('end_date');
                expect(typeof event.id).toBe('string');
                expect(typeof event.text).toBe('string');
            });
        });

        it('should return enhanced event data with custom fields', async () => {
            const response = await request(app).get('/data');
            const events = response.body;
            
            // Check that at least one event has the enhanced fields
            const enhancedEvent = events.find(event => event.location);
            expect(enhancedEvent).toBeDefined();
            expect(enhancedEvent).toHaveProperty('location');
            expect(enhancedEvent).toHaveProperty('priority');
            expect(enhancedEvent).toHaveProperty('category');
            expect(enhancedEvent).toHaveProperty('tags');
            expect(enhancedEvent).toHaveProperty('attendees');
        });

        it('should return properly formatted date strings', async () => {
            const response = await request(app).get('/data');
            const events = response.body;
            
            events.forEach(event => {
                // Dates should be formatted as "YYYY-MM-DD HH:mm"
                expect(event.start_date).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
                expect(event.end_date).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
            });
        });
    });

    describe('GET /init', () => {
        it('should initialize test data', async () => {
            const response = await request(app).get('/init');
            expect(response.status).toBe(200);
            expect(response.text).toContain('MongoDB not connected - using mock data');
        });
    });

    describe('POST /data', () => {
        it('should handle insert operation when DB not connected', async () => {
            const eventData = {
                text: 'Test Event',
                start_date: '2018-09-20 10:00',
                end_date: '2018-09-20 11:00',
                '!nativeeditor_status': 'inserted',
                id: 'temp_id'
            };

            const response = await request(app)
                .post('/data')
                .send(eventData);
            
            expect(response.status).toBe(500);
            expect(response.text).toBe('Database not connected');
        });

        it('should handle update operation when DB not connected', async () => {
            const eventData = {
                text: 'Updated Test Event',
                start_date: '2018-09-20 10:00',
                end_date: '2018-09-20 12:00',
                '!nativeeditor_status': 'updated',
                id: '1'
            };

            const response = await request(app)
                .post('/data')
                .send(eventData);
            
            expect(response.status).toBe(500);
            expect(response.text).toBe('Database not connected');
        });

        it('should handle delete operation when DB not connected', async () => {
            const eventData = {
                '!nativeeditor_status': 'deleted',
                id: '1'
            };

            const response = await request(app)
                .post('/data')
                .send(eventData);
            
            expect(response.status).toBe(500);
            expect(response.text).toBe('Database not connected');
        });

        it('should reject unsupported operations', async () => {
            const eventData = {
                '!nativeeditor_status': 'invalid_operation',
                id: '1'
            };

            const response = await request(app)
                .post('/data')
                .send(eventData);
            
            expect(response.status).toBe(500);
            expect(response.text).toBe('Database not connected');
        });
    });

    describe('Static file serving', () => {
        it('should serve static files from public directory', async () => {
            const response = await request(app).get('/index.html');
            expect(response.status).toBe(200);
            expect(response.type).toBe('text/html');
        });
    });

    describe('Application structure', () => {
        it('should export the Express app', () => {
            expect(app).toBeDefined();
            expect(typeof app).toBe('function');
        });

        it('should have the correct routes defined', () => {
            const routes = [];
            app._router.stack.forEach(middleware => {
                if (middleware.route) {
                    routes.push({
                        method: Object.keys(middleware.route.methods)[0].toUpperCase(),
                        path: middleware.route.path
                    });
                }
            });

            const expectedRoutes = [
                { method: 'GET', path: '/init' },
                { method: 'GET', path: '/data' },
                { method: 'POST', path: '/data' }
            ];

            expectedRoutes.forEach(expectedRoute => {
                expect(routes).toContainEqual(expectedRoute);
            });
        });
    });

    describe('Error handling', () => {
        it('should handle requests to non-existent endpoints gracefully', async () => {
            const response = await request(app).get('/nonexistent');
            expect(response.status).toBe(404);
        });
    });

    describe('Content type headers', () => {
        it('should set correct content type for JSON responses', async () => {
            const response = await request(app).get('/data');
            expect(response.type).toBe('application/json');
        });
    });
}); 