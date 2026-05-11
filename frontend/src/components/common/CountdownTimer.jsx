import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const getTimeLeft = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);
    const diff = midnight - now;
    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div style={{
      background: "linear-gradient(135deg, #1e3a5f, #0f172a)",
      border: "1px solid #FFD60A",
      borderRadius: "12px",
      padding: "20px 32px",
      textAlign: "center",
      margin: "20px auto",
      maxWidth: "600px",
    }}>
      <p style={{ color: "#FFD60A", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>
        🔥 Limited Time Offer — Ends Today!
      </p>
      <p style={{ color: "#ffffff", fontSize: "16px", marginBottom: "16px" }}>
        Get <span style={{ color: "#FFD60A", fontWeight: "bold" }}>50% OFF</span> on all courses!
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
        {[
          { label: "Hours", value: pad(timeLeft.hours) },
          { label: "Minutes", value: pad(timeLeft.minutes) },
          { label: "Seconds", value: pad(timeLeft.seconds) },
        ].map((item, i) => (
          <div key={i}>
            {i > 0 && <span style={{ color: "#FFD60A", fontSize: "32px", lineHeight: "60px" }}>:</span>}
            <div style={{
              backgroundColor: "#FFD60A",
              borderRadius: "8px",
              padding: "8px 16px",
              minWidth: "70px",
              display: "inline-block",
              marginLeft: i > 0 ? "16px" : "0",
            }}>
              <p style={{ color: "#000", fontSize: "32px", fontWeight: "bold", margin: 0 }}>{item.value}</p>
              <p style={{ color: "#333", fontSize: "11px", margin: 0 }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => window.location.href = '/catalog/web-development'}
      style={{
        marginTop: "16px",
        backgroundColor: "#FFD60A",
        color: "#000",
        border: "none",
        borderRadius: "8px",
        padding: "10px 28px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
      }}>
        🎯 Grab the Offer Now!
      </button>
    </div>
  );
};

export default CountdownTimer;