<template>
  <div id="app">
    <div>自定义组件</div>
    <image-preview :images="images"> </image-preview>
  </div>
</template>

<script>
// const IP = require('./vue-easy-ImagePreview.common.js')
// const ImagePreview = require("./vue-easy-ImagePreview.umd.min.js");
// const ImagePreview = require("./ip.js");
import ImagePreview from './ip.js'
export default {
  name: 'App',
  components: {
    ImagePreview: ImagePreview.show.Component,
  },
  created() {
    // console.log("---------------------", ImagePreview);
    // this.$preview({ images: this.images })
    // ImagePreview.show({ images: this.images })
  },
  data() {
    return {
      images: [
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.soumeitu.com%2Fwp-content%2Fuploads%2F2020%2F07%2F5efd4bc254c10.jpg&refer=http%3A%2F%2Fwww.soumeitu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629630925&t=608a56a47a9b890725fbf158dadfd4a6',
        'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg3.ph.126.net%2Fp-RJ33HgAuhSQOMCsyQ0UA%3D%3D%2F3099883918532000103.jpg&refer=http%3A%2F%2Fimg3.ph.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1629630925&t=39052dbea1dac7b90660e830c27c9e80',
      ],
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.swiper {
  width: 100px;
  height: 300px;
}
</style>
