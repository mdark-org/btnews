import {ParserResult} from "../type";
import path from "path";
import fs from "fs";
import {saveImage} from "./image";

export const saveToMd = (mdresult:ParserResult, filePath:string) => {
    let md = mdresult.content
    let images = mdresult.images
    try {
        let dirname = path.dirname(filePath)
        if(!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true })
        }
        if(fs.existsSync(filePath)){
            console.log("文件已存在",filePath)
            return
        }
        for (let item of images) {
            saveImage(item.url,item.savePath)
        }
        fs.writeFileSync(filePath, md);
        console.log(path.basename(filePath),'文件保存成功');
    } catch (err) {
        console.error('文件保存失败', err);
    }
}