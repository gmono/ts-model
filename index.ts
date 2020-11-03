//model机制  实体化类型机制

//指示应该以其中的类型为类型 并附带一个关联值
type TypeWithVal<V>={val:V};

//暂时废弃 目前是 遇到上面的类型就解包 否则不解包 
//如果遇到
//! 可能需要一个递归包装类型
//! 可能需要一个指示"深入解包下去"的类型
//此类型包装在上面的类型里面 当解包遇到一个这样的类型时 则继续解包 否则不解包
// type TypeDeepPacked<V>={val:V};
//纯粹的值函数 
function useVal<T>(val:T):TypeWithVal<T>
function useVal(val:any):TypeWithVal<any>{
    return {val};
}

//这里理论上应该不限制v的类型 因为v并非一定是初始数据 还可以是css选择器
//v可以由提取函数提取出来 如果是初始数据 提取得到初始对象
//如果是抓取选择器 提取得到爬虫model
//这里的实现为initval的情况 其他情况自己实现
//双重意义 泛型参数决定数据类型 提取得到的初始数据对象则意义自定
const useString=(v: string)=>useVal<string>(v);
const useNumber=(v: number)=>useVal<number>(v);
const useArr=<T>(v:T[])=>useVal<T[]>(v);
//集合
function useMulti<T extends any[]>(...args:T):{[idx in keyof T]:TypeWithVal<T[idx]>}{
    return args.map(v=>useVal(v)) as any;
}

let t={
    a:useMulti(1,"string",23)
}




export type UseType<T>=
T extends TypeWithVal<infer V>?UseType<V>:(
    //deep unpack
    //最后的T为递归出口
    T extends object?  {[idx in keyof T]:UseType<T[idx]>}:
    T extends [infer a,...infer rest]?{[idx in keyof T]:UseType<T[idx]>}:T
);

// let a={
//     a:useString("hello"),
//     b:{
//         t:useMulti(useMulti(useNumber(2222),"fasdfasd"),"asdfasd",123423),
//         d:[1] as [number]
//     }
// }
// type aa=UseType<typeof a>;

//直接取出val 如果是初始值 得到初始对象 如果是 爬虫模型 得到抓取模型对象
export function getInitObject<T>(obj:T):UseType<T>{
    let o=obj as any;
    if(typeof o=="object"){
        let ret={}
        for(let i in o){
            ret[i]=getInitObject(obj[i])
        }
        return ret as any;
    }else if(o instanceof Array){
        return o.map(v=>getInitObject(v)) as any;
    }else{
        if("val" in o) return o["val"];
        return o;
    }
}

