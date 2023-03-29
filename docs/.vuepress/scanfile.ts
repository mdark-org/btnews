import {fs} from '@vuepress/utils';
import * as path from "path";

type  opts = {
    exclude:RegExp[]
    match:RegExp[]
}
const scanDir = async (dir: string, options: opts): Promise<string[]> => {
    let result = []
    // 读取目录中的所有文件和子目录
    let files = await fs.readdir(dir);
    for (let file of files) {
        let path = dir + '/' + file;
        if (options.exclude.filter(exclude => path.match(exclude)).length > 0){
            continue
        }
        let stats = await fs.stat(path)
        if (stats.isDirectory()) {
            result.push(...await scanDir(path, options))
        }else if (options.match.filter(match => path.match(match)).length > 0) {
            result.push(path);
        }
    }
    return result;
}

// @ts-ignore
const files = await scanDir('./docs', {match: [/\.md$/], exclude: [/\.vuepress/]})


// 文件名 -> 文件元数据映射
export const contentMap:Map<string,any> = files.reduce((acc:Map<string,any>, cur) => {
    let frontmatter = {}
    let mdfile=fs.readFileSync(cur, 'utf8')
    let match = mdfile.match(/^---\n([\s\S]+?)\n---/)
    if (match){
        let fm = match[1]
        let lines = fm.split('\n')
        lines.forEach(line => {
            let [key, value] = line.split(':')
            frontmatter[key.trim()] = value.trim()
        })
    }
    let name = path.basename(cur)
    acc.set(name, {path: cur,frontmatter: frontmatter})
    return acc
}, new Map())