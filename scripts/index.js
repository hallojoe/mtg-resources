import path from "path"
import { fileURLToPath } from "url"
import { downloadSetJsonFiles } from  "./downloadSetJsonFiles.js"
import { createSetDb } from "./createSetDb.js"
import { downloadImages } from "./downloadImages.js"
import { optimizeImages } from "./minifyImages.js"
import { clean, cleanChunksAndMeta } from "./cleanUp.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const setName = process.argv[2]
const chunkSize = (process.argv[3] ? parseInt(process.argv[3]) : null) ?? 25

const directoryPath = path.join(__dirname, "..", "data")

await downloadSetJsonFiles(directoryPath, setName)

console.log("DownloadSetJsonFiles completed.")

await createSetDb(directoryPath, setName, chunkSize)

console.log("Set database created.")

await downloadImages(directoryPath, setName)

console.log("Images downloaded.")
    
await optimizeImages(setName)

console.log("Images optimized.")

await clean(directoryPath)

console.log("Cleaned up downloaded data.")

await cleanChunksAndMeta(directoryPath)

console.log("Cleaned up temp data.")

console.log("Done.")
