import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const styles = `
.chatbot-container {
  width: 100%;
  padding: 2rem 10vw;
  box-sizing: border-box;
  background: #fff;
  min-height: 100vh;
}
.chatbot-header {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e40af;
  margin-bottom: 2rem;
}
.chatbot-select {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #cbd5e1;
  border-radius: 10px;
  background: #f1f5f9;
  margin-bottom: 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}
.chatbot-select:focus {
  border-color: #1e40af;
  box-shadow: 0 0 0 2px #cbdcf7;
  outline: none;
}
.chatbot-chatbox {
  flex: 1;
  overflow-y: auto;
  background: #f8fafc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  max-height: 400px;
  scroll-behavior: smooth;
}
.chatbot-message {
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: fadeInSlide 0.4s ease forwards;
}
.chatbot-message.user {
  align-items: flex-end;
}
.chatbot-message.bot {
  align-items: flex-start;
}
.chatbot-bubble {
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 1.05rem;
  line-height: 1.5;
  background-color: #e2e8f0;
  color: #1e293b;
  transform: scale(0.98);
  animation: popUp 0.3s ease forwards;
}
.chatbot-message.user .chatbot-bubble {
  background-color: #dbeafe;
  color: #1e3a8a;
}
.chatbot-input-section {
  display: flex;
  gap: 0.6rem;
}
.chatbot-input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}
.chatbot-input:focus {
  border-color: #1e40af;
  box-shadow: 0 0 0 2px #bfdbfe;
  outline: none;
}
.chatbot-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #1e40af 60%, #3b82f6 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.chatbot-button:hover {
  background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%);
  transform: scale(1.03);
}
.chatbot-button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popUp {
  0% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .chatbot-container {
    padding: 2rem 5vw;
  }
}
`;

const ChatBotPanel = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("chatbot-style")) {
      const style = document.createElement("style");
      style.id = "chatbot-style";
      style.innerHTML = styles;
      document.head.appendChild(style);
    }

    axios
      .get("http://localhost:5000/api/cvs")
      .then((res) => setResumes(res.data))
      .catch((err) => console.error("Failed to fetch CVs:", err));
  }, []);

  useEffect(() => {
    if (selectedResumeId) {
      setMessages([]);
      setConversationId(null);
    }
  }, [selectedResumeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!selectedResumeId || !input.trim()) {
      alert("Please select a resume and enter a message.");
      return;
    }

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        resumeId: selectedResumeId,
        message: input,
        conversationId,
      });

      const botReply = { sender: "bot", text: res.data.response };
      setMessages((prev) => [...prev, botReply]);
      setConversationId(res.data.conversation_id);
      setInput("");
    } catch (err) {
      console.error("Chat failed:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error talking to server." },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Chat About Resume</div>

      <select
        className="chatbot-select"
        value={selectedResumeId}
        onChange={(e) => setSelectedResumeId(e.target.value)}
      >
        <option value="">Select a resume</option>
        {resumes.map((r) => (
          <option key={r._id} value={r._id}>
            {r.name}
          </option>
        ))}
      </select>

      <div className="chatbot-chatbox">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-message ${msg.sender}`}>
            <div className="chatbot-bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-section">
        <input
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about the resume..."
        />
        <button className="chatbot-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBotPanel;
