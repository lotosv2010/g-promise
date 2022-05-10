import Promise from "./Promise";

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    Math.random() > 0.5 ? resolve('resolve') : reject('reject');
  }, 2000);
});


p1.then(data => {
  console.log('data', data);
}).finally(() => {
  console.log('finally');
}).then(data => {
  console.log('data', data);
}).catch(error => console.log('catch', error));