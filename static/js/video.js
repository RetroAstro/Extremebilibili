

$.All('.main-container').forEach( a => { a.onclick = (e) => { e.preventDefault() } });


//Tab切换
var Switch = {
    handler(opts) {

        var 
        parent = $.Single(opts.Parent),
        lis = $.All(opts.Lis),
        model = opts.Model || "click";

        parent.addEventListener( model, (e) => {

            for ( let i = 0; i < lis.length; i++ ) {

                if ( e.target && e.target == lis[i] ) {

                    lis.forEach((li) => {

                        li.classList.remove('on');

                    })

                    lis[i].classList.add("on");

                    this.Differ(i);

                }

            }

        },true)

    },
    Differ(i) {

        var 
        racer = $.Single(".racler a"),   
        Dynwrapper = $.Single(".dyn-wrapper"),
        Textarr = ["查看全部", "所有关注", "进入专栏区"];
        racer.innerText = Textarr[i];
        
        Dynwrapper.classList.remove('ease-up');

        Dynwrapper.classList.add('down');

        setTimeout(() => {

            Dynwrapper.classList.remove('down');

            Dynwrapper.classList.add('ease-up');

        },50);

    }
}
Switch.handler({
    Lis: ".menu li",
    Parent: ".menu ul"
})


var elecrank = Object.create(Switch);

elecrank.Differ = function(i) {

}
elecrank.handler({
    Lis: ".elecrank-header .rank-tab",
    Parent: ".elecrank-header .rank-wrp"
})


var tabsorder = Object.create(Switch);

tabsorder.Differ = function(i) {

}
tabsorder.handler({
    Lis: ".tabs-ul li",
    Parent: ".tabs-ul"
})


var unique = true;

var videoTab = Object.create(Switch);

videoTab.Differ = function(i) {

    var wraplis = $.All(".capmark");

    for ( var wrapli of wraplis ) {
        wrapli.style.cssText = "display:none";
    }

    wraplis[i].style.cssText = "display:block";

    if ( i == 0 && unique ) {

        var sliderOne = Object.create(slider);

        sliderOne.init({
            Content: ".bili-player-recommend .mCSB_container",
            Tool: ".bili-player-recommend .mCSB_scrollTools",
            Dragger: ".bili-player-recommend .mCSB_dragger",
            Wrapper: ".bili-player-recommend .bili-player-panel-scrollbar"
        })

        unique = false;

    }
    
}
videoTab.handler({
    Lis: ".bili-player-filter .bpui-button",
    Parent: ".bili-player-filter"
})


var shield = {
    init(opts) {
        this.transform(opts);
        this.shotDown(opts);
    },
    transform(opts) {

        var 
        flex = $.Single(opts.Flex),
        flexp = flex.parentNode;

        flexp.addEventListener('click', () => {

            this.fresh = flexp;

            this.process();

        });
    },
    shotDown(opts) {

        var types = $.All(opts.Types);

        for ( let type of types ) {

            type.addEventListener('click', () => {

                this.fresh = type;

                this.process();

            })

        }

    },
    process() {

        var food = this.fresh;

        food.classList.toggle("active");

    }
}
shield.init({
    Flex: ".bpui-flex-wrap",
    Types: ".bili-player-block-filter-type"
})


var danmuToggle = Object.create(shield);

danmuToggle.init = function(opts) {

    this.shotDown(opts);

}

danmuToggle.shotDown = function(opts) {

    var types = $.All(opts.Types);

    var that = this;

    for ( let i = 0; i < types.length; i++ ) {

        that.parent = types[0].parentNode;

        types[i].addEventListener('click', () => {

            var 
            children = that.parent.childNodes,
            data0 = children[7].getAttribute('data-index'),
            data1 = children[9].getAttribute('data-index');

            if ( data0 == i ) {

                children[7].classList.toggle('active');

                children[9].classList.remove('active');

            } else if ( data1 == i ) {

                children[9].classList.toggle('active');

                children[7].classList.remove('active');

            }

        })

    }

}
danmuToggle.init({
    Types: ".bili-player-video-sendbar .bili-player-video-btn"
})


var ul = $.Single(".bpui-selectable");

var fragment = document.createDocumentFragment();

for ( var i = 0; i < 200; i++ ) {

    var li = document.createElement("li");

    li.innerHTML = 
    `
    <li class="danmu-info-row">
    <span class="danmu-info-time">08:27</span>
    <span class="danmu-info-content">${i}八戒</span>
    <span class="danmu-info-date">02-04 22:38</span>
    </li>
    `;

    fragment.appendChild(li);   
}

ul.appendChild(fragment);


//自定义滚动条 -->
var slider = {
    init(opts) {
        this.onWheel(opts);
        this.flag = false;
        this.y;
    },
    onWheel(opts) {

        var 
        tool = $.Single(opts.Tool),
        wrapper = $.Single(opts.Wrapper),
        dragger = $.Single(opts.Dragger),
        content = $.Single(opts.Content);

        scale = wrapper.clientHeight / content.clientHeight;
        h0 = ( wrapper.clientHeight ^ 2 ) / content.clientHeight;
        
        scale >= 1
                ? ( tool.style.display = "none" )
                : ( h0 < 30 
                        ? h0 = 30 
                        : h0 = h0 );
        dragger.style.height = h0 + "px";

        var y = 0;

        wrapper.addEventListener('mousewheel', (e) => {

        var 
        e = window.event || e,
        gapone = wrapper.clientHeight - dragger.clientHeight,
        gaptwo = content.clientHeight - wrapper.clientHeight;

            e.preventDefault 
                ? e.preventDefault() 
                : e.returnValue = false;
            this.y && this.flag
                ? y = this.y
                : y = y;
            this.flag = false;
            e.wheelDelta < 0 
                ? y += 10 
                : y -= 10;
            y <= 0 
                ? y = 0 
                : y = y;
            y >= gapone 
                ? y = gapone 
                : y = y;
            var y0 = y / scale;
            y0 >= gaptwo
                ? y0 = gaptwo
                : y0 = y0;

            this.dragger = dragger;
            this.content = content;
            this.process(y, y0);

        })

        dragger.addEventListener('mousedown', (e) => {
            this.dragger = dragger;
            this.content = content;
            this.wrapper = wrapper;
            this.start(e);
        })

    },
    start(e) {

        var me = this;

        deltaY = e.clientY - me.dragger.offsetTop;
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', stop);

        return false;

        function move() {

            var 
            gapone = me.wrapper.clientHeight - me.dragger.clientHeight,
            gaptwo = me.content.clientHeight - me.wrapper.clientHeight;

            var  
            e = window.event,
            y = e.clientY - deltaY;

            y <= 0 
                ? y = 0 
                : y = y;
            y >= gapone 
                ? y = gapone 
                : y = y;
            var y0 = y / scale;
            y0 >= gaptwo
                ? y0 = gaptwo
                : y0 = y0;
                
            me.y = y;
            me.flag = true;
            me.process(y, y0);

            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

            return false;

        }

        function stop() {

            document.removeEventListener('mousemove', move);

            document.removeEventListener('mouseup', stop);

            return true;

        }
    },
    process(y, y0) {

        this.dragger.style.top = y + "px";

        this.content.style.top = -y0 + "px";

    }
}
slider.init({
    Content: ".bili-player-danmu-wrap .mCSB_container",
    Tool: ".bili-player-danmu-wrap .mCSB_scrollTools",
    Dragger: ".bili-player-danmu-wrap .mCSB_dragger",
    Wrapper: ".bili-player-danmu-wrap"
})



// Player Control 
var videoController = {
    init(opts) {
        this.video  = $.Single(opts.Video);
        this.doc = $.Single(opts.Doc);
        this.reqfuller = $.Single(opts.Reqfuller);
        this.play();
        this.pause();
        this.requestFullscreen();
        this.exitFullscreen();
        this.playEvent(opts);
        this.doubleEvents(opts);
        this.isfullScreen(opts);
    },
    play() {

        const promise = this.video.play();

        if ( promise !== undefined ) {

            promise.catch(() => {
                console.log("It is fine...");
            })

        }

    },
    pause() {
        this.video.pause();
    },
    requestFullscreen() {

        var doc = this.doc;

        doc.requestFullscreen ? doc.requestFullscreen() : doc.webkitRequestFullScreen();

    },
    exitFullscreen() {

        document.exitFullscreen ? document.exitFullscreen() : document.webkitCancelFullScreen();

    },
    playEvent(opts) {

        var 
        button = $.Single(opts.Button),
        inside = $.Single(opts.Inside),
        binder = detail.bind(videoController);

        button.addEventListener('click', binder);
        this.video.addEventListener('click', binder);

        function detail() {

            if ( ! button.classList.contains("play") ) { 

                this.play();

                button.classList.add("play");
                inside.style.display = "none";
                button.childNodes[1].src = "../static/img/pause.png";

            } else {

                this.pause();

                button.classList.remove("play");
                inside.style.display = "block";
                button.childNodes[1].src = "../static/img/play.png";

            }

        }

    },
    isfullScreen() {

        var reqfuller = this.reqfuller;

        reqfuller.addEventListener('click', () => {

            this.requestFullscreen();

        })

    },
    doubleEvents(opts) {

        var 
        voprogress = $.Single(opts.Voprogress),    
        vohandle = $.Single(opts.Vohandle),
        vowrap = $.Single(opts.Vowrap),
        vpanel = $.Single(opts.Vpanel),    
        vonum = $.Single(opts.Vonum);

        var 
        viprogress = $.Single(opts.Viprogress),
        vitoaltime = $.Single(opts.Vitoaltime),
        vicurtime = $.Single(opts.Vicurtime),
        vihandle = $.Single(opts.Vihandle),
        viwrap = $.Single(opts.Viwrap);

        this.video.addEventListener('volumechange', updateVolume);
        this.video.addEventListener('timeupdate', updateProgress);
        this.video.addEventListener('loadedmetadata', () => {
            vpanel.style.display = 'none';
            vitoaltime.textContent = formatTime(this.video.duration);
        });

        vowrap.addEventListener('click', voact);
        vowrap.addEventListener('mousedown', () => { moveUp(1) });
        viwrap.addEventListener('click', viact);
        viwrap.addEventListener('mousedown', () => { moveUp(0) });

        function voact() { changeVolume(1) };
        function viact() { rewind(0) };

        function moveUp(x) {

            x == 1 ? type = voact : type = viact;

            document.addEventListener('mousemove', type);

            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

            document.addEventListener('mouseup',() => {

                document.removeEventListener('mousemove', type);

            })

        }

        function getRangeBox(x) {

            var rangeBox = null;

            x == 1 ? rangeBox = vowrap : rangeBox = viwrap;

            return rangeBox;

        }
        
        function inRange(x) {

            var e = window.event;
            var rangeBox = getRangeBox(x);
            var rect = rangeBox.getBoundingClientRect();
            var direction = rangeBox.dataset.direction;

            if ( direction == 'horizontal' ) {

                var min = rect.left;
                var max = min + rangeBox.offsetWidth;

                if ( e.clientX < min || e.clientX > max ) { return false };

            } else if ( direction == 'vertical' ) {

                var min = rect.top;
                var max = min + rangeBox.offsetHeight;

                if ( e.clientY < min || e.clientY > max ) { return false }; 

            }

            return true;

        }

        function getCoefficient(x) {

            var e = window.event;
            var slider = getRangeBox(x);
            var rect = slider.getBoundingClientRect();
            var K = 0;

            if ( slider.dataset.direction == 'horizontal' ) {

                var offsetX = e.clientX - rect.left;
                var width = slider.clientWidth;

                K = offsetX / width;

            } else if ( slider.dataset.direction == 'vertical' ) {

                var height = slider.clientHeight;
                var offsetY = e.clientY - rect.top;

                K = 1 - offsetY / height;
            }

            return K;

        }

        function changeVolume(x) {

            if ( inRange(x) ) {

                var that = videoController;

                that.video.volume = getCoefficient(x);

            }

        }

        function rewind(x) {

            if ( inRange(x) ) {

                var that = videoController;

                that.video.currentTime = that.video.duration * getCoefficient(x);

            }

        }

        function updateVolume() {

            var that = videoController;
            var final = that.video.volume * 100;
            var int = parseInt(final);

            int >= 97 ? int = 100 : int = int;

            int <= 3 ? int = 0 : int = int;

            vonum.textContent = int;
            vohandle.style.bottom = final + "%";
            voprogress.style.height = final + "%";

        }

        function updateProgress() {

            var that = videoController;
            var current = that.video.currentTime;
            var percent = current / that.video.duration * 100;

            vihandle.style.left = percent + "%";
            viprogress.style.width = percent + "%";
            vicurtime.textContent = formatTime(current);

        }

        function formatTime(time) {

            var min = Math.floor(time / 60);
            var sec = Math.floor(time % 60);

            return min + ':' + (sec < 10 ? '0' + sec : sec);

        }

    }
}
videoController.init({
    Video: ".bili-player-video video",
    Button: ".btn-start",
    Doc: ".bili-player-video-wrap",
    Inside: ".bili-player-video-state img",
    Reqfuller: ".bili-player-video-btn-fullscreen",
    Vonum: ".volume-num",
    Vowrap: ".vertical",
    Vohandle: ".vertical .bpui-slider-handle",
    Voprogress: ".vertical .bpui-slider-progress",
    Viwrap: ".horizontal",
    Vpanel: '.bili-player-video-panel',
    Vihandle: ".horizontal .bpui-slider-handle",
    Vicurtime: ".time-now",
    Vitoaltime: ".time-total",
    Viprogress: ".horizontal .bpui-slider-progress"
})


//弹幕
var barrage = {
    init(opts) {
        this.fonSizeEvent(opts);
        this.colorEvent(opts);
        this.danmakuEvent(opts);
        this.monitor(opts);
        // this.SaveTime(opts);
    },
    monitor(opts) {

        var that = this;

        var sendBtn = $.Single(opts.SendBtn);

        document.addEventListener('keydown', (e) => {

            if ( e.keyCode == 13 ) {

                that.createNew(opts);

            }

        });

        sendBtn.addEventListener('click', () => { that.createNew(opts) });

    },
    //获取用户输入文本
    getsafeValue(opts) {

        var unfilter = $.Single(opts.Unfilter).value;

        var encodeText = this.htmlEncode(unfilter);

        return encodeText;

    },
    //创建div并进行文本, 颜色, 字体赋值
    createNew(opts, data) {

        var text;

        var args = Array.from(arguments);

        args.length !== 1 ? text = data : text = this.getsafeValue(opts);

        var danmaku = $.Single(opts.Danmaku);

        var div = document.createElement('div');

        danmaku.appendChild(div);

        div.textContent = text;

        $.Single(opts.Unfilter).value = "";

        div.style.fontSize = this.fonSize;

        div.style.color = this.danmakuColor;

        var 
        width = danmaku.offsetWidth,
        height = danmaku.offsetHeight, 
        maxLines = height / 28,
        divLength = div.offsetWidth;

        if ( this.mode == 'flow' ) {

            animateFlow();

        } else if ( this.mode == 'top' ) {

            animateUporDown(0);

        } else {

            animateUporDown(1);

        }

        div.addEventListener('webkitAnimationEnd', () => {

            danmaku.removeChild(div);

        })

        function animateFlow() {

            var top = 28 * ( parseInt(Math.random() * (maxLines + 1)) -1 );

            div.style.top = top + "px";

            let style = document.createElement('style');

            document.head.appendChild(style);

            let from = `from { -webkit-transform: translateX( ${width}px ); }`;

            let to = `to { -webkit-transform: translateX( -${width + divLength}px ); }`;

            style.sheet.insertRule(`@-webkit-keyframes danmu { ${from} ${to} }`, 0);

        }

        function animateUporDown(type) {

            var halfTop = [28 * ( parseInt(Math.random() * (maxLines + 1)) )]/2;

            if ( type == 0 ) {

                div.style.top = halfTop + "px";

            } else {

                div.style.bottom = halfTop + "px";

            }

            div.style.cssText += "left:50%;transform:translateX(-50%);transition:none;";

            let style = document.createElement('style');

            document.head.appendChild(style);

            style.sheet.insertRule(`@-webkit-keyframes danmu {}`, 0);

        }
    },
    //监听弹幕事件
    danmakuEvent(opts) {

        var spans = $.All(opts.DanmuSpans);

        var that = this;

        that.mode = 'flow';

        spans.forEach((span) => {

            span.addEventListener('click', () => {

                for ( var btn of spans ) {
                    btn.classList.remove('active');
                }

                span.classList.toggle('active');

                if ( span.classList.contains('active') ) {

                    that.mode = span.getAttribute('data-mode');

                }

            })

        })

    },
    //监听字体事件
    fonSizeEvent(opts) {

        var spans = $.All(opts.FontSpans);

        var that = this;

        spans.forEach((span) => {

            span.addEventListener('click', () => {

                for ( var me of spans ) {
                    me.classList.remove('active');
                }

                span.classList.add('active');

                if ( span.classList.contains('active') ) {

                    that.fonSize = span.getAttribute('data-size') + "px";

                }

            });

        })

    },
    //监听颜色事件
    colorEvent(opts) {

        var 
        currentColor = $.Single(opts.CurrentColor),
        currentInput = $.Single(opts.CurrentInput),
        colorPanel = $.Single(opts.ColorPanel),
        that = this;

        currentInput.addEventListener('keyup', () => {

            var curhex = '#' + currentInput.value;

            currentColor.style.backgroundColor = curhex;

            that.danmakuColor = curhex;

        });

        that.danmakuColor = '#' + currentInput.getAttribute('placeholder');

        colorPanel.addEventListener('mouseenter', (e) => {

            if ( e.target && e.target.nodeName == 'SPAN' ) {

                var gallery = window.getComputedStyle(e.target, null)
                                    .getPropertyValue('background-color');

                currentColor.style.backgroundColor = gallery;

                currentInput.value = rgbToHex(gallery);

                that.danmakuColor = gallery;

            }

        }, true);

        function rgbToHex(color) {
            var rgb = color.split(',');
            var r = parseInt(rgb[0].split('(')[1]);
            var g = parseInt(rgb[1]);
            var b = parseInt(rgb[2].split(')')[0]);
            var hex = ( (1 << 24) + (r << 16) + (g << 8) + b ).toString(16).slice(1);
            return hex;
        }
    },
    SaveTime(opts) {

        var json = {
            '0:02' : '弹幕1',
            '0:05' : '弹幕2',
            '0:08' : '弹幕3',
            '0:10' : '弹幕4',
            '0:15' : '弹幕5'
        }

        var current = $.Single('.time-now');

        var keys = Object.keys(json);

        var that = this;

        var timer = setInterval(() => {

            for ( var key in json ) {

                if ( current.textContent == key ) {
    
                    var value = json[key];
    
                    that.createNew(opts, value);
    
                }
    
            }

            if ( current.textContent > keys[keys.length-1] ) {

                clearInterval(timer);

            }

        }, 1000)

    },
    //防止xss注入对用户输入进行转义
    htmlEncode(html) {

        var sub = document.createElement('div');

        sub.textContent !== null ? sub.textContent = html : sub.innerHTML = html;

        var output = sub.innerHTML;

        sub = null;

        return output;

    }

}
barrage.init({
    SendBtn: ".bpui-send-button",
    Unfilter: ".bili-player-video-danmaku-input",
    Danmaku: ".bili-player-video-danmuku",
    FontSpans: ".fontsize .selection-span",
    DanmuSpans: ".mode .selection-span",
    CurrentColor: ".bili-player-color-picker-current",
    CurrentInput: ".bili-player-color-picker-code",
    ColorPanel: ".bili-player-color-picker-panel"
})


//bili动画
var FrameAnimater = {
    init(opts) {
        this.animateEvent(opts);
        this.sheets = opts.Sheets;
        this.origin = opts.Origin || 0;
    },
    animateEvent(opts) {

        var icon = $.Single(opts.Icon);

        var i = 0;

        icon.addEventListener('mouseenter', () => { this.forward(i,opts) });

        icon.addEventListener('mouseleave', () => { this.backward(opts) });

    },
    forward(i,opts) {

        var icon = $.Single(opts.Icon);

        clearInterval(timer);

        var timer = setInterval(() => {

            i++;

            icon.style.backgroundPositionX = '-' + i * 80 + 'px';

            this.i = i;

            i = i == this.sheets ? this.origin : i;

        },100);

        this.timer = timer;

    },
    backward(opts) {

        var icon = $.Single(opts.Icon);

        clearInterval(this.timer);

        clearInterval(timer);

        var timer = setInterval(() => {

            this.i <= 0 ? clearInterval(timer) : this.i--;

            if ( this.i <= 0 ) {

                icon.style.backgroundPositionX = '0px';

                clearInterval(timer);

            }

            icon.style.backgroundPositionX = '-' + this.i * 80 + 'px';

        }, 100)

    }
}
FrameAnimater.init({
    Icon: ".b-icon-anim-fav",
    Sheets: 13
})

var animater_coin = Object.create(FrameAnimater);

animater_coin.init({
    Icon: ".b-icon-anim-coin",
    Sheets: 7
})

var animater_later = Object.create(FrameAnimater);

animater_later.init({
    Icon: ".b-icon-anim-watch-later",
    Sheets: 11
})

var animater_battery = Object.create(FrameAnimater);

animater_battery.init({
    Icon: ".elecrank-bg",
    Sheets: 5
})

var animater_phone = Object.create(FrameAnimater);

animater_phone.animateEvent = function(opts) {

    var icon = $.Single('.arc-toolbar .app');
    var i = 0;

    icon.addEventListener('mouseenter', () => { this.forward(i,opts) });
    icon.addEventListener('mouseleave', () => { this.backward(opts) });
    
}

animater_phone.init({
    Icon: ".b-icon-anim-app",
    Sheets: 15,
    Origin: 9
})


//评论
var comment = {
    init(opts) {

        this.flag = true;

        this.logo = true;

        var parent = $.Single(opts.Parent);

        area();

        parent.addEventListener('click', (e) => {

            var e = e || window.event;
            
            var el = e.target;

            if ( el.classList.contains('comment-submit') ) {

                var con = el.parentNode.parentNode.parentNode;

                con.classList.contains('reply-con') ? this.Send(el.parentNode, 2) : this.Send(el.parentNode, 1);

            }

            if ( el.nodeName == 'I' ) {

                this.Like(el);

            }

            if ( el.classList.contains('reply') ) {

                this.Reply(el.parentNode.parentNode);

                area();

            }
        })

        function area() {

            var areas = parent.querySelectorAll('textarea');

            areas.forEach((area) => {

                area.addEventListener('focus', () => {

                    area.classList.remove('error');

                    area.classList.add('focus');

                })

                area.addEventListener('blur', () => {

                    area.classList.remove('focus');

                    area.classList.add('blue');

                })

            })

        }
    },
    Send(Box, Where) {

        var box = Box.querySelector('.ipt-txt');

        var text = box.value;

        if ( text == '' ) {

            var error = Box.querySelector('.m-error');

            error.classList.add('active');

            box.classList.add('error');

            box.classList.remove('blue');

            if ( this.logo ) {

                this.logo = false;

                setTimeout(() => {

                    error.classList.remove('active');

                    this.logo = true;

                },3000)

            }

        }

        var time = getCurrentTime();

        if ( text !== '' && Where == 1 ) {

            var item = 
            `
            <div class="list-item">
                <div class="user-face">
                    <a href="">
                        <img src="../static/img/avatar2.jpg">
                    </a>
                    <div class="hot-follow">
                        <button class="follow-btn">关注</button>
                    </div>
                </div>
                <div class="con">
                    <div class="user">
                        <a href="" class="name"><em>风雪飘翎</em></a>
                        <a href="">
                            <i class="level l2"></i>
                        </a>
                    </div>
                    <p class="text">
                    ${text}
                    </p>
                    <div class="info">
                        <span class="floor">#870</span>
                        <span class="time">${time}</span>
                        <span class="like">
                            <i></i>
                            <span>6499</span>
                        </span>
                        <span class="dislike">
                            <i></i>
                        </span>
                        <span class="reply">回复</span>
                    </div>
                    <div class="reply-box">
                        <div class="reply-item reply-wrap">
                            <a href="" class="reply-face">
                                <img src="../static/img/avatar.jpg">
                            </a>
                            <div class="reply-con">
                                <div class="user">
                                    <a href="" class="name">延榆生</a>
                                    <a href="">
                                        <i class="level l2"></i>
                                    </a>
                                </div>
                                <div class="info">
                                    <span class="time">2018-03-10</span>
                                    <span class="like">
                                        <i></i>
                                        <span>762</span>
                                    </span>
                                    <span class="reply">回复</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
            `

            var list = $.Single('.comment-list');

            list.insertAdjacentHTML('afterBegin', item);

            box.value = '';

        }

        if ( text !== '' && Where == 2 ) {

            var item = Box.parentNode.parentNode.parentNode;

            var user = item.querySelector('.user .name').textContent;

            var reply = 
            `
            <div class="reply-item reply-wrap">
                <a href="" class="reply-face">
                    <img src="../static/img/avatar2.jpg">
                </a>
                <div class="reply-con">
                    <div class="user">
                        <a href="" class="name"><em>风雪飘翎</em></a>
                        <a href="">
                            <i class="level l2"></i>
                        </a>
                        <span class="text-con">@${user}: ${text}</span>
                    </div>
                    <div class="info">
                        <span class="time">${time}</span>
                        <span class="like">
                            <i></i>
                            <span>388</span>
                        </span>
                        <span class="reply">回复</span>
                    </div>
                </div>
            </div>
            `

            item.insertAdjacentHTML('afterEnd', reply);

            box.value = '';

        }

        function getCurrentTime() {

            var now = new Date();  
          
            var year = now.getFullYear();      
            var month = now.getMonth() + 1;    
            var day = now.getDate();           
              
            var hh = now.getHours();           
            var mm = now.getMinutes();         
            var ss = now.getSeconds();          
              
            var clock = year + "-";  
              
            if ( month < 10 ) clock += "0";  
              
            clock += month + "-";  
              
            if ( day < 10 ) clock += "0";  
                  
            clock += day + " ";  
              
            if ( hh < 10 ) clock += "0";  
                  
            clock += hh + ":";

            if ( mm < 10 ) clock += '0';

            clock += mm + ":";   
               
            if ( ss < 10 ) clock += '0';  

            clock += ss;    
             
            return(clock);   

        }

    },
    Like(el) {

        var type = el.parentNode;

        if ( type.className == 'like' ) {

            var span = type.querySelector('span');

            var val = span.innerText;

            if ( ! el.classList.contains('liked') ) {

                el.classList.add('liked');

                val++;

                span.textContent = val;

                //add anothor like

            } else {

                el.classList.remove('liked');

                val--;

                span.textContent = val;

                //delete anothor like

            }
        }

        if ( type.className == 'dislike' ) {

            el.classList.toggle('disliked');

        }

    },
    Reply(box) {

        var sendBox = 
        `
        <div class="comment-send">
            <div class="user-face">
                <img src="../static/img/avatar2.jpg" class="user-head">
            </div>
            <div class="textarea-container">
                <textarea name="msg" rows="5" cols="80" placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。" class="ipt-txt blue" ></textarea>
                <button type="submit" class="comment-submit">发表评论</button>
                <div class="m-layer m-error">
                    <div class="mini">
                        <div class="msg-text">
                            请发送3到1000字且非纯表情的评论
                        </div>
                </div>
            </div>
            </div>
        </div>
        `

        if ( this.flag ) {

            box.insertAdjacentHTML('beforeEnd', sendBox);

            this.flag = false;

        } else {

            var send = $.Single('.con .comment-send');

            send.outerHTML = '';

            this.flag = true;

        }

    }
}
comment.init({
    Parent: ".bb-comment"
})


//视频接口
var interface = {
    init() {
        this.dispose();
    },
    dispose() {

        var url = window.location.href;

        var arr = url.split('/');

        var id = arr[arr.length-1];

        var data = packageJSON(id);

        ajax({
            method: 'POST',
            url: '/gayligayliapi/videoPage',
            data: data,
            success: function(data) {

                console.log(data);

                if ( data.result = 'success' && data.videoInfo !== undefined ) {

                    showInfo(data.videoInfo);

                }
                
            }
        })

        function showInfo(obj) {

            var sec_av = $.Single('.info-sec-av');

            var views = $.Single('.view-count span');

            var coin = $.Single('.bangumi-coin-wrap');

            var time = $.Single('.info-sec-pub');

            var name = $.Single('.header-info h1');

            var avatar = $.Single('.face-wrapper img');

            var detail = $.Single('.info .sign');

            sec_av.innerText = 'AV' + obj.avId;

            views.innerText = obj.views;

            coin.innerHTML = `<i class="bangumi-coin"></i><span class="coin-status">硬币</span><span>${obj.coin}</span>`;

            time.innerText = formatUNIX(obj.time);

            name.innerText = obj.name;

            avatar.src = obj.photoUrl;

            detail.innerText = obj.description;

        }

        function packageJSON(id) {
            var current = Math.round(new Date().getTime()/1000).toString();
            var string = id + '.' + current;
            var base = new Base64();
            var sig_ture = base.encode(string);
            var hash = CryptoJS.HmacSHA256(sig_ture, "mashiroc").toString();
            var json = {
                id: id,
                timestamp: current,
                signature: hash
            }
            return JSON.stringify(json);
        }

    }
}
interface.init();



//margin-lr
var historyer = {
    init() {
        this.margin();
    },
    margin() {
        
        var wrap = $.Single('.arrow-wrap');

        var list = $.Single('.recommend-area .rm-list');

        var i = 0;

        wrap.addEventListener('click', (e) => {

            if ( e.target.classList.contains('next') ) {

                i++;

                if ( i > 5 ) { i = 0 };

                list.style.marginLeft = '-' + i * 880 + 'px';

            }

            if ( e.target.classList.contains('prev') ) {

                i--

                if ( i < 0 ) { i = 5 }

                list.style.marginLeft = '-' + i * 880 + 'px';

            }

        }, true);

        var storage = new Storage();

        var data = storage.getLocal('data');

        for ( var j = 0 ; j < 3; j++ ) {

            if ( data !== null ) {

                showInfo(data);

            }

        }

        function showInfo(data) {
    
            var arr = data.movies.info;
    
            var fragment = document.createDocumentFragment();
    
            arr.forEach((p) => {
    
                var li = document.createElement('li');
    
                li.innerHTML = 
                `
                <div class="v">
                    <a href="" class="preview">
                        <img src="${p.photoUrl}">
                        <div class="mask-video"></div>
                    </a>
                    <i class="watch-later"></i>
                    <a href="">
                        <div class="t">${p.name}</div>
                    </a>
                </div>     
                `
    
                fragment.appendChild(li);
    
            })

            list.appendChild(fragment);

        }
    }
}
historyer.init();


//投硬币
var dropCoin = {
    init() {
        this.frontPart();
    },
    frontPart() {

        var drop = $.Single('.block.coin');

        var mask = $.Single('.wnd-mask');

        var coin_wrap = $.Single('.coin-wrap');

        var coin_sure = $.Single('.coin-sure');

        var checkboxs = $.All('.coin-checkbox');

        var img_22 = $.Single('.erer');

        var img_33 = $.Single('.sansan');

        var coin_num = $.Single('.coin-title i');

        checkboxs[0].addEventListener('click', () => {

            checkboxs[0].classList.add('on');

            checkboxs[0].querySelector('img').src = '../static/img/22.gif';

            checkboxs[1].classList.remove('on');

            checkboxs[1].querySelector('img').src = '../static/img/33-gray.png';

            coin_num.textContent = 1;

        })

        checkboxs[1].addEventListener('click', () => {

            checkboxs[1].classList.add('on');

            checkboxs[1].querySelector('img').src = '../static/img/33.gif';

            checkboxs[0].classList.remove('on');

            checkboxs[0].querySelector('img').src = '../static/img/22-gray.png';

            coin_num.textContent = 2;

        })

        drop.addEventListener('click', () => {

            if ( drop.querySelector('i').classList.contains('on') ) {

                return;

            }

            mask.style.display = 'block';

            coin_wrap.classList.add('fade-in');

        })

        coin_sure.addEventListener('click', () => {

            var num = coin_num.textContent;

            this.backPart(num);

            mask.style.display = 'none';

            coin_wrap.classList.remove('fade-in');

        })

    },
    backPart(coin) {

        var data = packageJSON();

        var storage = new Storage();

        var jwt = storage.getLocal('jwt');

        if ( jwt == null ) {
            
            window.location.href = '/login';

        }

        ajax({
            method: 'POST',
            url: '/gayligayliapi/sendCoin',
            data: data,
            jwt: jwt,
            success: function(data) {

                console.log(data)

                if ( data.result == 'success' ) {

                    var yellow = $.Single('.b-icon-anim-coin');

                    yellow.classList.add('on');
            
                    var tCoin = $.Single('.coin .t-right-top');
            
                    tCoin.textContent = '已投币';

                }

            }

        })

        function packageJSON() {
            var url = window.location.href;
            var arr = url.split('/');
            var id = arr[arr.length-1];
            var current = Math.round(new Date().getTime()/1000).toString();
            var string = id + '.' + coin + '.' + current;
            var base = new Base64();
            var sig_ture = base.encode(string);
            var hash = CryptoJS.HmacSHA256(sig_ture, "mashiroc").toString();
            var json = {
                videoId: id,
                sendCoin: coin,
                timestamp: current,
                signature: hash
            }
            return JSON.stringify(json);
        }

    }
}
dropCoin.init();



var addMarks = {
    init() {
        this.click();
    },
    click() {

        var btn = $.Single('.btn-add');

        var ipt = $.Single('.s_tag .ipt');

        var close = $.Single('.btn-close');

        var flag = false;

        btn.addEventListener('click', () => {
            btn.style.display = 'none';
            ipt.classList.add('on');
            flag = false;
        })

        close.addEventListener('click', () => {
            ipt.classList.remove('on');
            flag = true;
        })

        ipt.addEventListener('transitionend', () => {
            if ( flag ) {
                btn.style.display = 'block';
            }
        })

        ipt.addEventListener('keydown', (e) => {
            if ( e.keyCode == 13 ) {
                showMarks();
            }
        })

        function showMarks() {

            ipt.classList.remove('on');

            var input = ipt.querySelector('input');

            var value = input.value;

            flag = true;

            var li = `<li class="tag"><a>${value}</a></li>`;

            btn.insertAdjacentHTML('beforeBegin', li);

            input.value = '';

        }

    }
} 
addMarks.init();


//分页
pagination.init({
    PageBox: ".paging-box-big",
    Total: 50
})


//回到顶部
rocker.init({
    Rocket: '.go-top',
    Speed: 80,
    Hide: true,
    Height: 0
})

//登录检测
logined.init();