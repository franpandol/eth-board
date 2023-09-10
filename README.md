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

## Setup and Usage
### Prerequisites:

Install Hardhat and other necessary packages.

Deploy the Wall.sol contract.

```bash
npx hardhat run scripts/deploy.js 
```


### Usage:

Setting up the environment variable:
Before running the script, set the NEW_VALUE environment variable to the message you want to add to the wall.

```bash
NEW_VALUE="Your message here" npx hardhat run scripts/index.js 
```


## License

This project is licensed under the MIT License.
