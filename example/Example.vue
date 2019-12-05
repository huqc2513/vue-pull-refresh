<template>
  <div style='height:400px;border:1px solid red;'>
    <pull-refresh :list.sync="list"
                  ref="scroll"
                  @onRefresh="onRefresh"
                  pull-height="400px"
                  @pullUpLoad="pullUpLoad">
      <div class="list">
        <ul>
          <li v-for="(n, i) in list"
              :key="i">{{ n }}</li>
        </ul>
      </div>
    </pull-refresh>
  </div>
</template>

<script>
export default {
  name: "Example",
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
      console.log("加载", i);
      if (i >= 3) {
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
    },
    open() {
      this.isRefreshing = true;
      setTimeout(() => {
        this.isRefreshing = false;
      }, 1000);
    }
  },
  components: {
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
</style>
