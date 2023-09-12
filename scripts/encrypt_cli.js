const forge = require('node-forge');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const RECIPIENTS_FILE = 'recipients.json';
const USER_KEYS_FILE = 'userKeys.json';

function ensureFileExists(filePath, defaultContent = {}) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
    }
}

function generateUserKeyPair(username) {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const publicKeyPem = forge.pki.publicKeyToPem(keys.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);

    ensureFileExists(USER_KEYS_FILE);
    fs.writeFileSync(USER_KEYS_FILE, JSON.stringify({
        publicKeyPem: publicKeyPem,
        privateKeyPem: privateKeyPem
    }, null, 2));

    // Automatically add the generated public key to the recipients.json file
    registerRecipient(username, publicKeyPem);

    console.log('Your key pair has been generated and stored in userKeys.json!');
    console.log(`${username}'s public key has been added to recipients.json!`);
}
function getUserKeys() {
    ensureFileExists(USER_KEYS_FILE);
    return JSON.parse(fs.readFileSync(USER_KEYS_FILE, 'utf8'));
}

function registerRecipient(username, publicKeyPem) {
    ensureFileExists(RECIPIENTS_FILE);
    const recipients = JSON.parse(fs.readFileSync(RECIPIENTS_FILE, 'utf8'));
    recipients[username] = publicKeyPem;
    fs.writeFileSync(RECIPIENTS_FILE, JSON.stringify(recipients, null, 2));
}

function getRecipientPublicKey(username) {
    ensureFileExists(RECIPIENTS_FILE);
    const recipients = JSON.parse(fs.readFileSync(RECIPIENTS_FILE, 'utf8'));
    return recipients[username] || null;
}

function encryptMessage(username, message) {
    const publicKeyPem = getRecipientPublicKey(username);
    if (!publicKeyPem) {
        console.log('Recipient not found!');
        return;
    }
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(message, 'RSA-OAEP');
    return forge.util.encode64(encrypted);
}

function decryptMessage(encryptedMessage) {
    const userKeys = getUserKeys();
    const privateKey = forge.pki.privateKeyFromPem(userKeys.privateKeyPem);
    const decrypted = privateKey.decrypt(forge.util.decode64(encryptedMessage), 'RSA-OAEP');
    return decrypted;
}

function main() {
    const action = process.argv[2];
    const recipientUsername = process.argv[3];
    const message = process.argv[4];

    if (action === "encrypt" && recipientUsername && message) {
        const encrypted = encryptMessage(recipientUsername, message);
        if (encrypted) {
            console.log(encrypted); // Print the encrypted message to stdout
            process.exit(0); // Exit after printing
        } else {
            console.error("Failed to encrypt the message.");
            process.exit(1);
        }
    } else {
        // If no command line arguments are provided, display the menu
        mainMenu();
    }
}
function mainMenu() {
    rl.question('Choose an option:\n1. Generate My Key Pair\n2. Encrypt Message\n3. Decrypt Message\n4. Exit\n', (choice) => {
        switch (choice) {
            case '1':
                rl.question('Enter your username: ', (username) => {
                    generateUserKeyPair(username);
                    mainMenu();
                });
                break;
            
            case '2':
                rl.question('Enter recipient username: ', (username) => {
                    rl.question('Enter message to encrypt: ', (message) => {
                        const encrypted = encryptMessage(username, message);
                        if (encrypted) {
                            console.log(`Encrypted Message: ${encrypted}`);
                        }
                        mainMenu();
                    });
                });
                break;
            case '3':
                rl.question('Enter encrypted message: ', (encryptedMessage) => {
                    const decrypted = decryptMessage(encryptedMessage);
                    console.log(`Decrypted Message: ${decrypted}`);
                    mainMenu();
                });
                break;
            case '4':
                rl.close();
                break;
            default:
                console.log('Invalid choice!');
                mainMenu();
                break;
        }
    });
}

main();
