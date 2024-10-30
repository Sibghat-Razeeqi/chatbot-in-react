from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from ctransformers import AutoModelForCausalLM

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_name = "zoltanctoth/orca_mini_3B-GGUF"
try:
    llm = AutoModelForCausalLM.from_pretrained(model_name, model_file="orca-mini-3b.q4_0.gguf")
except Exception as e:
    print(f"Error loading model: {e}")
    raise

class SummarizeRequest(BaseModel):
    text: str

class QuestionRequest(BaseModel):
    question: str
    history: List[str] = []  

def get_prompt(instruction: str, history: List[str]) -> str:
    system = "AI assistant that gives a helpful answer."
    prompt = f"### System:\n{system}\n\n### User:\n"
    if history:
        prompt += f"This is the conversation history: {''.join(history)}. Now answer the question: "
    prompt += f"{instruction}\n\n### Response:\n"
    print(f"Prompt created: {prompt}")
    return prompt

@app.post("/summarize")
def summarize_text(request: SummarizeRequest):
    try:
        input_text = "summarize: " + request.text
        response = ""
        for word in llm(input_text, stream=True):  
            response += word
        return {"summary": response.strip()}
    except Exception as e:
        return {"error": str(e)}

@app.post("/ask_question")
def ask_question(request: QuestionRequest):
    try:
        prompt = get_prompt(request.question, request.history)
        response = ""
        for word in llm(prompt, stream=True):  
            response += word
        return {"answer": response.strip()}
    except Exception as e:
        return {"error": str(e)}
