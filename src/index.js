import Promise from "./Promise";

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    Math.random() >= 0.5
      ? resolve('resolve')
      : reject('reject');
  }, 2000);
});

promise.then((data) => {
  console.log('success', data)
}, (error) => {
  console.log('error', error)
})

promise.then((data) => {
  console.log('success2', data)
}, (error) => {
  console.log('error2', error)
})