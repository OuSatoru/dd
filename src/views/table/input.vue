<template>
  <div class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.examID" placeholder="考试名" @change="filterClass">
        <el-option v-for="exam in exams" :key="exam.id" :value="exam.id" :label="exam.examName" />
      </el-select>
      <el-select v-model="listQuery.classNum" placeholder="班级名">
        <el-option v-for="cl in filteredClasses" :key="cl.id" :value="cl.id" :label="cl.className" />
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
      @sort-change="sortChange"
    >
      <el-table-column label="学号" prop="stuNum" sortable="custom" align="center" width="150px" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.stuNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="stuName" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" prop="className" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考试名" prop="examName" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学科" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subjName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分数" min-width="180px">
        <template slot-scope="{row}">
          <template v-if="!row.edit">
            <el-input v-model.number="row.score" type="number" min="0.0" max="100.0" step="0.1" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            />
            <el-button
              class="confirm-btn"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            />
          </template>
          <span v-else>{{ row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缺席标志" width="110px" align="center">
        <template slot-scope="scope">
          <el-select v-model.number="scope.row.leaveFlag">
            <el-option v-for="item in lflags" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { createUser, updateUser } from '@/api/userManage'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { scoreList } from '../../api/input'
import axios from 'axios'
import { getClasses, getExams } from '../../api/examAdd'

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
      exams: null,
      classes: null,
      filteredClasses: null,
      selectedClass: null,
      total: 0,
      listLoading: false,
      listQuery: {
        classNum: undefined,
        examID: undefined
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
    this.getExam()
    this.getClazz()
  },
  methods: {
    getList() {
      this.listLoading = true
      scoreList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.list.map(l => {
          l.originalScore = l.score
          return l
        })

        // console.log(this.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getExam() {
      getExams().then(response => {
        this.exams = response.data
      })
    },
    getClazz() {
      getClasses().then(response => {
        this.classes = response.data
      })
    },
    filterClass() {
      const classIDs = JSON.parse(this.exams.filter(e => { return e.id === this.listQuery.examID })[0].classes)
      this.filteredClasses = this.classes.filter(c => { return classIDs.indexOf(c.id) >= 0 })
    },
    handleFilter() {
      this.getList()
    },
    checkCanEdit(row) {
      if (row.score || row.score === 0) {
        row.edit = true
      }
      console.log(row.edit)
    },
    cancelEdit(row) {
      row.score = row.originalScore
      row.edit = true
      this.$message({
        message: '未改变成绩值',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.originalScore = row.score
      // updateStatOne(row).then(response => {
      //   row.edit = true
      //   this.$message({
      //     message: '更新成功',
      //     type: 'success'
      //   })
      // })
      axios.post('http://127.0.0.1:8080/mock/input/updateOne', row).then(resp => {
        console.log(resp)
      })
      console.log(this.list)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
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
