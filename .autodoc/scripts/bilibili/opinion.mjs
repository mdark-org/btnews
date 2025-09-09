
const regex = /【高见(\d{1,4})?期?】/
function formatTimestamp(timestamp) {
  if(typeof timestamp !== 'number' && !isFinite(timestamp)) {
    return `${timestamp}`
  }
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}_${month}_${day}`;
}

const title2filepath = (title, date) => {
    const [full, index] = regex.exec(title)

    if(index) {
        const indexNum = parseInt(index)
        let rangeStart = Math.floor(indexNum / 100) * 100 + 1
        if (indexNum % 100 === 0) {
            rangeStart = (Math.floor(rangeStart / 100) - 1) * 100 + 1
        }
        const rangeEnd = rangeStart + 99
        const range = `${String(rangeStart).padStart(4, '0')}_${String(rangeEnd).padStart(4, '0')}`
        const indexStr = String(indexNum).padStart(4, '0')
        return `docs/btnews/opinion/opinion_${indexStr}.md`
    }
    return `docs/btnews/opinion/opinion_${formatTimestamp(date)}.md`
}

export const listen = function(data) {
    const title = data.archives[0].title
    const pubdate = data.archives[0].pubdate
    if (regex.test(title)) {
      return {
          filepath: title2filepath(title, pubdate),
      }
    }
}

export const template = function(data) {
    if(regex.test(data.title)) {
        return {
            filepath: title2filepath(data.title, data.pubdate),
        }
    }
}
