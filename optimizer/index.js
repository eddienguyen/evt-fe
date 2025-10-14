import path from 'path';
import glob from 'glob';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGifsicle from 'imagemin-gifsicle';

async function optimize(file) {
  const filePath = file.split("/")
  filePath.pop()
  const dest = filePath.join("/")

  await imagemin([file], {
    destination: dest,
    plugins: [
      imageminGifsicle({
        optimizationLevel: 2
      }),
      // imageminJpegtran({
      //   progressive: true,
      // }),
      imageminPngquant({
        quality: [0.7, 0.9],
        speed: 1
      })
    ]
  })
  console.log(`${file} -> Optimized!`)
}

function nextOptimize(pattern = "../public/**/*.{jpg,jpeg,png,gif}") {
  glob(pattern, (err, files) => {
    if (err) {
      console.error('Error finding files:', err)
      return
    }
    files.forEach(async file => {
      try {
        await optimize(file)
      } catch (error) {
        console.error(`Failed to optimize ${file}:`, error)
      }
    })
  })
}

nextOptimize()