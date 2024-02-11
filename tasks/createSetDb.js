import { createSlug } from "./createSlug.js"
import { writeToDisk } from "./writeToDisk.js"
import { createFileDictionary } from "./createFileDictionary.js";

const inputDirectory = process.argv[2]
const outputFile = process.argv[3]
const outputChunkSize = (process.argv[4] ? parseInt(process.argv[4]) : null) ?? 25

if(!inputDirectory || inputDirectory.length < 1) throw new Error("Invalid input directory path.")

if(!outputFile || outputFile.length < 1) throw new Error("Invalid output file path.")

function run() {
    createSingleJsonFile()
    createSingleJsonFileChunked(outputChunkSize)

    

}

function createOptimizedValue(value) {

    let copy = {...value}

    delete copy.types
    delete copy.subtypes
    delete copy.rulings
    delete copy.legalities
    delete copy.originalText
    delete copy.originalType
    delete copy.foreignNames
    delete copy.id
    delete copy.printings
    delete copy.colorIdentity
    delete copy.colors
    delete copy.variations
    delete copy.supertypes
    delete copy.imageUrl
    delete copy.layout

    return copy
}

function getImageFileName(set, multiverseId, name) {
    return `${multiverseId}-${set}-${createSlug(name)}.png`.toLowerCase()
}

function createSingleJsonFile() {

    createFileDictionary(inputDirectory, (error, fileDictionary) => {



        if (error) {

            console.error("Error:", error);

        } 
        else {

            const result = []

            const flatCardArray = Object.keys(fileDictionary).flatMap(fileKey => fileDictionary[fileKey].cards)

            writeRawAndOptimizedArrayToFile(outputFile, flatCardArray)

            flatCardArray.forEach(flatCardValue => {

                if(!flatCardValue.multiverseid || !flatCardValue.imageUrl) return null

                const key = getImageFileName(flatCardValue.set, flatCardValue.multiverseid, flatCardValue.name)

                result.push({
                    url: flatCardValue.imageUrl.toString().replace("http:", "https:"),
                    name: flatCardValue.name,
                    path: key
                })
                
                // if(flatCardValue.foreignNames) {

                //     flatCardValue.foreignNames.forEach(foreignNameValue => {

                //         if(foreignNameValue.multiverseid && foreignNameValue.imageUrl) {

                //             const keyInner = getImageFileName(flatCardValue.set, foreignNameValue.multiverseid, foreignNameValue.name)

                //             result.push({
                //                 url: foreignNameValue.imageUrl.toString().replace("http:", "https:"),
                //                 name: foreignNameValue.name,
                //                 path: keyInner
                //             })

                //         }                            

                //     })
                    
                // }

            })

            const outputFileParts = outputFile.split(".")

            outputFileParts.splice(outputFileParts.length - 1, 0, "meta")

            writeToDisk(outputFileParts.join("."), result)
            
        }
    })
}

function createSingleJsonFileChunked(chunkSize) { 

    createFileDictionary(inputDirectory, (error, fileDictionary) => {

        if (error) {

            console.error("Error:", error);

        } 
        else {

            const flatCardArray = Object.keys(fileDictionary).flatMap(fileKey => fileDictionary[fileKey].cards)

            if(!chunkSize || chunkSize < 1 || chunkSize > flatCardArray.length) {

                writeRawAndOptimizedArrayToFile(outputFile, flatCardArray)
    
                return
        
            } 
        
            const chunkedArrays = chunkArray(flatCardArray, outputChunkSize)
        
            chunkedArrays.forEach((chunkedArray, index) => {

                const outputFileParts = outputFile.split(".")

                outputFileParts.splice(outputFileParts.length - 1, 0, (index + 1).toString())

                writeRawAndOptimizedArrayToFile(outputFileParts.join("."), chunkedArray)

            })
        
        }
    })

}

function chunkArray(array, size) {

    const chunkedArray = []

    for (let i = 0; i < array.length; i += size) chunkedArray.push(array.slice(i, i + size))
    
    return chunkedArray
}

function writeRawAndOptimizedArrayToFile(path, array) { 

    const jsonData = JSON.stringify(array, null, 2)
                
    writeToDisk(path, jsonData)

    const minArray = array.map(value => createOptimizedValue(value))

    const minJsonData = JSON.stringify(minArray, null, 2)

    const pathParts = path.split(".")

    pathParts.splice(pathParts.length - 1, 0, "min")
    
    writeToDisk(pathParts.join("."), minJsonData)
}

run()