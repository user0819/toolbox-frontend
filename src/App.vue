<template>
  <div id="app">
    <WebsiteList />
  </div>
</template>

<script>
import WebsiteList from './components/WebsiteList.vue';

export default {
  name: 'App',
  components: {
    WebsiteList
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>