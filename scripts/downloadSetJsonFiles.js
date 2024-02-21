import fs from "fs"
import path from "path"
import { promisify } from "util"
import { exec } from "child_process"

const mkdir = fs.promises.mkdir
const exists = promisify(fs.exists)
const execPromise = promisify(exec)

/**
 * @description Download set data.
 * @param {string} directoryPath 
 * @param {string} setName 
 * @param {boolean} forceDownload 
 */
export async function downloadSetJsonFiles(directoryPath, setName, forceDownload) {

  try {

    const setDirectoryPath = path.join(directoryPath, setName)

    await mkdir(setDirectoryPath, { recursive: true })

    const promises = []

    for (let i = 1; i < 10; i++) {

      const setChunkPath = path.join(setDirectoryPath, `${setName}${i}.json`)

      if (!forceDownload && await exists(setChunkPath)) {

        console.log("File exists:", setChunkPath)

        continue

      }

      const command = `curl "https://api.magicthegathering.io/v1/cards?set=${setName}&page=${i}" -o "${setChunkPath}"`

      const promise = execPromise(command).then(() => {

        console.log("File downloaded:", setChunkPath)

      })
      .catch(error => {

        console.error("Execute Curl command failed:", error)

        throw error

      })

      promises.push(promise)

    }

    await Promise.all(promises)

    console.log("All files downloaded successfully.")

  } 
  catch (error) {

    console.error("An error occurred:", error)

    throw error

  }

}
