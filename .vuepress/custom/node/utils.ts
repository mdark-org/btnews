import  path from "path";

export const groupBy = (array, f) => {
    let groups = {};
    array.forEach(function (o) {
        let group = f(o);
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return groups
}


export const getCategoryFromFilename = (filename):string|undefined => {
    let fn = path.basename(filename)
    let category = fn.indexOf('_') > 0 ? fn.split('_')[0] : fn.replace(path.extname(fn),"")
    return category
}
export const getIdFromFilename = (filename):string|undefined => {
    // btnews_0013_5.md
    let fn = path.basename(filename)
    let id = fn.match(/\d{4}(_\d)?/)?.at(0)
    return id
}

// 从文件名中获取唯一 id（带分类）
export const getIndependentIdFromFilename = (filename):string|undefined => {
    let fn = path.basename(filename)
    return fn.replace(path.extname(fn),"")
}