<template>
    <div class="room">
        <div class="inputs login">
            昵称:
            <input class="txt" type="text" v-model="nickName" />
            <div class="btn" @click="login">登录</div>
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
import Message from "../../core/message";
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
        login() {
            ws = new WebSocket("ws://127.0.0.1:5566");
            ws.onopen = function(e){
                ready = true;
                console.log("serve start");
                console.log(e);
            }

            ws.onclose = function(e){
                console.log("serve close");
                console.log(e);
            }

            ws.onmessage = function(e){
                console.log("serve message");
                console.log(e);
            }

            ws.onerror = function(e){
                console.log("serve error");
                console.log(e);
            }
        },
        say() {
            if(ready){
                this.send(this.message);
            }
            else{
                this.addMessage("尚未匹配完成");
            }
        },
        clear() {
            this.list = [];
        },
        send(msg) {
            // client.send(Message.TYPE_MESSAGE, msg);
            ws.send(msg);
            this.message = "";
        },
        startMatch() {
            this.status = "匹配中";
            // listener.emit("send", {
            //     type: Message.TYPE_START_MATCH
            // });

            client.send(Message.TYPE_START_MATCH);
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
