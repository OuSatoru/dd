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
        <el-select v-model="form.grade" placeholder="请选择考试科目" @change="getClass">
          <el-option v-for="grad in grades" :key="grad" :label="grad" :value="grad" />
        </el-select>
      </el-form-item>
      <el-form-item label="考试班级">
        <el-select v-model="form.selectedClasses" placeholder="请选择考试科目" @change="form.classes = JSON.stringify(form.selectedClasses)">
          <el-option v-for="cla in classes" :key="cla.id" :label="cla.className" :value="cla.id" />
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
import { getClasses, getSubjects } from '../../api/examAdd'

export default {
  data() {
    return {
      subjects: [],
      grades: ['一', '二', '三', '四', '五', '六'],
      classes: [],
      selectedClasses: [],
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
    getClass() {
      getClasses(this.form.grade).then(response => {
        this.classes = response.data
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

