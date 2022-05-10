import Promise from "./Promise";

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve');
  }, 2000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('reject');
  }, 1000);
});


p1.finally(() => {
  console.log('finally');
}).then(data => {
  console.log(data);
}, error => {
  console.log(error)
});

p2.then(data => {
  console.log(data);
}, error => {
  console.log(error);
}).finally(() => {
  console.log('finally');
  // return p1;
}).then(data => {
  console.log(data);
}, error => {
  console.log(error)
});