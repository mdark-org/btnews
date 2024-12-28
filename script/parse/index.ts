import { BedtimeNewsFrontmatter } from "../interfaces";
import { extractItem } from "./extractor";
import CheerioRoot = cheerio.Root
export default async function parseHTML($:CheerioRoot, frontmatter: BedtimeNewsFrontmatter): Promise<string> {
  const content = $("#js_content")
  const children = content.children()
  let mdContent = ""
  for (let child of children) {
    mdContent += await extractItem(frontmatter,child)
  }
  return mdContent
}