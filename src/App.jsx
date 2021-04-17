import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;

// const ENDPOINT = 'http://localhost:3001/';

const App = () => {
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');

  const socket = io(ENDPOINT);

  useEffect(() => {
    if (reply) {
      setMessages(messages.concat(reply));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reply]);

  useEffect(() => {
    socket.on('message', (received) => {
      setReply(received);
    });

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (text !== '') {
      let checkedName;
      if (name === '') {
        checkedName = 'anon';
      } else {
        checkedName = name;
      }
      socket.emit('message', { text, name: checkedName, time: Date.now() });
      setText('');
    }
  };

  const renderMessagesList = () => {
    return messages.map((message) => {
      return (
        <div
          key={Math.random()}
          style={{
            paddingLeft: '8px',
            color: 'white',
            background: '#242c37',
            margin: '10px 0 10px 0',
            padding: '5px',
            borderRadius: '5px',
          }}
        >{`[${new Date(message.time).getHours()}:${new Date(
          message.time
        ).getMinutes()}] ${message.name}: ${message.text}`}</div>
      );
    });
  };

  return (
    <div className="ui container">
      <div style={{ marginTop: '16px' }}>
        <div className="ui divided items">{renderMessagesList()}</div>

        <div style={{ position: 'sticky', bottom: '0' }}>
          <form>
            <div className="ui input" style={{ width: '100%' }}>
              <input
                placeholder="your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
                style={{
                  background: '#fff',
                  color: '#fd4d4d',
                }}
              />
            </div>
          </form>

          <form onSubmit={onSubmit}>
            <div>
              <div
                className="ui input"
                style={{
                  width: '100%',
                  marginTop: '8px',
                }}
              >
                <input
                  placeholder="enter your message"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                  style={{ background: '#fff', color: '#fd4d4d' }}
                />
              </div>
              <div>
                <button
                  type="submit"
                  class="ui primary button"
                  style={{
                    width: '100%',
                    margin: '8px 0 16px 0',
                    background: '#fd4d4d',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
