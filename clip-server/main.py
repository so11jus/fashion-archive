from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import clip
import torch
import pandas as pd

# Загружаем утверждённые теги из tags.csv
tags_df = pd.read_csv("tags.csv", encoding="utf-8")
all_known_tags = tags_df["tag"].tolist()

# Настройка FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Загружаем модель CLIP
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    # Чтение изображения
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_input = preprocess(image).unsqueeze(0).to(device)

    # Используем все теги из CSV как кандидаты
    text_tokens = clip.tokenize(all_known_tags).to(device)

    # Вычисляем вероятности для каждого тега
    with torch.no_grad():
        logits_per_image, _ = model(image_input, text_tokens)
        probs = logits_per_image.softmax(dim=-1).cpu().numpy()[0]

    # Получаем top-5 тегов
    top_tags = [
        tag for _, tag in sorted(zip(probs, all_known_tags), reverse=True)[:5]
    ]

    return {"tags": top_tags}
