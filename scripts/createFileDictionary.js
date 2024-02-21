import fs from "fs"
import path from "path"

const readdir = fs.promises.readdir
const stat = fs.promises.stat
const readFile = fs.promises.readFile

/**
 * @description Creates a file dictionary whey key is path and value is object parsed from JSON string.
 * @param {*} directoryPath 
 * @returns Dictionary of path, content.
 */
export async function createFileDictionary(directoryPath) {

  try {

    let filesData = {}

    const files = await readdir(directoryPath)

    const filteredFiles = files.filter(v => !v.startsWith("images"))

    let pending = filteredFiles.length

    if (pending === 0) return filesData

    for (const file of filteredFiles) {

      const filePath = path.join(directoryPath, file)

      const stats = await stat(filePath)

      if (stats.isDirectory()) {

        const data = await createFileDictionary(filePath)

        filesData = { ...filesData, ...data }

      } 
      else {

        const fileContent = await readFile(filePath, "utf8")

        try {

          const jsonData = JSON.parse(fileContent)

          filesData[filePath] = jsonData

        } 
        catch (jsonError) {

          console.error("JSON.parse failed:", jsonError)

          throw jsonError

        }

      }

      if (--pending === 0) {

        return filesData

      }

    }

  } 
  catch (error) {

    console.error("An error occurred:", error)

    throw error

  }

}
