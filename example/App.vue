<template>
  <div>
    <Example />
  </div>
</template>

<script>
import Example from './Example.vue'

export default {
    name: 'App',
    components: {
        Example
    }
}
</script>

<style  lang='scss'>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #eeeeee;
}
</style>
