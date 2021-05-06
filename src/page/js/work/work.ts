/// <reference path="../../../typing/index.d.ts" />

import '@/page/css/work/work.scss';   //引入scss文件


declare global {
    interface Window { 
        axios: any; 
        Router: any
        Vue: any
    }
}


$(function () {
    CommonUtils.setHtmlTitle('操作指南')
    new Vue({
        el: 'app',
        data: {
            text: 'hello world',
            className: 'green',
            bgColor: '#5a96ec',
            textColor: '#e99d3a',
            isChange: false,
            isShow: false
        },
        methods: {
            changeColor() {
                if(!this.isChange) {
                    this.className = 'red'
                    this.bgColor = '#67c23a'
                    this.textColor = '#fff'
                    this.isShow = true
                    this.isChange = true
                } else {
                    this.className = 'green'
                    this.bgColor = '#5a96ec'
                    this.textColor = '#e99d3a'
                    this.isShow = false
                    this.isChange = false
                }
            }
        }
    })
})

