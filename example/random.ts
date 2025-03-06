// 在安全场景下，使用弱伪随机数生成器
console.log(Math.random());
const val = Math.random();

console.log("Math.random()");


// 在安全场景下，使用保密性较强的crypto库来生成随机数
// *** 客户端 ***
const crypto = window.crypto || window.msCryto;
let array = new Unit32Array(1);
crypto.getRandomValues(array);

// *** 服务器端 ***
const crypto = require('crypto');
const buf = crypto.randomBytes(1);