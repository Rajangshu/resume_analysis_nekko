import React, { useEffect } from "react";
import InterviewPanel from "../components/InterviewPanel";

// Modern, full-page CSS for the interview page and panel
const styles = `
.interview-full-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
  margin: 0;
}
.interview-panel-full {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
}
.interview-panel-inner {
  background: #fff;
  border-radius: 0px;
  box-shadow: 0 0 0 rgba(0,0,0,0.0);
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  animation: fadeInPanelFull 0.8s cubic-bezier(0.4,0,0.2,1);
}

@keyframes fadeInPanelFull {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@media (max-width: 700px) {
  .interview-panel-inner {
    border-radius: 0;
    width: 100vw;
    height: 100vh;
    padding: 0;
  }
}
`;

const InterviewPage = () => {
  useEffect(() => {
    // Inject CSS only once
    if (!document.getElementById("interview-full-styles")) {
      const style = document.createElement("style");
      style.id = "interview-full-styles";
      style.innerHTML = styles;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="interview-full-bg">
      <div className="interview-panel-full">
        <div className="interview-panel-inner">
          <InterviewPanel />
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
