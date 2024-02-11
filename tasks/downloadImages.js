import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { readFromDisk } from "./readFromDisk.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname).substring(1)

const downloadInterval = 100; // Interval between downloads in milliseconds
const outputDirectory = './downloads'; // Directory where images will be saved
const startIndex = process.argv[2] ? parseInt(process.argv[2]) : 0; // Start index from command line argument
const endIndex = process.argv[3] ? parseInt(process.argv[3]) : undefined; // End index from command line argument

const agent = new https.Agent({ rejectUnauthorized: false });

var d = '../tasks/dmu/data/index.meta.json';


async function downloadImages() {

    try {


        await readFromDisk('../tasks/dmu/data/index.meta.json', (err, filesData) => {

            if (err) {

                console.error('Error:', err);

            } else {
                console.log('Yay:', filesData);


                down(filesData).then(c => {

                    console.log('Yay:');


                })
                



            }
        })

    }
    catch (error) {

        console.error(error.message);

    }
}


async function down(array) {


    console.log("down ", array.length)

    // Crreate output directory when not exist.
    if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory, { recursive: true });

    const start = isNaN(startIndex) ? 0 : Math.max(0, startIndex);
    const end = isNaN(endIndex) ? array.length : Math.min(array.length, endIndex);

    for (let i = start; i < end; i++) {



        const filePath = path.resolve(__dirname, outputDirectory, array[i].path)

        if (fs.existsSync(filePath)) {

            console.log(`Skipping image ${i + 1} as file ${array[i].path} already exists.`)

            continue;
        }

        const response = await fetchImage(array[i].url)

        const fileStream = fs.createWriteStream(filePath, { flags: 'wx' });

        await new Promise((resolve, reject) => {

            response.body.pipe(fileStream);

            response.body.on('error', err => {

                console.log(`Image ${i + 1} failed to download. ${err}`);

                reject(err);
            });
            fileStream.on('finish', () => {

                console.log(`Image ${i + 1} downloaded and saved as ${array[i].path}`);

                resolve();
            });
            fileStream.on('error', err => {

                reject(err);

            })

        })

        // resolve()

        // await new Promise(resolve => setTimeout(resolve, downloadInterval)); // Wait before downloading the next image

    }
    

}


async function fetchImage(imageUrl) {
    const response = await fetch(imageUrl, { agent })
    if (!response.ok) {
        throw new Error(`Failed to download image ${i + 1}: ${response.statusText}`)
    }
    return response
}

downloadImages();
