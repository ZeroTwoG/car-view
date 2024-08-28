<style scoped>
*{
  margin: 0px;
}
.van-card__content{
  min-height: 0px;
}
.van-cell__label{
  background-color: #f3f3f3;
  border-radius: 4px;
  color: black;
  padding: 3px;
}
</style>
<template>
<div>
<!--  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
    <!-- 粘性布局 -->
    <van-sticky>
      <!-- 导航栏 -->
      <van-nav-bar title="客服" left-arrow @click-left="jump('/home')" />
    </van-sticky>
    <div style="margin: 0px;padding-bottom: 90px">
      <van-card v-for="item in msgList"
                style="text-align: left;width: 100%;margin: 0px;padding: 0px">
        <template #tags v-if="item.chatName==='assistant'">
          <van-cell  title="客服" :label="item.chatMsg" style=" border-radius: 3px;color: #1a7b0c;margin: 0px;text-align: left;background-color: #ffffff"/>
        </template>
        <template #tags v-else>
          <van-cell  title="我" :label="item.chatMsg" style=" color: #6885e6;margin: 0px;text-align: right;background-color: #f3f3f3"/>
        </template>
      </van-card>
    </div>
  <van-tabbar style="margin-bottom: 45px">
    <div style="width: 100%;">
      <div style="width: 70%;float: left">
        <van-cell-group>
          <van-field v-model="msg" placeholder="请输入消息" />
        </van-cell-group>
      </div>
      <van-button type="primary"  style="width: 25%;float: right" @click="goMsg()">发送</van-button>
    </div>
  </van-tabbar>
    <!--                    :key="item" :thumb="item"-->
  <van-tabbar v-model="active">
    <van-tabbar-item icon="chat" dot >客服</van-tabbar-item>
    <van-tabbar-item icon="shop" info="5" @click="jump('/storeMsg')">商家</van-tabbar-item>
<!--    <van-tabbar-item icon="records"  @click="jump('/textMsg')">更多</van-tabbar-item>-->
  </van-tabbar>
</div>
</template>
<script>
import axios from "axios";
import { Toast } from "vant";

export default {
  comments:{
  },
  setup() {
    const onClickLeft = () => history.back();
    return {
      onClickLeft,
    };
  },
  data() {
    return {
      msgList:[],
      msg:"",
      active: 0,
      user:{},
    }
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
    this.getMsg();
  },
  methods: {
    fakeMsg(){
      this.msgList.push({
        chatName:"assistant",
        chatMsg:"你好,我是洗车App智能客服,请问有什么需要为您服务的吗?",
      })
    },

    getMsg(){
      // this.msgList.push({msg:this.msg});
      console.log(this.user)
      console.log(this.user.phone)
      console.log(this.user.userId)
      this.$axios.get(`/chat/chatAis/${this.user.phone}/${this.user.userId}`).then(resp => {
        if(resp.data.code==200){
          this.msgList=resp.data.data;
        }else{
          Toast("发送失败");
        }
      })
    },
    goMsg(){
      var msg = this.msg
      this.msg="";
      this.msgList.push({
        chatName:"user",
        chatMsg:msg,
      });
      this.$axios.get(`/chat/chatAi/${this.user.phone}/${this.user.userId}/${msg}`).then(resp => {
        this.msg="";
        console.log(resp)
        if(resp.data.code==200){
          this.msgList.push({
            chatName:"assistant",
            chatMsg:resp.data.data.chatMsg,
          });
        }else{
          Toast("发送失败");
        }
      })
    },

    //跳转页面的方法
    jump(url) {
      this.$router.push({
        path: url,
        query: { myUrl: this.backUrl },
      })
    },
  }
}
</script>
