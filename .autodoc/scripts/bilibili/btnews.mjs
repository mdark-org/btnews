
const regex = /【睡前消息(\d{1,4}(\.5)?)期?】/

const title2filepath = (title) => {
  const [full, index] = regex.exec(title)
  // index may
  const indexNum = parseInt(index)
  let rangeStart = Math.floor(indexNum / 100) * 100 + 1
  if (indexNum % 100 === 0) {
    rangeStart = (Math.floor(rangeStart / 100) - 1) * 100 + 1
  }
  const rangeEnd = rangeStart + 99
  const range = `${String(rangeStart).padStart(4, '0')}_${String(rangeEnd).padStart(4, '0')}`
  let indexStr = String(indexNum).padStart(4, '0')
  if(index.endsWith('.5')) {
    indexStr = indexStr + "_5"
  }
  return `docs/btnews/btnews/${range}/btnews_${indexStr}.md`
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