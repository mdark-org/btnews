// arrat To obj?map
import * as path from "path";

export const groupBy = (array, f) => {
    let groups = {};
    array.forEach(function (o) {
        let group = f(o);
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return groups
}



export const getIdFromFilename = (filename):string|undefined => {
    // btnews_0013_5.md
    let fn = path.basename(filename)
    let id = fn.match(/\d{3,4}_\d/)?.at(0)
    return id
}

export const getIndependentIdFromFilename = (filename):string|undefined => {
    let fn = path.basename(filename)
    return fn.replace(path.extname(fn),"")
}