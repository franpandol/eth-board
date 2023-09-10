const forge = require('node-forge');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const userKeys = {
    publicKeyPem: null,
    privateKeyPem: null
};

const recipients = {};

function generateUserKeyPair() {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    userKeys.publicKeyPem = forge.pki.publicKeyToPem(keys.publicKey);
    userKeys.privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
}

function registerRecipient(username, publicKeyPem) {
    recipients[username] = publicKeyPem;
}

function encryptMessage(username, message) {
    if (!recipients[username]) {
        console.log('Recipient not found!');
        return null;
    }
    const publicKeyPem = recipients[username];
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(message, 'RSA-OAEP');
    return forge.util.encode64(encrypted);
}

function decryptMessage(encryptedMessage) {
    const privateKey = forge.pki.privateKeyFromPem(userKeys.privateKeyPem);
    const decrypted = privateKey.decrypt(forge.util.decode64(encryptedMessage), 'RSA-OAEP');
    return decrypted;
}

function mainMenu() {
    rl.question('Choose an option:\n1. Generate My Key Pair\n2. Register Recipient\n3. Encrypt Message\n4. Decrypt Message\n5. Exit\n', (choice) => {
        switch (choice) {
            case '1':
                generateUserKeyPair();
                console.log('Your key pair has been generated!');
                mainMenu();
                break;
            case '2':
                rl.question('Enter recipient username: ', (username) => {
                    rl.question('Enter recipient public key: ', (publicKeyPem) => {
                        registerRecipient(username, publicKeyPem);
                        console.log(`${username} registered!`);
                        mainMenu();
                    });
                });
                break;
            case '3':
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
            case '4':
                rl.question('Enter encrypted message: ', (encryptedMessage) => {
                    const decrypted = decryptMessage(encryptedMessage);
                    console.log(`Decrypted Message: ${decrypted}`);
                    mainMenu();
                });
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid choice!');
                mainMenu();
                break;
        }
    });
}

mainMenu();
