import io from 'socket.io-client'
const CHAT={
	msgObj:document.getElementsByClassName("body-wrapper")[0],
	username:null,
	userid:null,
	color:null,
	socket:null,
	onlineCount:0,
	onlineUsers:null,
	msgArr:[],
	
	scrollToBottom:function(){
		
	},
	
	logout:function(){
		this.socket.disconnect();
		
	},
	
	submit:function(msg){
		if(msg != ''){
			let obj = {
				userid: this.userid,
				username: this.username,
				msg: msg,
				color: this.color
			};
			this.socket.emit('message', obj);
		}else{
			console.log('msg is null')
		}
		
		return false;
	},
	genUid:function(){
		return new Date().getTime()+""+Math.floor(Math.random()*899+100);
	},
	//used during user get in or leave
	updateSysMsg:function(o, action){
		
		this.onlineUsers=o.onlineUsers;
		
		this.onlineCount = o.onlineCount;
		
		var user = o.user;
			
	
		var userhtml = '';
		var separator = '';
		
	},
	changeInfo(){
		this.userid = localStorage.getItem('userid');
		this.username = localStorage.getItem('name');
		this.color = localStorage.getItem('color');
		this.weichat = localStorage.getItem('weichat');
		this.socket.emit('changeInfo', {userid:this.userid, username:this.username,color:this.color,weichat:this.weichat});
	},
	init:function(){
		
		this.userid = localStorage.getItem('userid');
		this.username = localStorage.getItem('name');
		this.color = localStorage.getItem('color');
		this.weichat = localStorage.getItem('weichat');

		if (!this.userid) {return}
		
		this.socket = io.connect('ws://localhost:3000');
		
		
		this.socket.emit('login', {userid:this.userid, username:this.username,color:this.color,weichat:this.weichat});
		

		setInterval(() => {
			this.socket.emit('heartbeat', 1);
		},10000)
		
		this.socket.on('login', function(obj){
			CHAT.updateSysMsg(obj, 'logout');
			CHAT.msgArr.push(obj)	
		});
		
		this.socket.on('changeInfo', function(o){
			CHAT.onlineUsers[o.userid]=o
			console.log(o)	
		});
		
		this.socket.on('logout', function(o){
			CHAT.updateSysMsg(o, 'logout');
		});
		
		
		this.socket.on('message', function(obj){
		
			CHAT.msgArr.push(obj)	
		});

	}
}	
export default CHAT