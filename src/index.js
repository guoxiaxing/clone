const type = require('./type');
// js 数据类型
// 基本数据类型：null, undefined, number, string, boolean, symbol
// 引用数据类型：object
// BUG: 对象层级很深或者存在循环引用的话就会有爆栈的问题
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
      target[i] = clone(source[i]);
    }
  }
  return target;
}

console.log(Array.from('abc'));

// NOTE：解决层级深带来的问题 - 递归改为循环

function cloneLoop(x) {
  const root = {};
  const loopList = [
    {
      // 待拷贝节点的父节点
      parent: root,
      // 待拷贝节点在父节点中的属性值 key
      key: undefined,
      // 待拷贝节点的值
      data: x,
    },
  ];
  while (loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标
    let res = parent;
    if (typeof key !== 'undefined') {
      res = parent[key] = {};
    }
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'object') {
          loopList.push({
            parent: res,
            key,
            data: data[key],
          });
        } else {
          res[key] = data[key];
        }
      }
    }
  }
  return root;
}

// NOTE：解决循环引用问题

function cloneForce(x) {
  // 用于去重
  const uniqueList = [];
  const root = {};
  const loopList = [
    {
      // 待拷贝节点的父节点
      parent: root,
      // 待拷贝节点在父节点中的属性值 key
      key: undefined,
      // 待拷贝节点的值
      data: x,
    },
  ];
  while (loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标
    let res = parent;
    if (typeof key !== 'undefined') {
      res = parent[key] = {};
    }
    // 数据已存在
    let uniqueData = find(uniqueList, data);
    if (uniqueData) {
      parent[key] = uniqueData.target;
      continue; // 中断本次循环
    }
    // 数据不存在
    // 将拷贝过的数据存下来
    uniqueList.push({
      source: data,
      target: res,
    });
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'object') {
          loopList.push({
            parent: res,
            key,
            data: data[key],
          });
        } else {
          res[key] = data[key];
        }
      }
    }
  }
  return root;
}

function find(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].source === item) {
      return arr[i];
    }
  }
  return null;
}

function isEqual(value, other) {
  if (value === other) return true;
  const vType = type(value);
  const oType = type(other);
  if (vType !== oType) return false;
  if (vType === 'array') {
    return equalArray(value, other);
  }
  if (vType === 'object') {
    return equalObject(value, other);
  }
  return value === other;
}

function equalArray(value, other) {
  if (value.length !== other.length) return false;
  for (let i = 0; i < value.length; i++) {
    if (!isEqual(value[i], other[i])) return false;
  }
  return true;
}

function equalObject(value, other) {
  const vKeys = Object.keys(value);
  const oKeys = Object.keys(other);
  if (vKeys.length !== oKeys.length) return false;
  for (let i = 0; i < vKeys.length; i++) {
    const v = value[vKeys[i]];
    const o = other[vKeys[i]];
    if (!isEqual(v, o)) return false;
  }
  return true;
}

function hasOwnProp(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function entends(defaultOpt, customOpt) {
  const cloneDefaultOpt = clone(defaultOpt);
  for (let key in customOpt) {
    const src = cloneDefaultOpt[key];
    const copy = customOpt[key];
    if (!hasOwnProp(customOpt, key)) continue;
    if (copy && type(copy) === 'object') {
      const clone = src && type(src) === 'object' ? src : {};
      cloneDefaultOpt[key] = entends(clone, copy);
    } else if (typeof copy !== 'undefined') {
      cloneDefaultOpt[key] = copy;
    }
  }
  return cloneDefaultOpt;
}

function parseKey(key) {
  return key.replace('[]', '');
}

function setany(obj, key, val) {
  const keys = key.split('.');
  const root = keys.slice(0, -1).reduce((parent, subkey) => {
    const realKey = parseKey(subkey);
    return (parent[realKey] = parent[realKey]
      ? parent[realKey]
      : subkey.includes('[]')
      ? []
      : {});
  }, obj);
  root[keys[keys.length - 1]] = val;
}

function getany(obj, key) {
  return key.split('.').reduce((prev, subkey) => {
    return prev == null ? prev : prev[parseKey[subkey]];
  }, obj);
}

module.exports = {
  clone,
  cloneLoop,
  cloneForce,
  isEqual,
  entends,
  setany,
  getany,
};
