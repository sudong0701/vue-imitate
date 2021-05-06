/**
 * @author sudong.duan
 * Date: 2020.09.02
 * description: 根据diff算法结果更新dom
 */

import { patch } from '@/utils/enum'

function patchDom($dom, patches) {
    const index = {
        value: 0
    }
    dfsWalkDom($dom, index, patches)
}

function dfsWalkDom($node, index, patches, isEnd:boolean = false) {
    if(patches[index.value]) {
        patches[index.value].forEach((p)=> {
            switch(p.type) {
                case patch.NODE_ATTRIBUTE_MODIFY:
                    $node.setAttribute(p.key, p.value)
                    break
                case patch.NODE_ATTRIBUTE_DELETE:
                    $node.removeAttribute(p.key, p.value)
                    break
                case patch.NODE_ATTRIBUTE_ADD:
                    $node.setAttribute(p.key, p.value) 
                    break
                case patch.NODE_ADD:
                    $node.appendChild(p.value.render())    
                    break
                case patch.NODE_TEXT_MODIFY:
                    $node.textContent = p.value
                    break
                case patch.NODE_REPLACE:
                    $node.replaceWith(p.value.render())
                    isEnd = true
                    break
                case patch.NODE_DELETE:
                    $node.remove()
                    isEnd = true
                    break 
                default:
                    break                   
            }
        })
    }
    if(isEnd) {
        return
    }
    if($node.childNodes.length > 0) {
        for(let i = 0; i < $node.childNodes.length; i++) {
            index.value++
            dfsWalkDom($node.childNodes[i], index, patches)
        }
    }
}

module.exports = {
    patchDom: patchDom
}
