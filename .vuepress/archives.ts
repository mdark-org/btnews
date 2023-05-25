import * as fs from 'fs';
import pkg from 'js-yaml';
const { load } = pkg;

type categoryArchive = {
  category: string
  archiveList: Archive[]
}
type Archive = {
  name : string
  content: string[]
}
const fileContents = fs.readFileSync(__dirname + '/archive.yaml', 'utf8');
export const archives: categoryArchive[] = load(fileContents) as categoryArchive[];

// 自定义合集
export const archiveNavbar = () => {
  let al = archives[0].archiveList
  let res:any = []
  for (let i = 0; i < al.length; i++) {
    res.push({
      text: al[i].name,
      link: `/btnews/archive/${al[i].name}/`
    })
  }
  return res
}