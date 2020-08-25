import '@/page/css/common/common.scss'
import axios from './utils/axios'

require('@/router/index')

window['axios'] = axios

class Vue {
    methods: any
    target: any
    childNodes: any
    data: any
    constructor(options) {
        const {el, data, methods} = options
        this.methods = methods
        this.data = data
        this.init($('#' + el)[0], data)
    }
    init(el, data) {
        this.childNodes = []
        this.getAllChildNodes(el)
        this.observe(this, data)
        this.compile()
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
    compile() {
        for(const node of this.childNodes) {
            const reg = /\{\{(.*)\}\}/    //匹配{{}}
            const templateReg = /\`(.*)\`/   //匹配模板字符串
            const variableReg = /\$\{(.*)\}/   //匹配${}
            let removeAttrs = []
            if(node.nodeType === 1) {    //如果为元素节点
                const match = node.innerHTML.match(reg)
                if(match && !node.childNodes) {   //如果使用了{{}}语法
                    const name = match[1].trim()
                    this.target = new Watcher(node, 'textTag')
                    this[name]
                }
                const attrs = node.attributes
                for(let attr of attrs) {
                    if(attr.name === 'v-model') {   //v-model双向绑定
                        if(node.nodeName === 'INPUT') {
                            this.target = new Watcher(node, 'input')
                            node.addEventListener('input', (e)=> {
                                this[attr.value] = e.target.value
                            })
                            node.setAttribute('value', this[attr.value] ? this[attr.value] : '')
                        }
                    }
                    if(attr.name.indexOf('@') > -1) {
                        node.addEventListener(`${attr.name.substring(attr.name.indexOf('@') + 1)}`, this.methods[attr.value].bind(this))
                    }
                    if(attr.name.indexOf(':') > -1) {
                        if(attr.name.substring(1) === 'style') {
                            let attrValue = attr.value.replace(/`/g, '').split(';')
                            attrValue.map((item)=> {
                                let styleName = item.split(':')[0].trim(), styleValue = item.split(':')[1].trim()
                                const match = styleValue.match(variableReg)
                                if(match) {
                                    this.target = new Watcher(node, 'style', styleName)
                                    node.style[styleName] = this[match[1]]
                                }
                            })
                        } else {
                            const template = attr.value.match(templateReg)
                            if(template) {   //如果为模板字符串
                                const match = attr.value.match(variableReg)
                                let remainder = attr.value.replace(variableReg, '').replace(/`/g, '')
                                if(match) {
                                    const matchArr = match[1].split(' ')
                                    matchArr.map((item)=> {
                                        this.target = new Watcher(node, 'bind', attr.name.substring(1), item)
                                        remainder += this[item] ? this[item] : ''
                                    })
                                }
                                node.setAttribute(attr.name.substring(1), remainder)
                                removeAttrs.push(attr.name)
                            }
                        }
                    }
                }
            } else if(node.nodeType === 3) {   //文本节点
                const match = node.nodeValue.match(reg)
                if(match) {   //如果使用了{{}}语法
                    this.target = new Watcher(node, 'text')
                    const name = match[1].trim()
                    node.nodeValue = this[name]
                }
            }
            removeAttrs.map((item)=> {
                node.removeAttribute(item)
            })
        }

    }
    getAllChildNodes(el) {
        this.childNodes.push(el)
        if(el.childNodes) {
            for(const node of el.childNodes) {
                this.getAllChildNodes(node)
            }
        }
        return this.childNodes
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
    node: any
    type: any
    name: any
    attrKey: any
    attrValue: any
    constructor(node, type, name='', attrKey='') {
        this.node = node
        this.type = type
        this.name = name
        this.attrKey = attrKey
    }
    update(oldValue, value) {
        if(this.type === 'input') {
            this.node.value = value
        }
        if(this.type === 'textTag') {
            this.node.innerHTML = value
        }
        if(this.type === 'text') {
            this.node.nodeValue = value
        }
        if(this.type === 'bind') {
            let preAttr: string = this.node.attributes[this.name].value
            this.node.setAttribute(this.name, preAttr.replace(oldValue, value))
            this.attrValue = value
        }
        if(this.type === 'style') {
            this.node.style[this.name] = value
        }
    }
}

window['Vue'] = Vue

//热更新添加
if ((module as any).hot) {
    (module as any).hot.accept();
}
