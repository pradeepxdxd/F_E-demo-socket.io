import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const socket = useMemo(() => io('http://localhost:4000'), []);

  const [text, settext] = useState('')
  const [id, setId] = useState('')
  const [showId, setShowId] = useState('')
  const [room, setRoom] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket io connected');
    });

    socket.on('welcome', receive => {
      setShowId(receive)
    })

    socket.on('receive-message', (data) => {
      setMessages(msg => [...msg, data])
    })

    socket.on('group-join-msg', (data) => {
      console.log(data)
    })

    return () => {
      socket.disconnect()
    }
  }, [socket])

  const handleClick = () => {
    socket.emit('message', { text, id})
    settext('')
  }

  const handleRoomJoin = () => {
    socket.emit('join-room', {room, userId:socket.id})
    setRoom('')
  }

  console.log(messages)
  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ color: 'red', border: '1px solid green', width: '500px', height: '350px', margin: '6px', textAlign: 'center' }}>
          {showId}
          <br />
          <label style={{ marginTop: '5px' }} htmlFor="room">Room id</label>{'  '}
          <input id='room' type="text" value={room} onChange={e => setRoom(e.target.value)} />
          <button onClick={handleRoomJoin}>Join</button>
          <br />
          <label style={{ marginTop: '5px' }} htmlFor="label">Id</label>{'  '}
          <input id='label' type="text" value={id} onChange={e => setId(e.target.value)} />
          <br />
          <label htmlFor="msg">Msg</label>{'  '}
          <input id='msg' type="text" value={text} onChange={e => settext(e.target.value)} />
          <br />
          <button onClick={handleClick}>send</button>

          <h4>Messages</h4>
          {
            messages.length > 0 && messages.map((msg, index) => 
              <p style={{color:'gray'}} key={index}>{msg}</p>
            )
          }
        </div>
      </div>
    </>
  );
}

export default App;
