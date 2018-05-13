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
        },
    })
    // DOM操作相关
    jQuery.prototype.extend({
        empty: function () {
            // 1.遍历所有找到的元素
            this.each(function (key, value) {
                value.innerHTML = '';
            })
            // 2.方便链式编程
            return this;
        },
        remove: function(sele) {
            if (arguments.length === 0) {
                // 1.遍历制定的元素
                this.each(function (key, value) {
                    // 根据遍历到的元素找到对应的父元素
                    var parent = value.parentNode;
                    // 通过父元素删除指定的元素
                    parent.removeChild(value);
                })
            } else {
                var $this = this;
                // 1.根据传入的选择器找到对应的元素
                $(sele).each(function (key, value) {
                    // 2.遍历找到的元素，并获得对应的类型
                    var type = value.tagName;
                    // 3.遍历指定的元素
                    $this.each(function(k, v) {
                        // 4.获取指定元素的类型
                        var t = v.tagName;
                        if (t === type) {
                            // 5.判断找到的元素类型和指定元素的类型
                            // 根据遍历到的元素找到对应的父元素
                            var parent = value.parentNode;
                            // 通过父元素删除指定的元素
                            parent.removeChild(value);
                        }
                    })

                })
            }
            return this;
        },
        html: function(content) {
            if (arguments.length === 0) {
                return this[0].innerHTML;
            } else {
                // this[0].innerHTML = content;
                this.each(function(key, value) {
                    value.innerHTML = content;
                })
                return this;
            }
        },
        text: function(content) {
            if (arguments.length === 0) {
                var res = '';
                this.each(function (key, value) {
                    res += value.innerText;
                })
                return res;
            } else {
                this.each(function (key, value) {
                    value.innerText = content;
                })
                return this;
            }
        },   
        appendTo: function(sele) {
            // 接收一个字符串 $('div') ==> jQuery
            // 接收一个jQuery对象 $($('div') ==> jQuery
            // 接收一个DOM元素 $(divs) ==>j Query
            // 统一将传入的数据转化为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 遍历取出所有指定的元素
            $.each($target, function(key, value) {
                // 2.遍历取出所有的元素
                $this.each(function(k, v) {
                    // 3.判断当前时候是第0个指定的元素
                    if (key === 0) {
                        // 直接添加
                        value.appendChild(v);
                        res.push(v);
                    } else {
                        //拷贝元素插入
                        var temp = v.cloneNode(true);
                        value.appendChild(temp);
                        res.push(temp);
                    }
                })
            });
            return $(res);
            // 遍历取出所有指定的元素
            // for (var i = 0; i < $target.length; i++) {
            //     var targetEle = $target[i];
            //     // 2.遍历取出所有的元素
            //     for (var j = 0; j < $this.length; j++) {
            //         var sourceEle = $this[j];
            //         // 3.判断当前时候是第0个指定的元素
            //         if (i === 0) {
            //             targetEle.appendChild(sourceEle);
            //         } else {
            //             //拷贝元素插入
            //             var temp = sourceEle.cloneNode(true);
            //             targetEle.appendChild(temp);
            //         }
            //     }
                
            // }
        },
        prependTo: function(sele) {
            // 统一将传入的数据转化为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 遍历取出所有指定的元素
            $.each($target, function(key, value) {
                // 2.遍历取出所有的元素
                $this.each(function(k, v) {
                    // 3.判断当前时候是第0个指定的元素
                    if (key === 0) {
                        // 直接添加
                        value.insertBefore(v, value.firstChild);
                        res.push(v);
                    } else {
                        //拷贝元素插入
                        var temp = v.cloneNode(true);
                        value.insertBefore(temp, value.firstChild);
                        res.push(temp);
                    }
                })
            });
            return $(res);
        },
        append: function(sele) {
            // 判断传入的参数是否是字符串
            if (jQuery.isString(sele)) {
                var $this = this;
                $this.each(function(key, value) {
                    value.innerHTML += sele;
                })
            } else {
                $(sele).appendTo(this);
            }
            return this;
        },
        prepend: function(sele) {
            if (jQuery.isString(sele)) {
                var $this = this;
                $this.each(function(key, value) {
                    value.innerHTML = sele + value.innerHTML;
                })
            } else {
                $(sele).prependTo(this);
            }
            return this;
        },
        insertBefore: function(sele) {
            // 统一将传入的数据转化为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 遍历取出所有指定的元素
            $.each($target, function(key, value) {
                // 1.拿到指定元素的父元素
                var parent = value.parentNode;
                // 2.遍历取出所有的元素
                $this.each(function(k, v) {
                    // 3.判断当前时候是第0个指定的元素
                    if (key === 0) {
                        // 直接添加
                        parent.insertBefore(v, value);
                        res.push(v);
                    } else {
                        //拷贝元素插入
                        var temp = v.cloneNode(true);
                        parent.insertBefore(temp, value);
                        res.push(temp);
                    }
                })
            });
            return $(res);
        },
        insertAfter: function(sele) {
            var $target = $(sele),
                $this = this,
                res = [];
            // 遍历目标元素
            $.each($target, function(key, value) {
                var parent = value.parentNode;
                $this.each(function(k, v) {
                    if (key === 0) {
                        parent.insertBefore(v, value.nextSibling);
                        res.push(v);
                    } else {
                        //拷贝元素插入
                        var temp = v.cloneNode(true);
                        parent.insertBefore(temp, value.nextSibling);
                        res.push(temp);
                    }
                })
            });
            return $(res);
        },
        before: function(sele) {
            if (jQuery.isString(sele)) {
                var $this = this;
                $this.each(function(key, value) {
                    // value.outerHTML = sele + value.outerHTML;
                    value.insertAdjacentHTML('beforebegin', sele);
                    // 接受四个参数
                    // beforebegin 作为前一个同辈元素
                    // afterbegin 作为第一个子元素
                    // beforeend 作为最后一个子元素
                    // afterend 作为后一个同辈元素
                })
            } else {
                $(sele).insertBefore(this);
            }
            return this;
        },
        after: function(sele) {
            if (jQuery.isString(sele)) {
                var $this = this;
                $this.each(function(key, value) {
                    // value.outerHTML += sele;
                    value.insertAdjacentHTML('afterend', sele);
                })
            } else {
                $(sele).insertAfter(this);
            }
            return this;
        },
        next: function() {
            var $this = this,
                res = [];
            $this.each(function(key, value) {
                var $next = value.nextSibling;
                while ($next.nodeType !== 1) {
                    $next = $next.nextSibling;
                    res.push($next);
                }
            })
            return res;
        },
        prev: function() {
            var $this = this,
                res = [];
            $this.each(function(key, value) {
                var $prev = value.previousSibling;
                while ($prev.nodeType !== 1) {
                    $prev = $prev.previousSibling;
                    if (!$prev) {
                        break
                    }
                    res.push($prev)
                }
            })
            return res;
        },
        replaceAll: function(sele) {
            // 统一将传入的数据转化为jQuery对象
            var $target = $(sele);  // 替换的目标
            var $this = this;  // 要添加的
            var res = [];
            // 遍历取出所有指定的元素
            $.each($target, function(key, value) {
                // 2.遍历取出所有的元素
                $this.each(function(k, v) {
                    // 3.判断当前时候是第0个指定的元素
                    if (key === 0) {
                        // 1.将元素插入到指定元素的前面
                        $(v).insertBefore(value);
                    } else {
                        //拷贝元素插入
                        var temp = v.cloneNode(true);
                        // 1.将元素插入到指定元素的前面
                        $(temp).insertBefore(value);
                    }
                    res.push(v);
                })
                $(value).remove();
            });
            // 2.删除指定元素
            return $(res);
        },
        replaceWith: function(sele) {
            if (jQuery.isString(sele)) {
                var $target = this;  // 要添加的
                // 遍历取出所有指定的元素
                $.each($target, function(key, value) {
                    $(value).before(sele);
                    $(value).remove();
                });
            } else {
                $(sele).replaceAll(this);
            }
           return this;
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