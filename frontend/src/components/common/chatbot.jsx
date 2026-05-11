import { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I am BrainVault AI Assistant. Ask me anything about courses or learning!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/v1/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      const botReply = data.reply || "Sorry I could not get a response!";
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (err) {
      console.log("Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Connection error. Please try again!" },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 9999 }}>
      {isOpen && (
        <div style={{
          width: "350px",
          height: "450px",
          backgroundColor: "#1e1e2e",
          border: "1px solid #FFD60A",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}>
          <div style={{
            backgroundColor: "#FFD60A",
            padding: "12px 16px",
            borderRadius: "16px 16px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🤖</span>
              <div>
                <p style={{ fontWeight: "bold", color: "#000", margin: 0, fontSize: "14px" }}>
                  BrainVault AI
                </p>
                <p style={{ color: "#333", margin: 0, fontSize: "11px" }}>
                  Always here to help!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>
              X
            </button>
          </div>

          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%",
                  padding: "8px 12px",
                  borderRadius: msg.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
                  backgroundColor: msg.role === "user" ? "#FFD60A" : "#2d2d44",
                  color: msg.role === "user" ? "#000" : "#fff",
                  fontSize: "13px",
                  lineHeight: "1.4",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ color: "#FFD60A", fontSize: "13px", padding: "4px 8px" }}>
                BrainVault AI is typing...
              </div>
            )}
          </div>

          <div style={{
            padding: "12px",
            borderTop: "1px solid #333",
            display: "flex",
            gap: "8px",
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "20px",
                border: "1px solid #FFD60A",
                backgroundColor: "#2d2d44",
                color: "#fff",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                backgroundColor: "#FFD60A",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                fontSize: "16px",
              }}>
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#FFD60A",
          border: "none",
          cursor: "pointer",
          fontSize: "28px",
          boxShadow: "0 4px 20px rgba(255,214,10,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "auto",
        }}>
        🤖
      </button>
    </div>
  );
};

export default Chatbot;