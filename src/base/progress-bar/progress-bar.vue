<template>
  <div class="progress-bar"
       ref="progressBar"
       @click="progressClick">
    <div class="bar-inner">
      <div class="progress"
           ref="progress">
      </div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom'
import { mapGetters, mapMutations } from 'vuex'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  computed: {
    ...mapGetters([
      'playing'
    ])
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initated) {
        return
      }
      if (this.playing) {
        this.setPlayingState(!this.playing)
      }
      const daltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + daltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd (e) {
      this.touch.initated = false
      this._triggerPercent()
    },
    progressClick (e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    ...mapMutations({
      'setPlayingState': 'SET_PLAYING_STATE'
    })
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "common/sass/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
