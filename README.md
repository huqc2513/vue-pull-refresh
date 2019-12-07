# v-pull-refresh

基于 vue 封装的轻量级上下拉刷新组件

## 实现功能

- 上拉刷新
- 下拉刷新
- 缓存列表数据，缓存scrollTop高度

## 在线demo

[点击查看,请使用浏览器手机模拟器模式](https://huqc.gitee.io/vue-pull/)


## 如何使用

```js
 npm install v-pull-refresh

 //main.js
 import pullRefresh from 'v-pull-refresh'
 Vue.use(pullRefresh)


```

## 代码示例

```js
<template>
  <div style='height:400px;border:1px solid black;'>
    <pull-refresh
                  :list.sync="list"
                  ref="scroll"
                  @refresh="onRefresh"
                  @loadmore="loadmore"
    >
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
    loadmore(pageindex) {
      console.log("加载pageindex", pageindex);
      if (i >= 3) {
        //数据上拉加载完成后，显示调用此方法后，滚动到底部将不会再派发
        this.$refs.scroll && this.$refs.scroll.forceUpdate();
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

**使用`pull-refresh`组件的外层父容器，必须要指定高度，使其内部子元素继承，子元素高度超出才能进行上拉滚动加载**


>在使用上拉刷新时，只要改变了 list 的长度，组件内会 watch 监听 list 变化，将刷新状态重置,在上拉刷新后若无数据需要显式调用组件的`forceUpdate`方法通知组件内部

## prop

| 属性       | 说明             | 类型    | 默认值         | 描述                                                                 |
| ---------- | ---------------- | ------- | -------------- | -------------------------------------------------------------------- |
| list       | 数组列表         | array   |    []         |   `异步的数据列表，内部` |
| pullTip    | 下拉时的提示文字 | string   | `下拉即可刷新` |
| pullingUp  | 是否开启上拉刷新 | Boolean  |  true         |
| pullingDown| 是否开启下拉刷新 | Boolean  |  true         |
| refreshTip | 刷新中的提示文字 | string   |   `正在刷新`   |
| useCache   | 是否开启缓存     | Boolean  |     true    | `开启缓存后，会将list数据以及刷新状态，滚动条高度等进行缓存，使得列表组件滚动条高度保留` |



 
>注意：开启useCache后，需要在使用时为list属性添加.sync修饰符，如上面例子中`:list.sync="list"`，这是为了组件内部更好的将缓存数据填充到父组件中 

  



## emit-event

| 事件方法   | 说明                       | 参数                 |
| ---------- | -------------------------- | -------------------- |
| refresh  | 下拉刷新成功后，触发此事件 | `无`                 |
| loadmore | 上拉刷新成功后，触发此事件 | `pageIndex` (nubmer) |

## 实例事件

| 事件方法   | 说明                       |
| ----------   | ----------------------- |
| forceUpdate  | `上拉刷新成功后，如list数组没有数据，应调用此方法，组件将不再派发滚动到底部事件`  |


## 其他

具体用例可查看 example 文件夹内使用方法
