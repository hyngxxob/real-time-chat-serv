const express = require('express')
const socket = require('socket.io')
const http = require('http')

const fs = require('fs')

const app = express()
const server = http.createServer(app)
const io = socket(server)

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function(req, res) {
    fs.readFile('./static/js/index.html', function(err, data){
        if(err) {
            res.send('에러')
        } else {
            res.writeHead(200, {'Content-Type':'text/html'})
            res.write(data)
            res.end()
        }
    })
})

io.sockets.on('connection', function(socket){
    // console.log('유저 접속 됨')
    
    // socket.on('send',function(data){
    //     console.log('전달된 메시지 : ', data.msg)
    // })

    // socket.on('disconnect', function(){
    //     console.log('접속 종료')
    // })
    socket.on('newUser', function(name){
        console.log(name + '님이 접속하셨습니다.')
        socket.name = name
        io.sockets.emit('update', {type : 'connect', name : 'SERVER', message : name + '님이 접속하셨습니다.'})
    })

    socket.on('message',function(data) {
        data.name = socket.name
        console.log(data)
        socket.broadcast.emit('update',data)
    })
    
    socket.on('disconnect', function(name){
        console.log(socket.name + '님이 나가셨습니다.')
        socket.broadcast.emit('update', {type : 'disconnect', name : 'SERVER', message : name + '님이 나가셨습니다.'})
    })
})



server.listen(8080, function() {
    console.log('서버 실행 중..')
})