<style scoped>
/* 样式调整 */
.message {
  display: flex;
  align-items: center;
  margin: 10px 0;
  padding: 0 15px;
}

.message-content {
  max-width: 70%;
  padding: 12px 18px;
  border-radius: 25px;
  position: relative;
  font-size: 16px;
  line-height: 1.5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-content.assistant {
  background-color: #e1f5fe;
  color: #1a7b0c;
  text-align: left;
  margin-right: auto;
}

.message-content.user {
  background-color: #f3f3f3;
  color: #6885e6;
  text-align: right;
  margin-left: auto;
}

.message-content::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  top: 50%;
  transform: translateY(-50%);
}

.message-content.assistant::before {
  left: -10px;
  border-width: 5px 10px 5px 0;
  border-color: transparent #e1f5fe transparent transparent;
}

.message-content.user::before {
  right: -10px;
  border-width: 5px 0 5px 10px;
  border-color: transparent transparent transparent #f3f3f3;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-enter-active,
.message-leave-active {
  transition: all 0.5s ease;
}

.message-enter,
.message-leave-to

/* .message-leave-active in <2.1.8 */
  {
  opacity: 0;
  transform: translateY(10px);
}

/* 响应式设计 */
@media (max-width: 600px) {
  .message-content {
    padding: 8px 10px;
  }
}

/* 输入框和按钮 */
.input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 56px;
  /* Tabbar 高度 */
  left: 0;
  right: 0;
  z-index: 1000;
  /* 确保输入框在 Tabbar 上方 */
}

.van-field {
  flex: 1;
  margin-right: 10px;
  border: none;
  border-radius: 20px;
  padding: 10px 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.van-button {
  flex-shrink: 0;
  border-radius: 20px;
  padding: 10px 15px;
}

/* 导航栏 */
.van-nav-bar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Tabbar */
.van-tabbar {
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div>
    <!-- 粘性布局 -->
    <van-sticky>
      <!-- 导航栏 -->
      <van-nav-bar title="客服" left-arrow @click-left="jump('/home')" />
    </van-sticky>
    <div style="margin: 0px; padding-bottom: 90px">
      <div class="message" v-for="item in msgList" :key="item.id" :class="{ 'message-enter-active': item.entering }">
        <div class="message-content assistant" v-if="item.chatName === 'assistant'">
          <span>{{ item.chatMsg }}</span>
        </div>
        <div class="message-content user" v-else>
          <span>{{ item.chatMsg }}</span>
        </div>
      </div>
    </div>
    <div class="input-container">
      <van-cell-group>
        <van-field v-model="msg" placeholder="请输入消息" @keydown.enter.prevent="goMsg" />
      </van-cell-group>
      <van-button type="primary" @click="goMsg()">发送</van-button>
    </div>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="chat" dot>客服</van-tabbar-item>
      <van-tabbar-item icon="shop" info="5" @click="jump('/storeMsg')">商家</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import axios from "axios";
import { Toast } from "vant";

export default {
  data() {
    return {
      msgList: [],
      msg: "",
      active: 0,
      user: {},
    };
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.getMsg();
  },
  mounted() {
    this.msgList.forEach(item => {
      this.$nextTick(() => {
        item.entering = true;
      });
    });
  },
  methods: {
    fakeMsg() {
      this.msgList.push({
        chatName: "assistant",
        chatMsg: "你好,我是洗车App智能客服,请问有什么需要为您服务的吗?",
      });
    },

    getMsg() {
      this.$axios.get(`/chat/chatAis/${this.user.phone}/${this.user.userId}`).then(resp => {
        if (resp.data.code == 200) {
          this.msgList = resp.data.data;
        } else {
          Toast("发送失败");
        }
      });
    },
    goMsg() {
      if (this.msg.trim()) { // 检查消息是否为空
        var msg = this.msg;
        this.msg = ""; // 清空输入框
        this.msgList.push({
          chatName: "user",
          chatMsg: msg,
        });
        this.$axios.get(`/chat/chatAi/${this.user.phone}/${this.user.userId}/${msg}`).then(resp => {
          this.msg = "";
          if (resp.data.code == 200) {
            // 确保接收到的数据正确打印
            console.log('Received response:', resp.data.data.chatMsg);
            this.msgList.push({
              chatName: "assistant",
              chatMsg: resp.data.data.chatMsg,
            });
          } else {
            Toast("发送失败");
          }
        });
      } else {
        Toast("消息不能为空");
      }
    },
    // 跳转页面的方法保持不变
    jump(url) {
      this.$router.push({
        path: url,
        query: { myUrl: this.backUrl },
      });
    },
  }
}
</script>