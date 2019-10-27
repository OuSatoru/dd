<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.login" placeholder="登录名" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
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
      <el-table-column label="登录名" prop="login" sortable="custom" align="center" width="150px" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          <span>{{ scope.row.login }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学科" prop="subjectName" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" prop="class_name" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.className }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.levelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人员" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!=='draft'" size="mini" @click="handleResetPwd(row)">
            重置密码
          </el-button>
          <el-button v-if="row.status!=='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="login">
          <el-input v-model="temp.login" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="科目" prop="subject">
          <el-select v-model="temp.subject" class="filter-item" placeholder="请选择科目">
            <el-option v-for="item in subjects" :key="item.id" :label="item.subjName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级" prop="classNum">
          <el-select v-model="temp.classNum" class="filter-item" placeholder="请选择班级">
            <el-option v-for="item in classes" :key="item.id" :label="item.className" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="level">
          <el-select v-model="temp.level" class="filter-item" placeholder="请选择角色">
            <el-option v-for="item in levels" :key="item.id" :label="item.levelName" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getTokenUser } from '../../utils/auth'
import { levelLabelNum, levelsMap } from '../../utils/idMap'
import { resetPassword } from '../../api/user'
import { calcPwd } from '../../utils/crypt'
import { fetchUsers, createUser, updateUser, deleteUser } from '../../api/userManage'
import { getClasses, getSubjects } from '../../api/examAdd'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        type: undefined,
        login: undefined,
        name: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        login: undefined,
        name: undefined,
        password: calcPwd('123456'),
        subject: undefined,
        classNum: undefined,
        level: undefined,
        createTime: new Date().toISOString(),
        createUser: getTokenUser()
      },
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
      downloadLoading: false,
      subjects: [],
      grades: ['一', '二', '三', '四', '五', '六'],
      classes: [],
      levels: []
    }
  },
  created() {
    this.listQuery.type = levelLabelNum(location.href.split('/')[location.href.split('/').length - 1])
    this.getList()
    this.getSubject()
    this.getClass()
    this.levels = levelsMap()
  },
  methods: {
    getSubject() {
      getSubjects().then(response => {
        this.subjects = response.data
        this.subjects.unshift({ id: null, subjName: '无' })
      })
      // console.log(this.subjects)
    },
    getClass() {
      this.grades.forEach(grade => {
        getClasses(grade).then(response => {
          this.classes.push(...response.data)
        })
      })
      this.classes.unshift({ id: null, className: '无' })
    },
    getList() {
      this.listLoading = true
      fetchUsers(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        console.log(this.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
        login: undefined,
        name: undefined,
        password: calcPwd('123456'),
        subject: undefined,
        classNum: undefined,
        level: undefined,
        createTime: new Date().toISOString(),
        createUser: getTokenUser()
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
          console.log(this.temp)
          createUser(this.temp).then(() => {
            this.getList()
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
      this.resetTemp()
      this.temp.login = row.login
      this.temp.name = row.name
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
          tempData.createTime = new Date().toISOString()
          updateUser(tempData).then(() => {
            this.getList()
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
      if (row.login === 'admin') {
        this.$message('不能删除admin用户')
        return
      }
      deleteUser({ loginID: row.login }).then(response => {
        this.$notify({
          title: '成功',
          message: response.message,
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleResetPwd(row) {
      resetPassword({ loginID: row.login, nPassword: calcPwd('123456') }).then(response => {
        this.$message(response.message)
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['登录名', '姓名', '学科', '班级', '角色', '创建时间', '创建人员']
          const filterVal = ['login', 'name', 'subjectName', 'className', 'levelName', 'createTime', 'createUser']
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
