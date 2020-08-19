import '@/page/css/common/common.scss'

require('@/router/index.ts')

//热更新添加
if ((module as any).hot) {
    (module as any).hot.accept();
}
