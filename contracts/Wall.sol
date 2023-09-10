// contracts/Wall.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wall {

    // Represents an entry in the wall
    struct Entry {
        address user;      // Address of the user who added the entry
        string data;       // The data of the entry
    }

    // List of all entries
    Entry[] private _entries;

    // Event emitted when a new entry is added
    event NewEntry(address indexed user, string data);

    /**
     * @dev Add a new entry to the wall
     * @param data The data for the entry
     */
    function addEntry(string memory data) public {
        Entry memory newEntry = Entry({
            user: msg.sender,
            data: data
        });
        _entries.push(newEntry);
        emit NewEntry(msg.sender, data);
    }

    /**
     * @dev Get the latest entry from the wall
     * @return The latest entry
     */
    function getLatestEntry() public view returns (Entry memory) {
        require(_entries.length > 0, "No entries found");
        return _entries[_entries.length - 1];
    }

    /**
     * @dev Get the history of all entries
     * @return List of all entries
     */
    function getAllEntries() public view returns (Entry[] memory) {
        return _entries;
    }
}
