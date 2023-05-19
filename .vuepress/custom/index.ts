
import {replaceLink, rplink} from "./node/link";
import {prepareArchivePages, prepareDatePages} from "./node/page";
import * as util from "./node/utils";
import { prepareHomePage } from './node/page/homepage';
import { getDirname, path } from "@vuepress/utils";

import {categoryArchiveList} from "../categoryArchiveList";

const __dirname = getDirname(import.meta.url);
export const customPlugin = { 
    name: 'custom-plugin',
        extendsMarkdown: (md) => {
            md.use(rplink,{replaceLink: replaceLink})
        },
        extendsPageOptions: (pageOptions, app) => {
            pageOptions.frontmatter = pageOptions.frontmatter ?? {}
            if (pageOptions.filePath?.startsWith(app.dir.source("btnews"))) {
                let id = util.getIdFromFilename(pageOptions.filePath)
                if (!id) {
                    return
                }
                id = id?.replace("_", ".")
                pageOptions.frontmatter.permalink = `/btnews/idx/${id}/`
                pageOptions.frontmatter.idx = id
                pageOptions.frontmatter.type = "index"
            }
        },
        onInitialized: async (app): Promise<void> => {
            // 生成年月视图的 page
            await prepareDatePages("btnews",app)
            // 生成合集 page
            await prepareArchivePages(categoryArchiveList,app)
            await prepareHomePage(app)
        },
        clientConfigFile: path.join(__dirname, "./client/client.ts"),

        alias: {
            "@theme-hope/modules/blog/components/TagList": path.resolve(
              __dirname,
              "./client/components/blog-replace/TagListWrapper.vue"
            ),
            "@theme-hope/modules/info/components/TagInfo": path.resolve(
              __dirname,
              "./client/components/blog-replace/PageTag.vue"
            ),
            "@theme-hope/modules/blog/components/ArticleList": path.resolve(
                __dirname,
                "./client/components/blog-replace/ArticleList.vue"
              ),
              "@theme-hope/modules/blog/components/InfoPanel": path.resolve(
                  __dirname,
                  "./client/components/blog-replace/InfoPanel.vue"
                ),
                "@theme-hope/modules/blog/components/InfoList": path.resolve(
                    __dirname,
                    "./client/components/blog-replace/InfoList.vue"
                  ),
                  "@theme-hope/modules/blog/components/BloggerInfo": path.resolve(
                      __dirname,
                      "./client/components/blog-replace/BloggerInfo.vue"
                    )
          },

  }