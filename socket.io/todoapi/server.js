const express = require('express');
const http = require('http')
const {Server} = require('socket.io')
const {v4:uuid}= require('uuid')

const app = express();

const server = http.createServer(app);

const socketIO = new Server(server,{
    cors:{
          origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5000",
    ],

        methods:["GET","POST"],
        credentials:true
    }
})

let todoList = [];
console.log(todoList,"todolist")

const todoListNameSpace = socketIO.of("/todo");
todoListNameSpace.on("connection",(socket)=>{
    console.log("new connection established")

    socket.emit("update",todoList);

    socket.on("newItem",(item)=>{
        const todoItem = {id:uuid(),value:item}
        todoList.push(todoItem);
        todoListNameSpace.emit("update",todoList)
    })

    socket.on("updateObj",(itemObj)=>{
        const index = todoList.findIndex((item)=> item.id === itemObj.id)
        if(index !== -1){
            todoList[index].value = itemObj.value;
        todoListNameSpace.emit("update",todoList)

        }
    })

    socket.on("deleteItem",(id)=>{
        todoList = todoList.filter((x)=> x.id !== id)
        todoListNameSpace.emit("update",todoList)
    })

    socket.on("disconnect",()=>{
        console.log("client disconnect")
    })
})




server.listen(3000,()=>{
    console.log('server is running')
})