<template>
    <div class="room">
        <div class="inputs login">
            昵称:
            <input class="txt" type="text" v-model="nickName" />
            <div class="btn" @click="login">登录</div>
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
import Message from "../../core/message";
import client from "../../core/client";

var socket;
var ready = false;
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
    methods: {
      disconnect(){
        client.disconnect();
      },
        login() {
            client.init("ws://localhost:8899");
            client.on(Message.TYPE_CONNECT, () => {
                client.send(Message.TYPE_LOGIN, { 
                    nickName: this.nickName,
                    avatarUrl: 'https://gss0.bdstatic.com/7Ls0a8Sm1A5BphGlnYG/sys/portrait/item/5d8356656e6e655f576f6e679218.jpg',
                    openid: '123456',
                    gender: 1,
                });
            });
            client.on(Message.TYPE_MESSAGE, data => {
                this.addMessage(data.player.nickName + "：" + data.msg);
            });
            client.on(Message.TYPE_LOGIN, data => {
                this.addMessage("【" + data.nickName + "  （" + data.id + "）进入房间】");
            });
            client.on(Message.TYPE_WAIT_MATCH, data => {
                console.log(Message.TYPE_WAIT_MATCH);
                console.log(data);
                this.addMessage("当前玩家个数：" + data.length);
            })
            client.on(Message.TYPE_END_MATCH, data => {
                console.log(Message.TYPE_END_MATCH);
                console.log(data);
                ready = true;
                this.addMessage("匹配完成");
            })
            client.on(Message.TYPE_EXIT_MATCH, data => {
                console.log(Message.TYPE_END_MATCH);
                console.log(data);
                ready = false;
                this.addMessage(data.nickName + "退出");
            })
            /*
            listener.emit('init', "http://localhost:8899", this.nickName);
            listener.on('connect', ()=>{
                listener.emit('send', {
                    type: Message.TYPE_LOGIN,
                    data: {
                        nickName: this.nickName
                    }
                });
            })

            listener.on(Message.TYPE_MESSAGE, data=>{
                this.addMessage(data);
            })

            listener.on(Message.TYPE_START_MATCH, ()=>{
                this.status = '查找匹配对手';
            })

            listener.on(Message.TYPE_END_MATCH, (data)=>{
                this.status = '匹配对手成功';
                this.addMessage(data);
            })


            listener.on('disconnect', ()=>{

            })
            */

            /*
            //线上
            // socket = io('wss://wlwol.cn');

            //本地
            socket = io('http://localhost:8899');
            socket.on('connect', ()=>{
                console.log('socket connect====');
                socket.emit('login', this.nickName);
            });
            
            socket.on('msg', (data)=>{
                console.log('socket msg====');
                console.log(data);
                this.addMessage(data);
            });
            
            socket.on('disconnect', ()=>{
                console.log('socket disconnect====');
            });
            */
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
            client.send(Message.TYPE_MESSAGE, msg);
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
