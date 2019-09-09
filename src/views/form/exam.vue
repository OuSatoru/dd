<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="考试名称">
        <el-input v-model="form.examName" />
      </el-form-item>
      <el-form-item label="创建人">
        <el-input v-model="form.createUser" disabled="disabled" />
      </el-form-item>
      <el-form-item label="考试科目">
        <el-select v-model="form.subject" placeholder="请选择考试科目">
          <el-option v-for="subj in subjects" :key="subj.id" :label="subj.subjName" :value="subj.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="考试年级">
        <el-select v-model="form.grade" placeholder="请选择考试科目">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="考试班级">
        <el-select v-model="form.classes" placeholder="请选择考试科目">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getTokenUser } from '../../utils/auth'
import { getSubjects } from '../../api/examAdd'

export default {
  data() {
    return {
      subjects: [],
      grades: [],
      form: {
        examName: '',
        createUser: getTokenUser(),
        subject: '',
        grade: '',
        classes: ''
      }
    }
  },
  created() {
    this.getSubject()
  },
  methods: {
    getSubject() {
      getSubjects().then(response => {
        this.subjects = response.data
      })
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
    .line{
        text-align: center;
    }
</style>

