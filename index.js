"use strict";
//model机制  实体化类型机制
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitObject = void 0;
function useVal(val) {
    return { val };
}
//这里理论上应该不限制v的类型 因为v并非一定是初始数据 还可以是css选择器
//v可以由提取函数提取出来 如果是初始数据 提取得到初始对象
//如果是抓取选择器 提取得到爬虫model
//这里的实现为initval的情况 其他情况自己实现
//双重意义 泛型参数决定数据类型 提取得到的初始数据对象则意义自定
const useString = (v) => useVal(v);
const useNumber = (v) => useVal(v);
const useArr = (v) => useVal(v);
//集合
function useMulti(...args) {
    return args.map(v => useVal(v));
}
let t = {
    a: useMulti(1, "string", 23)
};
// let a={
//     a:useString("hello"),
//     b:{
//         t:useMulti(useMulti(useNumber(2222),"fasdfasd"),"asdfasd",123423),
//         d:[1] as [number]
//     }
// }
// type aa=UseType<typeof a>;
//直接取出val 如果是初始值 得到初始对象 如果是 爬虫模型 得到抓取模型对象
function getInitObject(obj) {
    let o = obj;
    if (typeof o == "object") {
        let ret = {};
        for (let i in o) {
            ret[i] = getInitObject(obj[i]);
        }
        return ret;
    }
    else if (o instanceof Array) {
        return o.map(v => getInitObject(v));
    }
    else {
        if ("val" in o)
            return o["val"];
        return o;
    }
}
exports.getInitObject = getInitObject;
