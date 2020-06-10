/*const si = require('systeminformation')
console.log(1);
si.networkInterfaceDefault(result => {console.log(result); console.log(2);})
*/

const wlan = require('node-wifi')

async function whatever(){
  await wlan.init({iface: null})
  console.log(await wlan.scan());
}
whatever()
