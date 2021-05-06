/**
 * @author sudong.duan
 * Updated: 2020.09.02
 * description: 项目入口文件
 */

import '@/page/css/common/common.scss'
import axios from './utils/axios.ts'

require('@/router/index')
require('@/utils/VDom')
require('@/utils/diff')
require('@/utils/parseHTML')
const { VDom }  = require('@/utils/VDom')
const { patchDom }  = require('@/utils/patch')
let $dom, tree

window['axios'] = axios

class Vue {
    methods: any
    target: any
    childNodes: any
    data: any
    hideElement: any[]
    constructor(options) {
        const {el, data, methods} = options
        this.methods = methods
        this.data = data
        this.hideElement = []
        this.init($('#' + el)[0], data)
    }
    init(el, data) {
        let template = document.getElementsByTagName('template')[0].innerHTML.trim()
        let vDom  = new window['ParseHTML'](template)
        this.childNodes = []
        this.observe(this, data)
        tree = this.compile(vDom)
        this.hideElement.map((item)=> {
            item.dom.children.splice(item.key, 1)
        })
        $dom = tree.render();
        $('#app').append($dom)
        document.getElementsByTagName('template')[0].remove()
    }
    observe(root, data) {
        for(let key in data) {
            this.defineReactive(root, key, data[key])
        }
    }
    defineReactive(root, key, value) {
        if(typeof value === 'object') {
            return this.observe(value, value)
        }
        const dep = new Dispatcher()    //创建发布者
        Object.defineProperty(root, key, {
            set(newValue) {
                if(newValue === value) {
                    return
                }
                dep.notify(value, newValue)   //通知订阅者更新
                value = newValue
            },
            get() {
                dep.addWatcher(this.target)    //添加订阅者
                return value
            }
        })
    }
    compile(vDom, parentVDom?, childrenKey?) {
        const reg = /\{\{(.*)\}\}/    //匹配{{}}
        const templateReg = /\`(.*)\`/   //匹配模板字符串
        const variableReg = /\$\{(.*)\}/   //匹配${}
        let hideChildren = false
        for(let attr in vDom.props) {
            if(attr === 'v-model') {   //v-model双向绑定
                if(vDom.tagName === 'input') {
                    this.target = new Watcher(vDom, 'input')
                    vDom.methods['input'] = (e)=> {
                        this[vDom.props[attr]] = e.target.value
                    }
                    vDom.props.value = this[vDom.props[attr]] ? this[vDom.props[attr]] : ''
                }
            }
            if(attr.indexOf('@') === 0) {
                if(!vDom.methods) {
                    vDom.methods = {}
                }
                vDom.methods[attr.substring(1)] = this.methods[vDom.props[attr]].bind(this)
                delete vDom.props[attr]
            }
            if(attr.indexOf(':') > -1) {
                if(attr.substring(1) === 'style') {
                    vDom.props['style'] = ''
                    let attrValue =  vDom.props[attr].replace(/`/g, '').split(';')
                    attrValue.map((item, key)=> {
                        let styleName = item.split(':')[0].trim(), styleValue = item.split(':')[1].trim()
                        const match = styleValue.match(variableReg)
                        if(match) {
                            this.target = new Watcher(vDom, 'style', styleName)
                            vDom.props['style'] = `${vDom.props['style']}${key > 0 ? '; ' : ''}${styleName}: ${this[match[1]]}`
                            delete vDom.props[':style']
                        }
                    })
                } else {
                    const template = vDom.props[attr].match(templateReg)
                    if(template) {   //如果为模板字符串
                        const match = vDom.props[attr].match(variableReg)
                        let remainder = vDom.props[attr].replace(variableReg, '').replace(/`/g, '')
                        if(match) {
                            const matchArr = match[1].split(' ')
                            matchArr.map((item)=> {
                                this.target = new Watcher(vDom, 'bind', attr.substring(1), item)
                                remainder += this[item] ? this[item] : ''
                            })
                        }
                        vDom.props[attr.substring(1)] = remainder
                        delete vDom.props[attr]
                    } else {
                        
                    }
                }
            }
            if(attr === 'v-show') {
                this.target = new Watcher(vDom, 'v-show')
                vDom.props['style'] = `${this[vDom.props[attr]] ? '' : 'display: none;'}${vDom.props['style'] ? vDom.props['style'] : ''}`
            }
            if(attr === 'v-if') {
                this.target = new Watcher(vDom, 'v-if', parentVDom, childrenKey)
                let domIf = this[vDom.props[attr]]
                if(domIf === false) {
                    this.hideElement.push({
                        dom: parentVDom,
                        key: childrenKey
                    })
                }
            }
        }
        if(vDom.children) {   //如果存在子节点
            vDom.children.forEach((child, key)=> {
                if(child instanceof VDom) {   //如果子元素也为VDom则递归
                    this.compile(child, vDom, key)
                } else {
                    const match = child.match(reg)
                    if(match) {
                        const name = match[1].trim()
                        this.target = new Watcher(vDom, 'textTag', key)
                        vDom.children[key] = this[name]
                    }
                }
            })
        }
        return vDom
    }
}

class Dispatcher {   //发布者
    watchers: any[]
    constructor() {
        this.watchers = []
    }
    addWatcher(watcher) {
        if(this.watchers.indexOf(watcher) === -1) {
            this.watchers.push(watcher)
        }
    }
    notify(oldValue, value) {
        this.watchers.map((watcher)=> {
            watcher.update(oldValue, value)
        })
    }
}

class Watcher {    //订阅者
    vDom: any
    type: any
    remake: any
    attrKey: any
    attrValue: any
    constructor(vDom, type, remake?, attrKey?) {
        this.vDom = vDom
        this.type = type
        this.remake = remake
        this.attrKey = attrKey
    }
    update(oldValue, value) {
        let preVDom = JSON.parse(JSON.stringify(tree))
        if(this.type === 'input') {
            this.vDom.props.value = value
        }
        if(this.type === 'textTag') {
            this.vDom.children[this.remake] = value
        }
        if(this.type === 'bind') {
            this.vDom.props[this.remake] = this.vDom.props[this.remake].replace(oldValue, value)
        }
        if(this.type === 'style') {
            let styleArr =  this.vDom.props.style.split(';'), newStyle = []
            styleArr.map((item)=> {
                if(item.indexOf(this.remake) > -1) {
                    item = item.replace(oldValue, value)
                }
                newStyle.push(item)
            })
            this.vDom.props.style = newStyle.join(';')
        }
        if(this.type === 'v-show') {
            let styleArr = this.vDom.props.style.split(';')
            if(value) {
                styleArr.map((style, key)=> {
                    if(style.indexOf('display') > -1) {
                        styleArr.splice(key--, 1)
                    }
                })
            } else {
                styleArr.push('display: none')
            }
            this.vDom.props.style = styleArr.join(';')
        }
        if(this.type === 'v-if') {
            //console.log(this.remake, this.attrKey)
            if(value) {
                this.remake.children.splice(this.attrKey, 0, this.vDom)
            } else {
                this.remake.children.splice(this.attrKey, 1)
            }
        }
        const patches = new window['diff'](preVDom, tree);   //根据diff算法得出新旧dom数的区别对象
        patchDom($dom, patches);   //根据变化了的部分去更新DOM
    }
}

window['Vue'] = Vue

//热更新添加
if ((module as any).hot) {
    (module as any).hot.accept();
}
