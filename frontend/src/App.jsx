import React, { useEffect, useState } from 'react'
import { api } from './api'
import WorkoutForm from './components/WorkoutForm'
import WorkoutList from './components/WorkoutList'
import ProfileCard from './components/ProfileCard'

export default function App(){
  const [workouts, setWorkouts] = useState([])
  const [stats, setStats] = useState({ total_workouts: 0, total_minutes: 0, total_calories: 0, by_type: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = async () => {
    try{
      setLoading(true)
      const [ws, st] = await Promise.all([api('/workouts'), api('/stats')])
      setWorkouts(ws)
      setStats(st)
      setError(null)
    }catch(e){
      setError(e.message)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ refresh() }, [])

  const addWorkout = async (w) => {
    await api('/workouts', { method: 'POST', body: JSON.stringify(w) })
    refresh()
  }
  const updateWorkout = async (id, w) => {
    await api(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(w) })
    refresh()
  }
  const deleteWorkout = async (id) => {
    await api(`/workouts/${id}`, { method: 'DELETE' })
    refresh()
  }

  return (
    <div className="container">
      <h1>🏋️ Personal Fitness Manager</h1>
      <div className="row">
        <div className="card">
          <h2>Quick Add Workout</h2>
          <WorkoutForm onSubmit={addWorkout} />
          <div className="footer">Tip: Track run, cycle, yoga, strength, etc.</div>
        </div>
        <div className="card">
          <h2>Your Profile</h2>
          <ProfileCard />
        </div>
      </div>

      <div className="row" style={{marginTop:16}}>
        <div className="card">
          <h2>Recent Workouts</h2>
          {loading ? <div>Loading...</div> : error ? <div>{error}</div> : <WorkoutList items={workouts} onDelete={deleteWorkout} onUpdate={updateWorkout} />}
        </div>
        <div className="card">
          <h2>Overview</h2>
          <div className="kpi">
            <div className="box"><div className="badge">Total Workouts</div><div style={{fontSize:28,fontWeight:700}}>{stats.total_workouts}</div></div>
            <div className="box"><div className="badge">Total Minutes</div><div style={{fontSize:28,fontWeight:700}}>{stats.total_minutes}</div></div>
            <div className="box"><div className="badge">Total Calories</div><div style={{fontSize:28,fontWeight:700}}>{stats.total_calories}</div></div>
          </div>
          <div style={{marginTop:12}}>
            <div className="badge">By Type</div>
            <ul>
              {stats.by_type.map((b,i)=> <li key={i} style={{marginTop:6}}>{b.type}: {b.count}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
