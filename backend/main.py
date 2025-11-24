from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from openai import OpenAI
import ipapi
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DayMate AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.get("/")
def home():
    return {"message": "DayMate backend running!"}

@app.get("/api/plan")
async def get_plan(city: str = None):
    # Auto detect city
    if not city:
        try:
            loc = ipapi.location()
            city = loc.get("city", "Dhaka")
        except:
            city = "Dhaka"

    # Weather
    weather_url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={os.getenv('WEATHER_API_KEY')}&units=metric"
    weather = requests.get(weather_url).json()

    # News (Bangladesh + city fallback)
    news_url = f"https://newsapi.org/v2/top-headlines?country=bd&apiKey={os.getenv('NEWS_API_KEY')}"
    news_data = requests.get(news_url).json()
    headlines = [n["title"] for n in news_data.get("articles", [])[:4]]

    # AI Suggestion
    prompt = f"""
    Location: {city}, Bangladesh
    Weather: {weather.get('weather', [{}])[0].get('description', 'unknown')}, {weather.get('main', {}).get('temp', 0)}°C
    Latest news: {', '.join(headlines[:3])}

    Give 3 short, practical daily suggestions for someone in {city}. Be friendly and local style.
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )

    return {
        "city": city,
        "weather": weather.get("weather", [{}])[0].get("description", "N/A"),
        "temp": weather.get("main", {}).get("temp", 0),
        "news": headlines,
        "suggestions": response.choices[0].message.content.strip()
    }