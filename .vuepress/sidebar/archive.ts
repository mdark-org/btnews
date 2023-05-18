import {contentMap} from "../scanfile";
import {categoryArchiveList} from "../categoryArchiveList";
import path from "path"

const getIdFromFilename = (filename):string|undefined => {
    // btnews_0013_5.md
    let fn = path.basename(filename)
    let id = fn.match(/\d{4}(_\d)?/)?.at(0)
    return id
}

const generatePageSidebarFromId = (archiveItem:string,category,archive) => {
    let item = contentMap.get(archiveItem)
    let id = getIdFromFilename(archiveItem)
    id = id?.replace(/_/g,".")
    return {
        text: item.frontmatter.title,
        link: `/${category.category}/archive/${archive.name}/${id}/`,
    }
}

const generateArchiveSideBar = (archive,category) => {
    return {
        text: archive.name,
        collapsible: true,
        children: archive.content
            .filter(archiveItem => contentMap.has(archiveItem))
            .map(archiveItem => generatePageSidebarFromId(archiveItem,category,archive))
    }
}

export const archiveSideBar = () =>{
    return categoryArchiveList.map(category => {
        return {
            text: category.category,
            children: category.archiveList
                .map(archive =>generateArchiveSideBar(archive,category))
                .filter(item => item?.children.length > 0)
        }
    }).filter(item => item?.children.length > 0)
}