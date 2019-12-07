<template>
  <div class="pull-refresh" ref="pullF">
    <div class="pull-info" :style="{ height: tipHeight }" v-if="!refreshing">
      <img
        src="./img/refresh_arrow.png"
        :style="{ transform: `rotate(${arrowDeg}deg)`, transition: transition }"
      />
      <span>{{ tipText }}</span>
    </div>
    <div class="pull-info" :style="{ height: tipHeight }" v-else>
      <img v-if="state === 3" src="./img/loading.gif" />
      <img v-if="state === 4" src="./img/succ.png" />
      <span>{{ refreshTip }}</span>
    </div>
    <div
      class="pull-con"
      ref="pull"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      :style="{ transform: `translateY(${moveY}px)`, transition: transition }"
    >
      <slot></slot>
      <div class="pullingUp-wrap" v-if="pullingUp && showPullingUp">
        <img v-if="upllingUpState !== 2" class="img" src="./img/loading.gif" />
        {{ pullingUpTipText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pullRefresh",
  props: {
    list: {
      type: Array,
      default: () => []
    },
    tipHeight: {
      type: String,
      default: "40px"
    },

    pullTip: {
      type: String,
      default: "下拉即可刷新"
    },
    refreshTip: {
      type: String,
      default: "正在刷新"
    },
    pullingUp: {
      type: Boolean,
      default: true
    },
    pullingDown: {
      type: Boolean,
      default: true
    },
    pullingUpFinishText: {
      type: String,
      default: "没有更多数据了"
    },
    useCache: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      refreshing: false,
      state: 1,
      clientY: 0,
      moveY: 0,
      disabled: false,
      arrowDeg: 0,
      transition: "all 0.2s",
      getPullInfoHeight: 60,
      scrollLock: false,
      showPullingUp: false,
      pageIndex: 0,
      pullingUpText: "正在加载",
      upllingUpState: 1
    };
  },
  created() {
    if (this.useCache) {
      this.mergeCacheData();
    }
  },
  mounted() {
    this.setWrapHeight();
    if (this.pullingUp) {
      this.initPullUp();
    }
    if (this.useCache) {
      this.setContainerScrollTop();
    }
  },

  methods: {
    checkScrollHeight() {
      this.pullF = this.$refs.pullF;
      if (this.pullF.scrollHeight - this.pullF.clientHeight >= 10) {
        this.showPullingUp = true;
      }
    },
    initPullUp() {
      this.pullF = this.$refs.pullF;
      if (this.pullF) {
        this.checkScrollHeight();
        this.pullF.addEventListener("scroll", this.scroll);
      }
    },
    forceUpdate() {
      this.upllingUpState = 2;
      this.saveCache(this.list);
    },
    scroll(e) {
      let scrollTop = this.pullF.scrollTop || 0;
      if (scrollTop) {
        localStorage.setItem("vpullScrollTop", scrollTop);
      }

      let scrollH = this.pullF.scrollHeight;
      let clientH = this.pullF.clientHeight;
      if (clientH + scrollTop >= scrollH - 10 && scrollTop != 0) {
        if (this.scrollLock || this.upllingUpState === 2) {
          return;
        }
        this.scrollLock = true;
        this.pageIndex += 1;
        this.$emit("loadmore", this.pageIndex);
      }
    },
    setWrapHeight() {
      try {
        let parent = this.$refs.pullF.parentNode;
        let h = parent.clientHeight;
        let w = parent.clientWidth;
        this.$refs.pullF.style = `height:${h}px;width:${w}px`;
      } catch (e) {
        console.log(e);
      }
    },
    touchstart(e) {
      if (!this.pullingDown) return;
      if (this.$refs.pullF.scrollTop > 0) {
        this.disabled = true;
      } else {
        this.transition = "all 0s";
        this.clientY = e.touches[0].clientY;
      }
    },
    touchmove(e) {
      if (!this.pullingDown) return;
      let moveY = e.touches[0].clientY - this.clientY;
      const infoHeight = this.getPullInfoHeight;
      const maxRange = infoHeight * 2;
      if (!this.disabled && moveY >= 0) {
        e.preventDefault();
        this.moveY = moveY;
        this.moveY >= maxRange && (this.moveY = maxRange);
        this.arrowDeg =
          this.moveY < infoHeight
            ? 0
            : this.moveY < maxRange
            ? ((this.moveY - infoHeight) / infoHeight) * 180
            : 180;

        if (this.moveY >= infoHeight) {
          this.state = 2;
        } else {
          this.state = 1;
        }
      }
    },
    touchend() {
      const infoHeight = this.getPullInfoHeight;
      if (this.moveY >= infoHeight) {
        this.moveY = infoHeight;
        this.disabled = true;
        this.refreshing = true;
        this.state = 3;
        this.transition = "all 0.2s";
        this.$emit("refresh");
      } else {
        this.state = 1;
        this.moveY = 0;
        this.disabled = false;
      }
    },
    reset() {
      this.clientY = 0;
      this.moveY = 0;
      this.disabled = false;
      this.refreshing = false;
      this.arrowDeg = 0;
      this.transition = "all 0.2s";
      this.state = 1;
    },
    getOldScrollTop() {
      let scrollTop = localStorage.getItem("vpullScrollTop") || 0;
      return scrollTop;
    },
    // 获取额外需要缓存的数据
    getNeedToCacheExtData(extObj = {}) {
      let cacheList = ["showPullingUp", "upllingUpState", "scrollLock"];
      let obj = {};
      cacheList.forEach(prop => {
        obj[prop] = this[prop];
      });
      Object.assign(obj, extObj);

      return obj;
    },
    // 写入缓存
    saveCache(list = [], extData = {}) {
      let index = this.pageindex || 1;

      try {
        let obj = {
          list,
          listLenth: list.length,
          pageIndex: index,
          ext: {
            ...this.getNeedToCacheExtData(extData)
          }
        };
        console.log("obj", obj);
        obj = JSON.stringify(obj);
        localStorage.setItem("vpullData", obj);
        localStorage.setItem("vpullScrollTop", this.getOldScrollTop());
      } catch (e) {
        console.log("写入缓存出错", e);
      }
    },
    mergeCacheData() {
      let data = localStorage.getItem("vpullData");
      if (data) {
        try {
          data = JSON.parse(data);
          let { list, pageIndex, ext } = data;
          this.$emit("update:list", list);
          Object.assign(this, ext, {
            pageIndex
          });
        } catch (e) {
          console.log("读取缓存出错", e);
        }
      }
    },
    setContainerScrollTop(scrollTop) {
      scrollTop = scrollTop || localStorage.getItem("vpullScrollTop");
      if (scrollTop) {
        this.$nextTick(() => {
            // this.$refs.pullF.scrollTop = `200px`
            this.$refs.pullF.scroll(0,scrollTop)
        });
      }
    }
  },
  watch: {
    list: function(val, oldval) {
      if (this.pullingDown) {
        this.state = 4;
        setTimeout(() => {
          this.reset();
        }, 500);
      }
      if (this.pullingUp) {
        this.scrollLock = this.upllingUpState === 2 ? true : false;
        this.$nextTick(() => {
          this.checkScrollHeight();
        });
      }
      if (this.useCache) {
        
        this.saveCache(val,{
          upllingUpState:1, //重置上拉刷新的状态为待开始，为了解决组件数据被缓存后，外部接口数据更新了
          scrollLock:false  //请求ajax锁重置
        });
        
      }
    }
  },

  computed: {
    tipText() {
      let str = "下拉刷新";
      if (this.state === 1) str = this.pullTip || "下拉刷新";
      if (this.state === 2) str = this.refreshTip || "松开即可刷新";
      if (this.state === 3) str = "刷新中";
      if (this.state === 4) str = "刷新完成";
      return str;
    },
    pullingUpTipText() {
      let str = "";
      if (this.upllingUpState === 1) str = this.refreshTip || "上拉刷新";
      if (this.upllingUpState === 2) str = this.pullingUpFinishText;
      return str;
    }
  },
  beforeDestroy() {
    this.pullF.removeEventListener("scroll", this.scroll);
  }
};
</script>

<style lang='scss' scoped>
.pull-refresh::-webkit-scrollbar {
  /* display: none; */
}
.pull-refresh {
  position: relative;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  .pull-con {
    z-index: 99;
    position: absolute;
    width: 100%;
    background: #fff;
  }
}

.pull-info {
  display: flex;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  font-size:12px;
  z-index: 1;
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  span {
    color: #333333;
    font-size: 14px;
  }
}

.pullingUp-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  background: #fff;
  font-size:12px;
  color: #333;
}
.pullingUp-wrap .img {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}
</style>
