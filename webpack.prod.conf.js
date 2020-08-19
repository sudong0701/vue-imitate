const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");   //分离css
const CleanWebpackPlugin = require('clean-webpack-plugin');   //防止打包重复生成js文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');   //压缩代码
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');    //打包静态资源 static文件夹内的文件
const glob = require('glob')
const postcss = require('./postcss.config');

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

var config =  {
    //webpack4.0新增环境配置项
    mode: 'production',
    //入口文件配置
    entry: {
        app: ['babel-polyfill', './src/main.ts'],
        // vendor: ['jquery']
    },
    //输出文件配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[chunkhash].js',   //增加防缓存机制 保证用户获取最新的页面
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
            '@': path.resolve(__dirname, 'src')
        }
    },
    // 开发工具
    devtool: 'cheap-module-source-map',
    module: {   //加载器 loader配置项
        rules: [
            // {
            //     test: require.resolve('jquery'),
            //     use: [
            //         {
            //             loader: 'expose-loader',
            //             options: 'jQuery'
            //         },{
            //             loader: 'expose-loader',
            //             options: '$'
            //         }
            //     ]
            // },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                    loader: "css-loader"
                }, {
                    loader: "postcss-loader",
                    options: {
                        publicPath: '../',
                        sourceMap: true,
                        config: {
                            path: 'postcss.config.js'
                        }
                    }
                }
                ]
            },
            //处理scss文件
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
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
    //webpack4新增配置项
    optimization: {
        minimizer: [ // 用于配置 minimizers 和选项
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        // splitChunks: {   //拆分依赖库的代码 将逻辑代码和依赖库代码分离
        //     chunks: 'initial', // 只对入口文件处理
        //     cacheGroups:{
        //         vendors: {
        //             test: /node_modules\//,
        //             name: 'vendor',
        //             priority: 10,
        //             enforce: true,
        //         }
        //     }
        // },
        // runtimeChunk: {
        //     name: 'manifest'
        // }
    },
    //Plugins插件配置
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.HashedModuleIdsPlugin(),   //实现持久化缓存
        new HtmlWebpackPlugin({
            filename: 'index.html',   //输出文件的名称
            template: path.resolve(__dirname, 'index.html'),   //模板文件的路径
            title: '主页',   //配置生成页面的标题
            minify:{   //压缩html
                removeRedundantAttributes:true, // 删除多余的属性
                collapseWhitespace:true, // 折叠空白区域
                removeAttributeQuotes: true, // 移除属性的引号
                removeComments: true, // 移除注释
                collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
            },
            chunks: ['app', 'manifest', 'app~b80/b80']
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css',
            chunkFilename: 'css/[name].[hash].css',
        }),
        new copyWebpackPlugin([{
            from:path.resolve(__dirname+'/static'),// 打包的静态资源目录地址
            to:'static' // 打包到dist下面的static
        }])
    ]
}

var directories = getDirectories()
directories.map((item)=> {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    const entryName = item.jsFile.substring(item.jsFile.indexOf('js/')+3, item.jsFile.indexOf('.'))
    config.entry[entryName] = [`./src/page/${item.jsFile}`]
    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: item.htmlFile,
        // 每个html的模版，这里多个页面使用同一个模版
        template: `./src/page/${item.htmlFile}`,
        // 自动将引用插入html
        inject: true,
        minify:{   //压缩html
            removeRedundantAttributes:true, // 删除多余的属性
            collapseWhitespace:true, // 折叠空白区域
            removeAttributeQuotes: true, // 移除属性的引号
            removeComments: true, // 移除注释
            collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
        },
        chunks: [entryName]
    })
    config.plugins.push(plugin);
})

module.exports = config