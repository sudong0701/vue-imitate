interface routeItem {
    type?: string,
    route: string,
    path: string
}

interface pushItem {
    route: string,
    params?: any
}

import routes from './staticRoute'

class Router {
    routes: routeItem[] = []
    constructor(routes) {
        //添加路由
        routes.map((item)=> {
            if(item.children instanceof Array && item.children.length > 0) {
                item.children.map((child)=> {
                    this.routes.push({
                        type: item.type ? item.type : '',
                        route: `${item.route}/${child.route}`,
                        path: child.url
                    })
                })
            } else {
                this.routes.push({
                    type: item.type ? item.type : '',
                    route: `${item.route}`,
                    path: item.url
                })
            }
        })
    }
    /**
     路由初始化
     @param
     @return
     */
    init(): void {
        window.addEventListener('load', this.load.bind(this))
        window.addEventListener('hashchange', this.hashchange.bind(this))
    }
    /**
     页面加载时触发
     @param
     @return
     */
    load(): any {
        const routeObj:routeItem = this.getRoute(this.getCurrRoute())   //获取当前路由对象
        if(routeObj.path === '') {   //如果为空字符串说明前端无该路由页面则跳转至404页面
            this.push('error/404')
        } else {
            if(routeObj.type === 'chain') {
                $('#app').children('iframe').remove();
                this.createIframe(`/app/${routeObj.path}?t=20200811`, '', this.getCurrRoute());
            } else {
                $('#app').load(`/app/${routeObj.path}?t=20200811`)
            }
        }
    }

    hashchange(): any {
        const routeObj:routeItem = this.getRoute(this.getCurrRoute())   //获取当前路由对象
        if(routeObj.type === 'chain') {
            let $lastIframe = $('#app').children('iframe:last-child')
            if(this.getCurrRoute() === $lastIframe.attr('to')) {   //通过push跳转
                $('#app').children('iframe').hide();   //先隐藏所有iframe
                $lastIframe.show();   //显示最后一个iframe
            } else if(this.getCurrRoute() === $lastIframe.attr('from')) {   //浏览器回退
                $('#app').children('iframe').hide();   //先隐藏所有iframe
                $lastIframe.remove()   //然后删除最后一个iframe
                $('#app').children('iframe:last-child').show()   //最后显示原倒数第二个的iframe
            } else {
                $('#app').children('iframe').hide()   //隐藏所有iframe
                this.createIframe(`/app/${routeObj.path}?t=20200811`, $lastIframe.attr('to'), this.getCurrRoute());
            }
        } else {
            $('#app').load(`/app/${routeObj.path}?t=20200811`)
        }
    }
    /**
     路由跳转
     @param {String}route 路由
     @param {String}param 参数
     @return
     */
    push(route:string | pushItem) {
        if(typeof route === 'string') {   //如果route为字符串
            const routeObj:routeItem = this.getRoute(route)
            if(routeObj.path === '') {   //如果为空字符串说明前端无该路由页面则跳转至404页面
                this.push('error/404')
            } else {
                this.createIframe(`/app/${routeObj.path}?t=20200811`, this.getCurrRoute(), route)
                window.location.href = `${window.location.origin}/#/${route}`
            }
        } else if(route instanceof Object) {   //如果route为对象
            const routeObj:routeItem = this.getRoute(route.route)
            if(routeObj.path === '') {   //如果为空字符串说明前端无该路由页面则跳转至404页面
                this.push('error/404')
            } else {
                this.createIframe(`/app/${routeObj.path}?t=20200811`, this.getCurrRoute(), route.route)
                let url = `${window.location.origin}/#/${route}`
                if(typeof (route as any).params === 'string') {   //如果为字符串 直接相加
                    url += (route as any).params
                } else if((route as any).params instanceof Object) {   //如果route.params为对象
                    let index = 0
                    for(let key in (route as any).params) {
                        url = `${index++ === 0 ? '?' : '&'}${key}=${(route as any).params[key]}`
                    }
                }
                window.location.href = url
            }
        }

    }
    /**
     创建iframe
     @param {String}src 路径
     @param {String}from 原路由
     @param {String}to 下一个路由
     @return
     */
    createIframe(src: string, from: string, to: string) {
        let $iframe = $('<iframe></iframe>').attr({
            src: src,
            from: from,
            to: to
        })
        $('#app').append($iframe)
    }
    /**
     获取路由对象
     @param {String}route 路由
     @return {Object} 路由对象
     */
    getRoute(route: string): routeItem {
        let routeChild: routeItem = {
            route: '',
            path: ''
        }
        this.routes.map((item)=> {
            if(item.route === route) {
                routeChild = item
            }
        })
        return routeChild
    }
    /**
     获取当前路由(route)
     @param
     @return {String} 当前路由
     */
    getCurrRoute(): string {
        let h = window.location.hash.substr(1)
        let i = h.indexOf('?') < 0 ? h.length : h.indexOf('?')
        return h.substring(1, i)
    }

    /**
     获取参数链接
     @param
     @return {String} 参数集
     */
    getSearch(): string {
        var h = window.location.hash.substr(1);
        var i = h.indexOf('?')<0 ? h.length : h.indexOf('?');
        return h.substr(i+1);
    }

    /**
     获取链接参数
     @param {String}param 参数名
     @return {String} 参数值
     */
    getParameter(param: string): string {
        var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)', 'i');
        var r = this.getSearch().match(reg);
        if (r != null) {
            return r[2];
        } else {
            return '';
        }
    }
}

window['Router']= new Router(routes)
window['Router'].init()