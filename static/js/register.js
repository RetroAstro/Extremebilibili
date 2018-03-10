

//注册相关逻辑
var factory = {
    init(opts) {
        this.entry(opts);
        this.verification;
    },
    entry(opts) {

        var user_input = $.Single(opts.UserInput);
        var psw_input = $.Single(opts.PswInput);
        var phone_input = $.Single(opts.PhoneInput);
        var code_btn = $.Single(opts.CodeBtn);
        var agree_box = $.Single(opts.Agree);
        var register_btn = $.Single(opts.Register);

        var that = this;

        user_input.addEventListener('keyup', processUser);
        psw_input.addEventListener('keyup', processPsw);
        code_btn.addEventListener('click', processPhone);

        agree_box.addEventListener('click', () => {
            register_btn.classList.toggle('disabled');
        })

        register_btn.addEventListener('click', () => {
            processUser();
            processPsw();
            processPhone();
            processAll();
        });

        function processAll() {

            var star = 0;
            var error_btns = $.All('.yzm_x');
            var ver_code = $.Single('#yzm').value;

            error_btns.forEach( (btn) => {
                if ( btn.textContent == '' ) {
                    star++
                }
            })

            if ( ver_code == '' ) {
                error_btns[3].textContent = '验证码错误';
            }

            if ( star == 4 && that.permit ) {
                doRegister();
            } else {
                console.log('err');
            }
        }

        function packageJSON() {
            var current = Math.round(new Date().getTime()/1000).toString();
            var username = htmlEncode(phone_input.value);
            var nickname = htmlEncode(user_input.value);
            var password = htmlEncode(psw_input.value);
            var string = 'telephone.' + username + '.' + password + '.' + nickname + '.' + current;
            var base = new Base64();
            var sig_ture = base.encode(string);
            var info_hash = CryptoJS.HmacSHA256(sig_ture, "mashiroc").toString();
            var info_json = {
                usernameType: 'telephone',
                username: username,
                password: password,
                nickname: nickname,
                timestamp: current,
                signature: info_hash
            }
            return JSON.stringify(info_json);
        }
    
        function doRegister() {

            var data = packageJSON();

            fetcher('/gayligayliapi/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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

            })
            .catch( err => {
                console.log(err);
            })
        }

        function processUser() {
            var user_name = user_input.value;
            var user = htmlEncode(user_name);
            that.userEvent(user);
        }

        function processPsw() {
            var pass_word = psw_input.value;
            var psw = htmlEncode(pass_word);
            that.pswEvent(psw);
        }

        function processPhone() {
            var user_phone = phone_input.value;
            var phe = htmlEncode(user_phone);
            that.phoneEvent(phe);
        }

        function htmlEncode(html) {
            var sub = document.createElement('div');
            sub.textContent !== null ? sub.textContent = html : sub.innerHTML = html;
            var output = sub.innerHTML;
            sub = null;
            return output;
        }

    },
    userEvent(user) {

        var error_p = $.Single('.user-warn');
        var message = getMessage();
        error_p.textContent = message;

        function getType() {

            var type;

            var str = user;

            if ( str.length < 3 ) {
                type = 1
            }

            if ( str.length >= 3 && str.length <= 16 ) {

                /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str) ? type = 4 : type = 2;

                /[`~!@#$%^&*()_+<>?:"{},.。 \/;'[\]]/.test(str) ? type = 2 : type = 4; 
                               
            }

            if ( str.length > 16 ) {
                type = 3
            }

            return type;

        }

        function getMessage() {

            var mes = getType();

            switch ( mes ) {
                case 1:
                return '你的用户名过短，不允许注册'
                case 2: 
                return '昵称含有非法字符'
                case 3:
                return '你的用户名或用户笔名过长，不允许注册!'
                default:
                return ''
            }

        }

    },
    pswEvent(psw) {

        var str = psw;
        var error_p = $.Single('.psw-warn');
        error_p.textContent = getMessage();
        var length = getIntensity();
        var safe_lines = $.All('.safe_line');
        var tip = $.Single('.a_pw span');

        if ( length < 2 ) {
            tip.style.color = '#bc0001';
            tip.textContent = '弱';
        } else if ( length >=2 && length <= 4 ) {
            tip.style.color = '#ff9537';
            tip.textContent = '中';
        } else {
            tip.style.color = '#49c519';
            tip.textContent = '安全';
        }

        safe_lines.forEach((line) => {
            line.classList.remove('active');
        })

        for ( var i = 0; i < length; i++ ) {
            safe_lines[i].classList.add('active');
        }

        function getIntensity() {

            var line = 0;

            var level = checkPsw();

            switch ( level ) {
                case 0:
                line = 1
                break;
                case 1:
                line = 2
                break;
                case 2:
                if ( /[a-zA-Z]/.test(str) && /[0-9]/.test(str) ) {
                    line = 3
                }else {
                    line = 4
                }
                break;
                case 3:
                line = 5
                break;
            }
            return line;
        }

        function checkPsw() {

            var Lv = 0;

            if ( str.length < 6 ) {
                return Lv;
            }

            if ( /[0-9]/.test(str) ) {
                Lv++
            }

            if ( /[a-zA-Z]/.test(str) ) {
                Lv++
            }

            if ( /[\W]|_/.test(str) ) {
                Lv++
            }

            return Lv;

        }

        function getMessage() {

            if ( str.length < 6 ) {
                return '密码不能小于6个字符'
            }

            if ( str.length > 16 ) {
                return '密码不能大于16个字符'
            }

            return ''

        }

    },
    phoneEvent(phe) {

        var error_p = $.Single('.phone-warn');
        var ver_p = $.Single('.ver-warn');
        var ver_code = $.Single('#yzm').value;

        if ( /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(phe) ) {

            error_p.textContent = '';
            var code_btn = $.Single('.yzm_bottom');
            var seconds = 59;
            var e = window.event;

            if ( e.target == code_btn ) {

                ver_p.textContent = '';
                oneMinute(code_btn);
                doVerification(phe);

            }

            if ( ver_code && this.verification ) {

                var ver_hash = CryptoJS.HmacSHA256(ver_code, "mashiroc").toString();

                ver_p.textContent = 
                ver_hash == this.verification 
                ? '' 
                : '验证码错误'
                this.permit = true;
            }

        } else {
            error_p.textContent = '亲，看起来不像手机号呢';
        }

        function oneMinute(ele) {

            if ( seconds == 0 ) {
                ele.classList.remove('disabled');
                ele.textContent = '重新获取验证码';

            } else {

                ele.classList.add('disabled');
                ele.textContent = seconds + '秒后重新获取';
                seconds--;
                setTimeout( () => { oneMinute(ele) }, 1000);

            }

        }

        function packageJSON(phe) {
            var current = Math.round(new Date().getTime()/1000).toString();
            var string = phe + '.' + current;
            var base = new Base64();
            var sig_ture = base.encode(string);
            var phe_hash = CryptoJS.HmacSHA256(sig_ture, "mashiroc").toString();
            var phe_json = {
                telephone: phe,
                timestamp: current,
                signature: phe_hash
            }
            return JSON.stringify(phe_json);
        }

        var that = this;

        function doVerification(phe) {

            var data = packageJSON(phe);

            fetcher('/gayligayliapi/verificationCode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                dataType: 'text',
                body: data
            })
            .then( data => {

                console.log(data);

                var obj = JSON.parse(data);

                that.verification = obj.verification;
                
            })
            .catch( err => {
                console.log(err);
            })
        }
    }
}
factory.init({
    UserInput: ".user-input",
    PswInput: ".psw-input",
    PhoneInput: "#new_phone",
    CodeBtn: ".yzm_bottom",
    Register: ".next_step",
    Agree: "#agree"
})