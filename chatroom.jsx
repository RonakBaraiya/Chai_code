import { useState, useEffect } from "react";
import { io } from "socket.io-client"; // 1. Import the socket client

// 2. Initialize the connection outside the component
const socket = io("http://localhost:5000");

function Chatroom({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 3. Listen for global messages when the component loads
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup: stop listening if user leaves
    return () => socket.off("receive_message");
  }, []);

  const handleSend = () => {
    if (message.trim() !== "") {
      const newMessage = { text: message, sender: username };

      // 4. Send to Flask instead of just updating local state
      socket.emit("send_message", newMessage);

      setMessage("");
    }
  };

  return (
    <div
      className="chatroom"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <h3
        style={{
          fontSize: "0.8rem",
          opacity: 0.6,
          position: "absolute",
          top: "-180px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Welcome, {username}
      </h3>

      <div
        className="messages-display"
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "10px",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
            No messages yet...
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === username ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background:
                    msg.sender === username
                      ? "#01698f"
                      : "rgba(255,255,255,0.1)",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius:
                    msg.sender === username
                      ? "18px 18px 2px 18px"
                      : "18px 18px 18px 2px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  fontSize: "0.9rem",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {/* 5. Show sender name if it's not you */}
                {msg.sender !== username && (
                  <div
                    style={{
                      fontSize: "0.7rem",
                      opacity: 0.5,
                      marginBottom: "4px",
                    }}
                  >
                    {msg.sender}
                  </div>
                )}
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="chatroom-content">
        <textarea
          placeholder="Type a message..."
          rows="2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSend())
          }
        ></textarea>
        <button className="sendbtn" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatroom;
