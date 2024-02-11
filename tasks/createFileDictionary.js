import fs from 'fs';
import path from 'path';

export function createFileDictionary(directoryPath, callbackFunction) {

    let filesData = {}

    fs.readdir(directoryPath, (err, files) => {

        if (err) {

            console.error('Error reading directory:', err)

            callbackFunction(err, null)

            return
        }

        let pending = files.length

        if (pending === 0) callbackFunction(null, filesData)

        files.forEach(file => {

            const filePath = path.join(directoryPath, file)

            fs.stat(filePath, (err, stats) => {

                if (err) {

                    console.error('Error stating file:', err)

                    callbackFunction(err, null)

                    return
                }

                if (stats.isDirectory()) {

                    console.log("This is a directory", filePath)

                    readFilesInPath(filePath, (err, data) => {

                        if (err) {

                            console.error('Error reading directory:', err)

                            callbackFunction(err, null)

                            return
                        }

                        filesData = { ...filesData, ...data }

                        if (--pending === 0) callbackFunction(null, filesData)

                    })

                }
                else {

                    fs.readFile(filePath, 'utf8', (err, fileContent) => {

                        if (err) {

                            console.error('Error reading file:', err)

                            callbackFunction(err, null)

                            return
                        }

                        try {

                            const jsonData = JSON.parse(fileContent)

                            filesData[filePath] = jsonData
                        }
                        catch (jsonErr) {

                            console.error('Error parsing JSON:', jsonErr)

                        }

                        if (--pending === 0) callbackFunction(null, filesData)

                    })

                }

            })

        })

    })

}