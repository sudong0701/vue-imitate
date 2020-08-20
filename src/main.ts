import '@/page/css/common/common.scss'
import axios from './utils/axios'

require('@/router/index')

window['axios'] = axios

//热更新添加
if ((module as any).hot) {
    (module as any).hot.accept();
}
