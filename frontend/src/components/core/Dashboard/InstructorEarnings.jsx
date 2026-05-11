import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiConnector } from "../../../services/apiConnector";

const InstructorEarnings = () => {
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiConnector(
          "GET",
          `${import.meta.env.VITE_APP_BASE_URL}/course/getInstructorCourses`,
          null,
          { Authorization: `Bearer ${token}` }
        );
        const data = result?.data?.data || [];
        setCourses(data);
        const total = data.reduce((sum, course) => {
          return sum + (course.price * (course.studentsEnrolled?.length || 0));
        }, 0);
        setTotalEarnings(total);
      } catch (err) {
        console.log("Error:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ color: "#FFD60A", textAlign: "center", padding: "40px" }}>
      Loading earnings...
    </div>
  );

  return (
    <div style={{ padding: "24px", color: "#ffffff" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px", color: "#FFD60A" }}>
        💰 Instructor Earnings
      </h1>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total Earnings", value: `₹${totalEarnings.toLocaleString()}`, color: "#22c55e" },
          { label: "Total Courses", value: courses.length, color: "#3b82f6" },
          { label: "Total Students", value: courses.reduce((sum, c) => sum + (c.studentsEnrolled?.length || 0), 0), color: "#f59e0b" },
        ].map((card, i) => (
          <div key={i} style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "20px",
            border: `1px solid ${card.color}`,
            textAlign: "center",
          }}>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "8px" }}>{card.label}</p>
            <p style={{ color: card.color, fontSize: "28px", fontWeight: "bold" }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Course Earnings Table */}
      <div style={{ backgroundColor: "#1e293b", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#0f172a" }}>
              {["Course Name", "Price", "Students", "Earnings"].map((h, i) => (
                <th key={i} style={{ padding: "16px", textAlign: "left", color: "#FFD60A", fontSize: "14px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "#94a3b8" }}>
                  No courses found. Add courses to see earnings!
                </td>
              </tr>
            ) : (
              courses.map((course, i) => (
                <tr key={i} style={{ borderTop: "1px solid #334155" }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img src={course.thumbnail} alt="" style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }} />
                      <span style={{ fontWeight: "bold" }}>{course.courseName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px", color: "#94a3b8" }}>₹{course.price}</td>
                  <td style={{ padding: "16px", color: "#3b82f6" }}>{course.studentsEnrolled?.length || 0}</td>
                  <td style={{ padding: "16px", color: "#22c55e", fontWeight: "bold" }}>
                    ₹{((course.price || 0) * (course.studentsEnrolled?.length || 0)).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorEarnings;