


var login = {
    init() {
        this.surface();
    },
    surface() {

        var btn = $.Single('.btn-login');

        var phone = $.Single('.username input');

        var password = $.Single('.password input');

        var phe_warn = phone.parentNode.querySelector('.tips');

        var psw_warn = password.parentNode.querySelector('.tips');

        btn.addEventListener('click', process);

        phone.addEventListener('keyup', process);

        password.addEventListener('keyup', process);

        var that = this; 

        function process(e) {

            if ( e.type == 'keyup' ) {

                if ( e.target == phone ) {

                    phone.parentNode.classList.remove('error');

                    phe_warn.textContent = '';

                } else if ( e.target == password ) {

                    password.parentNode.classList.remove('error');

                    psw_warn.textContent = '';

                }

                return;

            }

            if ( ! test(phone.value) ) {

                phone.parentNode.classList.add('error');

                phe_warn.textContent = '请输入注册时用的手机号呀';

            } else {

                phone.parentNode.classList.remove('error');

                phe_warn.textContent = '';

            }

            if ( ! test(password.value) ) {

                password.parentNode.classList.add('error');

                psw_warn.textContent = '喵，你没输入密码么？';

            } else {

                password.parentNode.classList.remove('error');

                psw_warn.textContent = '';

            }

            if ( test(phone.value) && test(password.value) ) {

                that.underground(phone.value, password.value);

            }

        }

        function test(value) {

            var val = value;

            if ( val == '' ) {

                return false;

            } else {

                return true;

            }

        }

    },
    underground(phe, psw) {

        doLogin();

        function packageJSON() {
            var current = Math.round(new Date().getTime()/1000).toString();
            var phone = htmlEncode(phe);
            var password = htmlEncode(psw);
            var string = 'telephone.' + phone + '.' + password + '.' + current;
            var base = new Base64();
            var sig_ture = base.encode(string);
            var info_hash = CryptoJS.HmacSHA256(sig_ture, "mashiroc").toString();
            var info_json = {
                usernameType: 'telephone',
                username: phone,
                password: password,
                timestamp: current,
                signature: info_hash
            }
            return JSON.stringify(info_json);
        }

        var that = this ;

        function doLogin() {

            var data = packageJSON();

            fetcher('/gayligayliapi/login', {
                method: 'POST',
                dataType: 'text',
                body: data
            })
            .then( data => {

                var obj = JSON.parse(data);

                console.log(obj);

                if ( obj.result == 'success' ) {

                    var storage = new Storage();

                    storage.clearLocal();

                    storage.setLocal('jwt', obj.jwt);

                    window.location.href = '/';

                }

                if ( obj.result !== 'success' ) {

                    var phone = $.Single('.username input');

                    var password = $.Single('.password input');

                    var phe_warn = phone.parentNode.querySelector('.tips');

                    phone.parentNode.classList.add('error');

                    password.parentNode.classList.add('error');
    
                    phe_warn.textContent = '用户名或密码错误';

                }

            })
            .catch( err => {
                console.log(err);
            })

        }

        function htmlEncode(html) {

            var sub = document.createElement('div');

            sub.textContent !== null ? sub.textContent = html : sub.innerHTML = html;

            var output = sub.innerHTML;

            sub = null;

            return output;

        }
        
    }
}
login.init();
