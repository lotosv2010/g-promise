// 宏
const PENDING = 'PENDING'     // 等待状态
const FULFILLED = 'FULFILLED' // 成功状态
const REJECTED = 'REJECTED'   // 失败状态

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
    executor(resolve, reject);
  }
  then(onFulFilled, onRejected) {
    // 判断状态
    if(this.status === FULFILLED) {
      onFulFilled(this.value);
    } else if(this.status === REJECTED) {
      onRejected(this.reason);
    } else {
      // 订阅的过程
      // 将成功和失败回调存储起来
      this.onResolveCallback.push(() => {
        onFulFilled(this.value);
      });
      this.onRejectCallback.push(() => {
        onRejected(this.reason)
      });
    }
  }
}

export default Promise;