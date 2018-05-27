// 自己实现jQuery
(function (window, undefined) {
    var jQuery = function (selector) {
        return new jQuery.prototype.init(selector);
    }

    jQuery.prototype = {
        constructor: jQuery,
        init: function (selector) {
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
            if (!selector) {
                return this;
            }
            // 2.方法处理
            else if (jQuery.isFunction(selector)) {
                jQuery.ready(selector)
            }
            //  2.字符串
            // 代码片段：会将创建好的DOM元素储存到jQuery对象中返回
            // 选择器：会讲找到的所有元素存储到jQuery对象中返回
            else if (jQuery.isString(selector)) {
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
        toArray: function () {
            // 伪数组转换为真数组
            return [].slice.call(this);
        },
        // 如果不传递参数，相当于调用toArray
        get: function (num) {
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
                return this[this.length + num % this.length];
            }
        },
        eq: function (num) {
            // 没有传参
            if (arguments.length === 0) {
                return new jQuery();
            }
            // 传递不是负数
            else {
                return jQuery(this.get(num));
            }
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        each: function (fn) {
            return jQuery.each(this, fn);
        }
    };
    jQuery.extend = function (obj) {
        for (var key in obj) {
            this[key] = obj[key];
        }
    };
    // 方法并入jquery对象
    jQuery.extend = jQuery.prototype.extend = function (obj) {
        for (var key in obj) {
            this[key] = obj[key];
        }
    };
    // 工具方法
    jQuery.extend({
        isString: function (str) {
            return typeof str === 'string';
        },
        isHTML: function (str) {
            return str.charAt(0) == '<' &&
                str.charAt(str.length - 1) == '>' &&
                str.length > 2
        },
        trim: function (str) {
            if (!jQuery.isString(str)) {
                return str;
            }
            // 判断是否支持trim
            if (str.trim) {
                return str.trim();
            } else {
                return str.replace(/^\s+|\s+$/g, '');
            }
        },
        isObject: function (sele) {
            return typeof sele === 'object';
        },
        isWindow: function (sele) {
            return sele === window;
        },
        isArray: function (sele) {
            if (typeof sele === 'object' &&
                'length' in sele &&
                sele !== window) {
                return true;
            }
            return false;
        },
        isFunction: function (sele) {
            return typeof sele === 'function';
        },
        // 监听dom是否加载完毕
        ready: function (fn) {
            if (document.readyState == 'complete') {
                fn();
            } else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', function () {
                    fn();
                })
            } else {
                document.attachEvent('onreadystatechange', function () {
                    if (document.readyState == 'complete') {
                        fn();
                    }
                })
            }
        },
        each: function (obj, callback) {
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
        map: function (obj, callback) {
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
        getStyle: function (dom, styleName) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(dom)[styleName];
            } else {
                return dom.currentStyle[styleName];
            }
        },
        addEvent: function(dom, name, callback) {
            if (dom.addEventListener) {
                dom.addEventListener(name, callback);
            } else {
                dom.attachEvent('on' + name, callback);
            }
            
        },
    });
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
        remove: function (sele) {
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
                    $this.each(function (k, v) {
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
        html: function (content) {
            if (arguments.length === 0) {
                return this[0].innerHTML;
            } else {
                // this[0].innerHTML = content;
                this.each(function (key, value) {
                    value.innerHTML = content;
                })
                return this;
            }
        },
        text: function (content) {
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
        appendTo: function (sele) {
            // 接收一个字符串 $('div') ==> jQuery
            // 接收一个jQuery对象 $($('div') ==> jQuery
            // 接收一个DOM元素 $(divs) ==>j Query
            // 统一将传入的数据转化为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 遍历取出所有指定的元素
            $.each($target, function (key, value) {
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
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
        prependTo: function (sele) {
            // 统一将传入的数据转化为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 遍历取出所有指定的元素
            $.each($target, function (key, value) {
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
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
        append: function (sele) {
            // 判断传入的参数是否是字符串
            if (jQuery.isString(sele)) {
                var $this = this;
                $this.each(function (key, value) {
                    value.innerHTML += sele;
                })
            } else {
                $(sele).appendTo(this);
            }
            return this;
        },
        prepend: function (sele) {
            if (jQuery.isString(sele)) {
                var $this = this;
                $this.each(function (key, value) {
                    value.innerHTML = sele + value.innerHTML;
                })
            } else {
                $(sele).prependTo(this);
            }
            return this;
        },
        insertBefore: function (sele) {
            // 统一将传入的数据转化为jQuery对象
            var $target = $(sele);
            var $this = this;
            var res = [];
            // 遍历取出所有指定的元素
            $.each($target, function (key, value) {
                // 1.拿到指定元素的父元素
                var parent = value.parentNode;
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
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
        insertAfter: function (sele) {
            var $target = $(sele),
                $this = this,
                res = [];
            // 遍历目标元素
            $.each($target, function (key, value) {
                var parent = value.parentNode;
                $this.each(function (k, v) {
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
        before: function (sele) {
            if (jQuery.isString(sele)) {
                var $this = this;
                $this.each(function (key, value) {
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
        after: function (sele) {
            if (jQuery.isString(sele)) {
                var $this = this;
                $this.each(function (key, value) {
                    // value.outerHTML += sele;
                    value.insertAdjacentHTML('afterend', sele);
                })
            } else {
                $(sele).insertAfter(this);
            }
            return this;
        },
        replaceAll: function (sele) {
            // 统一将传入的数据转化为jQuery对象
            var $target = $(sele); // 替换的目标
            var $this = this; // 要添加的
            var res = [];
            // 遍历取出所有指定的元素
            $.each($target, function (key, value) {
                // 2.遍历取出所有的元素
                $this.each(function (k, v) {
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
        replaceWith: function (sele) {
            if (jQuery.isString(sele)) {
                var $target = this; // 要添加的
                // 遍历取出所有指定的元素
                $.each($target, function (key, value) {
                    $(value).before(sele);
                    $(value).remove();
                });
            } else {
                $(sele).replaceAll(this);
            }
            return this;
        },
        clone: function(deep) {
            var res = [];
            // 判断是否是深复制
            if (deep) {
                this.each(function(key, ele) {
                    var temp = ele.cloneNode(true); //注意，不能复制事件
                    // 遍历元素中的eventsCache
                    jQuery.each(ele.eventsCache, function(name, array) {
                        // 遍历事件对应的数组
                        jQuery.each(array, function(index, method) {
                            // 给复制的元素添加事件
                            $(temp).on(name, method);
                        })
                    })
                    res.push(temp);
                })
                return $(res);
            } else {
                this.each(function(key, ele) {
                    var temp = ele.cloneNode(true); //注意，不能复制事件
                    res.push(temp);
                })
                return $(res);
            }
        }
    });
    // 筛选相关方法
    jQuery.prototype.extend({
        next: function () {
            var $this = this,
                res = [];
            $this.each(function (key, value) {
                var $next = value.nextSibling;
                while ($next.nodeType !== 1) {
                    $next = $next.nextSibling;
                    res.push($next);
                }
            })
            return res;
        },
        prev: function () {
            var $this = this,
                res = [];
            $this.each(function (key, value) {
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
    });
    // 属性操作相关方法
    jQuery.prototype.extend({
        attr: function (attr, value) {
            // 1.判断是否是字符串
            if (jQuery.isString(attr)) {
                if (arguments.length === 1) {
                    return this[0].getAttribute(attr);
                } else {
                    this.each(function (key, ele) {
                        ele.setAttribute(attr, value);
                    })
                }
            }
            // 2.判断是逗是对象
            else if (jQuery.isObject(attr)) {
                var $this = this;
                // 遍历去除所有属性节点点名称和对应的值
                $.each(attr, function (key, value) {
                    // 遍历取出所有的元素
                    $this.each(function (k, ele) {
                        ele.setAttribute(key, value);
                    })
                })
            }
            return this;
        },
        prop: function (attr, value) {
            // 1.判断是否是字符串
            if (jQuery.isString(attr)) {
                if (arguments.length === 1) {
                    return this[0][attr];
                } else {
                    this.each(function (key, ele) {
                        ele[attr] = value;
                    })
                }
            }
            // 2.判断是逗是对象
            else if (jQuery.isObject(attr)) {
                var $this = this;
                // 遍历去除所有属性节点点名称和对应的值
                $.each(attr, function (key, value) {
                    // 遍历取出所有的元素
                    $this.each(function (k, ele) {
                        ele[attr] = value;
                    })
                })
            }
            return this;
        },
        css: function (attr, value) {
            // 1.判断是否是字符串
            if (jQuery.isString(attr)) {
                if (arguments.length === 1) {
                    return jQuery.getStyle(this[0], attr);
                } else {
                    this.each(function (key, ele) {
                        ele.style[attr] = value;
                    })
                }
            }
            // 2.判断是逗是对象
            else if (jQuery.isObject(attr)) {
                var $this = this;
                // 遍历去除所有属性节点点名称和对应的值
                $.each(attr, function (key, value) {
                    // 遍历取出所有的元素
                    $this.each(function (k, ele) {
                        ele.style[attr] = value;
                    })
                })
            }
            return this;
        },
        val: function (content) {
            if (arguments.length === 0) {
                // 使用的是DOM节点的value属性
                return this[0].value;
            } else {
                this.each(function (key, ele) {
                    ele.value = content;
                })
            }
        },
        hasClass: function (name) {
            var flag = false;
            if (arguments.length === 0) {
                return flag;
            } else {
                this.each(function (key, ele) {
                    // 1.获取元素中class保存的值
                    var className = ' ' + ele.className + ' ';
                    // 2.给查询的字符串前后也加上空格
                    name = ' ' + name + ' ';
                    // 3.通过indexOf判断
                    if (className.indexOf(name) != -1) {
                        flag = true;
                        return false;
                    }
                });
                return flag;
            }
        },
        addClass: function (name) {
            if (arguments.length === 0) {
                return this;
            }
            // 1.对传入的名字进行切割
            var names = name.split(' ');
            // 2.遍历取出所有的元素
            this.each(function (key, ele) {
                // 3.遍历数组取出每一个类名
                $.each(names, function (k, value) {
                    // 4.判断元素中是否包含指定的类名
                    if (!$(ele).hasClass(value)) {
                        ele.className += ' ' + value;
                    }
                })
            })
            return this;

        },
        removeClass: function (name) {
            if (arguments.length === 0) {
                this.each(function (key, ele) {
                    ele.className = '';
                })
            } else {
                // 1.对传入的名字进行切割
                var names = name.split(' ');
                // 2.遍历取出所有的元素
                this.each(function (key, ele) {
                    // 3.遍历数组取出每一个类名
                    $.each(names, function (k, value) {
                        // 4.判断元素中是否包含指定的类名
                        if ($(ele).hasClass(value)) {
                            ele.className = (' ' + ele.className + ' ').replace(value + ' ', '');
                        }
                    })
                })
            }

            return this;
        },
        toggleClass: function (name) {
            if (arguments.length === 0) {
                this.removeClass();
            }
            // 1.对传入的名字进行切割
            var names = name.split(' ');
            // 2.遍历取出所有的元素
            this.each(function (key, ele) {
                // 3.遍历数组取出每一个类名
                $.each(names, function (k, value) {
                    // 4.判断元素中是否包含指定的类名
                    if ($(ele).hasClass(value)) {
                        // 删除
                        $(ele).removeClass(value);
                    } else {
                        // 添加
                        $(ele).addClass(value);
                    }
                })
            })
            return this;
        },
    });
    // 事件操作方法
    jQuery.prototype.extend({
        on: function(name, callback) {
            // 1.遍历取出所有元素
            this.each(function(key, ele) {
                // 2.判断当前元素中是否有保存所有事件的对象
                if(!ele.eventsCache) {
                    ele.eventsCache = {};
                }
                // 3.判断对象中有没有对应类型的数组
                if (!ele.eventsCache[name]) {
                    ele.eventsCache[name] = [];
                    // 4.将回掉函数添加到数组中
                    ele.eventsCache[name].push(callback);
                    // 5.添加对应的类型事件
                    jQuery.addEvent(ele, name, function() {
                        jQuery.each(ele.eventsCache[name], function(k, method) {
                            method();
                        })
                    })
                } else {
                    // 4.将回掉函数添加到数组中
                    ele.eventsCache[name].push(callback);
                }
                // jQuery.addEvent(ele, name, callback)
            });
            return this;
        },
        off: function(name, callback) {
            // 1.是否传入参数
            if (arguments.length === 0) {
                this.each(function(key, ele) {
                    ele.eventsCache = {};
                })
            } 
            // 2.是否传入一个参数
            else if (arguments.length === 1) {
                this.each(function(key, value) {
                    ele.eventsCache[name] = [];
                })
            }
            // 3.判断是否传入两个参数
            else if (arguments.length === 2) {
                this.each(function(key, ele) {
                    jQuery.each(ele.eventsCache[name], function(index, method) {
                        // 判断当前遍历到的方法和传入放大是否相同
                        if (method === callback) {
                            ele.eventsCache[name].splice(index, 1);
                        }
                    })
                })
            }
        },
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