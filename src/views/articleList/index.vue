<template>
  <div>
    <el-card>
      <div>
        <span>数据筛选</span>
      </div>
      <el-form ref="form" :model="filterParams" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="filterParams.status" @change="handleStatuChange">
            <el-radio label="">全部</el-radio>
            <el-radio
            v-for="(item, index) in statuTypes"
            :label="index"
            :key="item.label"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <article-channel v-model="filterParams.channel_id" @input="handleFilterChange(filterParams.channel_id)"></article-channel>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
            v-model="range_date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <div>
        <span>一共有<strong>{{ totalCount }}</strong>条数据</span>
      </div>

      <el-table
        :data="articles"
        stripe
        style="width: 100%">
        <el-table-column
          label="封面"
          width="180">
          <template slot-scope="scope">
            <img
            width="20"
            v-for="(item, index) in scope.row.cover.images"
            :key="index"
            :src="item" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-tag :type="statuTypes[scope.row.status].type">
              {{ statuTypes[scope.row.status].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="$router.push(`/publish/${scope.row.id}`)">修改</el-button>
            <el-button size="mini" type="danger" @click="handelDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        :current-page="page"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalCount"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [],
      statuTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      filterParams: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: ''
      },
      range_date: ''
    }
  },
  components: {
    ArticleChannel
  },
  created () {
    this.loadArtList()
  },
  methods: {
    async loadArtList () {
      const filterData = {}
      for (let key in this.filterParams) {
        const item = this.filterParams[key]
        if (item !== null && item !== undefined && item !== '') {
          filterData[key] = item
        }
      }

      const data = await this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page: this.page,
          per_page: this.pageSize,
          ...filterData
        }
      })
      this.articles = data.results
      this.totalCount = data.total_count
    },

    async handleCurrentChange (page) {
      this.page = page
      this.loadArtList()
    },

    handleDateChange (value) {
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
      this.page = 1
      this.loadArtList()
    },

    handleStatuChange () {
      this.page = 1
      this.loadArtList()
    },

    handleFilterChange (e) {
      this.channel_id = e
      this.page = 1
      this.loadArtList()
    },

    async handelDelete (item) {
      try {
        await this.$confirm('此操作将永久删除该文件，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await this.$http({
          method: 'DELETE',
          url: `/articles/${item.id}`
        })

        this.$message({
          type: 'success',
          message: '删除成功'
        })

        this.loadArtList()
      } catch (err) {
        if (err === 'cancel') {
          return this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
        this.$message.error('删除失败！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .el-table {
    margin-bottom: 20px;
  }
</style>
