import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  RadialBarChart, RadialBar, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

const StudentProgressDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_BASE_URL}/profile/getEnrolledCourses`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log("Enrolled courses:", data);
        setEnrolledCourses(data?.data || []);
      } catch (err) {
        console.log("Error fetching courses:", err);
      }
      setLoading(false);
    };
    fetchEnrolledCourses();
  }, []);

  const getProgress = (course) => {
    const totalVideos = course?.courseContent?.reduce(
      (acc, section) => acc + (section?.subSection?.length || 0), 0
    ) || 1;
    const completedVideos = course?.completedVideos?.length|| 0;
    const percentage = Math.round((completedVideos / totalVideos) * 100);
    return percentage > 100 ? 100 : percentage; //
  };

  const radialData = enrolledCourses.map((course, i) => ({
    name: course.courseName?.substring(0, 15) + "...",
    progress: getProgress(course),
    fill: ["#FFD60A", "#22c55e", "#3b82f6", "#f59e0b", "#ec4899"][i % 5],
  }));

  const barData = enrolledCourses.map((course) => ({
    name: course.courseName?.substring(0, 12) + "..",
    progress: getProgress(course),
    total: 100,
  }));

  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + getProgress(c), 0) / enrolledCourses.length)
    : 0;

  const completedCourses = enrolledCourses.filter(c => getProgress(c) === 100).length;

  if (loading) return (
    <div style={{ color: "#FFD60A", textAlign: "center", padding: "60px", fontSize: "18px" }}>
      Loading your progress...
    </div>
  );

  return (
    <div style={{ padding: "24px", color: "#ffffff", minHeight: "100vh" }}>

      {/* Header */}
      <h1 style={{
        fontSize: "28px", fontWeight: "bold",
        marginBottom: "8px", color: "#FFD60A"
      }}>
        📊 My Learning Progress
      </h1>
      <p style={{ color: "#94a3b8", marginBottom: "32px" }}>
        Track your course completion and learning journey
      </p>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "32px"
      }}>
        {[
          { label: "Enrolled Courses", value: enrolledCourses.length, color: "#3b82f6", icon: "📚" },
          { label: "Completed", value: completedCourses, color: "#22c55e", icon: "✅" },
          { label: "In Progress", value: enrolledCourses.length - completedCourses, color: "#f59e0b", icon: "⏳" },
          { label: "Avg Progress", value: `${totalProgress}%`, color: "#FFD60A", icon: "🎯" },
        ].map((card, i) => (
          <div key={i} style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "20px",
            border: `1px solid ${card.color}`,
            textAlign: "center",
          }}>
            <p style={{ fontSize: "28px", marginBottom: "8px" }}>{card.icon}</p>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "4px" }}>{card.label}</p>
            <p style={{ color: card.color, fontSize: "24px", fontWeight: "bold" }}>{card.value}</p>
          </div>
        ))}
      </div>

      {enrolledCourses.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px",
          backgroundColor: "#1e293b", borderRadius: "12px"
        }}>
          <p style={{ fontSize: "20px", marginBottom: "8px" }}>📚 No courses enrolled yet!</p>
          <p style={{ color: "#94a3b8" }}>Enroll in courses to track your progress</p>
        </div>
      ) : (
        <>
          {/* Bar Chart */}
          <div style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{
              fontSize: "20px", fontWeight: "bold",
              marginBottom: "20px", color: "#FFD60A"
            }}>
              📈 Course Progress Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #FFD60A",
                    borderRadius: "8px",
                    color: "#ffffff"
                  }}
                  formatter={(value) => [`${value}%`, "Progress"]}
                />
                <Bar dataKey="progress" fill="#FFD60A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Course Progress Cards */}
          <div style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{
              fontSize: "20px", fontWeight: "bold",
              marginBottom: "20px", color: "#FFD60A"
            }}>
              🎓 Individual Course Progress
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {enrolledCourses.map((course, i) => {
                const progress = getProgress(course);
                const colors = ["#FFD60A", "#22c55e", "#3b82f6", "#f59e0b", "#ec4899"];
                const color = colors[i % colors.length];
                return (
                  <div key={i} style={{
                    backgroundColor: "#0f172a",
                    borderRadius: "10px",
                    padding: "16px",
                    border: "1px solid #334155"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img
                          src={course.thumbnail}
                          alt=""
                          style={{
                            width: "48px", height: "48px",
                            borderRadius: "8px", objectFit: "cover"
                          }}
                        />
                        <div>
                          <p style={{ fontWeight: "bold", fontSize: "15px" }}>
                            {course.courseName}
                          </p>
                          <p style={{ color: "#94a3b8", fontSize: "12px" }}>
                            {course.instructor?.firstName} {course.instructor?.lastName}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ color, fontSize: "20px", fontWeight: "bold" }}>
                          {progress}%
                        </p>
                        <p style={{ color: "#94a3b8", fontSize: "12px" }}>
                          {progress === 100 ? "✅ Completed" : "⏳ In Progress"}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                      backgroundColor: "#1e293b",
                      borderRadius: "10px",
                      height: "10px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: "100%",
                        backgroundColor: color,
                        borderRadius: "10px",
                        transition: "width 0.5s ease"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radial Chart */}
          <div style={{
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "24px",
          }}>
            <h2 style={{
              fontSize: "20px", fontWeight: "bold",
              marginBottom: "20px", color: "#FFD60A"
            }}>
              🎯 Progress Radial View
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                innerRadius="20%"
                outerRadius="90%"
                data={radialData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: "insideStart", fill: "#fff", fontSize: 12 }}
                  background
                  clockWise
                  dataKey="progress"
                />
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ color: "#94a3b8", fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #FFD60A",
                    borderRadius: "8px",
                    color: "#ffffff"
                  }}
                  formatter={(value) => [`${value}%`, "Progress"]}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentProgressDashboard;