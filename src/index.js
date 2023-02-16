const type = require('./type');
// js 数据类型
// 基本数据类型：null, undefined, number, string, boolean, symbol
// 引用数据类型：object
function clone(source) {
    const t = type(source);
    if (t !== 'object' && t !== 'array') {
        return source;
    }
    let target;
    if (t === 'object') {
        target = {};
        // for...in...会遍历到对象及其原型上的可枚举属性
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = clone(source[key]);
            }
        }
    } else {
        target = [];
        for (let i = 0; i < source.length; i++) {
            target[i] = clone(source[i])
        }
    }
    return target;
}

console.log(Array.from('abc'));


module.exports = clone;