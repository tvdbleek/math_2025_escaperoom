import { spawn } from 'child_process';
import https from 'https';
import qrcode from 'qrcode-terminal';

console.log("--- Tunnel Launcher v5.0 (LocalTunnel Restored) ---");
console.log("1. Fetching password from https://loca.lt/mytunnelpassword...");

const getPassword = () => new Promise((resolve, reject) => {
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    };
    https.get('https://loca.lt/mytunnelpassword', options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data.trim()));
    }).on('error', reject);
});

async function start() {
    try {
        console.log("🚀 Initializing Global Access...");

        // Start password fetch and tunnel simultaneously
        const passwordPromise = getPassword().catch(e => {
            console.log(`   ❌ Auto-fetch passcode failed: ${e.message}`);
            return "NOT_FOUND (Check https://loca.lt/mytunnelpassword)";
        });

        const SUBDOMAIN = 'math-escape-tim-2025';
        console.log(`   --> Starting tunnel (Subdomain: ${SUBDOMAIN})...`);

        // Command: npx localtunnel --port 5173 --subdomain math-escape-tim-2025
        const tunnel = spawn('npx', ['localtunnel', '--port', '5173', '--subdomain', SUBDOMAIN], { shell: true });

        tunnel.stdout.on('data', async (data) => {
            const output = data.toString();

            const urlMatch = output.match(/your url is: (https?:\/\/[^\s]+)/i);
            if (urlMatch) {
                const acquiredUrl = urlMatch[1];
                const password = await passwordPromise;

                console.log("\n\n==================================================");
                console.log("🌐  WORLD WIDE LINK READY! (FIXED URL)");
                console.log("==================================================");
                console.log(`\n    LINK:      ${acquiredUrl}`);
                console.log(`    PASSCODE:  ${password}`);
                console.log("\n");

                qrcode.generate(acquiredUrl, { small: true });

                console.log("==================================================");
                console.log("⚠️  ENTER PASSCODE ON FIRST VISIT");
                console.log("==================================================\n");
            } else {
                process.stdout.write(output);
            }
        });

        tunnel.on('close', (code) => {
            console.log(`\nTunnel process exited with code ${code}. Restarting...`);
            process.exit(1);
        });

    } catch (e) {
        console.error("\nFATAL ERROR:", e);
    }
}

start();
