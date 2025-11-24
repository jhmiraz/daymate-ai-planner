import { useState, useEffect } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPlan = async (c = '') => {
    setLoading(true)
    try {
      const url = c 
        ? `https://your-backend-url.onrender.com/api/plan?city=${c}`
        : 'https://your-backend-url.onrender.com/api/plan'
      const res = await fetch(url)
      const json = await res.json()
      setData(json)
    } catch (e) {
      alert("Backend not deployed yet — we'll fix in 2 mins")
      setData({ city: "Dhaka", temp: 28, weather: "Clear", news: ["Demo news"], suggestions: "• Perfect day for outdoor work\n• Stay hydrated\n• Great weather in Dhaka!" })
    }
    setLoading(false)
  }

  useEffect(() => { fetchPlan() }, [])

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">DayMate</h1>
        <p className="text-center text-xl opacity-80 mb-10">Your AI Daily Planner</p>

        <div className="card bg-base-100 shadow-2xl text-neutral-content">
          <div className="card-body">
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Enter city (or leave blank for auto)"
                className="input input-bordered flex-1"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && fetchPlan(city)}
              />
              <button onClick={() => fetchPlan(city)} className="btn btn-primary">Go</button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : data && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold">{data.city}</h2>
                  <p className="text-6xl font-bold mt-4">{Math.round(data.temp)}°C</p>
                  <p className="text-2xl capitalize opacity-80">{data.weather}</p>
                </div>

                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <h3 className="font-bold text-lg mb-3">Latest News</h3>
                  <ul className="space-y-2">
                    {data.news.map((n, i) => <li key={i}>• {n}</li>)}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-2xl text-white">
                  <h3 className="text-2xl font-bold mb-4">AI Suggestions</h3>
                  <pre className="whitespace-pre-wrap font-sans text-lg">{data.suggestions}</pre>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center mt-10 opacity-70 text-sm">
          Built by Md Jubair Hasan Miraz • FastAPI + React + daisyUI
        </p>
      </div>
    </div>
  )
}

export default App