
/*
 * 文件描述：公共方法
 * 创建时间：2018-11-13
*/
var CommonUtils = {
    /**
     去除字符串左右空格
     @param {String}str 原字符串
     @return {String} 去除左右空格后的字符串
     */
    trimStr: function (str) {
        if (str === undefined || str === 'undefined') {
            return ''
        }
        if (typeof(str) == 'number') {
            str = str.toString()
        }
        return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '')
    },
    /**
     转换空
     @param {String}str 原数据
     @return {String} 新数据
     */
    turnNull: function (str) {
        if (str === undefined || str === null || str === 'undefined' || str === 'null') {
            return '';
        }
        return str;
    },
    /**
     是否为空
     @param {String}str 字符穿
     @return {Boolean} 是否为空
     */
    isEmpty: function (str) {
        if (str === '' || str === 'null' || str === null || str === 'undefined' || str === undefined) {
            return true;
        }
        return false;
    },
    /**
     阻止事件冒泡
     @param
     @return
     */
    stopProp: function () {
        var e = window.event || arguments.callee.caller.arguments[0];
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    },
    /**
     日期格式化
     @param {Date}time 时间
     @param {String}format 时间格式
     @return {String} 新格式时间
     */
    dateFormat: function (time, format) {
        var t = new Date(time);
        var tf = function (i) {
            return (i < 10 ? '0' : '') + i;
        };
        return format.replace(/YYYY|MM|DD|hh|mm|ss|zz/g, function (a) {
            switch (a) {
                case 'YYYY':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'DD':
                    return tf(t.getDate());
                    break;
                case 'hh':
                    return tf(t.getHours());
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
                case 'zz':
                    return tf(t.getMilliseconds());
                    break;
            }
            ;
        });
    },
    /**
     加载公共资源
     @param {Function}callback 回调函数
     @return
     */
    loadCommon: function (callback) {
        this.appendLink('/src/assets/css/common/Common.css?t=20200205');
        this.appendLink('/src/assets/css/common/Dialog.css?t=20200205');
        this.appendScript('/src/third/jquery/Jquery-2.1.1.min.js', callback);
        this.appendScript('/src/config/Index.js?t=20200205');
        this.appendScript('/src/utils/md5.js');
        this.appendScript('/src/utils/AjaxUtils.js?t=20200205');
        this.appendScript('/src/utils/DialogUtils.js?t=20200205');
    },
    /**
     添加link资源
     @param {String}href 资源路径
     @return
     */
    appendLink: function (href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    },
    /**
     添加script样式资源
     @param {String}src 资源路径
     @param {Function}callback 回调函数
     @return
     */
    appendScript: function (src, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.onload = function () {
            if (typeof(callback) === 'function') {
                callback();
            }
        }
        document.body.appendChild(script);
    },
    /**
     调用app方法
     @param {Function}androidFun android方法
     @param {Function}iosFun ios方法
     @return
     */
    appFun: function (androidFun, iosFun) {
        var appType = CommonUtils.getAppType()
        if (appType == 'android') {
            androidFun()
        } else if (appType == 'ios') {
            iosFun()
        }
    },
    /**
     获取cookie参数
     @param {String}key 参数名
     @return {String} 参数值
     */
    getCookie: function (key) {
        var cookieArr = document.cookie.split(';');
        for (var i = 0; i < cookieArr.length; i++) {
            var arr = cookieArr[i].split('=');
            if (CommonUtils.trimStr(arr[0]) === key) {
                return arr[1];
            }
        }
        return '';
    },
    /**
     自动设置高度
     @param {String}divId div的id
     @param {String}width 参考宽度
     @param {String}height 参考高度
     @return
     */
    autoHeight: function (divId, width, height) {
        var radio = height / width;
        $('#' + divId).height(radio * document.body.clientWidth);
    },
    /**
     铺满高度
     @param
     @return
     */
    fullHeight: function () {
        $('html').css('height', '100%');
        $('body').css('height', '100%');
    },
    /**
     元素铺满高度(前提：祖先元素无定位)
     @param {String}id 元素id
     @return
     */
    fullHeightById: function (id) {
        $('#' + id).css({
            position: 'absolute',
            height: '100%'
        });
    },
    /**
     铺满屏幕高度
     @param {dom}dom 元素
     @return
     */
    fullScreenHeight: function (dom) {
        dom.style.minHeight = (window.innerHeight - 1) + 'px'
    },
    /**
     设置网页标题
     @param {String}title 标题
     @return
     */
    setHtmlTitle: function (title) {
        $('title').text(title);
    },
    /**
     获取版本号
     @param
     @return
     */
    getVersion: function () {
        var route = '';
        if (typeof(Router) == 'undefined') {
            route = parent.Router.getCurrRoute();
        } else {
            route = Router.getCurrRoute();
        }
        if (route === 'jialan') {
            return '20190118'
        } else if (route.indexOf('invite') > -1) {
            return '201901241002'
        }
        return '20181113'
    },
    /**
     获取浏览器类型
     @param
     @return {String} 浏览器类型
     */
    getBrowserType: function () {
        var u = window.navigator.userAgent
        if (u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
            return 'wechat'
        }
        if (!CommonUtils.isEmpty(CommonUtils.getCookie('app_uinfo'))) {
            return 'app'
        }
        return 'browser'
    },

    /**
     获取app类型
     @param
     @return {String} app类型
     */
    getAppType: function () {
        var u = window.navigator.userAgent
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('Windows') > -1) {
            return 'android'
        }
        if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            return 'ios'
        }
        return ''
    },

    /**
     获取请求客户端类型
     @param
     @return {String} 请求客户端类型
     */
    getRequestClient: function () {
        if (CommonUtils.getAppType() == 'ios') {
            return '2'
        }
        return '1'
    },

    /**
     获取浏览器类型
     @param
     @return {String} 浏览器类型
     */
    isAppEntrance: function () {
        if (!CommonUtils.isEmpty(CommonUtils.getCookie('app_uinfo'))) {
            return true;
        }
        return false;
    },
    /**
     获取oss图片压缩参数
     @param {String}width 宽
     @param {String}height 高
     @return {String} 压缩参数
     */
    getAliOssCompress: function (width, height) {
        return '?x-oss-process=image/auto-orient,0/resize,m_lfit,h_' + height + ',w_' + width
    },
    /**
     过滤字符串
     @param {String} length 规格（几个一组）
     @param {String} str 需要过滤的字符串
     @return {String} 符合要求的字符串
     */
    filterString: function (length, str) {
        var filterStr = str.replace(/[^\w/]/ig, '')
        var num = Math.floor((filterStr.length - 1) / length)
        if (num <= 0) {
            return filterStr
        } else {
            var airStr = ''
            for (var i = 0; i < num; i++) {
                airStr = airStr + filterStr.substr(length * i, length)
            }
            airStr = airStr + filterStr.substr(length * num)
            return airStr
        }
    },
    /**
     获取ie版本号
     @param
     @return {String} ie版本号
     */
    getIEVersion: function () {
        var userAgent = navigator.userAgent
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                return 7;
            } else if (fIEVersion == 8) {
                return 8;
            } else if (fIEVersion == 9) {
                return 9;
            } else if (fIEVersion == 10) {
                return 10;
            } else {
                return 6;//IE版本<=7
            }
        } else if (isEdge) {
            return 'edge';//edge
        } else if (isIE11) {
            return 11; //IE11
        } else {
            return -1;//不是ie浏览器
        }
    },
    /**
     Uint8Array格式转字符串
     @param {Uint8Array} fileData Uint8Array格式的数据
     @return {String} 转换后的字符串
     */
    Uint8ArrayToString: function Uint8ArrayToString(fileData) {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
        return dataString
    },
    /**
     获取链接参数
     @param
     @return {String} 参数值
     */
    getParameter: function(param){
        var h = window.location.hash.substr(1)
        var i = h.indexOf('?')<0 ? h.length : h.indexOf('?')
        var r = h.substr(i+1).match(new RegExp('(^|&)'+param+'=([^&]*)(&|$)','i'))
        if (r != null) {
            return r[2]
        } else {
            return ''
        }
    }
}

