
export type SourceInfo = {
  msgid: string
  title: string
  url: string
  date: string
}

export type SavePolicy = "LK_ONLINE" | "LOCAL"

export interface HTMLParserResult {
  content: string
  images: MDImage[],
  targetPath: string
}

export interface MDImage {
  url:string,
  name?:string,
  tmpPath?:string,
  index?:string
}

export interface BedtimeNewsFrontmatter {
  title: string,
  date: string,
  category?: string,
  description: string,
  tags: string[],
  index: string,
  dateCreated?: string,

  bvid?: string,
  ytid?: string,
  xgid?: string,
}