/**
 * @author sudong.duan
 * Date: 2020.09.02
 * description: 简版diff算法
 */

import { patch } from '@/utils/enum'
interface diffIndex {
    value: number
}

interface currentPatchItem {
    type: string,
    key?: string,
    value?: VDom | string
}
interface patchItem {
    [index: number]: currentPatchItem[]
}

class diff {
    patches: any
    index: diffIndex
    /**
     @param {Object} oldTree 老的dom树
     @param {Object} newTree 新的dom树
     */
    constructor(oldTree: VDom, newTree: VDom) {
        this.patches = {}
        this.index = {
            value: 0
        }
        this.dfsWalk(oldTree, newTree, this.index, this.patches)
        return this.patches
    }
    /**
     比较节点的变化
     @param {Object} oldNode 老的节点类
     @param {Object} newNode 新的节点类
     @param {Number} index 深度优先遍历的下标
     @param {Object} patches 存储dom修改内容的对象
     @return
     */
    dfsWalk(oldNode: VDom, newNode: VDom, index: diffIndex, patches: patchItem): void {
        const currentIndex:number = index.value, currentIndexPatches:currentPatchItem[] = []
        if(newNode === undefined) {   //节点被删除
            currentIndexPatches.push({
                type: patch.NODE_DELETE
            })
        } else if(typeof oldNode === 'string' && typeof newNode === 'string') {    //节点都为文本节点
            if(oldNode !== newNode) {   //文本节点被修改
                currentIndexPatches.push({
                    type: patch.NODE_TEXT_MODIFY,
                    value: newNode
                })
            }
        } else if(oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {   //如果新旧节点节点类型和索引一样
            this.diffProps(oldNode.props, newNode.props, index, currentIndexPatches, oldNode, newNode)   //比较属性变化
            this.diffChildren(oldNode.children, newNode.children, index, currentIndexPatches, patches)   //比较子节点变化
        } else {
            currentIndexPatches.push({
                type: patch.NODE_REPLACE,
                value: newNode
            })
        }
        if(currentIndexPatches.length > 0) {
            patches[currentIndex] = currentIndexPatches;   //保存节点修改内容
        }
    }

    /**
     比较节点属性的变化 思路为：先遍历旧属性获取删除更改的节点属性，然后再边路新属性获取新增的节点属性
     @param {Object} oldProps 老的节点属性对象
     @param {Object} newProps 新的节点属性对象
     @param {Number} index 当前深度优先遍历的下标
     @param {Object} currentIndexPatches 当前存储dom修改内容的对象
     @return
     */
    diffProps(oldProps: any, newProps: any, index: diffIndex, currentIndexPatches: currentPatchItem[], oldNode?, newNode?): void {
        // 遍历旧的属性,找到被删除和修改的情况
        for(const propKey in oldProps) {
            //新属性中不存在该属性说明属性被删除
            if(!newProps.hasOwnProperty(propKey)) {
                currentIndexPatches.push({
                    type: patch.NODE_ATTRIBUTE_DELETE,
                    key: propKey
                })
            } else if(newProps[propKey] !== oldProps[propKey]) {   //属性值改变
                currentIndexPatches.push({
                    type: patch.NODE_ATTRIBUTE_MODIFY,
                    key: propKey,
                    value: newProps[propKey]
                })
            }
        }
        //遍历新元素,找到添加的部分
        for(const propKey in newProps) {
            //旧属性中不存在 添加新属性
            if(!oldProps.hasOwnProperty(propKey)) {
                currentIndexPatches.push({
                    type: patch.NODE_ATTRIBUTE_ADD,
                    key: propKey,
                    value: newProps[propKey]
                })
            }
        }
    }
    /**
     比较子节点的变化
     @param {Array} oldChildren 老的子节点数组
     @param {Array} newChildren 新的子节点数组
     @param {Number} index 当前深度优先遍历的下标
     @param {Object} currentIndexPatches 存储dom修改内容的对象
     @param {Object} patches 存储dom修改内容的对象
     @return
     */
    diffChildren(oldChildren: VDom[], newChildren: VDom[], index: diffIndex, currentIndexPatches: currentPatchItem[], patches: patchItem) {
        if(oldChildren.length < newChildren.length) {   //有元素添加
            let i = 0
            for(; i < oldChildren.length; i++) {   //下标不超出老子节点数组 递归子节点
                index.value++
                this.dfsWalk(oldChildren[i], newChildren[i], index, patches)   //递归对比新旧子节点的变化
            }
            for(; i < newChildren.length; i++) {    //下标超出老子节点数组视为新增节点
                currentIndexPatches.push({
                    type: patch.NODE_ADD,
                    value: newChildren[i]
                })
            }
        } else {
            //对比新旧子元素的变化
            for(let i = 0; i < oldChildren.length; i++) {
                index.value++
                this.dfsWalk(oldChildren[i], newChildren[i], index, patches)   //递归对比新旧子节点的变化
            }
        }
    }
    getPatches() {
        return this.patches
    }
}

window['diff'] = diff