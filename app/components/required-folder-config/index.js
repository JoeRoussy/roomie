import fs from 'fs';

// This module makes any folders that are required by the project
// NOTE: This is only for folders that are required in the project
export default (requiredFolders) => {
    requiredFolders.forEach((folder) => {
        // NOTE: Normally we would never want to use sync functions but here we want to halt startup of the server until
        // we know the required folders exist. This does not impact performance because the server is not even listening to connections yet
        try {
            fs.accessSync(folder, fs.constants.R_OK | fs.constants.W_OK);
        } catch (e) {
            // The folder does not exist so we should make it
            fs.mkdirSync(folder);
        }
    });
};
