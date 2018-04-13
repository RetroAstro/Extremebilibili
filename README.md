> ### Ultimate bilibili


#### 实现功能：

* #### 首页

  * 登录检测, 后端给的jwt储存用户信息, 前端用localStorage储存, 实现用户信息缓存
  * header部分的图片移入移出切换, 基于事件委托, 事件冒泡。
  * 利用ES6中的class语法实现封装的轮播功能, 便于首页中三处轮播使用。
  * 视频信息preview动画和弹幕预览, 借助CSS3, 将需要移动的background-position位移抽象为(x, y) 坐标 , 最终再乘上对应的px 则实现该功能。
  * 首页多处的tab切换功能, 利用对象委托 Object.create 实现函数的重写和复用。
  * 右侧导航栏,  通过JS中的各种宽高属性并结合setInterval,  getAttribute获取data-id等等实现分区移动和平滑滚动到首页顶部的功能, 通过css3中的animation实现手机APP下载的动画。
  * 调用后端首页接口, 利用 for in , switch, forEach, split 等方法实现数据的显示。
  * 调用搜索接口, 监听keyup事件, 对请求使用debounce, 减少请求频率, 实现搜索keyword的提示效果。


* #### 视频页

  * 通过 mousewheel 和拖拽事件的mousedown, mouseup, mousemove以及宽高的判断, 将拖拽后的值赋给鼠标滑动的值最终实现自定义滚动条的功能。
  * 视频播放, 通过html5 中video的原生API 再利用相关JS事件进行封装实现了音量, 视频进度的控制。
  * 弹幕, 实现本地发送滚动, 顶部, 底部弹幕的发送以及设置弹幕的字体的大小和颜色。
  * 视频窗口底部逐帧动画, 同样将要实现效果的运动抽象出来, 并实现函数的封装进而对5个动画实现复用。
  * 视频标签添加, 浏览历史视频(假)
  * 用户评论, 通过事件代理, 熟用e.target并对点击元素进行querySelector的再次选择以及insertAdjacentHTML实现动态DOM的插入。
  * 视频接口, 通过window.location.href获取url, 进而得到videoId来获取data数据。 实现投硬币并向后端发送数据的效果。
  * 分页效果


* #### 注册页

  * 用户账号检测, 长度限制, 非法字符限制。
  * 用户密码强度检测, 根据数字, 字母, 和字符的不同匹配实现不同强度的显示。
  * 验证码限制1min获取。
  * 验证码以及注册接口的调用。( 尝试了下 fetch 获取接口 )


* #### 登录页

  * 用户名和密码输入的检测以及检测其是否正确。

* #### 视频上传页

  * 利用html 5 file API 和 Formdata 实现文件的上传, 并通过ajax的onprogress事件实现下载速度的显示。


* #### 搜索页

  * 调用后端搜索接口, 实现keyword提示, 点击keyword再显示数据, 点击分页实现下一页数据的再次加载, 点击视频图片跳转到视频页的功能。

> #### PS :

* #### 安全性考虑

通过htmlEncode, 对用户输入进行敏感字符的转义。 通过设置Content-Security-Policy 设置白名单, 限制只允许本地script文件加载进而防止XSS。

* #### 函数复用

ajax, storage, formatTime 的一些函数封装, 将常用的函数放到common.js里面便于各个页面使用。

* ####  反向代理

通过koa-proxies 设置本地到后端服务器的反向代理, node 处理路由, 获取一些静态资源, 并解决跨域问题, 较好的实现了前后端分离。

> 使用:  npm install ; node app.js













