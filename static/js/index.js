

$.All('main').forEach( a => { a.onclick = (e) => { e.preventDefault() } });


//Tab切换
var Switch = {
    handler(opts) {

        var that = this;

        var parents = $.All(opts.Parent);

        parents.forEach( (parent) => {

            var lis = parent.querySelectorAll(opts.Lis);

            model = opts.Model || 'click';

            parent.addEventListener( model, (e) => {

                for ( let i = 0; i < lis.length; i++ ) {

                    if ( e.target && e.target == lis[i] ) {

                        lis.forEach((li) => {
                            li.classList.remove('on');
                        })

                        lis[i].classList.add("on");

                        that.Differ(i,e);
                    }

                }

            },true)

        })

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



//对象委托
var switchSlider = Object.create(Switch);

switchSlider.Differ = function(i) {

    var Tabcon = $.Single(".tab-box .tab-con");

    Tabcon.style.marginLeft = '-' + (i * 260) + 'px';

}
switchSlider.handler({
    Lis: ".live-module .bili-tab .bili-tab-item",
    Parent: ".live-module .bili-tab"
})


var switchSeenter = Object.create(Switch);

switchSeenter.Differ = function(i,e) {

    if ( e.target.classList.contains('bili-tab-item') ) {

        var parent = e.target.parentNode.parentNode.parentNode;

        var Ranktab = parent.querySelector('.sec-rank .rank-list-wrap');

    } else {
        return;
    }
    
    Ranktab.style.marginLeft = '-' + i + '00%';
}
switchSeenter.handler({
    Lis: ".sec-rank .bili-tab-item",
    Parent: ".sec-rank .rank-tab",
    Model: "mouseenter"
})


var switchComics = Object.create(Switch);

var limit = true;

switchComics.Differ = function(i, e) {

    var type = e.target.parentNode.getAttribute('data-type');

    if ( type == null ) {

        return;

    }

    if ( ! limit ) {

        return;

    }

    limit = false;

    switch ( type ) {

        case 'music':
        interface.init(type)
        break;

        case 'dance':
        interface.init(type)
        break;

        case 'game':
        interface.init(type)
        break;

        case 'science':
        interface.init(type)
        break;

        case 'life':
        interface.init(type)
        break;

        case 'cartoon':
        interface.init(type);
        break;

        case 'fashion':
        interface.init(type);
        break;

        case 'advertisement':
        interface.init(type);
        break;

        case 'entertainment':
        interface.init(type);
        break;

        case 'autotuneRemix':
        interface.init(type);
        break;

    }

}
switchComics.handler({
    Lis: ".bili-tab .bili-tab-item",
    Parent: ".new-comers-module .bili-tab"
})


var switchBangumi = Object.create(Switch);

switchBangumi.Differ = function() {

    var arr = ['最新', '一', '二', '三', '四', '五', '六', '日'];

    var that = this;

    var tabs = $.All('.bangumi-timing-module .bili-tab');

    tabs.forEach( (tab) => {

        var children = tab.querySelectorAll('.bili-tab-item');

        tab.addEventListener('click', (e) => {

            for ( var i in children ) {
                children[i].innerText = arr[i];
            }

            if ( e.target && e.target.nodeName == 'DIV' && e.target.classList.contains('on') ) {

                if ( e.target !== children[0] ) {

                    var index = e.target.getAttribute('data-index');

                    e.target.textContent = '周' + arr[index];

                }

                var id = e.target.getAttribute('data-id');

                var parent = tab.parentNode.parentNode;

                that.load(id, parent);

            }

        })

    })

}

var fragment = document.createDocumentFragment();

switchBangumi.load = function(id, box) {

    var dataWrap = box.querySelector('.timing-box');

    dataWrap.innerHTML = '';

    var number = id;

    var storage = new Storage();

    var data = storage.getSession('data');

    if ( number == 0 ) {

        var empty = document.createElement('div');

        empty.classList.add('empty-status');

        empty.innerHTML = `<p>今天没有番剧更新</p>`;

        dataWrap.appendChild(empty);

        return;
    }

    var arr = data.anime.info;

    arr.forEach((p, i) => {

        if ( i < number ) {

            var div  = document.createElement('div');

            div.classList.add("card-timing-module", "clearfix", "card-timing");
    
            div.innerHTML =
            `
            <a href="" class="pic">
                <img src="${p.photoUrl}">
            </a>
            <div class="r-text">
                <a href="" class="t">${p.name}</a>
                <p class="update">
                    <span>
                    ${p.views}
                    </span>
                </p>
            </div>
            `

            fragment.appendChild(div);

        }

        dataWrap.appendChild(fragment);

    })

}

switchBangumi.handler({
    Lis: ".bili-tab .bili-tab-item",
    Parent: ".bangumi-timing-module .bili-tab"
})


//轮播 ES6 class 语法
class Carousel {
    constructor(opts) {
        this.picture = $.Single(opts.Picture);
        this.title= $.All(opts.Title);
        this.trig = $.All(opts.Trig);
        this.panel = $.Single(opts.Panel);
        this.bigtrig = $.Single(opts.Bigtrig);
        this.imgNum = opts.ImgNum;
        this.moveway = opts.Moveway;
        this.acitve = 0;
        this.setTime;
    }
    init() {
        this.selfMove();
        this.waytoMove();
        this.watcher();
    }
    selfMove() {

        var i = this.acitve;

        this.setTime = setInterval(() => {

            ( i < this.imgNum ) ? ( ++i ) : ( i = 0 );

            this.process(i);

        },5000);

    }
    waytoMove() {

        var 
        Bigtrig = this.bigtrig,
        trigs = this.trig;
        
        Bigtrig.addEventListener( this.moveway,(e) => {

            for ( let k = 0; k < trigs.length; k++ ) {

                if ( e.target && e.target == trigs[k] ) {

                    this.process(k);

                    clearInterval(this.setTime);

                    this.acitve = k;

                }

            }

        }, true);

    }
    watcher() {

        var panel = this.panel;

        panel.addEventListener('mouseenter', () => {

            clearInterval(this.setTime);

        });

        panel.addEventListener('mouseleave', () => {

            this.selfMove();

        });

    }
    process(x) {

        var i = x;

        this.picture.style.marginLeft = "-" + i + "00%";

        for ( var span of this.trig ) {
            span.className = "";
        }

        this.trig[i].className = "on";
        
        for ( var a of this.title ) {
            a.className = "";
        }

        this.title[i].className = "on";

    }
}

var chief = new Carousel({
    Picture: ".chief-recommend-module .panel .picture",
    Trig: ".chief-recommend-module .trig span",
    Title: ".chief-recommend-module .panel .title a",
    Panel: ".chief-recommend-module .panel",
    Bigtrig: ".chief-recommend-module .trig",
    Moveway: "click",
    ImgNum: 4
});
chief.init();

var slider = new Carousel({
    Picture: ".slider-box .panel .picture",
    Trig: ".slider-box .trig span",
    Title: ".slider-box .panel .title a",
    Panel: ".slider-box .panel",
    Bigtrig: ".slider-box .trig",
    Moveway: "mouseenter",
    ImgNum: 2
});
slider.init();

var slipper = new Carousel({
    Picture: ".bangumi-module .panel .picture",
    Trig: ".bangumi-module .trig span",
    Title: ".bangumi-module .panel .title a",
    Panel: ".bangumi-module .panel",
    Bigtrig: ".bangumi-module .trig",
    Moveway: "mouseenter",
    ImgNum: 1
});
slipper.init();


//视频信息相关功能
var InsideBox = {
    init(opts) {
        this.previewEvent(opts);
    },
    previewEvent(opts) {

        var boxes = $.All(opts.Box);

        boxes.forEach((box) => { getDirection(box) });

        function getDirection(wrap) {

            var pre;

            var hover = function(e) {

                var rect = wrap.getBoundingClientRect();
                var cur = e.clientX - rect.left;

                if ( !pre ) {

                    pre = cur;

                }

                var direction;

                if ( cur > pre ) {

                    pre = cur;

                    direction = 1;

                } else {

                    pre = cur;

                    direction = 0;

                }

                matrix(direction,e);

            }

            var less = throttle(hover,20,40,wrap);

            wrap.addEventListener('mousemove', less);

        }

        var x = 1, y = 1;

        function matrix(dir,e) {

            if ( dir ) {

                position(x,y,e);

                y++;

                if ( y == 11 ) {

                    y = 1;

                    x++;

                    x = x == 11 ? 1 : x;

                }

            } else {

                position(x,y,e);

                y--;

                if  ( y == 0 ) {

                    y = 10;

                    x--;

                    x = x == 0 ? 10 : x;

                }
            }

        }

        var that = this;

        function position(x,y,e) {

            var row = -160 * x;

            var col = -90 * y;

            var parent = e.target.parentNode;

            if ( ! parent.classList.contains('pic') ) {

                return;

            }

            that.danmuEvent(parent);

            var cover = parent.querySelector('.cover');

            var bar = parent.querySelector('.progress-bar span');

            bar.style.width = (y * 10) + '%';

            cover.style.cssText = 'background-position:' + row + 'px ' + col + 'px';

        }

    },
    danmuEvent(box) {

        var p_row = box.querySelectorAll('.danmu-module .dm');

        var i = 0;

        var timer;

        p_row[19].addEventListener('transitionend', loop);

        box.addEventListener('mouseenter', prepare);

        box.addEventListener('mouseleave', () => {

            clearInterval(timer);

        })

        function prepare() {

            clearInterval(timer);

            timer = setInterval(() => {

                p_row[i].style.cssText = 'left:-' + p_row[i].offsetWidth + 'px;' + 'transition:left 5s linear';

                i++;

                i = i == 20 ? clearInterval(timer) : i;

            }, 1500);

        }

        function loop() {

            p_row.forEach((p) =>{
                p.style.cssText = '';
            })

            setTimeout(() => {

                i = 0;

                prepare();

            }, 2000)

        }

    }
}
InsideBox.init({
    Box: ".popularize-module .pic"
})



// 右侧导航栏相关功能
var ElevatorModule = {
    init() {
        this.scrollEvent();
        this.frameAnimation();
    },
    //侧栏监听
    scrollEvent() {

        var chief = $.Single('.popularize-module');
        var elevator = $.Single('.elevator-module');
        var navList = $.Single('.nav-list');
        var items = $.All('.nav-list .item');

        window.addEventListener('scroll', topest); 
        window.addEventListener('scroll', slipper);
        navList.addEventListener('click', moveTo);

        //active效果
        function slipper() {

            for ( var item of items ) {

                var rect = item.getBoundingClientRect();
                var scrollTop = document.documentElement.scrollTop;
                var item_top = rect.top + scrollTop;
                var fetch = getLocation();
                var id = item.getAttribute('data-id');

                if ( item_top >= fetch[id] - 100 ) {

                    items.forEach((el) => {
                        el.classList.remove('active'); 
                    })

                    item.classList.add('active');

                }

            }

        }

        var flag = true;

        //定位到指定分区
        function moveTo() {

            var e = window.event;

            items.forEach((item) => {
                item.classList.remove('active');
            })

            if ( e.target && e.target.nodeName == 'DIV' ) {

                var id = e.target.getAttribute('data-id');

                e.target.classList.add('active');

                var fetch = getLocation();

                if ( flag ) {

                    AnimationFrame(fetch[id]);

                    id ? flag = false : flag = true;

                }

            }

        }
        //回到顶部
        function topest() {

            var pageHeight = pageY(chief);
            var scrollTop = document.documentElement.scrollTop;
            var elevatorHeight = elevator.offsetTop + scrollTop;

            if ( elevatorHeight >= pageHeight ) {

                elevator.classList.add('topest');

            }

            if ( scrollTop < 250 ) {

                elevator.classList.remove('topest');

                items.forEach( (item) => {
                    item.classList.remove('active');
                })

            }

        }
        //scrollTop过渡
        function AnimationFrame(future_top) {

            let current_top = document.documentElement.scrollTop;

            var timer = setInterval( () => {

                if ( current_top > future_top ) {

                    current_top -= 60;
                    document.documentElement.scrollTop = current_top;

                } else if ( current_top < future_top ) {

                    current_top += 60;
                    document.documentElement.scrollTop = current_top;

                }
                
                if ( current_top >= future_top - 30 && current_top <= future_top + 30 ) {

                    document.documentElement.scrollTop = future_top;
                    clearInterval(timer);
                    flag = true;

                }
            },10)
        }
        //获取pageY
        function getLocation() {

            var modules = $.All('.zone-wrap-module');

            var arr = [];

            modules.forEach((module) => {
                var thing = pageY(module);
                arr.push(thing);
            })

            return arr;

        }
        //获取元素顶部到页面最顶部的距离
        function pageY(el) {

            if ( el.offsetParent ) {

                return el.offsetTop + pageY(el.offsetParent);

            } else {

                return el.offsetTop;

            }

        }

    },
    //bili动画
    frameAnimation() {

        var icon = $.Single(".app-icon");

        icon.addEventListener('mouseenter', () => {

                icon.classList.add("step1");

                icon.classList.remove("mark");

        })

        icon.addEventListener('webkitAnimationEnd', () => {

                icon.classList.remove("step1");

                icon.classList.remove("step3");

                if ( !icon.classList.contains('mark') ) {

                    icon.classList.add("step2");

                }

        })

        icon.addEventListener('mouseleave', () => {

            icon.classList.remove("step2");

            icon.classList.add("step3");

            icon.classList.add("mark");

        })
        
    }
}
ElevatorModule.init();



var acess = true;

//获取主页信息
var interface = {
    init(type) {
        this.dispose(type);
    },
    dispose(type) {

        ajax({
            method: 'GET',
            url: 'http://www.mashiroc.cn/gayligayliapi/homePage',
            success: function(data) {

                console.log(data);

                if ( data == null ) {
                    return;
                }

                if ( acess ) {

                    var storage = new Storage();

                    storage.clearSession();

                    storage.setSession('data', data);

                    storage.removeLocal('data');

                    storage.setLocal('data', data);

                    acess = false;

                }

                type ? screen(data, type) : screen(data);

                limit = true;

            }
        })

        function screen(data, type) {

            if ( type !== undefined ) {

                var keys = Object.keys(data);

                keys.forEach((key) => {
    
                    if ( key == type ) {
    
                        Copy(data[key], {
                            tie: '.' + type + ' .tie',
                            pic: '.' + type + ' .pic img',
                            views: '.' + type + ' .play',
                            ritle1: '.' + type + ' .hot-list .ri-title',
                            ritle2: '.' + type + ' .origin-list .ri-title',
                            img: '.' + type + ' .ri-info-wrap img'
                        })
                        
                    }
    
                })

                return;
            }

            for ( let key in data ) {

                switch ( key ) {

                    case 'carousel' :
                    Carousel(data[key]);
                    break;

                    case 'typeNum' :
                    TypeNum(data[key]);
                    break;

                    case 'topInfo' :
                    TopInfo(data[key]);
                    break;

                    case 'spread' : 
                    Spread(data[key]);
                    break;
                
                    case 'cartoon' : 
                    Cartoon(data[key]);
                    break;

                    case 'anime' :
                    Anime(data[key]);
                    break;

                    case 'createdByNative' :
                    Native(data[key]);
                    break;

                    case 'movies' :
                    Movies(data[key]);
                    break;

                    case 'music' :

                    Copy(data[key], {
                        tie: '.music .tie',
                        pic: '.music .pic img',
                        views: '.music .play',
                        ritle1: '.music .hot-list .ri-title',
                        ritle2: '.music .origin-list .ri-title',
                        img: '.music .preview img'
                    })

                    break;

                    case 'dance' :

                    Copy(data[key], {
                        tie: '.dance .tie',
                        pic: '.dance .pic img',
                        views: '.dance .play',
                        ritle1: '.dance .hot-list .ri-title',
                        ritle2: '.dance .origin-list .ri-title',
                        img: '.dance .preview img'
                    })

                    break;

                    case 'game' :

                    Copy(data[key], {
                        tie: '.game .tie',
                        pic: '.game .pic img',
                        views: '.game .play',
                        ritle1: '.game .hot-list .ri-title',
                        ritle2: '.game .origin-list .ri-title',
                        img: '.game .preview img'
                    })

                    break;

                    case 'science' :

                    Copy(data[key], {
                        tie: '.science .tie',
                        pic: '.science .pic img',
                        views: '.science .play',
                        ritle1: '.science .hot-list .ri-title',
                        ritle2: '.science .origin-list .ri-title',
                        img: '.science .preview img'
                    })

                    break;

                    case 'life' :

                    Copy(data[key], {
                        tie: '.life .tie',
                        pic: '.life .pic img',
                        views: '.life .play',
                        ritle1: '.life .hot-list .ri-title',
                        ritle2: '.life .origin-list .ri-title',
                        img: '.life .preview img'
                    })

                    break;

                    case 'autotuneRemix' :

                    Copy(data[key], {
                        tie: '.guichu .tie',
                        pic: '.guichu .pic img',
                        views: '.guichu .play',
                        ritle1: '.guichu .hot-list .ri-title',
                        ritle2: '.guichu .origin-list .ri-title',
                        img: '.guichu .preview img'
                    })

                    break;


                    case 'fashion' :

                    Copy(data[key], {
                        tie: '.fashion .tie',
                        pic: '.fashion .pic img',
                        views: '.fashion .play',
                        ritle1: '.fashion .hot-list .ri-title',
                        ritle2: '.fashion .origin-list .ri-title',
                        img: '.fashion .preview img'
                    })

                    break;


                    case 'entertainment' :

                    Copy(data[key], {
                        tie: '.entertainment .tie',
                        pic: '.entertainment .pic img',
                        views: '.entertainment .play',
                        ritle1: '.entertainment .hot-list .ri-title',
                        ritle2: '.entertainment .origin-list .ri-title',
                        img: '.entertainment .preview img'
                    })

                    break;

                    case 'advertisement' :

                    Copy(data[key], {
                        tie: '.advertisement .tie',
                        pic: '.advertisement .pic img',
                        views: '.advertisement .play',
                        ritle1: '.advertisement .hot-list .ri-title',
                        ritle2: '.advertisement .origin-list .ri-title',
                        img: '.advertisement .preview img'
                    })

                    break;

                }

            }
        }

        function Carousel(value) {

            var photos = $.All('.chief-recommend-module .picture img');

            var titles = $.All('.chief-recommend-module .title a');

            var arr = value.filter( (p, i) => { if ( i < 5 ) return p } );

            arr.forEach((k, i) => {
                titles[i].textContent = k.name;
                photos[i].src = k.photoUrl;
                // photos[i].setAttribute('data-id', k.id);
            })

        }

        function TypeNum(obj) {

            var typeNums = $.All('.primary-menu .num-wrap span');

            var arr = Object.values(obj);

            arr.forEach((p, i) => {
                typeNums[i].textContent = p;
            })

        }

        function TopInfo(value) {

            var titles = $.All('.groom-module .title');

            var photos = $.All('.groom-module img');
            
            var views = $.All('.groom-module .play');


            value.forEach((p, i) => {
                titles[i].textContent = p.name;
                views[i].textContent = p.views;
                photos[i].src = p.photoUrl;
                // photos[i].setAttribute('data-id', p.id);
            })

        }

        function Spread(value) {

            var ties = $.All('.spread-module .tie');

            var pics = $.All('.popularize-module .pic img');

            value.forEach((p, i) => {
                ties[i].textContent = p.name;
                pics[i].src = p.photoUrl;
                // pics[i].setAttribute('data-id', p.id);
            })

        }

        function Cartoon(value) {

            var info = value.info;

            var rank = value.rank;

            var ties1 = $.All('.cartoon .tie');

            var views1 = $.All('.cartoon .play');

            var imgs1 = $.All('.cartoon img');

            var ties2 = $.All('.fanju .tie');

            var views2 = $.All('.fanju .play');

            var imgs2 = $.All('.fanju .lazy-img img');

            var ties3 = $.All('.guochuang .tie');

            var views3 = $.All('.guochuang .play');

            var imgs3 = $.All('.guochuang .lazy-img img');

            info.forEach((p, i) => {

                ties1[i].innerText = p.name;
                views1[i].innerHTML = `<i class='icon'></i>` + p.views;
                imgs1[i].src = p.photoUrl;
                imgs1[i].setAttribute('data-id', p.id);

                ties2[i].innerText = p.name;
                views2[i].innerHTML = `<i class='icon'></i>` + p.views;
                imgs2[i].src = p.photoUrl;
                imgs2[i].setAttribute('data-id', p.id);

                ties3[i].innerText = p.name;
                views3[i].innerHTML = `<i class='icon'></i>` + p.views;
                imgs3[i].src = p.photoUrl;
                imgs3[i].setAttribute('data-id', p.id);

            })

            var titles1 = $.All('.cartoon .hot-list .ri-title');

            var titles2 = $.All('.cartoon .origin-list .ri-title');

            rank.forEach((p, i) => {
                titles1[i].innerText = p.data.name;
                titles2[i].innerText = p.data.name;
            })

            var img = $.All('.cartoon .preview img');

            img.forEach((p) => {
                p.src = rank[0].data.photoUrl;
            })

        }

        function Anime(value) {

            var info = value.info;

            var rank = value.rank;

            var titles = $.All('.fanju .r-text .t');

            var pics = $.All('.fanju .pic img');

            info.forEach((p, i) => {
                titles[i].innerText = p.name;
                pics[i].src = p.photoUrl;
                // pics[i].setAttribute('data-id', p.id);
            })

            var rankties = $.All('.fanju .ri-title');

            rank.forEach((p, i) => {
                rankties[i].innerText = p.data.name;
            })

        }

        function Native(value) {

            var info = value.info;

            var rank = value.rank;

            var titles = $.All('.guochuang .r-text .t');

            var pics = $.All('.guochuang .pic img');

            info.forEach((p, i) => {
                titles[i].innerText = p.name;
                pics[i].src = p.photoUrl;
                // pics[i].setAttribute('data-id', p.id);
            })

            var rankties = $.All('.guochuang .ri-title');

            rank.forEach((p, i) => {
                rankties[i].innerText = p.data.name;
            })

        }

        function Movies(value) {

            var info = value.info;

            var rank = value.rank;

            var titles = $.All('.live .tie');

            var pics = $.All('.live .lazy-img img');

            info.forEach((p, i) => {
                titles[i].textContent = p.name;
                pics[i].src = p.photoUrl;
                pics[i].setAttribute('data-id', p.id);
            })

        }

        function Copy(value,opts) {

            var info = value.info;

            var rank = value.rank;

            var titles = $.All(opts.tie);

            var pics = $.All(opts.pic);

            var views = $.All(opts.views);

            info.forEach((p, i) => {
                titles[i].innerText = p.name;
                views[i].innerHTML = `<i class="icon"></i>` + p.views;
                pics[i].src = p.photoUrl;
                pics[i].setAttribute('data-id', p.id);
            })

            var titles1 = $.All(opts.ritle1);

            var titles2 = $.All(opts.ritle2);

            rank.forEach((p, i) => {
                titles1[i].innerText = p.data.name;
                titles2[i].innerText = p.data.name;
            })

            var rank_img = $.All(opts.img);

            rank_img.forEach((p) => {
                p.src = rank[0].data.photoUrl;
            }) 

        }
    }
}
interface.init();


//搜索
var search = {
    init() {
        this.surface();
    },
    surface() {

        var input = $.Single('.search-keyword');

        var btn = $.Single('.search-submit');

        var suggest_wrap = $.Single('.bili-suggest');

        input.addEventListener('keyup', () => {

            debounce(request, input);
            
        })

        btn.addEventListener('click', () => { Jump(input.value) });

        input.addEventListener('keydown', (e) => {

            if ( e.keyCode == 13 ) {

                e.preventDefault();

                Jump(input.value);

            }

        });

        suggest_wrap.addEventListener('click', (e) => {

            if ( e.target.classList.contains('suggest-item') ) {

                var words = e.target.textContent;

                Jump(words);

            }

        })

        function Jump(val) {

            var storage = new Storage();

            storage.setSession('keyword', val);

            window.location.href = '/search';

        }

        function debounce(func, context, args) {

            clearTimeout(func.setTime);

            func.setTime = setTimeout(() => {

            func.call(context, args); 

            }, 1000);

        }

        function packageJSON() {
            var value = htmlEncode(input.value);
            var current = Math.round(new Date().getTime()/1000).toString();
            var string = value + '.1.' + current;
            var base = new Base64();
            var sig_ture = base.encode(string);
            var hash = CryptoJS.HmacSHA256(sig_ture, "mashiroc").toString();
            var json = {
                data: value,
                page: 1,
                timestamp: current,
                signature: hash
            }
            return JSON.stringify(json);
        }

        function request() {

            if ( input.value == '' ) {

                suggest_wrap.style.display = 'none';

                return;

            }

            var data = packageJSON();

            ajax({
                method: 'POST',
                url: 'gayligayliapi/search',
                data: data,
                success: function(data) {

                    console.log(data);

                    if ( data.result == 'success' ) {
                        dispose(data);
                    } else {
                        suggest_wrap.style.display = 'none';
                    }

                }
            })
        }

        function htmlEncode(html) {

            var sub = document.createElement('div');

            sub.textContent !== null ? sub.textContent = html : sub.innerHTML = html;

            var output = sub.innerHTML;

            sub = null;

            return output;

        }

        function dispose(obj) {

            var arr = obj.data;

            var value = htmlEncode(input.value);
    
            var fragment = document.createDocumentFragment();
    
            arr.forEach((p, i) => {
    
                var li = document.createElement('li');

                li.classList.add('suggest-item');
    
                var em = `<em class="high-light">${value}</em>`;
    
                var name = p.name.replace( new RegExp(value), em );
    
                li.innerHTML = name;
    
                fragment.appendChild(li);
    
            })
    
            suggest_wrap.style.display = 'block';
    
            suggest_wrap.innerHTML = '';
    
            suggest_wrap.appendChild(fragment);

        }

    }
}
search.init();


function JumptoVideo() {

    var zones = $.All('.zone-wrap-module');

    zones.forEach((zone) => {

        zone.addEventListener('click', (e) => {

            if ( e.target.parentNode.classList.contains('pic') ) {

                var img = e.target.parentNode.querySelector('img');

                var id = img.getAttribute('data-id');

                e.preventDefault();

                if ( id !== null ) {

                    window.location.href = '/video/' + id;

                }

            }

        })

    })

}
JumptoVideo();


function lazyImg() {

    var chief = $.Single('.chief-recommend-module');

    var popular = $.Single('.popularize-module .l-con');

    var images1 = chief.querySelectorAll('img');

    var images2 = popular.querySelectorAll('img');

    images1.forEach((img) => {
        img.src = '';
    })

    images2.forEach((img) => {
        img.src = '';
    })
    
}
lazyImg();


//回到顶部
rocker.init({
    Rocket: '.elevator-module .back-top',
    Speed: 60
})

//登录检测
logined.init();