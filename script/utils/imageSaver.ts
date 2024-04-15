import sharp from "sharp";
import { MDImage } from "../interfaces";
import {imageSavePolicy, imageStorageHost, imageStorageToken, options} from "../index";
import fs from "fs";
import path from "path";
export class ImageSaver {
  private SavePolicy:string = imageSavePolicy??"LOCAL";
  private constructor() {
    console.log(`ImageSaver init, save image to ${this.SavePolicy}`);
    if (this.SavePolicy === undefined) {
      this.SavePolicy = "LOCAL";
    }
    if(this.SavePolicy === "LK_ONLINE") {
      if (imageStorageHost === undefined || imageStorageToken === undefined) {
        throw new Error("Image storage host or token not found in env");
      }
    }
  }

  private static instance: ImageSaver;
  public static getInstance(): ImageSaver {
    if (!ImageSaver.instance) {
      ImageSaver.instance = new ImageSaver();
    }
    return ImageSaver.instance;
  }

  private index = 0;
  public async saveImage(image: MDImage) {
    this.index++;
    switch (this.SavePolicy) {
      case "LK_ONLINE":
        return await this.saveImageToLK(image);
      case "LOCAL":
        return await this.saveImageToLocal(image);
    }
  }

  private async fetchImageContent(img: MDImage) {
    const resp = await fetch(img.url);
    const blob = await resp.blob();
    return await sharp(await blob.arrayBuffer()).webp({
      quality: 80,
    }).toBuffer();
  }

  public async saveImageToLocal(img: MDImage) {
    const buffer = await this.fetchImageContent(img);
    // const tmpDir = path.join(options.localDir, img.tmpPath??"");
    // if (!fs.existsSync(tmpDir)) {
    //   fs.mkdirSync(tmpDir,{
    //     recursive: true
    //   });
    // }
    const filename = img.name || `${this.index}.webp`;
    let p = path.join(`${options.localDir}/images/${img.tmpPath??""}`, filename)
    let dir = path.dirname(p)
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir, {recursive: true});
    }
    fs.writeFileSync(p, buffer);
    return `![](/${path.join("./images",img.tmpPath??"", filename)})`
  }

  public async saveImageToLK(img: MDImage) {
    const buffer = await this.fetchImageContent(img);
    const formData = new FormData();
    formData.append("file", new Blob([buffer]),img.name||"");
    const uploadRes = await fetch(`${imageStorageHost}/api/v1/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${imageStorageToken}`,
        Accept: "application/json",
      }
    });
    try {
      const uploadJSON:any = await uploadRes.json();
      if (uploadJSON!!["status"]) {
        return uploadJSON!!["data"]["links"]["markdown"];
      }
    }catch (e) {
      console.log(e);
    }
    return `![${img.name||""}](${img.url})`
  }



}