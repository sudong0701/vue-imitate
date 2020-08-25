/// <reference path="../../../typing/index.d.ts" />   

import '@/page/css/work/work.scss';   //引入scss文件

declare global {
    interface Window { 
        axios: any; 
        Router: any
        Vue: any
    }
}

class work {
    constructor() {
        this.initData()
    }
    /**
     初始化数据
     @param
     @return
    */
    initData(): void {
        window.axios.post()    //接口调用示例
        $('#actionContent>p').text('这是操作流程页面')
        $('#questionContent>p').text('这是常见问题页面')
        $('#infoContent>p').text('这是方案说明页面')
        $('#actionTab').click(() => {
            this.changeTab('action')
        })
        $('#questionTab').click(() => {
            this.changeTab('question')
        })
        $('#infoTab').click(() => {
            this.changeTab('info')
            window.Router.push('main/main')
        })
    }
    /**
     切换tab页
     @param {string} type tab页类型
     @return
    */
    changeTab(type: string): void {
        $('#tab').children().removeClass('active')
        $('.content').removeClass('active')
        if (type == 'action') {
            $('#actionTab').addClass('active')
            $('#actionContent').addClass('active')
        } else if (type == 'question') {
            $('#questionTab').addClass('active')
            $('#questionContent').addClass('active')
        } else if (type == 'info') {
            $('#infoTab').addClass('active')
            $('#infoContent').addClass('active')
        }
    }
}

$(function () {
    CommonUtils.setHtmlTitle('操作指南')
    new work()
    new Vue({
        el: 'app',
        data: {
            text: 'hello world',
            className: 'green',
            bgColor: '#5a96ec'
        },
        methods: {
            reset() {
                this.className = 'red'
                this.bgColor = '#67c23a'
            }
        }
    })
})

