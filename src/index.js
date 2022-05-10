import Promise from "./Promise";

const promise = new Promise((resolve, reject) => {
  // setTimeout(() => {
  //   Math.random() >= 0.5
  //     ? resolve('resolve')
  //     : reject('reject');
  // }, 2000);
  resolve('resolve');
});

function other() {
  return new Promise((resolve, reject) => {
    resolve('other');
  })
}

const  p1= promise.then((data) => {
  console.log('success', data);
  return p1; // TODO: 返回自己会报 Chaining cycle detected for promise
  // return 100;
}, (error) => {
  console.log('error', error)
})

p1.then((data) => {
  console.log(data);
  return other();
}, (error) => {
  console.log(error.message)
})
.then(data => console.log(data))
