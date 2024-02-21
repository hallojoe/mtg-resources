import imagemin from "imagemin"
import imageminJpegtran from "imagemin-jpegtran"
import imageminPngquant from "imagemin-pngquant"

/**
 * @description Minify downloaded images. Overwrites self.
 * @param {string} setName 
 */
export async function optimizeImages(setName) {
	
	await imagemin([`./data/${setName}/images/*.{jpg,png}`], {
		destination: `./data/${setName}/images/`,
		plugins: [
			imageminJpegtran(),
			imageminPngquant({
				quality: [0.6, 0.8]
			})
		]
	})

}
