import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/course/getAllCourses`
        );
        const data = await res.json();
        console.log("Courses data:", data);
        const allCourses = data?.data || [];
        const filtered = allCourses.filter((course) =>
          course.courseName?.toLowerCase().includes(query.toLowerCase()) ||
          course.courseDescription?.toLowerCase().includes(query.toLowerCase())
        );
        setCourses(filtered);
      } catch (err) {
        console.log("Search error:", err);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [query]);

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#000814",
      padding: "40px 20px",
      color: "#ffffff"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <h1 style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#FFD60A"
        }}>
          🔍 Search Results
        </h1>

        <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
          {loading ? "Searching..." : `${courses.length} result(s) for "${query}"`}
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#FFD60A" }}>
            Searching courses...
          </div>
        ) : courses.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px",
            backgroundColor: "#1e293b",
            borderRadius: "12px",
          }}>
            <p style={{ fontSize: "20px", marginBottom: "8px" }}>
              😔 No courses found for "{query}"
            </p>
            <p style={{ color: "#94a3b8" }}>
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}>
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => navigate(`/courses/${course._id}`)}
                style={{
                  backgroundColor: "#1e293b",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid #334155",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                  }}
                />
                <div style={{ padding: "16px" }}>
                  <h3 style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#ffffff"
                  }}>
                    {course.courseName}
                  </h3>
                  <p style={{
                    fontSize: "13px",
                    color: "#94a3b8",
                    marginBottom: "12px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {course.courseDescription}
                  </p>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{
                      color: "#FFD60A",
                      fontWeight: "bold",
                      fontSize: "16px"
                    }}>
                      ₹{course.price}
                    </span>
                    <span style={{
                      backgroundColor: "#FFD60A",
                      color: "#000",
                      padding: "4px 12px",
                      borderRadius: "15px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}>
                      View Course
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;