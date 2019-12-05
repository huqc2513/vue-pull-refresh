<template>
  <div class="pull-refresh" ref="pullF">
    <div class="pull-info" :style="{ height: tipHeight }" v-if="!refreshing">
      <img
        :src="refresh_arrowImg"
        :style="{ transform: `rotate(${arrowDeg}deg)`, transition: transition }"
      />
      <span>{{ tipText }}</span>
    </div>
    <div class="pull-info" :style="{ height: tipHeight }" v-else>
      <img v-if="state === 3" :src="loadingImg" />
      <img v-if="state === 4" :src="succImg" />
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
        <img v-if="!pullingUpStaus" class="img" :src="loadingImg" />
        {{ pullingUpTipText }}
      </div>
    </div>
  </div>
</template>

<script>
const getVueCacheData = vue => {
  let cacheList = [
    "showPullingUp",
    "pullingUpStaus",
    "upllingUpState",
    "scrollLock"
  ];
  let obj = {};
  cacheList.forEach(e => {
    obj[e] = vue[e];
  });
  return obj;
};

export default {
  name: "pullRefresh",
  props: {
    list: {
      type: Array,
      default: () => []
    },
    // refreshing: {
    //   type: Boolean,
    //   default: false
    // },
    // onRefresh: {
    //   type: Function,
    //   default: function() {}
    // },
    tipHeight: {
      type: String,
      default: "50px"
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
      default: false
    }
  },
  data() {
    return {
      loadingImg: require("./img/loading.gif"),
      refresh_arrowImg: require("./img/refresh_arrow.png"),
      succImg: require("./img/succ.png"),
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
      pullingUpStaus: false,
      upllingUpState: 1
    };
  },
  mounted() {
    this.setWrapHeight();
    if (this.pullingUp) {
      this.initPullDown();
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
  },
  methods: {
    checkScrollheieght() {
      if (
        this.pullF.scrollHeight > this.pullF.clientHeight &&
        this.pullF.scrollTop != 0
      ) {
        this.showPullingUp = true;
      }
    },
    initPullDown() {
      this.pullF = this.$refs.pullF;
      if (this.pullF) {
        this.checkScrollheieght();
        this.pullF.addEventListener("scroll", this.scroll);
      }
    },
    pullUpLoadFinish() {
      this.upllingUpState = 2;
      this.pullingUpStaus = true;
    },
    scroll(e) {
      if (this.pullingUpStaus) {
        return;
      }
      let scrollTop = this.pullF.scrollTop;
      let scrollH = this.pullF.scrollHeight;
      let clientH = this.pullF.clientHeight;
      if (clientH + scrollTop >= scrollH - 10 && scrollTop != 0) {
        if (this.scrollLock || this.upllingUpState === 2) {
          return;
        }
        this.scrollLock = true;
        this.pageIndex += 1;

        this.$emit("pullUpLoad", this.pageIndex);
      }
    },
    setWrapHeight() {
      try {
        let parent = this.$refs.pullF.parentNode;
        let h = parent.clientHeight;
        this.$refs.pullF.style = `height:${h}px`;
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
        this.$emit("onRefresh");
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
    // 写入缓存
    saveCache(data) {
      let index = this.pageindex || 1;

      let oldData = localStorage.getItem("vpullData");
      oldData = JSON.parse(oldData);

      let { scrollTop } = oldData;
      scrollTop = scrollTop || this.$refs.pullF.scrollTop || 0;

      let that = this;
      try {
        let obj = {
          list: data,
          pageIndex: index,
          scrollTop: scrollTop,
          ext: {
            ...getVueCacheData(that)
          }
        };
        obj = JSON.stringify(obj);
        localStorage.setItem("vpullData", obj);
      } catch (e) {
        console.log("写入缓存出错", e);
      }
    },
    getCacheData() {
      let data = localStorage.getItem("vpullData");
      if (data) {
        try {
          data = JSON.parse(data);
          let { list, pageIndex, scrollTop, ext } = data;
          this.$emit("update:list", list);
          this.pageIndex = pageIndex;
          Object.assign(this, ext);
          this.$nextTick(() => {
            this.$refs.pullF.scrollTop = scrollTop + "px";
            console.log(this.$refs.pullF, scrollTop);
          });
        } catch (e) {
          console.log("读取缓存出错", e);
        }
      }
    }
  },
  watch: {
    list: function(val, oldval) {
      if (this.pullingUp) {
        this.scrollLock = false;
        this.checkScrollheieght();
      }
      if (this.pullingDown) {
        this.state = 4;
        setTimeout(() => {
          this.reset();
        }, 500);
      }
      if (this.useCache) {
        val.length > 0 && this.saveCache(val);
      }
    },
    refreshing: function(nv, ov) {
      if (!nv && ov) {
        this.clientY = 0;
        this.moveY = 0;
        this.disabled = false;
        this.arrowDeg = 0;
        this.transition = "all 0.2s";
      } else if (nv && !ov) {
        this.moveY = this.getPullInfoHeight;
        this.disabled = true;
        this.arrowDeg = 180;
      }
    }
  },
  created() {
    if (this.useCache) {
      this.getCacheData();
    }
  }
};

</script>

<style lang='scss' scoped>
.pull-refresh::-webkit-scrollbar {
  display: none;
}
.pull-con {
  height: 100%;
}
.pull-info {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  width: 100%;
}
.pull-info img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.pull-info span {
  color: #333333;
  font-size: 14px;
}

.pullingUp-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  background: #fff;
}
.pullingUp-wrap .img {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}
</style>
