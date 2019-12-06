<template>
  <div class="box">
    <pull-refresh
      :list.sync="list"
      ref="scroll"
      @refresh="onRefresh"
      @loadmore="pullUpLoad"
    >
      <div class="list">
        <ul>
          <li v-for="(n, i) in list" :key="i">{{ n }}</li>
        </ul>
      </div>
    </pull-refresh>
  </div>
</template>

<script>
// import pullRefresh from "v-pull-refresh";

export default {
  data() {
    return {
      list: [1, 2, 3, 4, 5]
    };
  },
  methods: {
    onRefresh() {
      let arr = [],
        len = this.list.length;
      for (let i = len; i < len + 10; i++) {
        arr.push(i);
      }
      setTimeout(() => {
        this.list = this.list.concat(arr);
      }, 1000);
    },
    pullUpLoad(i) {
      console.log("加载pageIndex", i);
      if (i >= 4) {
        this.$refs.scroll && this.$refs.scroll.pullUpLoadFinish();
        return;
      }
      let arr = [],
        len = this.list.length;
      for (let i = len; i < len + 10; i++) {
        arr.push(i);
      }
      setTimeout(() => {
        this.list = this.list.concat(arr);
      }, 1000);
    }
  },
  components: {
    //  pullRefresh
  }
};
</script>

<style lang='scss' scoped>
.list {
  width: 100%;
  background-color: white;
  overflow: hidden;
  li {
    display: flex;
    align-items: center;
    margin: 10px 0;
    justify-content: center;
  }
}

.box {
  width: 330px;
  margin: 0 auto;
  height: 400px;
  border: 1px solid black;
}
</style>
