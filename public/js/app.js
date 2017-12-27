'use strict';

$(function(){

});

const socket = io();
const query = document.querySelector('#comment');
const html = document.querySelector('#conversation');


document.querySelector('#chat-send').addEventListener('click', () => {
	var date = new Date();
	var htmlResponse	=	"<div class=\"row message-body\">\
	<div class=\"col-sm-12 message-main-sender\">\
	<div class=\"sender\">\
	<div class=\"message-text\">" +
	query.value +
	"</div>\
	<span class=\"message-time pull-left\">"
	+ date.getHours() + ":" + date.getMinutes() +
	"</span>\
	</div>\
	</div>\
	</div>";
	query.value = '';
	console.log(query.value);
	html.innerHTML = html.innerHTML + htmlResponse;
});

function replyMain(e){
	var key = e.which || e.keyCode;
    if (key === 13 && query.value != "") { // 13 is enter
    	var date = new Date();
    	var htmlResponse	=	"<div class=\"row message-body\">\
    	<div class=\"col-sm-12 message-main-sender\">\
    	<div class=\"sender\">\
    	<div class=\"message-text\">" +
    	query.value +
    	"</div><span class=\"message-time pull-left\">"
    	+ date.getHours() + ":" + date.getMinutes() +
    	"</span>\
    	</div>\
    	</div>\
    	</div>";
    	html.innerHTML = html.innerHTML + htmlResponse;
    	socket.emit('chat request', query.value);
    	query.value = '';
    	console.log(query.value);
    	}
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const oSpeechRecognition = new SpeechRecognition();
oSpeechRecognition.lang = 'en-US';
oSpeechRecognition.interimResults = false;
oSpeechRecognition.maxAlternatives = 1;

document.querySelector('#microphone-send').addEventListener('click', () => {
	oSpeechRecognition.start();
});

oSpeechRecognition.addEventListener('result', (e) => {
	console.log('Finalized the Result.');

	let previous = e.results.length - 1;
	let text = e.results[previous][0].transcript;

	query.textContent = text;
	console.log('Confidence: ' + e.results[0][0].confidence);
	console.log(e);
});

oSpeechRecognition.addEventListener('speechend', () => {
	oSpeechRecognition.stop();
});

oSpeechRecognition.addEventListener('error', (e) => {
	outputBot.textContent = 'Error: ' + e.error;
});

function speak(text) {
	const speechSynthesis = window.speechSynthesis;
	const oSpeechSynthesisUtternace = new SpeechSynthesisUtterance();
	oSpeechSynthesisUtternace.text = text;
	speechSynthesis.speak(oSpeechSynthesisUtternace);
}

socket.on('ai response', function(response) {
	speak(response);
	var date = new Date();
	if(response == '') response = '(No answer...)';
	var htmlResponse = "<div class=\"row message-body\">\
	<div class=\"col-sm-12 message-main-receiver\">\
	<div class=\"receiver\">\
	<div class=\"message-text\">" +
	response +
	"</div>\
	<span class=\"message-time pull-left\">"
	+ date.getHours() + ":" + date.getMinutes() +
	"</span>\
	</div>\
	</div>\
	</div>";
	html.innerHTML = html.innerHTML + htmlResponse;
});

