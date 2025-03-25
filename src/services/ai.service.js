import api from "./api.service";

class AIService {
  sendMessage = (message) => {
    return api.post("/api/ai/chat", { message });
  };
}

// Create one instance (object) of the service
const aiService = new AIService();

export default aiService;
