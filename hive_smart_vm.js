const https = require('https');

// Function to get the public key from Hive blockchain
async function getPublicKey(username) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.hive.blog',
            port: 443,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.result && response.result[0] && response.result[0].posting.key_auths.length > 0) {
                        const publicKey = response.result[0].posting.key_auths[0][0];
                        resolve(publicKey);
                    } else {
                        reject("User not found, public key not available, or key_auths array is empty");
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        // JSON-RPC request payload to get account details
        const payload = JSON.stringify({
            jsonrpc: "2.0",
            method: "condenser_api.get_accounts",
            params: [[username]],
            id: 1
        });

        req.write(payload);
        req.end();
    });
}

// Function to get the current time from Hive blockchain
function getCurrentHiveTime() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.hive.blog',
            port: 443,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.result && response.result.time) {
                        const timestamp = new Date(response.result.time + 'Z');
                        resolve(timestamp);
                    } else {
                        reject("Timestamp not found in response");
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        // JSON-RPC request payload to get the dynamic global properties
        const payload = JSON.stringify({
            jsonrpc: "2.0",
            method: "condenser_api.get_dynamic_global_properties",
            params: [],
            id: 1
        });

        req.write(payload);
        req.end();
    });
}

// Function to get the local system time
function getLocalTime() {
    return new Date(); // Gets the current system time
}

// Function to format a timestamp in the desired format
function formatTimestamp(timestamp) {
    return timestamp.toISOString();
}

// Main execution block
(async () => {
    try {
        const username = 'username'; // Replace with actual username input logic
        const publicKey = await getPublicKey(username);
        console.log(`Public Key for ${username}: ${publicKey}`);

        // First Hive time check
        const firstHiveTime = await getCurrentHiveTime();

        // Local time check
        const localTime = getLocalTime();

        // Second Hive time check
        const secondHiveTime = await getCurrentHiveTime();

        if (firstHiveTime instanceof Date && secondHiveTime instanceof Date &&
            !isNaN(firstHiveTime) && !isNaN(secondHiveTime)) {

            const firstHiveTimestamp = firstHiveTime.getTime();
            const secondHiveTimestamp = secondHiveTime.getTime();
            const targetTimestamp = new Date("2023-12-17T15:09:00Z").getTime();

            console.log("First Hive Timestamp:", formatTimestamp(firstHiveTime));
            console.log("Local System Timestamp:", formatTimestamp(localTime));
            console.log("Second Hive Timestamp:", formatTimestamp(secondHiveTime));
            console.log("Target Timestamp:", formatTimestamp(new Date(targetTimestamp)));

            // Check if both Hive time checks are close enough and after the target time
            if (Math.abs(firstHiveTimestamp - secondHiveTimestamp) < 1000 && // 1 second tolerance
                firstHiveTimestamp >= targetTimestamp && secondHiveTimestamp >= targetTimestamp) {
                console.log("VM should be booted now.");
                await bootVM();
            } else {
                console.log("The VM boot is scheduled for a later time, or time check failed.");
            }
        } else {
            console.error("Invalid Hive API response:", firstHiveTime, secondHiveTime);
        }
    } catch (error) {
        console.error('Error:', error);
    }
})();

async function bootVM() {
var zlib = require("zlib");
//await _g.unzip(Buffer.from('COMPRESSED','Base64'))
_g = {
    zip: function gzip(input, options) {
        var promise = new Promise(function (resolve, reject) {
            zlib.gzip(input, options, function (error, result) {
                if (!error) resolve(result);
                else reject(Error(error));
            });
        });
        return promise;
    },
    unzip: function ungzip(input, options) {
        var promise = new Promise(function (resolve, reject) {
            zlib.gunzip(input, options, function (error, result) {
                if (!error) resolve(result);
                else reject(Error(error));
            });
        });
        return promise;
    },
};
let consize = process.stdout.getWindowSize();
(async () => {
    var fs = require("fs");
    if (!process.argv[2])
        process.stdout.write(
            `\x1b[${Math.floor(consize[1] / 2) + 1};${Math.floor(
                consize[0] / 2 - 7
            )}H[#10=======]`
        );
    if (!process.argv[2]) console.log("Initializing library...");
    const delay = (delayInms) => {
        return new Promise((resolve) => setTimeout(resolve, delayInms));
    };
    fs.writeFileSync(
        "libv86.js",
        await _g.unzip(
            Buffer.from(
                "H4sIAAAAAAAACuy9aXviSLI",
                "Base64"
            )
        )
    );
    let wasm = await _g.unzip(Buffer.from('H4sIAAAAAAAACux9','Base64'))
    if (!process.argv[2])
        process.stdout.write(
            `\x1b[${Math.floor(consize[1] / 2) + 1};${Math.floor(
                consize[0] / 2 - 7
            )}H[##20======]`
        );
    var V86Starter = require("./libv86.js").V86Starter;
    fs.unlinkSync("libv86.js");
    if (!process.argv[2]) console.log("Initializing BIOS image...");
    const bios = new Uint8Array(
        await _g.unzip(
            Buffer.from('H4sIAAAAAAAACuy9e3','Base64')
        )
    ).buffer;
    if (!process.argv[2])
        process.stdout.write(
            `\x1b[${Math.floor(consize[1] / 2) + 1};${Math.floor(
                consize[0] / 2 - 7
            )}H[###30=====]`
        );
    if (!process.argv[2]) console.log("Initializing linux image...");
    const linux = new Uint8Array(
        Buffer.from(
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
            "Base64"
        )
    ).buffer;
    if (!process.argv[2])
        process.stdout.write(
            `\x1b[${Math.floor(consize[1] / 2) + 1};${Math.floor(
                consize[0] / 2 - 7
            )}H[####40====]`
        );
    if (!process.argv[2]) console.log("Initializing STD stream...");
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    if (!process.argv[2]) process.stdout.write("\033c");
    if (!process.argv[2])
        process.stdout.write(
            `\x1b[${Math.floor(consize[1] / 2)};${Math.floor(
                consize[0] / 2 - 7
            )}HStarting Hive Smart VM...`
        );
    if (!process.argv[2])
        process.stdout.write(
            `\x1b[${Math.floor(consize[1] / 2) + 1};${Math.floor(
                consize[0] / 2 - 7
            )}H[####50====]`
        );
    let initialized = !!process.argv[2];
    if (fs.existsSync("NodeVM_autosave.bin")) {
        let b = fs.readFileSync("NodeVM_autosave.bin");
        var emulator = new V86Starter({
            bios: { buffer: bios },
            cdrom: { buffer: linux },
            wasm_fn: async (env) =>
                (await WebAssembly.instantiate(wasm, env)).instance.exports,
            autostart: true,
            fastboot: true,
            initial_state: b.buffer.slice(
                b.byteOffset,
                b.byteOffset + b.byteLength
            ),
        });
    } else
        var emulator = new V86Starter({
            bios: { buffer: bios },
            cdrom: { buffer: linux },
            wasm_fn: async (env) =>
                (await WebAssembly.instantiate(wasm, env)).instance.exports,
            autostart: true,
            fastboot: true,
        });
    if (!process.argv[2]) await delay(1000);
    if (!process.argv[2]) process.stdout.write("\033c");
    if (!process.argv[2])
        process.stdout.write(
            `\x1b[${Math.floor(consize[1] / 2)};${Math.floor(
                consize[0] / 2 - 14.5
            )}HBooting Linux, Please standby...`
        );
    if (!process.argv[2])
        process.stdout.write(
            `\x1b[${Math.floor(consize[1] / 2) + 1};${Math.floor(
                consize[0] / 2 - 7
            )}H[######75==]`
        );
    var stackOut = [],
        stackIn = [];
    emulator.add_listener("serial0-output-char", async function (chr) {
        if (chr <= "~" && stackOut.length > 47) {
            if (stackOut.length == 48 && process.argv[2]) {
                emulator.serial0_send(process.argv.slice(2).join(" ") + "\n");
            } else if (
                process.argv[2] &&
                stackOut.slice(55).join("").endsWith("/root%")
            ) {
                console.log(
                    stackOut
                        .slice(55 + process.argv.slice(2).join(" ").length)
                        .slice(0, -9)
                        .join("")
                );
                let state = await emulator.save_state();
                fs.writeFileSync("NodeVM_autosave.bin", Buffer.from(state));
                emulator.stop();
                process.stdin.pause();
            } else if (!process.argv[2]) process.stdout.write(chr);
            //console.log(stackOut.slice(-99));
        }
        stackOut.push(chr);
        if (stackOut.length > 100 && !process.argv[2]) stackOut.shift();
        //if (stack.join("") == "\r\r\nWelcome to Buildroot\r\n\r(none) login: ") {
        if (
            stackOut
                .join("")
                .endsWith("Welcome to Buildroot\r\n\r(none) login: ")
        ) {
            emulator.serial0_send("root\n");
            if (!initialized) {
                process.stdout.write("\033c");
                initialized = true;
            }
            if (!process.argv[2])
                console.log(
                    'For a list of commands, type "busybox" | to exit, press Ctrl+C'
                );
        }
    });

    process.stdin.on("data", async function (c) {
        stackIn.push(c);
        if (stackIn.length > 100) stackIn.shift();
        if (
            (c === "\u0003" &&
            /\/{0,1}[a-zA-Z-\d_]+(%| #) $/.test(stackOut.join("")))
        ) {
            // ctrl c
            process.stdout.write("\033c");
            let state = await emulator.save_state();
            fs.writeFileSync("NodeVM_autosave.bin", Buffer.from(state));
            emulator.stop();
            process.stdin.pause();
        } else {
            emulator.serial0_send(c);
        }
    });
})();
}