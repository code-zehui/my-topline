<template>
  <el-row>
    <el-col :span="16">
      <div class="grid-content bg-purple">江苏传智播客教育科技股份有限公司</div>
    </el-col>
    <el-col :span="8" class="header-right">
      <div class="grid-content bg-purple">
        <el-dropdown trigger="click" class="el-dropdown-link">
          <span>
            <img :src="userInfo.photo" alt>
            {{ userInfo.name}}
            <i class="el-submenu__icon-arrow el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item @click.native="handleLogout">
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>
<script>
// const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
import { getUser, removeUser } from '@/utils/auth'
const userInfo = getUser();
export default {
  data () {
    return {
      userInfo
    }
  },
  methods: {
    handleLogout () {
      this.$confirm('确定要退出系统吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUser()
        this.$message({
          type: 'success',
          message: '成功退出!'
        })
        this.$router.push({name: 'login'})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })       
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  text-align: left;
  line-height: 36px;
  height: 36px;
  padding-top: 12px;
  .header-right {
    text-align: right;
    img {
      width: 36px;
      vertical-align: middle;
    }
    .el-submenu__icon-arrow {
      position: relative;
      top: 50%;
      right: 0;
      margin-top: -7px;
      -webkit-transition: -webkit-transform 0.3s;
      transition: -webkit-transform 0.3s;
      transition: transform 0.3s;
      transition: transform 0.3s, -webkit-transform 0.3s;
      transition: transform 0.3s, -webkit-transform 0.3s;
      font-size: 12px;
    }
  }
}
</style>


