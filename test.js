const wifi = require('node-wifi')
async function getWiFiNetworks(){
  await wifi.init({iface: null})
  const c = await wifi.getCurrentConnections()
  console.log(c)
}
getWiFiNetworks();
