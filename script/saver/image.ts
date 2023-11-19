import fs, {promises as fsp} from "fs";
import path from "path";
import sharp from "sharp";
export const saveImage = async (url: string, filePath: string) => {
    if (!fs.existsSync(path.dirname(filePath))){
        await fsp.mkdir(path.dirname(filePath), { recursive: true })
    }
    return fetch(url)
        .then(response => response.blob())
        .then(imageBlob => {
            return imageBlob.arrayBuffer()
        })
        .then(async buffer => {
            const bf = Buffer.from(buffer)
            let targetPath = filePath.toLocaleLowerCase()
            .replace(/\.jpg$/,".webp")
            .replace(/\.jpeg$/,".webp")
            .replace(/\.png$/,".webp")
            .replace(/\.gif$/,".webp")
            .replace(/\.bmp$/,".webp")
            .replace(/\.tiff$/,".webp")
            return sharp(bf)
            .webp({
                quality: 80,
            }).toFile(targetPath)
        })
        // 处理可能的错误
        .catch(error => {
            console.error(error);
        });
}