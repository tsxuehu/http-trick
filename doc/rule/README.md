
# 转发规则
<img src="./img/rulelist.jpeg" />
## 规则导入
可以导入远程规则、本地规则。方便团队之间共享规则文件。  
导入gitlab上的远程规则时，确保已经配置了gitlab token

## 规则导出
将规则文件导出，放到gitlab上，方便别人导入。  

## 规则配置
zanProxy中一个规则集可对应多个规则，每个规则集和每个规则都可单独配置是否生效。(如a规则在A规则集下，当A规则不生效时，无论a规则是否被勾选，都不生效)。
<img src="./img/ruleedit.png" />
## rule编辑界面

### 条件
条件框分给两个组成部分
* 请求方式: 请求方式中可以选择包含GET，POST，PUT以及全部，你可以选择不同的请求方式对你需要转发的请求进行定义。
* 匹配规则  

#### 匹配过程
匹配规则为该请求是否被zanProxy所转发的主要判定方式。其判定规则如下：
1. 优先将匹配规则当成一个字符去匹配所有请求，当某一请求的url中包含匹配规则，则视为该请求符合该匹配规则。
2. 当规则1无法匹配时，将该匹配规则实例化为一个正则表达式，再对所有请求进行匹配（RegExp.prototype.test方法）。

### 动作：转发请求
将请求转发到本地、或者另一个url

### 动作：返回自定义数据
将指定的数据文件返回给浏览器

### 动作：修改返回body
* 可以为html中的js、css资源请求后面加上时间戳，避免使用缓存数据。
* 可以将数据以jsonp的方式返回

### 进阶
在使用正则写匹配规则时，zanProxy支持在处理类型的转发中写$占位符，用于替换为正则匹配后第N个获取组。  
e.g.  
请求url为：https://b.yzcdn.cn/v2/build/wap/showcase/sku_58590c11af.js  
要拦截的请求的url特征为：build/wap/(.*?)_[^_]*$  
请求转发路径为：<%=wapproject%>/js/$1/main.js。  
则最终请求路径中的$1将被替换为showcase/sku  