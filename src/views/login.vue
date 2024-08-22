<template>
  <div>
    <van-sticky>
      <van-nav-bar title="登录" left-arrow @click-left="onClickLeft" />
    </van-sticky>
    <div class="login">
      <img src="../assets/img/login/login.png" alt="">
      <van-form>
        <van-cell-group inset>
          <van-field v-model="username" left-icon="phone-o" name="username" placeholder="手机号码"
            :rules="[{ required: true, message: '请填写用户名' }]" />
          <van-field v-model="password" left-icon="manager-o" type="password" name="password" placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]" />
        </van-cell-group>
        <div style="margin: 25px">
          <van-button round block type="primary" native-type="submit" @click="login">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
    <div class="find">
      <a @click="jump('/register')" style="color: blue;">注册新用户 </a>
      <a @click="jump('/pass')" style="color: blue;">找回密码</a>
    </div>
    <div class="ways">
      <span>其他登录方式</span>
      <div>
        <span class="iconfont" @click="jump('/threeLogin')">&#xe600;</span>
        <span class="iconfont" @click="jump('/threeLogin')">&#xe882;</span>
        <span class="iconfont" @click="jump('/threeLogin')">&#xe643;</span>
      </div>
    </div>
    <div style="text-align: center;font-size: 13px">
      <p>登陆即表示您同意<span><a href="#">《平价洗车用户隐私协议》</a> </span></p>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import '../assets/img/iconfont/iconfont.css';
import axios from "axios";

export default {
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      username: 'admin',
      password: '123456',
    }
  },
  beforeRouteLeave(to, from, next) {
    // 在离开当前路由前保存 redirect 信息
    sessionStorage.setItem("redirect", to.query.redirect || "/home");
    next();
  },
  methods: {
    login() {
      axios.post("http://172.16.7.55:7011/sso/login?username=" + this.username + "&password=" + this.password).then((res => {
        console.log(res.data);
        if (res.data.code === 200) {
          sessionStorage.setItem("token", res.data.data.token);
          sessionStorage.setItem("user", JSON.stringify(res.data.data.user));
          sessionStorage.setItem("role", JSON.stringify(res.data.data.role));
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          const redirect = sessionStorage.getItem("redirect") || "/index"
          this.$router.push("/index");
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      }));
    },
    //跳转页面的方法
    jump(uri) {
      this.$router.push({ path: uri, query: { redirect: this.$route.query.redirect } });
    },
  }
}
</script>
<style scoped>
.login {
  width: 100%;
  margin-top: 22.6667vw;
}

.login img {
  margin-left: 50vw;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  transform: translate(-50%, 0);
}

.find {
  display: flex;
  width: 70%;
  margin: 0 auto;
  justify-content: space-between;
}

.find span {
  color: #0079fe;
}

.ways {
  width: 80%;
  margin: 7.6667vw auto;
  text-align: center;
}

.ways>span {
  display: block;
  margin-bottom: 5.3333vw;
  color: #999999;
}

.ways div {
  display: flex;
  width: 80%;
  margin: 0 auto;
  justify-content: space-around;
}

.ways div span {
  font-size: 8.3333vw;
}
</style>