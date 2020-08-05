const Queue = require('bull')
const slideshowQueue = new Queue('slideshows')
slideshowQueue.process('*', (job) => {
  console.log('xxxxxxxxxxxxxxx')
})
