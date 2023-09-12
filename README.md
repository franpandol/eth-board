# README for Ethereum Wall Project
## Overview

The Ethereum Wall Project allows users to add and retrieve messages on the Ethereum blockchain. It consists of a smart contract named Wall and a script to interact with the deployed contract.
## Files

`Wall.sol`

This is the main smart contract for the project. It provides functionalities to:

* Add a new entry to the wall.
* Retrieve the latest entry from the wall.
* Get the history of all entries.

Key Features:

* Entry Structure: Each entry on the wall is represented by a struct containing the Ethereum address of the user who added the entry and the data/message of the entry.

* Events: The contract emits an event NewEntry whenever a new entry is added to the wall.


`index.js`

This script provides functionalities to interact with the contract.

The script reads the contract address from a file named contract-address.json located in the `contracts_build/` directory.

`encrypt_cli.js``

This CLI tool allows users to:

Generate RSA key pairs.
Register a new recipient with their public key.
Encrypt a message using a recipient's public key.

## Setup and Usage
### Prerequisites:

Install Hardhat and other necessary packages.

Deploy the Wall.sol contract.

```bash
npx hardhat run scripts/deploy.js 
```


### Using the Encryption CLI:

Generate RSA Key Pair for a User:

This will generate a key pair and automatically register the user's public key.


```bash
node encrypt_cli.js generate "username"
```

### Encrypt a Message:

This will encrypt a message using the recipient's public key.

```bash
node encrypt_cli.js encrypt "recipientUsername" "Your Message"
```

### Usage:

Setting up the environment variable:

Before running the script, set the NEW_VALUE environment variable to the encrypted message you want to add to the wall.

```bash
export NEW_VALUE=$(node encrypt_cli.js encrypt "recipientUsername" "Your Message")
```

### Publish to the Wall:

Use the following command to publish the encrypted message to the Ethereum wall.

```bash
npx hardhat run index.js --network localhost
```

License

This project is licensed under the MIT License.

## License

This project is licensed under the MIT License.
