import path from "path"
import fs from "fs"

const mkdir = fs.promises.mkdir
const writeFile = fs.promises.writeFile

/**
 * @description JSON serialize and write object to disk.
 * @param {string} filePath 
 * @param {object} fileContent 
 * @returns Path and contents.
 */
export async function writeToDisk(filePath, fileContent) {

  try {

    const jsonContent = typeof fileContent === "object" ? JSON.stringify(fileContent, null, 2) : fileContent.toString()

    await mkdir(path.dirname(filePath), { recursive: true })

    await writeFile(filePath, jsonContent, "utf8")

    console.log("File written:", filePath)

    return { filePath, fileContent }

  } catch (error) {

    console.error("Write to disk failed:", error)

    throw error

  }

}
