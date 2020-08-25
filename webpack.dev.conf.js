const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const copyWebpackPlugin = require('copy-webpack-plugin');    //打包静态资源 static文件夹内的文件
const open = require('opn')   //打开浏览器
const chalk = require('chalk')   //命令行颜色插件
const ip = require('ip').address()   //获取本机局域网IP
const port = 8089
const glob = require('glob')


//获取src路径下的所有js和ts文件 需要先安装glob插件
function getDirectories() {
    let plugins = []
    let jsFileList = glob.sync('./src/page/**/*.js')
    let tsFileList = glob.sync('./src/page/**/*.ts')
    jsFileList.map((item)=> {
        plugins.push({
            htmlFile: `app${item.substring(item.indexOf('js/') + 2, item.lastIndexOf('.'))}.html`,
            jsFile: item.substring(item.indexOf('js/'))
        })
    })
    tsFileList.map((item)=> {
        plugins.push({
            htmlFile: `app${item.substring(item.indexOf('js/') + 2, item.lastIndexOf('.'))}.html`,
            jsFile: item.substring(item.indexOf('js/'))
        })
    })
    return plugins
}

var config = {
    //webpack4.0新增环境配置项
    mode: 'development',
    //入口文件配置
    entry: {
        app: path.resolve(__dirname, './src/main.ts'),
        vendor: ['jquery']
    },
    //输出文件配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash].js',   //增加防缓存机制 保证用户获取最新的页面
        chunkFilename: "js/[name].[chunkhash].js",
        publicPath: ''
    },
    //模板解析配置项
    resolve: {
        //设置可省略文件后缀名 引用时可以省略后缀名
        extensions: [' ','.js','.json','.jsx', '.ts'],
        //查找 module 的话从这里开始查找;
        modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules")], // 绝对路径;
        //配置路径映射 即Vue通过@指定路径
        alias: {
            "@": path.resolve(__dirname, 'src'),  //仅适用于js文件
            "@dist": path.resolve(__dirname, 'dist')
        }
    },
    // 开发工具
    devtool: 'eval-source-map',   //增加sourcemap 方便开发调试
    module: {   //加载器 loader配置项  loader主要用来做模块转换 将非js模块转换为js能支持的模块
        rules: [
            {
                test: require.resolve('jquery'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'jQuery'
                    },{
                        loader: 'expose-loader',
                        options: '$'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true,
                        config: {
                            path: 'postcss.config.js'
                        }
                    }
                }]
            },
            //处理scss文件
            {
                test: /\.scss$/,
                use: [
                    {
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "postcss-loader",
                    options: {
                        sourceMap: true,
                        config: {
                            path: 'postcss.config.js'
                        }
                    }
                }, {
                    loader: 'sass-loader',
                    options: { sourceMap: true }
                }],
                exclude: /node_modules/
            },
            //处理ts文件
            {
                test: /\.tsx?$/,
                use:'ts-loader',
                exclude:/node_modules/
            },
            //处理图片静态资源
            {
                test: /\.(png|jp?g|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,        // 小于8192字节的图片打包成base 64图片
                            name:'images/[name].[hash:8].[ext]',
                            publicPath:''
                        }
                    }
                ]
            },
            //要处理 html 文件中的图片，需要用到 html-loader
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            attrs: ["img:src","img:data-src"]
                        }
                    }
                ]
            },
            //处理字体图标、音频、视频的loader 使用file-loader
            {
                // 文件依赖配置项——字体图标
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'fonts/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {
                // 文件依赖配置项——音频
                test: /\.(wav|mp3|ogg)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'audios/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {
                // 文件依赖配置项——视频
                test: /\.(ogg|mpeg4|webm)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        name: 'videos/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {
                test: /\.(js|jsx)$/,
                use: ['babel-loader?cacheDirectory=true'],
                include: path.resolve(__dirname, 'src')
            }
        ]
    },
    //Plugins插件配置
    plugins: [
        new HtmlWebpackPlugin({   //处理html 该插件会自动将当前打包的资源(js、css)自动引用到html文件中
            filename: 'index.html',   //输出文件的名称
            template: path.resolve(__dirname, 'index.html'),   //模板文件的路径
            title: '主页',   //配置生成页面的标题
            chunks: ['app', 'vendor', 'manifest', 'app~vendor', 'app~b80/b80']
        }),
        new copyWebpackPlugin([{
            from:path.resolve(__dirname+'/static'),// 打包的静态资源目录地址
            to:'static' // 打包到dist下面的static
        }]) ,
        new webpack.HotModuleReplacementPlugin()   //热更新模块添加
    ],
    //开发服务配置项
    devServer: {
        port: port,
        contentBase: path.resolve(__dirname, 'dist'),   //对外提供的访问内容的路径
        historyApiFallback: true,   //当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
        host: ip,   //配置DevServer服务器监听的地址
        open: 'chrome',
        hot: true,   //热更新
        inline: true,
        overlay: true,    //是否在浏览器全屏显示编译的errors或warnings 默认关闭
        clientLogLevel: "none",   //关闭console日志打印
        after(app) {   //在 webpack-dev-server 静态资源中间件处理之后，用于打印日志或其它处理
            open(`http://${ip}:${this.port}`)
                .then(() => {
                    console.log(chalk.cyan(`成功打开链接： http://${ip}:${this.port}`));
        })
                .catch(err => {
                console.log('error', chalk.red(err));
                });
        },
        before: function() {

        }
    }
}

var directories = getDirectories()
directories.map((item)=> {
    // 每个页面生成一个entry
    const entryName = item.jsFile.substring(item.jsFile.indexOf('js/')+3, item.jsFile.indexOf('.'))
    config.entry[entryName] = `./src/page/${item.jsFile}`
    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: item.htmlFile,
        // 每个html的模版，这里多个页面使用同一个模版
        template: `./src/page/${item.htmlFile}`,
        // 自动将引用插入html
        inject: true,
        chunks: [entryName]
    })
    config.devServer.after = ()=> {}    //防止多次打开浏览器
    config.plugins.push(plugin);
})


module.exports = config