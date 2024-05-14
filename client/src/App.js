import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [essayInput, setEssayInput] = useState("");
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [essayPrompt, setEssayPrompt] = useState("");

  useEffect(() => {
    const promptText = `Directions: For this part, you are allowed 30 minutes to write an
    advertisement on your campus website to sell some of the course books you
    used at college. Your advertisement may include a brief description of
    their content, their condition and price and your contact information. You
    should write at least 120 words but no more than 180 words.`;
    setEssayPrompt(promptText);
  }, []);

  const handleEssayChange = (event) => {
    setEssayInput(event.target.value);
  };

  const submitEssay = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:3000/score", {
        essay: essayInput,
        title: essayPrompt,
      });
      setScore(response.data.totalScore);
    } catch (error) {
      console.error("Error submitting essay:", error);
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      setScore(null);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>作文评分</h1>
      <div id="essayPrompt" style={{ marginBottom: "20px" }}>
        {essayPrompt}
      </div>
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
