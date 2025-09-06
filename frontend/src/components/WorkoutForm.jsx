import React, { useState } from 'react'

export default function WorkoutForm({ onSubmit }){
  const today = new Date().toISOString().slice(0,10)
  const [form, setForm] = useState({ date: today, type: 'run', duration_minutes: 30, calories: 200, notes: '' })

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, duration_minutes: Number(form.duration_minutes), calories: Number(form.calories) })
    setForm(f => ({ ...f, duration_minutes: 30, calories: 200, notes: '' }))
  }

  return (
    <form onSubmit={submit} className="grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
      <div>
        <label>Date</label>
        <input type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})} required />
      </div>
      <div>
        <label>Type</label>
        <select value={form.type} onChange={e => setForm({...form, type:e.target.value})}>
          <option value="run">Run</option>
          <option value="cycle">Cycle</option>
          <option value="yoga">Yoga</option>
          <option value="strength">Strength</option>
          <option value="swim">Swim</option>
          <option value="walk">Walk</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label>Duration (min)</label>
        <input type="number" min="1" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes:e.target.value})} required />
      </div>
      <div>
        <label>Calories</label>
        <input type="number" min="0" value={form.calories} onChange={e => setForm({...form, calories:e.target.value})} />
      </div>
      <div style={{gridColumn:'1 / span 2'}}>
        <label>Notes</label>
        <textarea rows="2" value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} placeholder="How did it feel?" />
      </div>
      <div style={{gridColumn:'1 / span 2', display:'flex', gap:8, justifyContent:'flex-end'}}>
        <button type="submit">Add Workout</button>
      </div>
    </form>
  )
}
