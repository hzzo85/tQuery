// 自己实现jQuery
(function (window, undefined) {
    var jQuery = function(selector) {
        return new jQuery.prototype.init(selector);
    }

    jQuery.prototype = {
        constructor: jQuery,
        init: function(selector) {
            /*
                1.传入 '' null undefined NaN 0 false 返回空的jQuery对象
                2.字符串
                代码片段：会将创建好的DOM元素储存到jQuery对象中返回
                选择器：会讲找到的所有元素存储到jQuery对象中返回
                3.数组
                会讲数组中的元素依次存储到jQuery对象中返回
                4.除上述类型以外
                会将传入的数据存储到jQuery对象中返回
            */
            // 0.去除字符串两端的空格
            selector = jQuery.trim(selector);
            // 1.传入 '' null undefined NaN 0 false 返回空的jQuery对象
            if(!selector) {
                return this; 
            } 
            // 2.方法处理
            else if (jQuery.isFunction(selector)) {
                jQuery.ready(selector)
            }
            //  2.字符串
            // 代码片段：会将创建好的DOM元素储存到jQuery对象中返回
            // 选择器：会讲找到的所有元素存储到jQuery对象中返回
            else if (jQuery.isString(selector)){
                // 2.1判断是否代码片段
                if (jQuery.isHTML(selector)) {
                    // 1.根据代码片段创建所有的元素
                    var temp = document.createElement('div');
                    temp.innerHTML = selector;
                    // // 2.将创建好的一级元素添加到jQuery当中
                    // temp.children
                    // for (var i = 0; i < temp.children.length; i++) {
                    //     this[i] = temp.children[i];
                    // }
                    // // 3.给jQuery对象添加length属性
                    // this.length = temp.children.length;
                    // 使用apply代替 2,3 两步
                    [].push.apply(this, temp.children);
                    // 4.返回加工好到this（jQuery)
                }
                // 2.2判断是否选择器
                else {
                    // 1.根据传入的选择器找到对应的元素
                    var res = document.querySelectorAll(selector);
                    // 2.将找到的元素添加到jquery上
                    [].push.apply(this, res);
                    // 3.返回加工好的this
                    return this;
                }
            }
            // 3.数组
            // else if (typeof selector === 'object'
            //          && 'length' in selector
            //          && selector !== window
            //         ) {
            else if (jQuery.isArray(selector)) {
                /*
                // 3.1真数组
                if (({}).toString.apply(selector) === '[object Array') {
                    [].push.apply(this, selector);
                    return this;
                }
                // 3.2伪数组
                else {
                    // 将自定义的伪数组转换为真数组
                    var arr = [].slice.call(selector);
                    // 将真数组转换为伪数组
                    [].push.apply(this, arr);
                    return this;
                }
                */
                var arr = [].slice.call(selector);
                    // 将真数组转换为伪数组
                [].push.apply(this, arr);
            } 
            // 4.除上述类型以外
            // 会将传入的数据存储到jQuery对象中返回
            else {
                this[0] = selector;
                this.length = 1;
            }
            return this;
        },
        jquery: '0.0.1',
        selector: '',
        length: 0,
        // [].push找到数组的push方法
        // 冒号前面的push将来又jquery对象先用
        // 相当于 [].push.aplly(this)
        push: [].push,
        sort: [].sort,
        splice: [].splice,
        toArray: function() {
            // 伪数组转换为真数组
            return [].slice.call(this);
        },
        // 如果不传递参数，相当于调用toArray
        get: function(num) {
            // 没有传参
            if (arguments.length === 0) {
                return this.toArray();
            } 
            // 传递不是负数
            else if (num >= 0) {
                return this[num];
            } 
            // 传递负数
            else {
                return this[this.length + num%this.length];
            }
        },
        eq: function(num) {
            // 没有传参
            if (arguments.length === 0) {
                return new jQuery();
            }
            // 传递不是负数
            else {
                return jQuery(this.get(num));
            } 
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        each: function(fn) {
            return jQuery.each(this, fn);
        }
    }
    jQuery.extend = function(obj) {
        for (var key in obj) {
            this[key] = obj[key];
        }
    }
    // 方法并入jquery对象
    jQuery.extend = jQuery.prototype.extend = function (obj) {
        for (var key in obj) {
            this[key] = obj[key];
        }
    }
    jQuery.extend({
        isString : function (str) {
            return typeof str === 'string';
        },
        isHTML : function (str) {
            return str.charAt(0) == '<' 
            && str.charAt(str.length - 1) == '>' 
            && str.length > 2
        },
        trim : function (str) {
            if(!jQuery.isString(str)) {
                return str;
            }
            // 判断是否支持trim
            if (str.trim) {
                return str.trim();
            } else {
                return str.replace(/^\s+|\s+$/g, '');
            }
        },
        isObject : function (sele) {
            return typeof sele === 'object';
        },
        isWindow : function (sele) {
            return sele === window;
        },
        isArray : function (sele) {
            if (typeof sele === 'object'
                && 'length' in sele
                && sele !== window) {
                    return true;
                }
                return false;
        },
        isFunction : function (sele) {
            return typeof sele === 'function';
        },
        // 监听dom是否加载完毕
        ready: function(fn) {
            if (document.readyState == 'complete') {
                fn();
            } else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', function () {
                    fn();
                })
            } else {
                document.attachEvent('onreadystatechange', function() {
                    if (document.readyState == 'complete') {
                        fn();
                    }
                })
            }
        },
        each: function(obj, callback) {
            // 判断是否数组
            if (jQuery.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    // 改变内部this指向
                    var res = callback.call(obj[i], i, obj[i], obj);
                    if (res === true) {
                        continue;
                    } else if (res === false) {
                        break;
                    }
                }
            } 
            // 判断是否对象
            else if (jQuery.isObject(obj)) {
                for (var key in obj) {
                    // 改变内部this指向
                    var res = callback.call(obj[key], key, obj[key], obj);
                    if (res === true) {
                        continue;
                    } else if (res === false) {
                        break;
                    }
                }
            }
            return obj;
        },
        map: function(obj, callback) {
            var res = [];
            // 判断是否数组
            if (jQuery.isArray(obj)) {
                for (var i = 0; i < obj.length; i++) {
                    var temp = callback(obj[i], i, obj)
                    if (temp) {
                        res.push(temp);
                    }
                }
            } 
            // 判断是否对象
            else if (jQuery.isObject(obj)) {
                for (var key in obj) {
                    var temp = callback(obj[key], key, obj)
                    if (temp) {
                        res.push(temp);
                    }
                }
            }
            return res;
        }
    })
    /*
    jQuery.isString = function (str) {
        return typeof str === 'string';
    }
    jQuery.isHTML = function (str) {
        return str.charAt(0) == '<' 
        && str.charAt(str.length - 1) == '>' 
        && str.length > 2
    }
    jQuery.trim = function (str) {
        if(!jQuery.isString(str)) {
            return str;
        }
        // 判断是否支持trim
        if (str.trim) {
            return str.trim();
        } else {
            return str.replace(/^\s+|\s+$/g, '');
        }
    }
    jQuery.isObject = function (sele) {
        return typeof sele === 'object';
    }
    jQuery.isWindow = function (sele) {
        return sele === window;
    }
    jQuery.isArray = function (sele) {
        if (typeof sele === 'object'
            && 'length' in sele
            && sele !== window) {
                return true;
            }
            return false;
    }
    jQuery.isFunction = function (sele) {
        return typeof sele === 'function';
    }
    */
    jQuery.prototype.init.prototype = jQuery.prototype;
    window.jQuery = window.$ = jQuery;
})(window);