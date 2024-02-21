import path from "path"
import { createSlug } from "./createSlug.js"
import { writeToDisk } from "./writeToDisk.js"
import { createFileDictionary } from "./createFileDictionary.js"

const createFileDictionaryPromise = createFileDictionary
const writeToDiskPromise = writeToDisk

/**
 * @description Create set data.
 * @param {string} directoryPath 
 * @param {string} setName 
 * @param {number} chunkSize 
 */
export async function createSetDb(directoryPath, setName, chunkSize) {

  try {

    await createSingleJsonFile(directoryPath, setName)

    //await createSingleJsonFileChunked(directoryPath, setName, chunkSize)

    console.log("createSetDb completed")

  } 
  catch (error) {
   
    console.error("An error occurred:", error)
   
    throw error
  
  }
}

/**
 * @description Create contents for index.json.
 * @param {string} directoryPath 
 * @param {string} setName 
 */
async function createSingleJsonFile(directoryPath, setName) {

  try {

    const inputDirectory = path.join(directoryPath, setName)

    const outputFile = path.join(directoryPath, setName, "data", "index.json")

    const fileDictionary = await createFileDictionaryPromise(inputDirectory)

    const flatCardArray = Object.keys(fileDictionary).flatMap(fileKey => fileDictionary[fileKey].cards)

    await writeRawAndOptimizedArrayToFile(outputFile, flatCardArray)

    const result = flatCardArray
      .filter(flatCardValue => flatCardValue && flatCardValue.multiverseid && flatCardValue.imageUrl)
      .map(flatCardValue => ({
        url: flatCardValue.imageUrl.toString().replace("http:", "https:"),
        name: flatCardValue.name,
        path: getImageFileName(flatCardValue.set, flatCardValue.multiverseid, flatCardValue.name)
      }))

    const metaFilePath = outputFile.replace(".json", ".meta.json")

    await writeToDiskPromise(metaFilePath, result)

    console.log("Single JSON file created:", outputFile)

  } catch (error) {

    console.error("An error occurred:", error)

    throw error

  }

}

// Obsolete. Not in use. 
// TODO: Chunk option should be moved to seperate script.
async function createSingleJsonFileChunked(directoryPath, setName, chunkSize) {

  try {

    const inputDirectory = path.join(directoryPath, setName)

    const outputFile = path.join(directoryPath, setName, "data", "index.json")

    const fileDictionary = await createFileDictionaryPromise(inputDirectory)

    const flatCardArray = Object.keys(fileDictionary).flatMap(fileKey => fileDictionary[fileKey].cards)

    if (!chunkSize || chunkSize < 1 || chunkSize > flatCardArray.length) {

      await writeRawAndOptimizedArrayToFile(outputFile, flatCardArray)

      console.log("Single JSON file created:", outputFile)

      return

    }

    const chunkedArrays = chunkArray(flatCardArray, chunkSize)

    const writeFilesPromises = chunkedArrays.map(async (chunkedArray, index) => {
      
      const chunkOutputFile = outputFile.replace(".json", `.${index + 1}.json`)
      
      await writeRawAndOptimizedArrayToFile(chunkOutputFile, chunkedArray)
      
      console.log("Chunked JSON file chunk created:", chunkOutputFile)

    })

    await Promise.all(writeFilesPromises)
  
  } 
  catch (error) {
    
    console.error("An error occurred:", error)
    
    throw error
  
  }
}

/**
 * @description Write index.json and index.min.json to disk.
 * @param {string} filePath 
 * @param {Array} array 
 */
async function writeRawAndOptimizedArrayToFile(filePath, array) {
  
  try {

    const jsonData = JSON.stringify(array, null, 2)

    await writeToDiskPromise(filePath, jsonData)

    const minArray = array.map(value => createOptimizedValue(value))

    const minJsonData = JSON.stringify(minArray, null, 2)

    const minFilePath = filePath.replace(".json", ".min.json")

    await writeToDiskPromise(minFilePath, minJsonData)

  } 
  catch (error) {

    console.error("An error occurred:", error)

    throw error

  }

}

/**
 * @description Create an object with minimum values.
 * @param {object} value 
 * @returns Minumal magic card object object.
 */
function createOptimizedValue(value) {

  if(!value) return value

  const imageFilename = getImageFileName(
    value.set,
    value.multiverseid,
    value.name
  )

  let copy = { ...value, imageFilename }

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

/**
 * @description Get magic card image file name.
 * @param {string} set 
 * @param {number} multiverseId 
 * @param {string} name 
 * @returns Image file name.
 */
function getImageFileName(set, multiverseId, name) {

  return `${multiverseId}-${set}-${createSlug(name)}.png`.toLowerCase()

}

/**
 * @description Chunk array into portions.
 * @param {Array} array 
 * @param {number} size 
 * @returns Array of chunks.
 */
function chunkArray(array, size) {

  const chunkedArray = []

  for (let i = 0; i < array.length; i += size) chunkedArray.push(array.slice(i, i + size))
  
  return chunkedArray

}
