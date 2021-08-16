import Vue from 'vue'
import App from './App.vue'
// const ImagePreview = require('./ip.js')
// import ImagePreview from './ip.js'
// console.log(ImagePreview)
// Vue.component(ImagePreview.name, ImagePreview)
// Vue.use(ImagePreview)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
