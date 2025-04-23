
const regex = /【参考信息第?(\d{1,4})期?】/

const title2filepath = (title) => {
    const [full, index] = regex.exec(title)
    const indexNum = parseInt(index)
    let rangeStart = Math.floor(indexNum / 100) * 100 + 1
    if (indexNum % 100 === 0) {
        rangeStart = (Math.floor(rangeStart / 100) - 1) * 100 + 1
    }
    const rangeEnd = rangeStart + 99
    const range = `${String(rangeStart).padStart(4, '0')}_${String(rangeEnd).padStart(4, '0')}`
    const indexStr = String(indexNum).padStart(4, '0')
    return `docs/btnews/refnews/${range}/refnews_${indexStr}.md`
}

export const listen = function(data) {
    const title = data.archives[0].title
    if (regex.test(title)) {
        return {
            filepath: title2filepath(title),
        }
    }
}

export const template = function(data) {
    if(regex.test(data.title)) {
        return {
            filepath: title2filepath(data.title),
        }
    }
}