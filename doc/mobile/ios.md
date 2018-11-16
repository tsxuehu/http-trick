# 一、安装描述文件
默认安装「有赞移动」 App 的情况下，手机是没有安装根证书的，这会导致抓包或者连接弹出错误，在使用的时候，应当安装根证书（类似 Charles 的操作)


你会看见界面如下


<img src="https://img.yzcdn.cn/public_files/2018/11/16/5b81a436f10ed0dc78b9fa3b56e6dbb1.png" width="500" />


点击红字，就会安装描述文件，一路点允许即可。

安装完后是这样的


<img src="https://img.yzcdn.cn/public_files/2018/11/16/d02c1e243cfbf6ec4f51a2703660796a.png" width="500" />


这个就是安装完成的状态。

# 二、信任证书
证书安装完成的时候，默认是不信任的，所以需要信任证书，信任证书的方式如下：


「设置」——「通用」——「关于本机」—— 拉到底部「证书信任设置」 —— 把 「zProxy」的开关打开 —— 完成


<img src="https://img.yzcdn.cn/public_files/2018/11/16/2783949023fd2f9a6b1a730cfb54f204.png" width="500" />


像这样，就完成了

好，开始enjoy抓包吧
