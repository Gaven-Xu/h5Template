---
title: "H5开发文档"
export_on_save:
  html: true
html: 
  toc: true
---
# 1. 联系方式

规范的目的是方便大家，简化开发流程，减少重复工作
如有不便的地方，希望及时反馈给我

😀 徐佳程

📞 18758037064 (电话、钉钉、微信)

✉ xujiacheng@ellabook.cn

# 2. 项目说明

基于Gulp配置的自动化流程，目前支持的功能：

- [x] scss编译，压缩
- [x] es6编译，压缩，混淆加密
- [x] 开发环境sourcemaps，生产环境混淆加密
- [x] 生成zip部署包（gulp zip）
- [ ] 图片压缩
- [x] H5的js工具库ellaH5（弹窗、url取参）
  - [x] setRem
  - [x] getQuery
  - [x] alert

## 2.1. 项目结构

```sh
# 此处仅列出与开发相关的部分

|--[项目目录]
    |--ipConfig.js      这里配置的是接口地址，可以修改ip和端口，但是不要增加和修改额外部分
    |--src              开发目录
        |--index.html   项目首页，如果有多页面，放在与index.html同一级
        |--es           js开发目录，ES3，ES6都写在这里，该目录的js会进行编译、压缩、混淆
        |--scss         css开发目录，统一采用scss后缀
        |--lib          第三方库目录，第三方的css或者js都可以放到这里，不进行任何压缩，例如zepto.min.js
          |--ellaH5     公司统一抽离出来的工具库，不需要压缩的
        |--fonts        字体目录，需要使用自定义字体的时候，请在线进行字体裁剪 https://www.disidu.com/online-ttf-subset.html
        |--imgs         图片目录
        |--js           !!! css和js目录，都是编译后的目录，会被自动编译清空，不要手动在这两个目录写任何代码
        |--css          !!! css和js目录，都是编译后的目录，会被自动编译清空，不要手动在这两个目录写任何代码
```

## 2.2. 开发步骤


```sh
# 从以下地址拉取H5-template，
git clone git@git.ellabook.cn:front-end/h5-template.git [项目目录]
cd [项目目录]
gulp

# 根据约定好的目录结构开发

# 部署之前
gulp zip

# 如果部署人员需要zip包，把dist.zip发过去即可，如果需要自己部署到ftp，复制src下全部内容即可

```

## 2.3. 第三方库

* 尽可能选择体积小的，比如jQuery和Zepto，尽量使用Zepto
* 不要从第三方CDN访问，使用的第三方工具放入lib目录

## 2.4. 工具封装

* 自己封装的工具，放在es目录下，后续可以提供给架构组，加入到ellaH5工具库中


## 2.5. 注意事项
不要在 css 和 js 目录下创建代码，会被自动化编译删除
不需要编译的代码，以及第三方的插件，建议放到lib下

# 3. gulp命令


- gulp / gulp default

      编译scss和es
      然后开启相关的监听

- gulp build

      清理 css 和 js 目录
      然后编译scss和es

- gulp clean

      仅清理 css 和 js 目录

- gulp zip

      清理 css 和 js 目录
      编译 scss 和 es
      清理 zip 文件
      压缩 zip 文件

- --dev

      为方便调试，可以根据需要，在上述命令后面加上--dev
      生成 sourcemaps
      不进行混淆加密
      gulp --dev

