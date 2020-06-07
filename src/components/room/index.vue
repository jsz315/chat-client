<template>
    <div class="room">
        <div class="inputs login">
            昵称:
            <input class="txt" type="text" v-model="nickName" />
            <div class="btn" @click="login(0)">本地</div>
            <div class="btn" @click="login(1)">线上</div>
            <div class="btn" @click="disconnect">退出</div>
        </div>
        <div class="inputs">
            状态:
            <input class="txt" type="text" v-model="status" />
            <div class="btn" @click="init">初始化题目</div>
        </div>
        <div class="answer-title">{{questions[questionId]}}.题目</div>
        <div class="answer-list">
            <div class="answer-btn" v-for="(item, index) in answers" :class="{selected: index == answerId}" v-bind:key="item" @click="choose(index)">{{item}}</div>
        </div>
        
        <div class="inputs say">
            输入:
            <input class="txt" type="text" v-model="message" />
            <div class="btn" @click="say">发送</div>
            <div class="btn" @click="clear">清空</div>
        </div>
        <div class="list">
            <div class="item" v-bind:key="index" v-for="(item, index) in list">{{item}}</div>
        </div>
    </div>
</template>

<script>
import listener from "@/core/listener";
import {Message} from "../../core/message";
import client from "../../core/client";

var socket;
var ready = false;
var timer = 0;

var ws;
export default {
    name: "HelloWorld",
    data() {
        return {
            nickName: "",
            list: [],
            message: "",
            status: "",
            answers: ["A", "B", "C", "D"],
            answerId: -1,
            questions: [],
            questionId: 0,
        };
    },
    props: {
        msg: String
    },
    mounted(){
        
    },
    methods: {
      disconnect(){
        // client.disconnect();
        console.log("服务器断开");
        clearInterval(timer);
        ws.close();
      },
        login(n) {
            if(n == 0){
                ws = new WebSocket("ws://127.0.0.1:5566");
            }
            else{
                ws = new WebSocket("wss://wlwol.cn/websocket");
            }

            ws.onopen = (e)=>{
                console.log("serve open");
                console.log(e);
                this.send(Message.TYPE_LOGIN, {
                    nickName: this.nickName,
                    avatarUrl: "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
                    openid: "openid12345",
                    gender: 1
                });

                clearInterval(timer);
                timer = setInterval(()=>{
                    this.send(Message.TYPE_PING, 0);
                }, 6000)
            }

            ws.onclose = (e)=>{
                console.log("serve close");
                console.log(e);
                clearInterval(timer);
            }

            ws.onmessage = (e)=>{
                console.log("接收数据：")
                console.log(e);
                var obj = JSON.parse(e.data);
                if(obj.type == Message.TYPE_MESSAGE){
                    this.addMessage(obj.data);
                }
                else if(obj.type == Message.TYPE_LOGIN){
                    this.addMessage(obj.player.nickName + "登录成功");
                }
                else if(obj.type == Message.TYPE_QUIT){
                    this.addMessage(obj.player.nickName + "退出房间");
                    this.addMessage("自动销毁房间");
                    this.disconnect();
                }
                else if(obj.type == Message.TYPE_WAIT_MATCH){
                    this.addMessage("当前玩家个数：" + obj.players.length);
                }
                else if(obj.type == Message.TYPE_END_MATCH){
                    ready = true;
                    this.addMessage("匹配完成");
                }
                else if(obj.type == Message.TYPE_LIST_ID){
                    console.log(obj);
                    this.questions = obj.data;
                    this.questionId = 0;
                }
                else if(obj.type == Message.TYPE_CHOOSE_ANSWER){
                    console.log(obj);
                    this.answerId = obj.data.index;
                    setTimeout(()=>{
                        this.answerId = -1;
                        this.questionId++;
                    }, 3000)
                }
                else if(obj.type == Message.TYPE_PING){
                    console.log(obj);
                }
            }

            ws.onerror = (e)=>{
                console.log("serve error");
                console.log(e);
            }
        },
        say() {
            if(ready){
                this.send(Message.TYPE_MESSAGE, this.message);
            }
            else{
                this.addMessage("尚未匹配完成");
            }
        },
        clear() {
            this.list = [];
        },
        send(type, data) {
            console.log("发送数据：");
            console.log(type, data);
            if(ws && ws.readyState == 1){
                ws.send(JSON.stringify({type, data}));
            }
            else{
                this.$toast({message: "请重新登陆", duration: 3000})
            }
            this.message = "";
        },
        choose(n) {
            this.send(Message.TYPE_CHOOSE_ANSWER, {index: n, level: 1});
        },
        init(){
            this.send(Message.TYPE_LIST_ID, {allSize: 100, pkSize: 4});
        },
        addMessage(tip) {
            this.list.push(tip);
        }
    }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
