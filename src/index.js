import Promise from "./Promise";

new Promise((resolve, reject) => {
  resolve('resolve');
  reject('reject');
})
  .then(
    data => console.log(data),
    error => console.log(error)
  );