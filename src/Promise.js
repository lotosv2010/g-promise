// 宏
const PENDING = 'PENDING'     // 等待状态
const FULFILLED = 'FULFILLED' // 成功状态
const REJECTED = 'REJECTED'   // 失败状态

class Promise {
  status = PENDING; // promise 状态
  value = undefined; // 成功的数据
  reason = undefined; // 失败的原因

  constructor(executor) {
    const resolve = (value) => { // 使用箭头函数是为了让 resolve 中的 this 指向 promise 实例
      if(this.status !== PENDING) return; // 只有状态是等待状态的话才能更新状态
      this.status = FULFILLED; // 将状态更改为成功
      this.value = value; // 保存成功的数据
    }
    const reject = (reason) => {
      if(this.status !== PENDING) return;
      this.status = REJECTED; // 将状态更改为失败
      this.reason = reason; // 保存失败的原因
    }
    executor(resolve, reject);
  }
  then(onFulFilled, onReject) {
    // 判断状态
    if(this.status === FULFILLED) {
      onFulFilled(this.value);
    } else if(this.status === REJECTED) {
      onReject(this.reason);
    }
  }
}

export default Promise;