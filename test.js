const si = require('systeminformation')
console.log(1);
si.networkInterfaceDefault(result => {console.log(result); console.log(2);})
