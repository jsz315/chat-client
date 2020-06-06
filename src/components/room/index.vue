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
            <div class="btn" @click="startMatch">快速匹配</div>
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

var ws;
export default {
    name: "HelloWorld",
    data() {
        return {
            nickName: "",
            list: [],
            message: "",
            status: ""
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
                this.send(Message.TYPE_LOGIN, this.nickName);
            }

            ws.onclose = (e)=>{
                console.log("serve close");
                console.log(e);
            }

            ws.onmessage = (e)=>{
                console.log("serve message");
                console.log(e);
                var obj = JSON.parse(e.data);
                if(obj.type == Message.TYPE_MESSAGE){
                    this.addMessage(obj.msg);
                }
                else if(obj.type == Message.TYPE_QUIT){
                    this.addMessage(obj.msg);
                    this.addMessage("自动退出房间");
                    this.disconnect();
                }
                else if(obj.type == Message.TYPE_WAIT_MATCH){
                    this.addMessage("当前玩家个数：" + obj.players.length);
                }
                else if(obj.type == Message.TYPE_END_MATCH){
                    ready = true;
                    this.addMessage("匹配完成");
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
        send(type, msg) {
            // client.send(Message.TYPE_MESSAGE, msg);
            if(ws && ws.readyState == 1){
                ws.send(JSON.stringify({type, msg}));
            }
            else{
                this.$toast({message: "请重新登陆", duration: 3000})
            }
            this.message = "";
        },
        startMatch() {
            this.status = "匹配中";
            this.send(Message.TYPE_START_MATCH);
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
