// Make Connection
var socket = io.connect('http://localhost:4000'); 

// Query DOM
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

// Emit Event

btn.addEventListener('click',function(){
	socket.emit('chat',{
		message: message.value,
		handle: handle.value
	})
});

message.addEventListener('keypress',function(){
	socket.emit('typing',{
		handle: handle.value
	})
});

// Listen for events 
socket.on('chat',function(data){
	output.innerHTML += '<p><strong>' + data.handle + ':</strong>'
	+ data.message+'</p>';
	feedback.innerHTML = "";
});

socket.on('typing',function(data){
	feedback.innerHTML = '<p><em>' + data.handle + ' is typing a message... </em></p>';
});

socket.on('online',function(data){
	output.innerHTML += '<p><strong>' + data.handle + ':</strong>'
	+ data.message+'</p>';
	feedback.innerHTML = "";
});

socket.on('offline',function(data){
	output.innerHTML += '<p><strong>' + data.handle + ':</strong>'
	+ data.message+'</p>';
	feedback.innerHTML = "";
});

function init(){
	socket.emit('online',{
		message: " se conectó",
		handle: "alguien"
	});
}

// Espera a que cargue la pantalla
window.onload= init;
window.onbeforeunload = function () {
    	socket.emit('offline',{
		message: " se desconectó",
		handle: "alguien"
	});
};