const net = require('net');
const readline = require('readline');
const argv = require('minimist')(process.argv.slice(2));
//getting the host an ports to scan from the command line, with default
const host = argv['host'] || 'localhost';
let start = argv['start'] || 1;
let end = argv['end'] || 10000;
let timeout = argv['timeout'] || 2000;
//this timeout shouldn't be too low, to avoid missing a port,
// but shouldn't be too high to avoid a waste of ressources

const checkPort = (port) => {
    const s = new net.Socket();
    s.setTimeout(timeout, () => s.destroy());
    s.connect(port, host, () => {
        console.log(`Port ${port} is open`);
        //we could destroy the socket now, but we want to be able to listen for data
    });
    //if we receive data, we can store it, maybe to get more infos later (fingerprint ?)
    s.on('data', (data) => {
        console.log(`Message on port ${port} : ${data}`);
        s.destroy();//we know the port is open, we can safely destroy the connection now, instead of waiting for timeout
    });
    
    s.on('error', (e) => {
        //we assume the port is closed
        s.destroy();
    });
};
while (start <= end) {
    checkPort(start);
    start++;
}