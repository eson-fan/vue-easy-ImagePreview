<template>
  <div
    class="preview-container"
    ref="previewContainer"
    :style="{ 'pointer-events': show ? 'auto' : 'none' }"
  >
    <slot name="index" v-if="showIndex">
      <slot name="index">
        <div class="preview-index">{{ curIndex }} / {{ length }}</div>
      </slot>
    </slot>
    <div class="preview-images" ref="imagesContainer">
      <div class="preview-img" id="right" ref="right">
        <img
          :src="defaultImg"
          alt=""
          width="100%"
          ref="imgRight"
          error="#placeholderRightFail"
          loading="#placeholderRight"
        />
        <div class="placeholder" id="placeholderRight">
          <slot name="placeholderLoading">
            <div class="placeholder-inner">
              <span>加载中...</span>
            </div>
          </slot>
        </div>
        <div
          class="placeholder"
          style="display:none;"
          id="placeholderRightFail"
        >
          <slot name="placeholderFail">
            <div class="placeholder-inner">
              <span>图片加载失败</span>
            </div>
          </slot>
        </div>
      </div>
      <div class="preview-img" id="left" ref="left">
        <img
          :src="images[index - 1]"
          alt=""
          width="100%"
          ref="imgLeft"
          error="#placeholderLeftFail"
          loading="#placeholderLeft"
        />
        <div class="placeholder" id="placeholderLeft">
          <slot name="placeholderLoading">
            <div class="placeholder-inner">
              <span>加载中...</span>
            </div>
          </slot>
        </div>
        <div class="placeholder" style="display:none;" id="placeholderLeftFail">
          <slot name="placeholderFail">
            <div class="placeholder-inner">
              <span>图片加载失败</span>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// touchend以后滑动的动画
const TRANSITION_DURATION = 300
const TRANSITION = 'left ' + (TRANSITION_DURATION - 50) / 1000 + 's'
//是否为点击的最大时间间隔(touchstart-->touchend之间的间隔)
const CLICK_MAX_DURATION = 200
//滑动时，是否进入下一页的速度阈值
const MAX_SPEED = 0.2
export default {
  name: 'ImagePreview',
  data() {
    return {
      defaultImg:
        'data:image/jpg;base64,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',
      curIndex: 1, //当前图片位置

      //点击相关
      clickCount: 0, //点击的次数
      clickTimeout: '', //判断是否是点击的计时器
      startTouchTime: -1, //按下的时间

      //滑动相关
      moveXOffset: 0, //手指滑动的轴距离
      startX: null, //触摸的开始x坐标
      startY: null, //触摸的开始y坐标

      //缩放相关
      curVisibleImg: '', //当前显示的img标签
      imgScale: 1, //当前图片的放大倍数
      imgStartScale: 1, //当前图片开始缩放时的放大倍数
      start2PointDistance: -1, //双指缩放，开始两点间距离
      imgLeft: 0, //当前操作的img的left值
      imgTop: 0, //当前操作的img的top值
      isScaleing: false, //是否是双指缩放中

      valideScroll: false, //是否有效的触发了滚动，如果没有触发，则touchend不处理
      isScrolling: false, //是否在滚动中
      isStart: false, //是否有按下发生
    }
  },
  model: {
    prop: 'show',
    event: 'close',
  },
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    images: {
      type: Array,
      default: function() {
        return []
      },
    },
    loop: {
      type: Boolean,
      default: true,
    },
    showIndex: {
      type: Boolean,
      default: true,
    },
    minZoom: {
      type: Number,
      default: 0.5,
    },
    maxZoom: {
      type: Number,
      default: 3,
    },
    index: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    show(value) {
      if (value) {
        this.initIndex()
      }
      this._updateVisible()
    },
  },
  computed: {
    length() {
      return this.images.length
    },
  },
  mounted() {
    let tmpLeftImg = this.$refs.imgLeft
    tmpLeftImg.onerror = function() {
      let error = this.getAttribute('error')
      let loading = this.getAttribute('loading')
      setTimeout(() => {
        document.querySelector(error).style.display = 'flex'
        document.querySelector(loading).style.display = 'none'
      })
    }
    tmpLeftImg.onload = function() {
      let loading = this.getAttribute('loading')
      this.style.display = 'flex'
      setTimeout(() => {
        document.querySelector(loading).style.display = 'none'
      })
    }
    let tmpRightImg = this.$refs.imgRight
    tmpRightImg.onerror = function() {
      let error = this.getAttribute('error')
      let loading = this.getAttribute('loading')
      setTimeout(() => {
        document.querySelector(error).style.display = 'flex'
        document.querySelector(loading).style.display = 'none'
      })
    }
    tmpRightImg.onload = function() {
      let loading = this.getAttribute('loading')
      this.style.display = 'flex'
      setTimeout(() => {
        document.querySelector(loading).style.display = 'none'
      })
    }
    this.initIndex()

    this.$refs.left.addEventListener('touchstart', this.touchHandle)
    this.$refs.left.addEventListener('touchmove', this.touchHandle)
    this.$refs.left.addEventListener('touchend', this.touchHandle)
    this.$refs.right.addEventListener('touchstart', this.touchHandle)
    this.$refs.right.addEventListener('touchmove', this.touchHandle)
    this.$refs.right.addEventListener('touchend', this.touchHandle)

    setTimeout(() => {
      this._updateVisible()
    }, 100)
  },
  methods: {
    initIndex() {
      if (this.index < 1) {
        this.index = 1
      } else if (this.index > this.length) {
        this.index = this.length
      }
      this.curIndex = this.index
      this.indexChange(this.index)
      //设置初始显示的图片，并且设置图片的onerror，onload
      if (
        this.curVisibleImg &&
        this.curVisibleImg.src != this.images[this.curIndex - 1]
      ) {
        let img = this.curVisibleImg
        let loading = img.getAttribute('loading')
        let error = img.getAttribute('error')
        document.querySelector(loading).style.display = 'flex'
        document.querySelector(error).style.display = 'none'
        img.onerror = function() {
          let error = this.getAttribute('error')
          let loading = this.getAttribute('loading')
          setTimeout(() => {
            document.querySelector(error).style.display = 'flex'
            document.querySelector(loading).style.display = 'none'
          })
        }
        img.onload = function() {
          let loading = this.getAttribute('loading')
          this.style.display = 'flex'
          setTimeout(() => {
            document.querySelector(loading).style.display = 'none'
          })
        }
        this.curVisibleImg.src = this.images[this.curIndex - 1]
      }
    },
    //拦截触摸，处理滑动
    touchHandle(event) {
      if (!this.isScrolling) {
        //当前的元素
        let currentTarget = event.currentTarget
        //左或右的元素
        let nextTarget =
          currentTarget.id == 'left' ? this.$refs.right : this.$refs.left
        //当前点击或滑动的图片
        this.curVisibleImg = currentTarget.children[0]
        switch (event.type) {
          case 'touchstart':
            this.isStart = true
            //记录点击的时间，用于单击和双击判断
            if (event.touches.length == 1) {
              this.startTouchTime = Date.now()
            }
            this.startX = event.touches[0].pageX
            this.startY = event.touches[0].pageY
            this._clearTransition()

            //获取touch开始时放大的图片的当前的left/top值
            this.imgLeft = this.curVisibleImg.style.left || '0px'
            this.imgLeft = parseFloat(this.imgLeft.replace('px', ''))
            //高度的初始值，top不是0，需要计算
            this.imgTop =
              this.curVisibleImg.style.top ||
              (this.$refs.imagesContainer.clientHeight -
                this.curVisibleImg.height) /
                2 +
                'px'
            this.imgTop = parseFloat(this.imgTop.replace('px', ''))

            //双指缩放,获取两点间的距离
            if (event.touches.length == 2) {
              this.imgStartScale = this.imgScale
              this.start2PointDistance = this._get2PointDistance(
                event.touches[0],
                event.touches[1]
              )
            }
            break
          case 'touchmove':
            if (!this.isStart) break
            //如果是双指缩放，直接执行缩放操作
            if (this.start2PointDistance > 0 && event.touches.length == 2) {
              let cur2PointDistance = this._get2PointDistance(
                event.touches[0],
                event.touches[1]
              )
              let scale =
                this.imgStartScale *
                (cur2PointDistance / this.start2PointDistance)
              if (scale > this.maxZoom) {
                scale = this.maxZoom
              } else if (scale < this.minZoom) {
                scale = this.minZoom
              }
              this._scaleHandle(scale)
              this.isScaleing = true
            } else if (!this.isScaleing) {
              //一次双指缩放是否结束，如果结束才执行下面代码，例如当双指缩放时，一指先抬起会导致有滑动问题
              //滑动时，左或右元素的开始位置
              let nextStart = 0
              //当前是第几张图片
              let imageIndex = this.curIndex

              //计算水平移动距离
              this.moveXOffset = event.touches[0].pageX - this.startX
              //如果图片是放大状态，则执行图片移动
              if (this.imgScale !== 1) {
                if (this.imgScale < 1) break
                let moveYOffset = event.touches[0].pageY - this.startY
                let curLeft = this.imgLeft
                let curTop = this.imgTop

                //设置图片移动后的top值，如果超过边界则不能继续移动
                let heightScale =
                  this.imgScale -
                  this.$refs.imagesContainer.clientHeight /
                    this.curVisibleImg.height
                if (heightScale > 0) {
                  let tmpY =
                    (this.$refs.imagesContainer.clientHeight -
                      this.curVisibleImg.height) /
                    2
                  let maxYOffset = (this.curVisibleImg.height * heightScale) / 2
                  let maxY = tmpY + maxYOffset
                  let minY = tmpY - maxYOffset
                  let willTop = curTop + moveYOffset
                  if (willTop > maxY) {
                    willTop = maxY
                  } else if (willTop < minY) {
                    willTop = minY
                  }
                  this.curVisibleImg.style.top = willTop + 'px'
                }

                //设置图片移动后的left值，如果超过边界则不能继续移动
                let maxXOffset =
                  (this.$refs.imagesContainer.clientWidth *
                    (this.imgScale - 1)) /
                  2
                let willLeft = curLeft + this.moveXOffset
                if (Math.abs(willLeft) > maxXOffset) {
                  if (willLeft > 0) {
                    willLeft = maxXOffset
                  } else {
                    willLeft = -maxXOffset
                  }
                }
                this.curVisibleImg.style.left = willLeft + 'px'
              } else {
                //是否取消循环滚动
                if (!this.loop) {
                  if (imageIndex == 1 && this.moveXOffset > 0) {
                    this.moveXOffset = 0
                  } else if (
                    imageIndex == this.length &&
                    this.moveXOffset < 0
                  ) {
                    this.moveXOffset = 0
                  }
                }
                //如果图片大于一张，并且触发了滑动，则进行图片滑动切换
                if (this.length > 1 && Math.abs(this.moveXOffset) > 0) {
                  this.valideScroll = true
                  if (this.moveXOffset > 0) {
                    //上一张
                    nextStart = -this.$refs.imagesContainer.clientWidth
                    imageIndex -= 1
                  } else {
                    //下一张
                    imageIndex += 1
                    nextStart = this.$refs.imagesContainer.clientWidth
                  }
                  if (imageIndex <= 0) {
                    imageIndex = this.length
                  } else if (imageIndex > this.length) {
                    imageIndex = 1
                  }
                  //设置下一张图片到组件中
                  if (
                    this.images[imageIndex - 1] != nextTarget.children[0].src
                  ) {
                    nextTarget.children[0].onerror = function() {
                      let error = this.getAttribute('error')
                      let loading = this.getAttribute('loading')
                      document.querySelector(error).style.display = 'flex'
                      document.querySelector(loading).style.display = 'none'
                    }
                    nextTarget.children[0].onload = function() {
                      let loading = this.getAttribute('loading')
                      this.style.display = 'flex'
                      document.querySelector(loading).style.display = 'none'
                    }
                    nextTarget.children[0].src = this.images[imageIndex - 1]
                    nextTarget.children[1].style.display = 'flex'
                    nextTarget.children[2].style.display = 'none'

                    //首先设置为透明，移动到目标位置，防止出现闪烁
                    nextTarget.style.opacity = 0
                    nextTarget.style.left = nextStart + 'px'
                  } else {
                    nextTarget.children[0].style.display = 'flex'
                  }

                  currentTarget.style.left = this.moveXOffset + 'px'
                  nextTarget.style.opacity = 1
                  nextTarget.style.left = nextStart + this.moveXOffset + 'px'
                }
              }
            }
            break
          case 'touchend':
            if (!this.isStart) break
            if (event.touches.length == 0) {
              //如果比原来比例小，则恢复
              if (this.imgScale < 1) {
                this._scaleHandle(1, true)
              } else if (this.isScaleing) {
                //如果是刚缩放结束，则判断是否超出了边界，如果超出了，则边界对齐
                //是否有修改
                let isChange = false

                //计算X是否超过边界
                let maxXOffset =
                  (this.curVisibleImg.width * (this.imgScale - 1)) / 2
                let destLeft = this.imgLeft
                if (Math.abs(this.imgLeft) > maxXOffset) {
                  if (this.imgLeft >= 0) {
                    destLeft = maxXOffset
                  } else {
                    destLeft = -maxXOffset
                  }
                  isChange = true
                }

                //计算Y是否超出边界
                let heightScale =
                  this.imgScale -
                  this.$refs.imagesContainer.clientHeight /
                    this.curVisibleImg.height
                let destTop = this.imgTop
                if (heightScale > 0) {
                  let standY =
                    (this.$refs.imagesContainer.clientHeight -
                      this.curVisibleImg.height) /
                    2
                  let maxYOffset = (this.curVisibleImg.height * heightScale) / 2
                  if (Math.abs(this.imgTop - standY) > maxYOffset) {
                    if (this.imgTop >= standY) {
                      destTop = standY + maxYOffset
                    } else {
                      destTop = standY - maxYOffset
                    }
                    isChange = true
                  }
                } else {
                  destTop =
                    (this.$refs.imagesContainer.clientHeight -
                      this.curVisibleImg.height) /
                    2
                  isChange = true
                }
                //如果改变了，则执行过度
                if (isChange) {
                  this._setImageTransition(this.curVisibleImg)
                  this.curVisibleImg.style.left = destLeft + 'px'
                  this.curVisibleImg.style.top = destTop + 'px'
                  this._clearImageTransition(this.curVisibleImg)
                }
              } else if (this.valideScroll) {
                //滑动停时，当前元素滑动的距离
                let endLeft = 0
                //计算滑动速度
                let moveDuration = Date.now() - this.startTouchTime
                let speed = this.moveXOffset / moveDuration
                //是否进入下一页
                let isNext = Math.abs(speed) > MAX_SPEED
                //如果执行了滑动，则是图片滑动
                endLeft = currentTarget.style.left.replace('px', '')
                endLeft = parseFloat(endLeft)
                //清空图片
                let clearSrcTarget = null
                //松手的时候判断，如果没有划过了图片的一半距离或者速度没有达到翻页要求，则还需要显示当前的图片
                if (
                  Math.abs(endLeft) <
                    this.$refs.imagesContainer.clientWidth / 2 &&
                  !isNext
                ) {
                  this._setTransition()
                  currentTarget.style.left = '0px'
                  if (endLeft > 0) {
                    nextTarget.style.left =
                      0 - this.$refs.imagesContainer.clientWidth + 'px'
                  } else {
                    nextTarget.style.left =
                      this.$refs.imagesContainer.clientWidth + 'px'
                  }
                  clearSrcTarget = nextTarget
                } else {
                  //松手的时候判断，如果划过了图片的一半距离或者速度达到翻页要求，则需要自动滑动到下一张/上一张
                  let curDestLeft = 0
                  if (endLeft > 0) {
                    if (this.curIndex == 1) {
                      this.curIndex = this.length
                    } else {
                      this.curIndex -= 1
                    }
                    curDestLeft = this.$refs.imagesContainer.clientWidth
                    //如果下一个图片所在位置不在屏幕右边，则先将他移动到右边，否则会出现从左边划过去，和当前图片不同步
                    let curNextLeft = nextTarget.style.left || '0px'
                    curNextLeft = parseFloat(curNextLeft.replace('px', ''))
                    if (curNextLeft >= curDestLeft - 0.5) {
                      nextTarget.style.opacity = 0
                      nextTarget.style.left = -curDestLeft + 'px'
                    }
                  } else {
                    if (this.curIndex == this.length) {
                      this.curIndex = 1
                    } else {
                      this.curIndex += 1
                    }
                    curDestLeft = 0 - this.$refs.imagesContainer.clientWidth
                    //如果下一个图片所在位置不在屏幕左边，则先将他移动到左边，否则会出现从右边划过去，和当前图片不同步
                    let curNextLeft = nextTarget.style.left || '0px'
                    curNextLeft = parseFloat(curNextLeft.replace('px', ''))
                    if (curNextLeft >= curDestLeft + 0.5) {
                      nextTarget.style.opacity = 0
                      nextTarget.style.left = curDestLeft + 'px'
                    }
                  }
                  clearSrcTarget = currentTarget
                  nextTarget.style.opacity = 1
                  this._setTransition()
                  nextTarget.style.left = '0px'
                  currentTarget.style.left = curDestLeft + 'px'
                  this.indexChange(this.curIndex)
                }
                //清除动画，清楚动画以后，如果翻页了，则清空图片
                this._clearTransition(clearSrcTarget)
              } else {
                //如果没有走滑动，则判断是否需要执行点击或双击操作
                if (
                  Date.now() - this.startTouchTime < CLICK_MAX_DURATION &&
                  Math.abs(this.moveXOffset) < 0.1
                ) {
                  this.clickCount += 1
                  if (this.clickTimeout) {
                    clearTimeout(this.clickTimeout)
                    this.clickTimeout = ''
                  }
                  this.clickTimeout = setTimeout(() => {
                    if (this.clickCount == 1) {
                      this.hidden()
                    } else if (this.clickCount == 2) {
                      //双击放大/缩小
                      let scale = this.imgScale
                      if (this.imgScale > 1) {
                        scale = 1
                      } else {
                        scale =
                          this.$refs.imagesContainer.clientHeight /
                          this.curVisibleImg.height
                      }
                      this._scaleHandle(scale, true)
                    }
                    this.clickCount = 0
                    this.clickTimeout = ''
                  }, 250)
                }
              }
              this.isScaleing = false
              this._reset()
            }
            break
        }
      }
      event.preventDefault()
    },
    //清除滚动过度
    _clearTransition(target) {
      setTimeout(() => {
        this.$refs.left.style.transition = ''
        this.$refs.right.style.transition = ''
        this.$refs.left.style['-webkit-transition'] = ''
        this.$refs.left.style['-moz-transition'] = ''
        this.$refs.left.style['-o-transition'] = ''
        this.$refs.right.style['-webkit-transition'] = ''
        this.$refs.right.style['-moz-transition'] = ''
        this.$refs.right.style['-o-transition'] = ''
        this.isScrolling = false
        if (target) {
          target.children[0].style.display = 'none'
        }
      }, TRANSITION_DURATION)
    },
    //设置滚动过度
    _setTransition() {
      this.isScrolling = true
      this.$refs.left.style.transition = TRANSITION
      this.$refs.right.style.transition = TRANSITION
      this.$refs.left.style['-webkit-transition'] = TRANSITION
      this.$refs.left.style['-moz-transition'] = TRANSITION
      this.$refs.left.style['-o-transition'] = TRANSITION
      this.$refs.right.style['-webkit-transition'] = TRANSITION
      this.$refs.right.style['-moz-transition'] = TRANSITION
      this.$refs.right.style['-o-transition'] = TRANSITION
    },
    //重置数据
    _reset() {
      this.isStart = false
      this.start2PointDistance = -1
      this.moveXOffset = 0
      this.valideScroll = false
    },
    hidden() {
      this.$refs.previewContainer.style.opacity = 0
      this.removeSelf()
    },
    removeSelf() {
      setTimeout(() => {
        this.$emit('close', false)
      }, 500)
    },
    indexChange(index) {
      this.$emit('change', index)
    },
    _updateVisible() {
      if (this.show) {
        this.$refs.previewContainer.style.opacity = 1
      } else {
        this.$refs.previewContainer.style.opacity = 0
      }
    },
    //放大图片
    _scaleHandle(scale, anim = false) {
      if (this.imgScale != scale) {
        if (anim) {
          this._setImageTransition(this.curVisibleImg)
        }
        this.curVisibleImg.style.transform =
          'scale(' + scale + ',' + scale + ')'
        if (scale == 1) {
          this.curVisibleImg.style.left = ''
          this.curVisibleImg.style.top = ''
        }
        if (anim) {
          this._clearImageTransition(this.curVisibleImg)
        }
        this.imgScale = scale
      }
    },
    //设置图片的过度(移动、缩放)
    _setImageTransition(img) {
      if (img) {
        img.style.transition = 'all .3s'
      }
    },
    //清除图片的transition
    _clearImageTransition(img) {
      if (img) {
        setTimeout(() => {
          img.style.transition = ''
          if (this.imgScale == 1) {
            img.style.transform = ''
          }
        }, 300)
      }
    },
    //计算两点之间的距离
    _get2PointDistance(p1, p2) {
      if (p1 && p2) {
        return Math.sqrt(
          Math.pow(Math.abs(p1.pageX - p2.pageX), 2) +
            Math.pow(Math.abs(p1.pageY - p2.pageY), 2)
        )
      }
      return -1
    },
  },
  beforeDestroy() {
    //清除监听
    this.$refs.left.removeEventListener('touchstart', this.touchHandle)
    this.$refs.left.removeEventListener('touchmove', this.touchHandle)
    this.$refs.left.removeEventListener('touchend', this.touchHandle)
    this.$refs.right.removeEventListener('touchstart', this.touchHandle)
    this.$refs.right.removeEventListener('touchmove', this.touchHandle)
    this.$refs.right.removeEventListener('touchend', this.touchHandle)
  },
}
</script>

<style scoped>
.preview-container {
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.5s;
}
.preview-index {
  padding: 35px;
  font-size: 15px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: white;
  line-height: 42px;
}
.preview-images {
  width: 100%;
  flex: 1;
  overflow-x: hidden;
  position: relative;
}
.preview-images::-webkit-scrollbar {
  width: 0px;
}
.preview-img {
  position: absolute;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: black;
}
.preview-img::-webkit-scrollbar {
  width: 0px;
}
.preview-img > img {
  position: absolute;
  left: 0px;
  z-index: 0;
}
.preview-img > .placeholder {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.placeholder > .placeholder-inner {
  background-color: black;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: white;
}
</style>
