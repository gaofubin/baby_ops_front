<template>
  <div class="app-container">
    <!--卡片视图区域-->
    <el-card>
      <!--搜索及添加区域-->
      <el-row :gutter="20" class="head-container">
        <el-col :span="6">
          <el-input v-model="queryInfo.search" placeholder="请输入内容" size="small" clearable @clear="getUserList" @change="getUserList" @input="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList" />
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="small" @click="userAddDialogVisible = true">添加</el-button>
        </el-col>
      </el-row>

      <!--表格区域-->
      <el-table :data="userInfo" size="small" border style="width: 100%">
        <el-table-column type="index" label="序号" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="real_name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="is_active" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_active" @change="userStateChanged(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit" @click="showUserEditId(scope.row.id)" />
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteUserId(scope.row.id)" />
            <el-button type="warning" size="small" icon="el-icon-setting" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        :current-page="queryInfo.page"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
        class="footer-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!--添加用户对话框-->
    <el-dialog title="添加用户" :visible.sync="userAddDialogVisible" width="50%" @close="userAddDialogClosed">
      <!--内容主体区域-->
      <el-form ref="userAddFormRef" :model="userAddForm" :rules="userAddFormRule" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userAddForm.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="real_name">
          <el-input v-model="userAddForm.real_name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userAddForm.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userAddForm.password" />
        </el-form-item>
        <el-form-item label="状态" prop="is_active">
          <el-switch v-model="userAddForm.is_active" />
        </el-form-item>
      </el-form>
      <!--内容底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="userAddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userAddSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改用户对话框-->
    <el-dialog title="修改用户" :visible.sync="userEditDialogVisible" width="50%" @close="userEditDialogClosed">
      <!--内容主体区域-->
      <el-form ref="userEditFormRef" :model="userEditForm" :rules="userEditFormRule" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userEditForm.username" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="real_name">
          <el-input v-model="userEditForm.real_name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userEditForm.email" />
        </el-form-item>
        <el-form-item label="状态" prop="is_active">
          <el-switch v-model="userEditForm.is_active" />
        </el-form-item>
      </el-form>
      <!--内容底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="userEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userEditSubmit">确 定</el-button>
      </span>

    </el-dialog></div>
</template>

<script>
import { UserList, modifyUserState, UserAdd, UserEdit, ShowEditId, UserDel } from '@/api/user'
export default {
  data() {
    return {
      userInfo: [],
      count: 0,
      queryInfo: {
        search: '',
        page: 1,
        size: 10
      },
      // 控制添加对话框显示与隐藏
      userAddDialogVisible: false,
      // 控制修改对话框显示与隐藏
      userEditDialogVisible: false,
      // 添加用户表单数据
      userAddForm: {
        username: '',
        password: '',
        email: '',
        real_name: '',
        is_active: false
      },
      // 修改用户表单数据
      userEditForm: {},
      // 添加表单的验证规则
      userAddFormRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        real_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        is_active: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 修改表单的验证规则
      userEditFormRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        real_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        is_active: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户信息
    getUserList() {
      UserList(this.queryInfo).then(response => {
        this.userInfo = response.detail.results
        this.count = response.detail.count
      })
    },
    // 初始化页面大小，每页显示几条数据
    handleSizeChange(newSize) {
      this.queryInfo.size = newSize
      this.getUserList()
    },
    // 初始化页数，默认显示第几页
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getUserList()
    },
    // 监听switch状态的改变
    userStateChanged(userinfo) {
      modifyUserState(userinfo.id, userinfo).then(res => {
        if (res.code !== 200) {
          userinfo.is_active = !userinfo.is_active
          return this.$message.error('更新用户状态失败')
        } else {
          return this.$message.success('更新用户状态成功')
        }
      })
    },
    // 添加用户表单关闭后重置操作
    userAddDialogClosed() {
      this.$refs.userAddFormRef.resetFields()
    },
    // 修改用户表单关闭后重置操作
    userEditDialogClosed() {
      this.$refs.userEditFormRef.resetFields()
    },
    // 添加用户提交操作
    userAddSubmit() {
      this.$refs.userAddFormRef.validate(valid => {
        // 如果表单验证不通过直接return
        if (!valid) return
        // 如果表单验证通过，则发起添加用户请求
        UserAdd(this.userAddForm).then(res => {
          if (res.code === 201) {
            this.userAddDialogVisible = false
            this.getUserList()
            return this.$message.success('添加用户成功')
          } else {
            return this.$message.error('添加用户失败')
          }
        })
      })
    },
    showUserEditId(id) {
      this.userEditDialogVisible = true
      ShowEditId(id).then(res => {
        this.userEditForm = res
      })
    },
    userEditSubmit() {
      this.$refs.userEditFormRef.validate(valid => {
        // 如果表单验证不通过直接return
        if (!valid) return
        // 如果表单验证通过，则发起修改用户请求
        UserEdit(this.userEditForm.id, this.userEditForm).then(res => {
          if (res.code === 200) {
            this.userEditDialogVisible = false
            this.getUserList()
            return this.$message.success('修改用户成功')
          } else {
            return this.$message.error('修改用户失败')
          }
        })
      })
    },
    // 删除用户函数
    async deleteUserId(id) {
      // 提示用户是否真正删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)
      // 用户点击确定，返回字符串comfirm，点击取消返回cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      UserDel(id).then(res => {
        if (res.code !== 200) {
          return this.$message.error('用户删除失败')
        }

        this.$message.success('用户已删除')
        this.getUserList()
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
