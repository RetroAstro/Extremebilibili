

// 文件上传
var uploader = {
    init() {
        this.flag = true;
        this.number = 1;
        this.upload = ".first .webuploader-pick";
        this.input = ".first .element-invisible";
        this.dispatchEvent();
    },
    dispatchEvent() {

        var upload_btn = $.Single(this.upload);
        var file_input = $.Single(this.input);

        upload_btn.addEventListener('click', dispatchFilesBox);
        upload_btn.addEventListener('dragover', preventDefault);
        upload_btn.addEventListener('drop', dragCommit);
        file_input.addEventListener('change', clickCommit);

        var that = this;

        function preventDefault(e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        }

        function dragCommit(e) {
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files;
            that.fileReaderEvent(files);
        }

        function clickCommit(e) {
            var files = e.target.files;
            that.fileReaderEvent(files);
        }

        function dispatchFilesBox() {
            var evt = new MouseEvent('click', {
                bubbles: false,
                cancelable: true,
                view: window
            })
            file_input.dispatchEvent(evt);
        }
    },
    fileReaderEvent(files) {

        var type_warn = $.Single('.alert-wrp');

        type_warn.childNodes[3].addEventListener('click', () => {
            type_warn.style.display = 'none';
        })

        for ( var i = 0, f; f = files[i]; i++ ) {

            if ( !f.type.match('video.*') ) {
                type_warn.style.display = 'block';
                continue;
            }

            if ( this.flag ) {
                var first = $.Single('.main .first');
                var second = $.Single('.main .second');
                first.style.display = 'none';
                second.style.display = 'block';
                this.upload = ".second .webuploader-pick";
                this.input = ".second .element-invisible";
                this.dispatchEvent();
                this.flag = false;
            }

            this.f = f;

            var file_name = $.Single('.name-wrp .name');
            file_name.textContent = f.name;
            var number = $.Single('.order-num');
            number.textContent = this.number;
            this.number++;

            var size = f.size;
            var start = 0;
            var split_size = 1024 * 1024;

            var data = packageJSON(f.name, f.size);

            Permission(data, f);

            // ReadFile(f);
        }

        function packageJSON(name, size) {
            var current = Math.round(new Date().getTime()/1000).toString();
            var string = name + '.music.detail.' + size + '.' + current;
            var base = new Base64();
            var sig_ture = base.encode(string);
            var hash = CryptoJS.HmacSHA256(sig_ture, "mashiroc").toString();
            var json = {
                name: name,
                type: "music",
                description: "detail",
                length: size,
                timestamp: current,
                signature: hash
            }
            return JSON.stringify(json);
        }

        function Permission(data, f) {

            var storage = new Storage();

            var jwt = storage.getLocal('jwt');

            if ( jwt == null ) {
                
                window.location.href = '/login';

            }

            var arr = f.name.split('.');

            var type = arr[arr.length-1];

            ajax({
                method: 'POST',
                url: '/gayligayliapi/uploadToken',
                data: data,
                jwt: jwt,
                success: function(data) {
                    var key = 'video/' + data.avId + '.' + type;
                    Qiniu(f, data.upToken, key, data.avId);
                }
            })

        }

        var speedContent;

        var progressBar = $.Single('.progress-wrp .progress');

        function Qiniu(f, token, key, id) {
            
            var xhr = new XMLHttpRequest();

            xhr.open('POST', 'http://up.qiniu.com', true);

            var start;

            var formdata = new FormData();

            if ( key !== null && key !== undefined ) {
                formdata.append('key', key);
            }

            formdata.append('token', token);
            formdata.append('file', f);

            var taking;

            xhr.upload.addEventListener('progress', (evt) => {

                if ( evt.lengthComputable ) {

                    var present = new Date().getTime();
                    taking = present - start;
                    var x = ( evt.loaded ) / 1024;
                    var y = taking / 1000;
                    var uploadSpeed = x / y;
                    var formatSpeed;

                    if ( uploadSpeed > 1024 ) {
                        formatSpeed = ( uploadSpeed / 1024 ).toFixed(2) + 'MB / s';
                    } else {
                        formatSpeed = uploadSpeed.toFixed(2) + " kb / s";
                    }

                    var percentComplete = Math.round( evt.loaded * 100 / evt.total );
                    progressBar.style.width = percentComplete + '%';
                    speedContent = progressBar.parentNode.querySelector('span');
                    speedContent.textContent = '上传速度 ：' + formatSpeed;

                }
            });

            xhr.onreadystatechange = function(response) {

                if ( xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != '' ) {

                    var blkRet = JSON.parse(xhr.responseText);

                    console.log(blkRet);

                    if ( blkRet.hash ) {
                        uploadSuccess(id);
                    }
                }
            }
            
            start = new Date().getTime();

            xhr.send(formdata);
        }

        function uploadSuccess(id) {

            var data = packageJSON();

            var storage = new Storage();

            var jwt = storage.getLocal('jwt');

            ajax({
                method: 'POST',
                url: '/gayligayliapi/uploadSuccess',
                data: data,
                jwt: jwt,
                success: function(data) {
                    if ( data.result == 'success' ) {
                        speedContent.textContent = ' 上传成功 !';
                    }
                }
            })

            function packageJSON() {
                var avId = id;
                var current = Math.round(new Date().getTime()/1000).toString();
                var string = avId + '.' + current;
                var base = new Base64();
                var sig_ture = base.encode(string);
                var hash = CryptoJS.HmacSHA256(sig_ture, "mashiroc").toString();
                var json = {
                    avId: avId,
                    timestamp: current,
                    signature: hash
                }
                return JSON.stringify(json);
            }
        }

        /*--------------------------- FileReader ---------------------------- */

        var reader;

        function ReadFile(f) {
            reader = new FileReader();
            var blob = f.slice(start, start + split_size);
            reader.onload = onloadHandler;
            reader.onerror = errorHandler;
            reader.readAsBinaryString(blob);
        }

        function errorHandler(e) {
            switch(e.target.error.code) {
                case e.target.error.NOT_FOUND_ERR:
                     alert('File Not Found!');
                     break;
                case e.target.error.NOT_READABLE_ERR:
                     alert('File is not readable!');
                     break;
                case e.target.error.ABORT_ERR:
                     break;
                default:
                     alert('An error occurred reading this file.');
            }
        }
    
        function onloadHandler() {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/');
            xhr.overrideMimeType("application/octet-stream");
            xhr.onload = loadXHR;
            xhr.onerror = errorXHR;
            xhr.upload.onprogress = progressXHR;
            xhr.upload.onloadstart = loadstartXHR;
            xhr.sendAsBinary(reader.result);
        }

        var s_t;
        var s_loaded;

        function loadstartXHR() {
            s_t = new Date().getTime();
            s_loaded = 0;
        }

        function progressXHR(e) {
            var n_t = new Date().getTime();
            var per_time = ( n_t - s_t ) / 1000;
            s_t = new Date().getTime();

            var per_load = e.loaded - s_loaded;
            s_loaded = e.loaded;

            var speed = per_load / per_time;
            var b_speed = speed;
            var units = 'b/s';

            if ( speed / 1024 > 1 ) {
                speed = speed / 1024;
                units = 'k/s';
            }
            if ( speed / (1024^2) > 1 ) {
                speed = speed / (1024^2);
                units = 'MB/s';
            }
            speed = speed.toFixed(1);
            progressBar.textContent = speed + units;
        }

        var that = this;

        function loadXHR() {
            if ( start + split_size >= size ) {
                progressBar.textContent = '上传成功！';
                progressBar.style.width = '100%';
            }else {
                var loaded = Math.round( (start / size) * 100 );
                progressBar.style.width = loaded + "%";
                start += split_size;
                ReadFile(that.f);
            }
        }

        function errorXHR() {
            console.log('Something goes wrong!');
        }
    }
}
uploader.init();