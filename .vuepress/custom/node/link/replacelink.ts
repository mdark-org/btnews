// temporary copy of https://github.com/martinheidegger/markdown-it-replace-link
// I can't find an appropriate way to use it with vuepress by import from npm package
// I try to use `require` to import package, it always reports `Dynamic import not allowed` error.
// maybe because of node version
// also try import * as rplink from 'markdown-it-replace-link', but reports has no apply function error.

function replaceAttr (token, attrName, replace, env) {
    token.attrs.forEach(function (attr) {
        if (attr[0] === attrName) {
            attr[1] = replace(attr[1], env, token)
        }
    })
}

function replaceNodes (nodes, replace, env, token) {
    if (!nodes) return
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (node.attribs) {
            if (node.name === 'img' && node.attribs.src) {
                node.attribs.src = replace(node.attribs.src, env, token, node)
            }
            if (node.name === 'a' && node.attribs.href) {
                node.attribs.href = replace(node.attribs.href, env, token, node)
            }
        }
        replaceNodes(node.children, replace, env, token)
    }
}

function replaceHTML (token, replace, env) {
    const htmlparser = require('htmlparser2')
    const serializer = require('dom-serializer')
    const dom = new htmlparser.parseDocument(token.content, {
        recognizeCDATA: true,
        recognizeSelfClosing: true
    })
    replaceNodes(dom.children, replace, env, token)
    token.content = serializer.render(dom)
}

export const rplink =  (md, opts)=> {
    md.core.ruler.after(
        'inline',
        'replace-link',
        function (state) {
            let replace

            if (md.options.replaceLink && typeof md.options.replaceLink === 'function') {
                // Use markdown options (default so far)
                replace = md.options.replaceLink
            } else if (opts && opts.replaceLink && typeof opts.replaceLink === 'function') {
                // Alternatively use plugin options provided upon .use(..)
                replace = opts.replaceLink
            } else {
                return false
            }

            const html = opts && opts.processHTML || false

            if (typeof replace === 'function') {
                state.tokens.forEach(function (blockToken) {
                    if (html && blockToken.type === 'html_block') {
                        replaceHTML(blockToken, replace, state.env)
                    }
                    if (blockToken.type === 'inline' && blockToken.children) {
                        blockToken.children.forEach(function (token) {
                            const type = token.type
                            if (html && type === 'html_inline') {
                                replaceHTML(token, replace, state.env)
                            }
                            if (type === 'link_open') {
                                replaceAttr(token, 'href', replace, state.env)
                            } else if (type === 'image') {
                                replaceAttr(token, 'src', replace, state.env)
                            }
                        })
                    }
                })
            }
            return false
        }
    )
}