import Promise from "./Promise";

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve1');
  }, 2000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve2');
  }, 1000);
});


Promise.all(['a', p1, p2]).then((data) => {
  console.log('data', data);
}, (error) => {
  console.log(error);
})
