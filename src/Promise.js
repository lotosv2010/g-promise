// 宏
const PENDING = 'PENDING'     // 等待状态
const FULFILLED = 'FULFILLED' // 成功状态
const REJECTED = 'REJECTED'   // 失败状态

const isPromise = value => {
  if(typeof (value === 'object' && value!== null) || typeof value === 'function') {
    return typeof value.then === 'function';
  }
  return false;
}

const resolvePromise = (promise2, x, resolve, reject) => {
  // 判断可能你的 promise 要和别人的 promise 来混用
  // 可能不同的promise库之间要相互调用

  // 为了考虑别人的 promise 不健壮所以我们需要自己取判断一下，
  // 如果调用失败不能再调成功，如果调用成功不能再调失败
  // 不能多次调用成功或失败
  let called;

  // 1.x 如果和 promise 使用一个对象，x永远不能成功或失败，所以就死循环了，我们要直接抛出一个错误
  if(promise2 == x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }

  // todo 判断 x 的状态
  // 2.判断 x 是不是promise
  if((typeof x === 'object' && x!== null) || typeof x === 'function') {
    // x 是一个对象或这函数
    try {
      let then = x.then; // 取出 then 方法，这个 then 方法采用 defineProperty 定义的
      if(typeof then === 'function') {
        // 判断 then 是不是一个函数，如果 then 不是一个函数，说明 x 不是 promise
        // todo：注意：x.then(() => {}, () => {}) 这样调用会再次取 then
        then.call(x, y => { // 如果 x 是一个 promise 就采用这个 promise 的返回结果
          if(called) return;
          called = true;
          // 如果 y 是一个 promise 继续解析成功的值
          resolvePromise(promise2, y, resolve, reject);
        }, r => {
          if(called) return;
          called = true;
          reject(r);
        })
      } else {
        // x 是一个对象，例如：x = {then:123}
        resolve(x);
      }
    } catch (e) {
      if(called) return;
      called = true;
      reject(e); // 去 then 失败了，直接触发 promise2 的失败逻辑
    }
  } else {
    // x 肯定不是 promise
    resolve(x);
  }
}

class Promise {
  status = PENDING; // promise 状态
  value = undefined; // 成功的数据
  reason = undefined; // 失败的原因
  onResolveCallback = [];
  onRejectCallback = [];

  constructor(executor) {
    const resolve = (value) => { // 使用箭头函数是为了让 resolve 中的 this 指向 promise 实例
      if(this.status !== PENDING) return; // 只有状态是等待状态的话才能更新状态
      this.status = FULFILLED; // 将状态更改为成功
      this.value = value; // 保存成功的数据
      this.onResolveCallback.forEach(fn => fn()); // 发布的过程
    }
    const reject = (reason) => {
      if(this.status !== PENDING) return;
      this.status = REJECTED; // 将状态更改为失败
      this.reason = reason; // 保存失败的原因
      this.onRejectCallback.forEach(fn => fn()); // 发布的过程
    }
    try { // try...catch...只能捕获同步异常
      // executor执行的时候需要传入两个参数，用来给用户改变状态使用的
      executor(resolve, reject);
    } catch (error) {
      // 表示当前有异常，那就使用这个异常作为 Promise失败的原因
      reject(error);
    }
    
  }
  then(onFulFilled, onRejected) {
    // TODO: 可选参数的处理
    onFulFilled = typeof onFulFilled == 'function' ? onFulFilled : val => val;
    onRejected = typeof onRejected == 'function' ? onRejected : val => { throw val };
    const promise2 = new Promise((resolve, reject) => {
      // 判断状态
      if(this.status === FULFILLED) {
        setTimeout(() => { // TODO: 此处用异步逻辑为了解决 Uncaught ReferenceError: Cannot access 'promise2' before initialization
          try {
            const x = onFulFilled(this.value);
            // 判断 x 的值是普通值还是promise对象
            // 如果是普通值，直接调用 resolve
            // 如果是 promise 对象，查看 promise 对象的返回结果
            // 再根据 promise 对象返回的结果，决定调用 resolve 还是调用 reject
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0)
      } else if(this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      } else {
        // 订阅的过程
        // 将成功和失败回调存储起来
        this.onResolveCallback.push(() => {
          setTimeout(() => {
            try {
              const x = onFulFilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectCallback.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  // TODO: 静态方法
  // 测试是否符合规范
  static deferred() {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    })
    return dfd;
  }
  // Promise 化
  // 把异步的 node 中的 api 转化成 Promise 方法，只针对 node 方法
  static promisify(fn) {
    return function(...args) {
      return new Promise((resolve, reject) => {
        fn(...args, function(error, data) {
          if(error) reject(error);
          resolve(data);
        })
      })
    }
  }
  // all
  static all(promises) {
    return new Promise((resolve, reject) => {
      // 让一个 promise 执行，就是调用它的 then 方法
      let res = [], j = 0;
      const processData = (data) => {
        res[j] = data;
        if(++j === promises.length) {
          resolve(res);
        }
      }
      for (const current of promises) {
        if(isPromise(current)) { // promise 对象
          // 如果有任何一个 promise 失败了，直接让这个 promise变成失败态即可
          current.then(data => {
            processData(data);
          }, reject);
        } else { // 普通值
          processData(current);
        }
      }
    });
  }
  // race
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (const current of promises) {
        // 采用第一个调用 resolve 或 reject 的结果
        if(isPromise(current)) {
          current.then(resolve, reject);
        } else {
          resolve(current)
        }
      }
    });
  }
  // resolve
  static resolve(value) {
    // resolve 方法里面放一个 promise 会等待这个 promise 执行完成
    // return new Promise(resolve => resolve(value)); 等同于下面
    return isPromise(value) ?
    value :
    new Promise(resolve => resolve(value));
  }
  // reject
  static reject(value) {
    // reject 不会解析 value 中的 promise
    return new Promise(reject => reject(value));
  }
}

export default Promise;