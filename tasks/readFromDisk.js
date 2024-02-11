import fs from "fs";


export function readFromDisk(filePath, callback) {

    fs.readFile(filePath, "utf8", (err, data) => {

        if (err) {

            console.error("Error reading file:", err);

            callback(err, null);

            return;
        }

        callback(null, JSON.parse(data, null, 2));

    });
}
