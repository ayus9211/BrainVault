import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Certificate = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/profile/getEnrolledCourses`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        const enrolled = data?.data || [];
        setCourses(enrolled);
        if (enrolled.length > 0) setSelectedCourse(enrolled[0]);
      } catch (err) {
        console.log("Error:", err);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const downloadCertificate = async () => {
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
    pdf.save(`BrainVault_Certificate_${selectedCourse?.courseName}.pdf`);
  };

  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric"
  });

  if (loading) return (
    <div style={{ color: "#FFD60A", textAlign: "center", padding: "60px" }}>
      Loading certificates...
    </div>
  );

  if (courses.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px", color: "#ffffff" }}>
      <p style={{ fontSize: "20px" }}>No enrolled courses found!</p>
      <p style={{ color: "#94a3b8" }}>Enroll in courses to get certificates</p>
    </div>
  );

  return (
    <div style={{ padding: "24px", color: "#ffffff" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px", color: "#FFD60A" }}>
        🎓 My Certificates
      </h1>

      {/* Course Selector */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ color: "#94a3b8", marginBottom: "8px", fontSize: "14px" }}>
          Select Course:
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {courses.map((course, i) => (
            <button
              key={i}
              onClick={() => setSelectedCourse(course)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: `2px solid ${selectedCourse?._id === course._id ? "#FFD60A" : "#334155"}`,
                backgroundColor: selectedCourse?._id === course._id ? "#FFD60A" : "#1e293b",
                color: selectedCourse?._id === course._id ? "#000" : "#ffffff",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "13px",
              }}>
              {course.courseName}
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Design */}
      {selectedCourse && (
        <>
          <div ref={certRef} style={{
            width: "800px",
            height: "560px",
            background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1e3a5f 100%)",
            border: "8px solid #FFD60A",
            borderRadius: "16px",
            padding: "40px",
            position: "relative",
            overflow: "hidden",
            margin: "0 auto 24px",
          }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", border: "2px solid rgba(255,214,10,0.2)" }} />
            <div style={{ position: "absolute", bottom: "-50px", left: "-50px", width: "200px", height: "200px", borderRadius: "50%", border: "2px solid rgba(255,214,10,0.2)" }} />

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <p style={{ color: "#FFD60A", fontSize: "14px", letterSpacing: "4px", textTransform: "uppercase" }}>
                BrainVault Learning Platform
              </p>
              <h1 style={{ color: "#ffffff", fontSize: "42px", fontWeight: "bold", margin: "8px 0" }}>
                Certificate of Completion
              </h1>
              <div style={{ height: "2px", background: "linear-gradient(to right, transparent, #FFD60A, transparent)", margin: "12px auto", width: "60%" }} />
            </div>

            {/* Body */}
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "8px" }}>
                This is to certify that
              </p>
              <h2 style={{ color: "#FFD60A", fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
                {user?.firstName} {user?.lastName}
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "16px", marginBottom: "8px" }}>
                has successfully completed the course
              </p>
              <h3 style={{ color: "#ffffff", fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
                "{selectedCourse?.courseName}"
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                Issued on {today}
              </p>
            </div>

            {/* Footer */}
            <div style={{
              position: "absolute",
              bottom: "30px",
              left: "0", right: "0",
              display: "flex",
              justifyContent: "space-around",
              padding: "0 60px",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ height: "1px", backgroundColor: "#FFD60A", width: "150px", marginBottom: "8px" }} />
                <p style={{ color: "#94a3b8", fontSize: "12px" }}>Student Signature</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#FFD60A", fontSize: "18px", fontWeight: "bold" }}>🧠 BrainVault</p>
                <p style={{ color: "#94a3b8", fontSize: "12px" }}>Official Seal</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ height: "1px", backgroundColor: "#FFD60A", width: "150px", marginBottom: "8px" }} />
                <p style={{ color: "#94a3b8", fontSize: "12px" }}>Instructor</p>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={downloadCertificate}
              style={{
                backgroundColor: "#FFD60A",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                padding: "12px 32px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}>
              📥 Download Certificate as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Certificate;