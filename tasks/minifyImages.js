import imagemin from "imagemin"
import imageminJpegtran from "imagemin-jpegtran"
import imageminPngquant from "imagemin-pngquant"


await imagemin(["dmu/images/*.{jpg,png}"], {
	destination: "dmu/images-optimized/",
	plugins: [
		imageminJpegtran(),
		imageminPngquant({
			quality: [0.6, 0.8]
		})
	]
})