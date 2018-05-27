/* privide method*/
function obj2str(obj) {
    // ie中会认为相同的url是一个结果，所以要在url后面加上hash值
    obj.t = new Date().getTime();
    var res = [];
    for (var key in obj) {
        // 防止低版本ie乱码，url中不允许出现中文
        res.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return res.join('&');
}

function post(url, obj, timeout, success, error) {
    // 0.将请求参数转换为字符串
    var str = obj2str(obj);
    // 1.创建异步对象
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft XMLHTTP'),
        timer;
    // 2.设置请求方式和请求地址
    /*
     * method: GET POST
     * url
     * async: true(异步) 或 false(同步)
     */
    xmlhttp.open('POST', url, true);
    // 注意⚠️： 以下代码必须要放在open和send之间
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    // 3.发送请求
    xmlhttp.send(str);
    // 4.监听状态变化
    xmlhttp.onreadystatechange = function (ev2) {
        /*
         * 0: 请求未初始化
         * 1: 服务器连接已建立
         * 2: 请求已接收
         * 3: 请求处理中
         * 4: 请求已完成，且相应已就绪
         */
        if (xmlhttp.readyState === 4) {
            clearInterval(timer);
            // 判断是否请求成功
            if (xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp.status === 304) {
                // 5.处理返回
                success(xmlhttp);
            } else {
                // 没有收到服务器返回结果
                error(xmlhttp);
            }
        }
    }
    // 判断外界是否传入了超时时间
    if (timeout) {
        timer = setInterval(function() {
            console.log('请求已超时');
            xmlhttp.abort(); 
            clearInterval(timer);
        }, timeout)
    }
}