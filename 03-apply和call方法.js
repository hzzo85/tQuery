// apply 和 call 方法的作用
// 专门用于修改方法内波的this
// 格式
// call(对象, 参数1, 参数2， 参数3...)
// apply(对象, [数组])
function test () {
    console.log(this);
}
var obj = {'name': 'ok'};
window.test.apply(obj);

function sum (a, b) {
    console.log(this)
    console.log(a + b)
}
window.sum.call(obj, 1, 2)
window.sum.apply(obj, [1, 2])

// 真数组转换伪数组的一个过程
var arr = [1, 3, 5, 7, 9];
var obj2 = {};

[].push.apply(obj2, arr); // {0:1, 1:3, 2:5, 3:7, 4:9} 并且拥有length属性
console.log('真数组转换伪数组的一个过程[].push.apply(obj2, arr)=', obj2);

// 伪数组转换真数组
var obj3 = {0: 'yt', 1: 'cool', length: 2};  // 必须要有length属性

// 如果slice方法什么参数都没有传递，会将数组中的元素放到一个新的数组中原样返回
var rel = [].slice.call(obj3);  // ["yt", "cool"]
console.log('伪数组转换真数组', rel);