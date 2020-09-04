/**
 * @author sudong.duan
 * Date: 2020.09.02
 * description: template模板编译，将template模板编译成VDom
 */

const { VDomParse }  = require('@/utils/VDom')

//匹配HTML的正则表达式
const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/
const singleLabel = ['br', 'hr', 'img', 'input', 'param', 'meta', 'link']

class ParseHTML {
    //openTag: string[]
    notOverVDom: any[]
    vDom: any
    constructor(html) {
        this.notOverVDom = []
        this.vDom = new VDomParse('', [])
        this.initData(html)
        return this.vDom
    }
    initData(html, vDom?, type?) {
        if(html.match(attribute)) {
            this.setAttribute(html, html.match(attribute), vDom, type)
        }
        if(html.match(dynamicArgAttribute)) {

        }
        if(html.match(ncname)) {

        }
        if(html.match(startTagOpen)) {   //html开始标签
            if(!type) {
                this.startTag(html, html.match(startTagOpen), this.vDom)
            } else if(type === 'closeTag') {   //
                if(vDom.children) {
                    vDom.children.push(new VDomParse('', []))
                } else {
                    vDom.children = [new VDomParse('', [])]
                }
                this.startTag(html, html.match(startTagOpen), vDom.children[vDom.children.length - 1])
            } else if(type === 'endTag') {
                let prevDom = this.notOverVDom[this.notOverVDom.length - 1]
                let currDom = new VDomParse('', [])
                if(prevDom.children) {
                    prevDom.children.push(currDom)
                } else {
                    prevDom.children = [currDom]
                }
                this.startTag(html, html.match(startTagOpen), currDom)
            }
        }
        if(html.match(startTagClose)) {
            this.closeTag(html, html.match(startTagClose), vDom)
        }
        if(html.match(endTag)) {
            this.endTag(html, html.match(endTag), vDom)
        }
        // console.log(html.match(doctype))
        // if(html.match(doctype)) {
        //
        // }
    }
    startTag(html, match, vDom = new VDomParse(match[1], [])) {
        vDom.tagName = match[1]
        this.notOverVDom.push(vDom)
        this.initData(html.replace(match[0], '').trim(), vDom)
    }
    setAttribute(html, match, vDom, type?) {
        if(type === 'closeTag') {
            vDom.children = [match[1]]
        } else {
            vDom.props =  vDom.props ?  vDom.props : {}
            vDom.props[match[1]] = match[3]
        }
        this.initData(html.replace(match[0], '').trim(), vDom)
    }
    closeTag(html, match, vDom) {
        if(singleLabel.indexOf(vDom.tagName) > -1) {
            this.notOverVDom.pop()
            this.initData(html.replace(match[0], '').trim(), vDom, 'endTag')
        } else {
            this.initData(html.replace(match[0], '').trim(), vDom, 'closeTag')
        }
    }
    endTag(html, match, vDom) {
        this.notOverVDom.pop()
        this.initData(html.replace(match[0], '').trim(), vDom, 'endTag')
    }
}

window['ParseHTML'] = ParseHTML