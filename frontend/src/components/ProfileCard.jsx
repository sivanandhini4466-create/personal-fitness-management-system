import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function ProfileCard(){
  const [p, setP] = useState({ name:'You', height_cm:'', weight_kg:'', goal:'' })
  const [saving, setSaving] = useState(false)

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await api('/profile')
        setP({ ...data, height_cm: data.height_cm || '', weight_kg: data.weight_kg || '', goal: data.goal || '' })
      }catch{}
    })()
  }, [])

  const save = async () => {
    setSaving(true)
    const payload = {
      name: p.name || 'You',
      height_cm: p.height_cm === '' ? null : Number(p.height_cm),
      weight_kg: p.weight_kg === '' ? null : Number(p.weight_kg),
      goal: p.goal || null
    }
    await api('/profile', { method: 'PUT', body: JSON.stringify(payload) })
    setSaving(false)
  }

  return (
    <div className="grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
      <div>
        <label>Name</label>
        <input value={p.name} onChange={e=>setP({...p, name:e.target.value})} placeholder="Your name" />
      </div>
      <div>
        <label>Goal</label>
        <input value={p.goal} onChange={e=>setP({...p, goal:e.target.value})} placeholder="e.g., 5K in 30 mins" />
      </div>
      <div>
        <label>Height (cm)</label>
        <input type="number" value={p.height_cm} onChange={e=>setP({...p, height_cm:e.target.value})} />
      </div>
      <div>
        <label>Weight (kg)</label>
        <input type="number" value={p.weight_kg} onChange={e=>setP({...p, weight_kg:e.target.value})} />
      </div>
      <div style={{gridColumn:'1 / span 2', display:'flex', justifyContent:'flex-end'}}>
        <button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
      </div>
    </div>
  )
}
