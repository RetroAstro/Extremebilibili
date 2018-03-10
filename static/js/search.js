

var hover = {
    init(opts) {
        this.Seenter(opts);
    },
    Seenter(opts) {

        var parent = $.Single(opts.Parent);
        var lis = $.All(opts.Lis);
        var bar = $.Single(opts.Bar);
    
        parent.addEventListener('mouseover', (e) => {

            for ( var i = 0, len = lis.length; i < len; i++ ) {

                if ( e.target == lis[i] ) {

                    bar.style.cssText = 'left:' + i * 102 + 'px;' + 'display:block;';

                }
                
            }
        })
    
        parent.addEventListener('mouseleave', (e) => {

            bar.style.cssText = 'left:0px;display:block;';

        })
    }
}
hover.init({
    Parent: '.nav-wrap .wrap',
    Lis: '.nav-wrap li',
    Bar: '.hover-bar'
})


function search() {

    var input = $.Single('.search-block input');

    var btn = $.Single('.search-button');

    var result_wrap = $.Single('.result-wrap');

    var no_data = $.Single('.recom-wrap');

    var suggest_wrap = $.Single('.suggest-wrap');

    var keyword_wrap = $.Single('.keyword-wrap');

    var ul = $.Single('.video-contain');

    var flag = true;

    var axios = true;

    input.addEventListener('keyup', () => {

        if ( flag ) {

            debounce(request, input, 1);

        }

        flag = true;

    })

    document.addEventListener('keydown', (e) => {

        if ( e.keyCode == 13 ) {

            request(2);

            flag = false;

            axios = true;

        }

    });

    btn.addEventListener('click', () => {
        
        request(2);

        axios = true;

    })

    keyword_wrap.addEventListener('click', (e) => {

        if ( e.target.classList.contains('vt-text') ) {

            var words = e.target.textContent;

            input.value = words;

            request(2);

        }

    })

    ul.addEventListener('click', (e) => {

        if ( e.target.nodeName == 'IMG' ) {
            
           var id = e.target.getAttribute('data-id');

           window.location.href = '/video/' + id;

        }

    })

    var storage = new Storage();

    var index_keyword = storage.getSession('keyword');

    if ( index_keyword !== '' ) {

        input.value = index_keyword;

        request(2);

        storage.clearSession();

    }

    var searchPage = Object.create(pagination);

    searchPage.reaction = function(page) {

        request(2, page);

    }

    function request(type, page) {

        var data = packageJSON(page);

        if ( data == 0 ) {

            suggest_wrap.style.display = 'none';

            return;

        }

        ajax({
            method: 'POST',
            url: '/gayligayliapi/search',
            data: data,
            success: function(data) {

                console.log(data);

                if ( data.result == 'success' && type == 1 ) {

                    showKeyword(data);

                }

                if ( data.result !== 'success' && type == 1 ) {

                    suggest_wrap.style.display = 'none';

                }

                if ( data.result == 'success' && type == 2 ) {

                    suggest_wrap.style.display = 'none';

                    no_data.style.display = 'none';
                        
                    result_wrap.style.display = 'block';

                    showInfo(data);

                    if ( axios ) {

                        searchPage.init({
                            PageBox: ".paging-box-big",
                            Total: data.page
                        })

                        axios = false;

                    }

                }

                if ( data.result !== 'success' && type == 2 ) {

                    no_data.style.display = 'block';
                        
                    result_wrap.style.display = 'none';

                }

            }

        })

    }

    function packageJSON(page) {

        var value = htmlEncode(input.value);

        if ( value == '' ) {

            return 0;

        }

        var page = page || 1;

        var current = Math.round(new Date().getTime()/1000).toString();
        var string = value + '.' + page + '.' + current;
        var base = new Base64();
        var sig_ture = base.encode(string);
        var hash = CryptoJS.HmacSHA256(sig_ture, "mashiroc").toString();
        var json = {
            data: value,
            page: page,
            timestamp: current,
            signature: hash
        }
        return JSON.stringify(json);
    }

    function showKeyword(obj) {

        var arr = obj.data;

        var value = htmlEncode(input.value);

        var fragment = document.createDocumentFragment();

        arr.forEach((p, i) => {

            var li = document.createElement('li');

            var em = `<em class="high-light">${value}</em>`;

            var name = p.name.replace( new RegExp(value), em );

            li.innerHTML = `<a class="vt-text keyword">${name}</a>`;

            fragment.appendChild(li);

        })

        suggest_wrap.style.display = 'block';

        keyword_wrap.innerHTML = '';

        keyword_wrap.appendChild(fragment);

    }
    
    function showInfo(obj) {

        ul.innerHTML = '';

        var fragment = document.createDocumentFragment();

        var arr = obj.data;

        arr.forEach((p) => {

            var li = document.createElement('li');

            li.classList.add('video', 'matrix');

            var time = formatUNIX(p.time);

            var value = htmlEncode(input.value);

            var em = `<em class="high-light">${value}</em>`;

            var name = p.name.replace( new RegExp(value), em );

            li.innerHTML = 
            `
            <a>
                <div class="img">
                    <div class="lazy-img">
                        <img src="${p.photoUrl}" data-id="${p.id}">
                    </div>
                    <span class="current">04:24</span>
                    <div class="watch-later"></div>
                </div>
                <div class="info">
                    <div class="headline clearfix">
                        <a class="title">${name}</a>
                    </div>
                    <div class="tags">
                        <span class="so-icon watch-num">
                            <i class="icon-playtime"></i>
                            ${p.views}
                        </span>
                        <span class="so-icon time">
                            <i class="icon-date"></i>
                            ${time}
                        </span>
                        <span class="so-icon up">
                            <i class="icon-uper"></i>
                            <a class="up-name">浅橙月</a>
                        </span>
                    </div>
                </div>
            </a>
            `

            fragment.appendChild(li);

        })

        ul.appendChild(fragment);

    }

    function JumptoVideo() {

    }

    function debounce(func, context, args) {

        clearTimeout(func.setTime);

        func.setTime = setTimeout(() => {

           func.call(context, args); 

        }, 1000);

     }

    function htmlEncode(html) {

        var sub = document.createElement('div');

        sub.textContent !== null ? sub.textContent = html : sub.innerHTML = html;

        var output = sub.innerHTML;

        sub = null;

        return output;
        
    }

}
search();


//回到顶部
rocker.init({
    Rocket: '.rocket-con',
    Speed: 50,
    Hide: true,
    Height: 300
})