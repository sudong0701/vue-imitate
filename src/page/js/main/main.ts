/// <reference path="../../../typing/index.d.ts" />


declare global {
    interface Window {
        axios: any;
        Router: any
        Vue: any
    }
}

export default new window['Vue']({
    el: 'app',
    data: {
        isShow: false
    },
    methods: {
        reset() {
            this.isShow = !this.isShow
        }
    }
})

