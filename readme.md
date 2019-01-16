# 1. 命令说明
## 1.1. 注意事项
不要在css和scripts目录下创建代码，会被自动化编译删除
不需要编译的代码，以及第三方的插件，建议放到lib下

## 1.2. gulp命令
建议使用gulp命令，防止有时候项目没有配置package.json，或者package.json没有及时更新

### 1.2.1. gulp / gulp default
编译scss和es
然后开启相关的监听

### 1.2.2. gulp build
清理css和scripts目录
然后编译scss和es

### 1.2.3. gulp clean
仅清理css和scripts目录

## 1.3. 参数
* --dev
以开发模式进行编译，为方便调试：
生成sourcemaps
不进行混淆加密
