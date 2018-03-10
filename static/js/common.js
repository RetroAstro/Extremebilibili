
// Simple DOM Capture
var $ = {
    Single(obj) {
        return document.querySelector(obj);
    },
    All(obj) {
        return document.querySelectorAll(obj);
    }
}

//鼠标移入移出图片切换
var TabPics = {
    toggle(opts) {

        var 
        parent = $.Single(opts.Parent),
        spans = $.All(opts.Spans),
        imgBox = $.Single(opts.ImgBox);

        parent.addEventListener('mouseenter', (e) => {

            for ( let i = 0; i < spans.length; i++ ) {

                if ( e.target && e.target == spans[i] ) {

                    var url = "../static/img/rightaside" + (i+1) + ".png";

                    imgBox.style.cssText = "background:url(" + url + ");"; 

                }

            }

        }, true);
        
        parent.addEventListener('mouseleave', (e) => {

            for ( let i = 0; i < spans.length; i++ ) {

                if ( e.target && e.target == spans[i] ) {

                    imgBox.style.cssText = "visibility:hidden;"; 

                }

            }    

        }, true);

    }
}
TabPics.toggle({
    Parent: ".nav-con ul",
    Spans: ".all a span",
    ImgBox: ".img-box"
})


//分页
var pagination = {
    init(opts) {
        this.movement(opts);
    },
    movement(opts) {
        
        var pageBox = $.Single(opts.PageBox);
        var total = opts.Total;
        var currentPage = 1;

        listeners = {
            'meta': function(obj) {
                Click(obj.src);
                return false;
            }
        }

        listenersPrev = {
            'prev': function(obj) {
                prevClick()
                return false;
            }
        }

        listenersNext = {
            'next': function(obj) {
                nextClick();
                return false;
            }
        }

        var root = createPage(1, total);

        pageBox.innerHTML = root;

        $on(pageBox, ['click'], listeners);
        $on(pageBox, ['click'], listenersPrev);
        $on(pageBox, ['click'], listenersNext);

        function createPage(page, total) {

            var str = `<a class="current">${page}</a>`;

            for ( var i = 1; i <= 2; i++ ) {

                if ( page - i > 1 ) {
                    str = `<a attr="meta">${page-i}</a>` + str;
                }

                if ( page + i < total ) {
                    str = str + `<a attr="meta">${page+i}</a>`;
                }

            }

            if ( page - 4 > 1 ) {
                str = `<span class="dian">...</span>` + str;
            }

            if ( page + 4 < total ) {
                str = str + `<span class="dian">...</span>`;
            }

            if ( page > 1 ) {
                str = `<a class="prev">上一页</a><a attr="meta">1</a>` + str;
            }

            if ( page < total ) {
                str = str + `<a attr="meta">${total}</a><a class="next">下一页</a>`;
            }

            return str;

        }

        var that = this;

        function prevClick() {
            var back = --currentPage;
            var reset = createPage(back, total);
            pageBox.innerHTML = reset;
            that.reaction(back);
        }

        function nextClick() {
            var forward = ++currentPage;
            var reset = createPage(forward, total);
            pageBox.innerHTML = reset;
            that.reaction(forward);
        }

        function Click(obj) {
            var present = parseInt(obj.textContent);
            currentPage = present;
            var root = createPage(present, total);
            pageBox.innerHTML = root;
            that.reaction(present);
        }

        //事件代理
        function $on(dom, event, listeners) {
            $addEvent(dom, event, function(e) {

                var 
                e = e || window.event,
                src = e.target,
                returnVal,
                action;
    
                while ( src && src !== dom ) {
                    action = src.getAttribute('attr') || src.getAttribute('class');
                    if ( listeners[action] ) {
                        returnVal = listeners[action]({
                            src: src,
                            e: e,
                            action: action
                        })
                        if ( returnVal === false ) { break }
                    }
                    src = src.parentNode;
                }
            })
        }

        function $addEvent(obj, type, handle) {
            
            function createDelegate(handle, context) {
                return function() {
                    return handle.apply(context, arguments);
                }
            }
            
            var wrapper = createDelegate(handle, obj);
            
            obj.addEventListener(type, wrapper, false);
        }
    },
    reaction(page) {
        //请求页面
    }
}


//回到顶部
var rocker = {
    init(opts) {
        this.dispose(opts);
    },
    dispose(opts) {

        var rocket = $.Single(opts.Rocket);

        var speed = opts.Speed;

        rocket.addEventListener('click', fly);

        if ( opts.Hide ) {

            document.addEventListener('scroll', () => {

                window.pageYOffset > opts.Height ? rocket.style.display = 'block' : rocket.style.display = 'none';
    
            })

        }

        function fly() {

            cancelAnimationFrame(timer);
        
            var timer = requestAnimationFrame( function fn() {
        
                var top = window.pageYOffset;
        
                if ( top > 0 ) {
        
                    document.documentElement.scrollTop = top - speed;
        
                    timer = requestAnimationFrame(fn);
        
                } else {
                    cancelAnimationFrame(timer);
                }
            })

        }
    }
}

//check login
var logined = {
    init() {
        this.check();
    },
    check() {

        var storage = new Storage();

        var jwt = storage.getLocal('jwt');

        var nav = $.Single('.nav-con.bui-right');

        var name = $.Single('.header-name b');

        var coin = $.Single('.btns-profile .coin .num');

        var Bcoin = $.Single('.btns-profile .currency .num');
        
        if ( jwt !== null ) {
        
            var arr = jwt.split('.');
            
            var base = new Base64();
        
            var decode = base.decode(arr[1]);
        
            var obj = JSON.parse(decode);

            name.textContent = obj.nickname;

            coin.textContent = obj.coin;

            Bcoin.textContent = obj.Bcoin;

            nav.classList.add('logined');
        
        } else {

            nav.classList.remove('logined');

        }

        var out = $.Single('.logout');

        out.addEventListener('click', () => {

            storage.clearLocal();

            location.reload();

        })

    }
}



function formatUNIX(time) {

    var unix = time;

    var unixTimestamp = new Date( unix * 1000 );

    let Y = unixTimestamp.getFullYear();

    let M = ((unixTimestamp.getMonth() + 1) > 10 ? (unixTimestamp.getMonth() + 1) : '0' + (unixTimestamp.getMonth() + 1));

    let D = (unixTimestamp.getDate() > 10 ? unixTimestamp.getDate() : '0' + unixTimestamp.getDate());

    let today = Y + '-' + M + '-' + D;

    return today
}


//函数节流
var throttle = function(fn, delay, reqDelay, context) {

    var timer = null;

    var start;

    return function() {

        var args = arguments;

        var current = +new Date();

        clearTimeout(timer);

        if ( !start ) {

            start = current;

        }

        if ( current - start >= reqDelay ) {

            fn.apply(context, args);

            start = current;

        } else {

            timer = setTimeout( function() {

                fn.apply(context, args);
                
            }, delay);

        }

    }
    
}


//ajax
function ajax(setting) {
    //设置参数初始值
    var opts = {
        method: ( setting.method || "GET" ).toUpperCase(),
        url: setting.url || "",
        async: setting.async || true,
        dataType: setting.dataType || "json",
        data: setting.data || "",
        success: setting.success || function() {},
        error: setting.error || function() {},
        jwt: setting.jwt
    }
    //参数格式化
    function params_format(obj) {
        var str = '';
        for ( var i in obj ) {
            str += i + '=' + obj[i] + '&';
        }
        return str.split('').slice(0, -1).join('');
    }
    //创建ajax对象
    var xhr = new XMLHttpRequest();

    if ( opts.method == 'GET' ) {
        xhr.open( opts.method, opts.url, opts.async );
        xhr.send();
    } else if ( opts.method == 'POST' ) {
        xhr.open( opts.method, opts.url, opts.async );
        xhr.setRequestHeader("Content-Type", "text/plain;charset=utf-8");
        if ( setting.jwt ) {
            xhr.setRequestHeader("jwt", setting.jwt);
        }
        xhr.send(opts.data);
    }
    //onreadystate
    xhr.onreadystatechange = function() {
        if ( xhr.readyState == 4 && (xhr.status === 200 || xhr.status === 304) ) {
            switch(opts.dataType) {
                case "json":
                    var json = JSON.parse(xhr.responseText);
                    opts.success(json);
                    break;
                case "xml":
                    opts.success(xhr.responseXML);
                    break;
                default:
                    opts.success(xhr.responseText);
                    break;
            }
        }
    }
    xhr.onerror = function(err) {
        opts.error(err);
    }
}

//fetch
function fetcher(url, setting) {

    var headers = new Headers(setting.headers);
    //设置参数初始值
    let opts = {
        method: ( setting.method || 'GET' ).toUpperCase(),
        headers: headers,
        credentials: setting.credentials || true, //设置cookie是否一起发送
        body: setting.body || {},
        mode: setting.mode || 'no-cors',  //可以设置cors, no-cors, same-origin
        redirect: setting.redirect || 'follow', //follow, error, manual
        cache: setting.cache || 'default' //default, reload, no-cache
    }

    let 
    data = setting.data || "",
    dataType = setting.dataType || "json";
        
    function params_format(obj) {
        var str = ''
        for ( var i in obj ) {
            str += `${i}=${obj[i]}&`
        }
        return str.split('').slice(0, -1).join('');
    }

    if ( opts.method === 'GET' ) {
        url = url + (data?`?${params_format(data)}`:'')
    }else {
        setting.body = data || {}
    }

    var request = new Request(url, opts);

    return new Promise( (resolve, reject) => {
        fetch(request).then( async res => {
            let data = 
                dataType === 'text'
                ? await res.text()
                : dataType === 'blob'
            ? await res.blob()
            : await res.json()
            resolve(data)
        }).catch( e => {
            reject(e)
        })
    })
}


//Storage
class Storage {
    constructor () {
        this.ls = window.localStorage;
        this.ss = window.sessionStorage;
    }

    /*-----------------cookie---------------------*/

    /*设置cookie*/
    setCookie (name, value, day) {
        var setting = arguments[0];
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object'){
            for ( var i in setting ) {
                var oDate = new Date();
                oDate.setDate(oDate.getDate() + day);
                document.cookie = i + '=' + setting[i] + ';expires=' + oDate;
            }
        }else {
            var oDate = new Date();
            oDate.setDate(oDate.getDate() + day);
            document.cookie = name + '=' + value + ';expires=' + oDate;
        }
    }

    /*获取cookie*/
    getCookie (name) {

        var arr = document.cookie.split('; ');

        for ( var i = 0; i < arr.length; i++ ) {

            var arr2 = arr[i].split('=');

            if ( arr2[0] == name ) {

                return arr2[1];

            }
        }

        return '';

    }

    /*删除cookie*/
    removeCookie (name) {

        var exp = new Date();

        exp.setTime( exp.getTime() - 1 );

        var cookie = this.getCookie(name);

        if ( cookie !== null ) {

            document.cookie = name + "=" + cookie + ";expires=" + exp.toGMTString();

        }
        
    }

    /*-----------------localStorage---------------------*/

    /*设置localStorage*/
    setLocal(key, val) {
        var setting = arguments[0];
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object'){
            for(var i in setting){
                this.ls.setItem(i, JSON.stringify(setting[i]))
            }
        }else{
            this.ls.setItem(key, JSON.stringify(val))
        }
    }

    /*获取localStorage*/
    getLocal(key) {
        if (key) return JSON.parse(this.ls.getItem(key))
        return null;
    }

    /*移除localStorage*/
    removeLocal(key) {
        this.ls.removeItem(key)
    }

    /*移除所有localStorage*/
    clearLocal() {
        this.ls.clear()
    }

    /*-----------------sessionStorage---------------------*/

    /*设置sessionStorage*/
    setSession(key, val) {
        var setting = arguments[0];
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object'){
            for(var i in setting){
                this.ss.setItem(i, JSON.stringify(setting[i]))
            }
        }else{
            this.ss.setItem(key, JSON.stringify(val))
        }
    }

    /*获取sessionStorage*/
    getSession(key) {
        if (key) return JSON.parse(this.ss.getItem(key))
        return null;
    }

    /*移除sessionStorage*/
    removeSession(key) {
        this.ss.removeItem(key)
    }

    /*移除所有sessionStorage*/
    clearSession() {
        this.ss.clear()
    }
}


//Polyfill
if ( !XMLHttpRequest.prototype.sendAsBinary ) {
    XMLHttpRequest.prototype.sendAsBinary = function (sData) {
      var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
      for (var nIdx = 0; nIdx < nBytes; nIdx++) {
        ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
      }
      this.send(ui8Data);
    };
}

function Base64() {
         
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
 
    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }
 
    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
        return utftext;
    }
 
    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
