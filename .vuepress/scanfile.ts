import {fs} from '@vuepress/utils';
import path from "path";
import frontmatter from 'gray-matter'

const getIndependentIdFromFilename = (filename):string => {
    let fn = path.basename(filename)
    return fn.replace(path.extname(fn),"")
}
type  opts = {
    exclude:RegExp[]
    match:RegExp[]
}
const scanDir =  (dir: string, options: opts): string[] => {
    let result :any= []
    let files = fs.readdirSync(dir);
    for (let file of files) {
        let path = dir + '/' + file;
        if (options.exclude.filter(exclude => path.match(exclude)).length > 0){
            continue
        }
        let stats = fs.statSync(path)
        if (stats.isDirectory()) {
            result.push(... scanDir(path, options))
        }else if (options.match.filter(match => path.match(match)).length > 0) {
            result.push(path);
        }
    }
    return result;
}

let docPath = path.join(__dirname, '../btnews')
const files = scanDir(docPath, {match: [/\.md$/], exclude: [/\.vuepress/, "btnews.md", "readme.md"]})

// 文件名 -> 文件元数据映射
export const contentMap:Map<string,any> = files.reduce((acc:Map<string,any>, cur) => {
    let mdfile=fs.readFileSync(cur, 'utf8')
    const { data } = frontmatter(mdfile)
    let name = path.basename(cur)
    let key = getIndependentIdFromFilename(name)
    acc.set(key, {path: cur,frontmatter: data})
    return acc
}, new Map())