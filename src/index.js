import Promise from "./Promise";

const promise = new Promise((resolve, reject) => {
  // setTimeout(() => {
  //   Math.random() >= 0.5
  //     ? resolve('resolve')
  //     : reject('reject');
  // }, 2000);
  // throw new Error('executor error'); // TODO: 错误一执行器中的错误
  resolve('resolve');
  // reject('reject');
});

function other() {
  return new Promise((resolve, reject) => {
    resolve('other');
  })
}

const  p1= promise
.then()
.then()
.then((data) => {
  console.log('success', data);
  // throw new Error('then resolve error'); // TODO: 错误二then方法中的成功回调中的错误
  return 100;
}, (error) => {
  console.log('error', error.message)
  return 101;
})

p1.then((data) => {
  console.log('data', data);
  return other();
}, (error) => {
  console.log(error.message);
  return 1002;
})
.then(data => console.log(data))
