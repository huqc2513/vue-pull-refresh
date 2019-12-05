# v-pull-refresh

基于 vue 封装的轻量级上下拉刷新组件

#### 如何使用

```js
 npm install v-pull-refresh

 //main.js
 import pullRefresh from 'v-pull-refresh'
 Vue.use(pullRefresh)


```

#### 示例

使用`pull-refresh`组件的外层父容器，必须要指定高度，使其内部子元素继承，子元素高度超出才能进行上拉滚动加载

```js
<template>
  <div style='height:400px;border:1px solid red;'>
    <pull-refresh :refreshing="isRefreshing" :on-refresh="onRefresh" >
      <div class="list">
            <ul>
              <li v-for="(n, i) in list"
                  >{{ n }}
              </li>
            </ul>
      </div>
    </pull-refresh>
  <div>
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
    }
  }


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
```

注意：

只要改变了 list 的长度，组件内会 watch 监听 list 变化，将刷新状态重置

#### API

:list.sync="list"
ref="scroll"
@onRefresh="onRefresh"
@pullUpLoad="pullUpLoad"

| 属性       | 说明             | 类型    | 默认值         | 描述                                                         |
| ---------- | ---------------- | ------- | -------------- | ------------------------------------------------------------ |
| list       | 数组列表         | array   | `[]`           |
| pullTip    | 下拉时的提示文字 | string  | `下拉即可刷新` |
| refreshTip | 刷新中的提示文字 | string  | `正在刷新`     |
| usecache   | 是否开启缓存     | Boolean | false          | `开启缓存后，会将list数据以及刷新状态，滚动条高度等进行缓存` |

| 事件方法   | 说明                       | 参数                 |
| ---------- | -------------------------- | -------------------- |
| onRefresh  | 下拉刷新成功后，触发此事件 | `无`                 |
| pullUpLoad | 上拉刷新成功后，触发此事件 | `pageIndex` (nubmer) |

#### 其他

具体用例可查看 example 文件夹内使用方法
