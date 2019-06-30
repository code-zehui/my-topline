<template>
  <div class="home">
    <div class="form-body">
      <div class="form-head">
        <img src="@/assets/logo_index.png" alt>
      </div>
      <el-form :model="homeForm" class="home-form" :rules="rules" ref="homeForm">
        <el-form-item prop="mobile">
          <el-input v-model="homeForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-col :span="14">
            <el-input v-model="homeForm.code" placeholder="验证码"></el-input>
          </el-col>
          <el-col :span="9">
            <el-button type="primary" @click="handleSubmit" :disabled="!!codeTimer">{{ codeTimer ? `剩余${codeSeconds}秒` : '发送验证码'}}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox class="agree-checkbox" v-model="homeForm.agree"></el-checkbox>
          <span class="agree-text">
            我已阅读并同意
            <a href="#">用户协议</a>和
            <a href="#">隐私条款</a>
          </span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="btn-login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveUser } from '@/utils/auth'
const codeTimes = 60
export default {
  name: 'login',
  data () {
    return {
      homeForm: {
        mobile: '15010155243',
        code: '246810',
        agree: true
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /\d{11}/, message: '请输入有效的手机号码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /\d{6}/, message: '验证码长度错误', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请阅读并签订协议' },
          { pattern: /true/, message: '请阅读并签订协议' }
        ]
      },
      codeSeconds: codeTimes,
      codeTimer: null
    }
  },

  methods: {
    handleSubmit () {
      const { mobile } = this.homeForm
      this.$refs.homeForm.validateField('mobile', valid => {
        if (valid) {
          return false
        }
        this.$http({
          method: 'GET',
          url: `/captchas/${mobile}`
        }).then(res => {
          const data = res
          window.initGeetest(
            {
              gt: data.gt,
              challenge: data.challenge,
              offline: !data.success,
              new_captcha: data.new_captcha,
              product: 'bind'
            },
            captchaObj => {
              captchaObj
                .onReady(() => {
                  captchaObj.verify()
                }).onSuccess(() => {
                  this.codeCountDown()
                  const {
                    geetest_challenge: challenge,
                    geetest_validate: validate,
                    geetest_seccode: seccode
                  } = captchaObj.getValidate()
                  this.$http({
                    method: 'GET',
                    url: `/sms/codes/${mobile}`,
                    params: {
                      challenge,
                      validate,
                      seccode
                    }
                  }).then(res => {
                    console.log(res)
                  })
                }).onError(() => {})
            }
          )
        })
      })
    },
    handleLogin () {
      this.$refs['homeForm'].validate(valid => {
        if (!valid) {
          return false
        }
      })

      this.$http({
        method: 'POST',
        url: '/authorizations',
        ContentType: 'application/json',
        data: this.homeForm
      }).then(res => {
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
        saveUser(res)
        this.$router.push('/')
      }).catch(() => {
        this.$message.error('登录失败，手机号或验证码错误')
      })
    },
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeSeconds--
        if (this.codeSeconds === 0) {
          window.clearInterval(this.codeTimer)
          this.codeTimer = null
          this.codeSeconds = codeTimes
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  background: url("./assets/index-bg.jpg");
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  .form-head {
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 200px;
    }
  }
  .form-body {
    width: 400px;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    .agree-checkbox {
      margin-right: 20px;
    }
    .agree-text {
      font-size: 16px;
      color: #999;
      a {
        color: #409eff;
        text-decoration: none;
      }
    }
    .btn-login {
      width: 200px;
    }
  }
}
</style>
