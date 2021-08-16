import Vue from 'vue'
import ImagePreviewComponent from './ImagePreview.vue'

let ImagePreview = (function() {
  return function(options) {
    let defaults = {
      images: [], //图片数组
      close: '', // 关闭时回调
      change: '', // 图片切换时回调 (index) => {}
      loop: true, //是否无限循环
      showIndex: true, //是否显示指示器
      maxZoom: 3, // 最大放大的倍数
      minZoom: 0.5, //最小缩放倍数
      index: 1, //从第几页开始
    }
    var Component = Vue.extend(ImagePreviewComponent)
    if (typeof options === 'object') {
      if (options instanceof Array) {
        defaults.images = options
      } else {
        for (let key in options) {
          defaults[key] = options[key]
        }
      }
    }
    defaults._hasRemoved = false
    var vm = new Component({
      el: document.createElement('div'),
      props: {
        //是否显示
        show: {
          type: Boolean,
          default: true,
        },
        //图片
        images: {
          type: Array,
          default: () => {
            if (defaults.images) {
              return defaults.images
            }
            return []
          },
        },
        loop: {
          type: Boolean,
          default: defaults.loop,
        },
        showIndex: {
          type: Boolean,
          default: defaults.showIndex,
        },
        minZoom: {
          type: Number,
          default: defaults.minZoom,
        },
        maxZoom: {
          type: Number,
          default: defaults.maxZoom,
        },
        index: {
          type: Number,
          default: defaults.index,
        },
      },
      methods: {
        indexChange(index) {
          if (defaults.change && typeof defaults.change === 'function') {
            defaults.change(index)
          }
        },
        removeSelf() {
          setTimeout(() => {
            if (!defaults._hasRemoved) {
              defaults._hasRemoved = true
              if (defaults.close && typeof defaults.close === 'function') {
                defaults.close()
              }
              document.body.removeChild(vm.$el)
            }
          }, 500)
        },
      },
    })
    document.body.appendChild(vm.$el)
    return vm
  }
})()

ImagePreview.Component = ImagePreviewComponent

function install(V) {
  if (V) {
    V.prototype.$preview = ImagePreview
    V.component(ImagePreviewComponent.name, ImagePreviewComponent)
  }
}

export default { install, show: ImagePreview }
