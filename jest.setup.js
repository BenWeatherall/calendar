// Global Jest setup for handling cleanup and timeouts

// Increase default timeout for all tests
jest.setTimeout(10000);

// Global teardown to ensure everything is cleaned up
afterAll(async () => {
    // Small delay to allow any pending operations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
});

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Suppress MongoDB connection warnings in tests
const originalConsoleLog = console.log;
console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('MongoDB connection error') || 
        message.includes('Continuing without MongoDB connection')) {
        return; // Suppress these messages in tests
    }
    originalConsoleLog.apply(console, args);
}; 