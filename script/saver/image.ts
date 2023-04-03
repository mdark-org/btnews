import fs, {promises as fsp} from "fs";
import path from "path";

export const saveImage = async (url: string, filePath: string) => {
    const pattern = /https:\/\/mmbiz.qpic.cn\/mmbiz_.*/
    if (!pattern.test(url)) {
        console.log("not a image url")
        return
    }
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
            return fsp.writeFile(filePath, bf)
        })
        // 处理可能的错误
        .catch(error => {
            console.error(error);
        });
}