import fs from "fs"
import path from "path"

export function writeToDisk(filePath, fileContent, callbackFunction) {

    const jsonContent = typeof(fileContent) === "object" ? JSON.stringify(fileContent, null, 2) : fileContent.toString()

    fs.mkdir(path.dirname(filePath), { recursive: true }, err => {

        if (err) {

            console.error("Error creating directory:", err)

            if (callbackFunction) callbackFunction(err)

            return
        }

        fs.writeFile(filePath, jsonContent, "utf8", err => {

            if (err) {
    
                console.error("Error writing to file:", err)
    
                if(callbackFunction) callbackFunction(err)
    
            } 
            else {
    
                console.log(`File has been written successfully: ${filePath}`)
    
                if(callbackFunction) callbackFunction(null)
    
            }
    
        })
    
    })

}

