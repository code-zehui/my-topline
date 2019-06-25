<template>
  <el-container>
    <el-aside width="200px">
      <app-aside/>
    </el-aside>
    <el-container>
      <el-header>
        <app-header/>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppAside from './components/AppAside'
export default {
  name: 'AppLayout',
  data() {
    return {}
  },
  components: {
    AppHeader,
    AppAside
  }
}
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
    .el-header {
      line-height: 60px;
      .grid-content {
        text-align: left;
      }
      
    }
    .el-main {
        background: #f2f3f5;
      }
    .el-aside {
      height: 100%;
      background: #2e2f32;
      text-align: center;
    }
  }
</style>
