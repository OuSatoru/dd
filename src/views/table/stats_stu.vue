<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.student" placeholder="学生">
        <el-option v-for="student in students" :key="student.stuid" :value="student.stuid" :label="student.stuName" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        提交
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="考试名" prop="examName" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在班级" prop="className" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学科" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subjName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分数" min-width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缺席标志" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.leaveflag }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { examStuList, getStudents } from '../../api/stat'

export default {
  name: 'ComplexTable',
  // components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      students: null,
      total: 0,
      listLoading: false,
      listQuery: {
        student: undefined
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      lflags: [{ value: 0, label: '未缺席' }, { value: 1, label: '缺席' }],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getStu()
  },
  methods: {
    getList() {
      this.listLoading = true
      examStuList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    getStu() {
      getStudents().then(response => {
        this.students = response.data
      })
    },
    handleFilter() {
      this.getList()
    },
    fix2(num) {
      return num.toFixed(2)
    },
    percentage(num) {
      const str = (num * 100).toFixed(2)
      return str + '%'
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .confirm-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .cancel-btn {
    position: absolute;
    right: 62px;
    top: 10px;
  }
</style>
