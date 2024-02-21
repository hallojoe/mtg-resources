import fs from "fs"
import path from "path"

const readdir = fs.promises.readdir
const stat = fs.promises.stat
const readFile = fs.promises.readFile
const rm = fs.promises.rm

/**
 * @description Removes the raw download files from set folder.
 * @param {*} directoryPath 
 */
export async function clean(directoryPath) {

  try {

    const fsEntries = await readdir(directoryPath)

    const filteredFsEntries = fsEntries.filter(v => !v.includes("."))

    for (const setDirectory of filteredFsEntries) {

      const setPath = path.join(directoryPath, setDirectory)

      console.log("Cleaning:", setPath)

      const stats = await stat(setPath)

      if (stats.isDirectory()) {

        const setFsEntries = await readdir(setPath)

        const filteredSetFsEntries = setFsEntries.filter(v => v.endsWith(".json"))

        for (const setDataFile of filteredSetFsEntries) {

          const setDataFilePath = path.join(directoryPath, setDirectory, setDataFile)

          console.log("Removing:", setDataFilePath)

          await rm(setDataFilePath, {recursive: true, force: true})

        }

      }

    }
    
    console.log("Cleaning complete.")

  }
  catch (error) {

    console.error("An error occurred:", error)

    throw error

  }

}

/**
 * @description Removes chunks(not created by default anymore) and meta file. 
 * @param {*} directoryPath 
 */
export async function cleanChunksAndMeta(directoryPath) {

  try {

    const fsEntries = await readdir(directoryPath)

    const filteredFsEntries = fsEntries.filter(v => !v.includes("."))

    for (const setDirectory of filteredFsEntries) {

      const setDataPath = path.join(directoryPath, setDirectory, "data")

      console.log("Cleaning:", setDataPath)

      const stats = await stat(setDataPath)

      if (stats.isDirectory()) {

        const setDataFsEntries = await readdir(setDataPath)

        const filteredSetDataFsEntries = setDataFsEntries.filter(v => /^.*\.\d+\.(?:min\.)?json$/.test(v) || v.endsWith(".meta.json"))

        for (const setDataFile of filteredSetDataFsEntries) {

          const setDataFilePath = path.join(setDataPath, setDataFile)

          console.log("Removing:", setDataFilePath)

          await rm(setDataFilePath, {recursive: true, force: true})

        }

      }

    }
    
    console.log("Cleaning complete.")

  }
  catch (error) {

    console.error("An error occurred:", error)

    throw error

  }

}
