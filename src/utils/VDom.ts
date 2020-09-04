/**
 * @author sudong.duan
 * Date: 2020.09.02
 * description: VDom(虚拟dom)类
 */

class VDom implements VDomInterface {
    tagName: ''
    properties: {
        style: ''
    }
    methods: any
    children: VDom[]
    key: 0
    props: any
    constructor(tagName, ...args) {
        this.methods = {}
        this.tagName = tagName
        if(Array.isArray(args[0])) {
            this.props = {}
            this.children = args[0]
        } else {
            this.props = args[0]
            this.children = args[1]
        }
    }
    //将VDom变成真实节点
    render(): Node {
        //创建节点
        const $dom = document.createElement(this.tagName)
        //给元素添加属性
        for(const proKey in this.props) {
            $dom.setAttribute(proKey, this.props[proKey])
        }
        //给元素添加事件
        for(const metKey in this.methods) {
            $dom.addEventListener(metKey, this.methods[metKey])
        }
        //渲染子元素
        if(this.children) {   //如果存在子节点
            this.children.forEach((child)=> {
                if(child instanceof VDom) {   //如果子元素也为VDom则递归
                    $dom.appendChild(child.render())
                } else {
                    $dom.appendChild(document.createTextNode((child as string)))
                }
            })
        }
        return $dom
    }
}

module.exports = {
    VDom: VDom,
    VDomParse: VDom
}
//window['VDom'] = VDom