/**
 * @author sudong.duan
 * Date: 2020.09.03
 * description: ts声明文件
 */

interface VDomInterface {
    //标签名
   tagName: string
   //属性名
   properties: {
       style: string
   }
   //子节点数组
   children: VDomInterface[]
   //索引
   key: number
   props: any
   render(): Node
}


declare var $: any
declare var request_path: any
declare var Vue: any
declare var module: any
declare var VDomInterface: VDomInterface