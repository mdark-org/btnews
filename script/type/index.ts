
export type SourceInfo = {
    msgid: string
    title: string
    url: string
    date: string
} | undefined

export type ParserResult = {
    content: string
    images: MDImage[]
}
export type MDImage = {
    url:string,
    savePath:string
}