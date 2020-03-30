<template>
	<div class="room">
		<div class="inputs login">
			昵称:<input class="txt" type="text" v-model="nickName" /><div class="btn" @click="login">登录</div>
		</div>
		<div class="inputs say">
			输入:<input class="txt" type="text" v-model="message" /><div class="btn" @click="say">发送</div><div class="btn" @click="clear">清空</div>
		</div>
		<div class="list">
			<div class="item" v-bind:key="index" v-for="(item, index) in list">{{item}}</div>
		</div>
	</div>
</template>

<script>
	var socket;
	export default {
	  name: 'HelloWorld',
	  data(){
		  return {
			  nickName: "",
			  list: [],
			  message: ""
		  }
	  },
	  props: {
	    msg: String
	  },
	  methods:{
		  login(){
			// socket = io('http://122.51.176.36:8899');
			socket = io('wss://wlwol.cn');
			// socket = io('http://localhost:8899');
			socket.on('connect', ()=>{
				console.log('socket connect====');
				// this.send(this.nickName);
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
		  },
		  say(){
			this.send(this.message);
			this.message = "";
		  },
		  clear(){
			  this.list = [];
		  },
		  send(msg){
			  socket.emit('msg', msg);
			  this.message = "";
		  },
		  addMessage(tip){
			  this.list.push(tip);
		  }
	  }
	}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
