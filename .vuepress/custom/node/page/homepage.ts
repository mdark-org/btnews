import { createPage } from "vuepress";

export const prepareHomePage = async (app): Promise<void> => {
    let pages = app.pages.filter(page => page.path.match(/\/btnews\/idx\/[0-9]{4}/))
    pages.sort((a, b) => {
        return b.frontmatter.date - a.frontmatter.date
    })
    let recentPage = pages.slice(0, 6)
    let homePages = recentPage.map(page => {
        return {
            link: page.path,
            ...page.frontmatter,
        }
    })
    let frontmatter = {
        index: false,
        title: "首页",
        description: "睡前消息文稿合集",
        home:true,
        heroImage: "/images/favicon.png",
        heroText: "睡前消息文稿合集",
        tagline: " ",
        recentPage: homePages,
    }
    let p = await createPage(app, {
        path: '/',
        frontmatter: frontmatter,
        content: `<HomeCardList/>`,
    })
    app.pages.push(p)
}
