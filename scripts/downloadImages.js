import fs from "fs"
import path from "path"
import { promisify } from "util"
import { exec } from "child_process"

const mkdir = fs.promises.mkdir
const readFile = fs.promises.readFile
const exists = promisify(fs.exists)

/**
 * @description Download set images.
 * @param {string} directoryPath 
 * @param {string} setName 
 * @param {boolean} forceDownload 
 */
export async function downloadImages(directoryPath, setName, forceDownload) {

  try {

    const jsonDatabaseFile = path.join(directoryPath, setName, "data", "index.meta.json")

    const outputDirectory = path.join(directoryPath, setName, "images")

    await mkdir(outputDirectory, { recursive: true })

    const content = await readFile(jsonDatabaseFile, "utf8")

    const filesData = JSON.parse(content)

    const promises = filesData.map(async fileData => {

      const imagePath = path.join(outputDirectory, fileData.path)

      if (!forceDownload && await exists(imagePath)) {

        console.log("Image exists. Skipping:", imagePath)

        return null

      }

      const command = `curl "${fileData.url}" -o "${imagePath}"`

      console.log("Downloading:", imagePath)

      await promisify(exec)(command)

      return command

    })
    .filter(promise => promise !== null)

    await Promise.all(promises)

    console.log("Downloads completed.")

  } catch (error) {

    console.error("Error:", error)

  }
}