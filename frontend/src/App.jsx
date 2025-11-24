import { useState, useEffect } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPlan = async (c = '') => {
    setLoading(true)
    try {
      const url = c
        ? `https://daymate-ai-planner.onrender.com/api/plan?city=${c}`
        : 'https://daymate-ai-planner.onrender.com/api/plan'
      const res = await fetch(url)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setData({
        city: "Dhaka", temp: 28, weather: "Clear",
        news: ["Demo news only (backend waking up)"],
        suggestions: "• Perfect day for outdoor work\n• Stay hydrated\n• Great weather in Dhaka!"
      })
    }
    setLoading(false)
  }

  useEffect(() => { fetchPlan() }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-2xl mx-auto p-6 pt-12">
        <h1 className="text-6xl font-black text-center mb-3 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
          DayMate
        </h1>
        <p className="text-center text-xl opacity-80 mb-12">Your AI-powered daily planner</p>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              placeholder="Enter city (or leave blank for auto-detect)"
              className="input input-bordered input-lg flex-1 bg-white/20 placeholder-white/60 text-white border-white/30"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && fetchPlan(city)}
            />
            <button onClick={() => fetchPlan(city)} className="btn btn-primary btn-lg">
              Plan My Day
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : data && (
            <>
              <div className="text-center mb-10">
                <h2 className="text-5xl font-bold">{data.city}</h2>
                <p className="text-7xl font-black mt-4">{Math.round(data.temp)}°C</p>
                <p className="text-2xl capitalize opacity-90">{data.weather}</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  Latest News
                </h3>
                <ul className="space-y-3 text-lg">
                  {data.news.map((n, i) => <li key={i} className="opacity-90">• {n}</li>)}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-violet-600 to-pink-600 rounded-3xl p-8 text-white">
                <h3 className="text-3xl font-bold mb-5 flex items-center gap-3">
                  AI Suggestions for Today
                </h3>
                <pre className="whitespace-pre-wrap text-xl font-medium leading-relaxed">
                  {data.suggestions}
                </pre>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-16">
          <p className="text-sm opacity-70 mb-4">More projects by Md Jubair Hasan Miraz</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://any-vibes.com" target="_blank" className="btn btn-outline btn-sm">AnyVibes</a>
            <a href="https://www.politeoptic.com" target="_blank" className="btn btn-outline btn-sm">Polite Optic</a>
            <a href="https://aicontenthub-bcd54.firebaseapp.com" target="_blank" className="btn btn-outline btn-sm">AI Content Hub (SaaS)</a>
          </div>
          <p className="mt-6 text-xs opacity-50">
            Built with React + FastAPI + GPT-4o-mini + daisyUI
          </p>
        </div>
      </div>
    </div>
  )
}

export default App