#!/usr/bin/env node

const { execSync } = require('child_process');
const port = process.env.PORT || 3000;

console.log(`🧹 Cleaning up processes on port ${port}...`);

try {
    // Find processes using the port
    const lsofOutput = execSync(`lsof -ti :${port}`, { encoding: 'utf8' }).trim();
    
    if (lsofOutput) {
        const pids = lsofOutput.split('\n').filter(pid => pid.trim());
        
        console.log(`Found ${pids.length} process(es) using port ${port}:`);
        pids.forEach(pid => console.log(`  - PID: ${pid}`));
        
        // Kill the processes
        pids.forEach(pid => {
            try {
                execSync(`kill -9 ${pid}`);
                console.log(`✅ Killed process ${pid}`);
            } catch (error) {
                console.log(`⚠️  Process ${pid} may have already been terminated`);
            }
        });
        
        console.log(`🎉 Port ${port} is now free!`);
    } else {
        console.log(`✅ Port ${port} is already free`);
    }
} catch (error) {
    if (error.status === 1) {
        console.log(`✅ Port ${port} is already free`);
    } else {
        console.error('❌ Error during cleanup:', error.message);
        process.exit(1);
    }
} 