import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#05070d", color: "white" }}>
      
      {/* NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          cursor: "pointer"
        }}
      >
        <div onClick={() => navigate("/")}>The Invisible Data</div>

        <div style={{ display: "flex", gap: "30px" }}>
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/path")}>Path</span>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "80px 40px", maxWidth: "900px", margin: "auto" }}>
        
        <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
          About
        </h1>

        <p style={{ opacity: 0.8, lineHeight: "1.6" }}>
          Perimenopause is often experienced as a fragmented and invisible phase
          of life, where symptoms do not appear in isolation but as interconnected
          patterns. Despite its widespread impact, structured data capturing these
          lived experiences remains limited.
        </p>

        <p style={{ marginTop: "20px", opacity: 0.8, lineHeight: "1.6" }}>
          This project explores how personal narratives and shared experiences can
          be transformed into visual systems—revealing symptom clusters, behavioral
          patterns, and emotional landscapes that are often overlooked in clinical
          data.
        </p>

        <p style={{ marginTop: "20px", opacity: 0.8, lineHeight: "1.6" }}>
          By combining qualitative insights with interactive visualization, this
          work aims to create new ways of understanding and navigating the
          perimenopausal journey.
        </p>

        {/* CTA */}
        <div style={{ marginTop: "50px" }}>
          <button onClick={() => navigate("/path")}>
            Choose Your Path →
          </button>
        </div>
      </div>
    </div>
  );
}