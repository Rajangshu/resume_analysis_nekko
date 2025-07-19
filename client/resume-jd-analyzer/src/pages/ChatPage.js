import React, { useEffect } from "react";
import ChatBotPanel from "../components/ChatBotPanel";

// Modern, full-page chat CSS
const styles = `
.chatpage-bg {
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-panel-main {
  width: 100vw;
  height: 100vh;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
}
@media (max-width: 700px) {
  .chat-panel-main {
    padding: 0;
  }
}
`;

const ChatPage = () => {
  useEffect(() => {
    // Inject CSS only once
    if (!document.getElementById("chatpage-panel-styles")) {
      const style = document.createElement("style");
      style.id = "chatpage-panel-styles";
      style.innerHTML = styles;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="chatpage-bg">
      <div className="chat-panel-main">
        <ChatBotPanel />
      </div>
    </div>
  );
};

export default ChatPage;
