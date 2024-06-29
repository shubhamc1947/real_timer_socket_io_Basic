import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const App = () => {
    const [inputMsg, setInputMsg] = useState('');
    const [roomName, setRoomName] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [text, setText] = useState("");
    useEffect(() => {
        const newSocket = io('http://localhost:3000', {
            withCredentials: true,
        });

        setSocket(newSocket);

        newSocket.on('recv-msg', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        newSocket.on('connect', () => {
            console.log('Connected with ' + newSocket.id);
        });

        newSocket.on('real-time-recv',(msg)=>{
            setText(msg);
        })
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputMsg === '') return;
        socket.emit('send-msg', inputMsg, roomName);
        setInputMsg('');
    };

    const handleJoinRoom = () => {
        socket.emit('join-room', roomName);
    };
    const handleText =(e)=>{
        setText(e.target.value)
        socket.emit('real-time-send',e.target.value);
    }
    return (
        <div class="app">
            <div id="msg">
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <form id="form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                />
                <input type="submit" value="Submit" />
                <br />
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <input type="button" value="Join" onClick={handleJoinRoom} />
                <div>
                    <textarea name="" id="" value={text} onChange={handleText} />
                </div>
            </form>
        </div>
    );
};

export default App;
