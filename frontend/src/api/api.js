import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const summarizeText = async (text) => {
  try {
    const response = await axios.post(`${API_URL}/summarize`, { text });
    return response.data.summary;
  } catch (error) {
    console.error("Error in summarizeText API call:", error.response || error.message);
    throw error;
  }
};

export const askQuestion = async (question) => {
  try {
    const response = await axios.post(`${API_URL}/ask_question`, { question });
    return response.data.answer;
  } catch (error) {
    console.error("Error in askQuestion API call:", error.response || error.message);
    throw error;
  }
};