/// <reference path="../../../index.d.ts" />

import '@/page/css/work/work.scss';
const { axios } = require('@/utils/axios')


$(function() {
    CommonUtils.setHtmlTitle('操作指南')
    initData()
    $('#actionTab').click(function () {
        changeTab('action')
    })
    $('#questionTab').click(function () {
        changeTab('question')
    })
    $('#infoTab').click(function () {
        changeTab('info')
    })
})


/**
 初始化数据
 @param
 @return
 */
function initData():void {
    $('#actionContent>p').text('这是操作流程页面')
    $('#questionContent>p').text('这是常见问题页面')
    $('#infoContent>p').text('这是方案说明页面')
}

/**
 切换tab页
 @param {string} type tab页类型
 @return
 */
function changeTab(type: string): void {
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

