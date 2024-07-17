import { spawn } from 'child_process';

// Get the network name from the command line arguments
const network = process.argv[2];

// Prepare environment variables
const env = { ...process.env, VITE_NETWORK: network };

// Run vite with the environment variable
const vite = spawn('vite', [], { env, shell: true, stdio: 'inherit' });

vite.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

vite.on('close', (code) => {
  console.log(`vite process exited with code ${code}`);
});
