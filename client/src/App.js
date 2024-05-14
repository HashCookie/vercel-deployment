import "./App.css";
import { useState } from "react";
import axios from "axios"; // 如果你选择使用axios的话

function App() {
  const [essayInput, setEssayInput] = useState("");
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEssayChange = (event) => {
    setEssayInput(event.target.value);
  };

  const submitEssay = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:3000/score", {
        essay: essayInput,
      });
      setScore(response.data.totalScore);
    } catch (error) {
      console.error("Error submitting essay:", error);
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
      }
      setScore(null);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>作文评分</h1>
      <textarea
        rows="10"
        cols="50"
        placeholder="请输入你的作文..."
        value={essayInput}
        onChange={handleEssayChange}
      ></textarea>
      <br />
      <button onClick={submitEssay} disabled={isLoading}>
        {isLoading ? "提交中..." : "提交评分"}
      </button>
      {score !== null && <div>你的分数是: {score}</div>}
    </div>
  );
}

export default App;
