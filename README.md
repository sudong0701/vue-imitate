# simple-Vue
> 低仿版MVVM框架

## 日志

### 2020.08.19
> 使用webpack4.X打包源生js多页面项目，路由模式为hash路由。支持npm run dev本地调试代码，npm run build打包项目。
  [webpack参考](https://github.com/kaivin/webpack4.x)

### 2020.08.25
新增低仿版mvvm

### 2020.09.02
> 新增丐版Virtual DOM(虚拟Dom)及template模板编译成虚拟Dom类,然后渲染成真实Dom,同时和MVVM集成一起,当数据更新时通过简版diff算法更新视图
待解决：目前对于‘：’语法要求苛刻，必须通过模板字符串的方法，示例参考page/js/work.ts和page/app/work.html(地址栏路由:work/work)：
```
<template>
    <div class="detail" :style="background: ${bgColor}`">
        <p :class="`${className}`">春江潮水连海平</p>
        <p>{{text}}</p>
        <input type="text" v-model="text">
        <div>
            <p @click="reset">海上明月共潮生</p>
            <span>滟滟随波千万里</span>
            <div>
                <p style="color: #5a96ec">何处春江无月明</p>
                <p>江流宛转绕芳甸</p>
            </div>
        </div>
    </div>
</template>
```
### 2020.09.03
> 新增 v-if和v-show控制元素显隐,v-show为设置元素display:none;v-if则元素不会渲染，示例参考page/js/main.ts和page/app/main.html(地址栏路由:main/main):
```
<template>
    <div class="main">
        <p v-show="isShow">111</p>
        <p v-if="isShow">
           <span>
               <img src="https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg" alt="">
           </span>
        </p>
        <button @click="reset">控制显隐</button>
    </div>
</template>
```

