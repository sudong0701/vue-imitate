/**
 * @author sudong.duan
 * Date: 2020.09.03
 * description: 路由配置文件
 */

interface routeChildren {
    route: string,
    url: string
}

interface route {
    route: string,
    url?: string,
    children?: routeChildren[]
}

const routes:route[] = [
    //系统路由404
    {
        route: 'error',
        children: [{
            route: '404',
            url: 'error/404.html'
        }]
    },
    //work简单业务
    {
        route: 'work',
        children: [{
            route: 'work',
            url: 'work/work.html'
        }]
    },
    //main测试业务
    {
        route: 'main',
        children: [{
            route: 'main',
            url: 'main/main.html'
        }]
    }

]

    export default routes