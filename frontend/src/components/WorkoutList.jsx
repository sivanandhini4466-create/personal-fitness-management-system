import React, { useState } from 'react'

export default function WorkoutList({ items, onDelete, onUpdate }){
  const [editingId, setEditingId] = useState(null)
  const [edit, setEdit] = useState(null)

  const startEdit = (item) => {
    setEditingId(item.id)
    setEdit({...item})
  }
  const save = () => {
    const payload = { ...edit, duration_minutes: Number(edit.duration_minutes), calories: Number(edit.calories) }
    onUpdate(edit.id, payload)
    setEditingId(null)
    setEdit(null)
  }

  if(items.length === 0) return <div>No workouts yet. Add your first one!</div>

  return (
    <div className="list">
      {items.map(item => (
        <div key={item.id} className="item">
          {editingId === item.id ? (
            <div style={{flex:1}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
                <input type="date" value={edit.date} onChange={e=>setEdit({...edit, date:e.target.value})} />
                <input value={edit.type} onChange={e=>setEdit({...edit, type:e.target.value})} />
                <input type="number" value={edit.duration_minutes} onChange={e=>setEdit({...edit, duration_minutes:e.target.value})} />
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:8, marginTop:8}}>
                <input type="number" value={edit.calories} onChange={e=>setEdit({...edit, calories:e.target.value})} />
                <input value={edit.notes||''} onChange={e=>setEdit({...edit, notes:e.target.value})} placeholder="Notes" />
              </div>
            </div>
          ) : (
            <div style={{flex:1}}>
              <div style={{display:'flex', alignItems:'center', gap:8, flexWrap:'wrap'}}>
                <span className="badge">{item.date}</span>
                <strong style={{textTransform:'capitalize'}}>{item.type}</strong>
                <span>{item.duration_minutes} min</span>
                {item.calories ? <span>• {item.calories} cal</span> : null}
              </div>
              {item.notes ? <div style={{opacity:.8, marginTop:6}}>{item.notes}</div> : null}
            </div>
          )}
          <div style={{display:'flex', gap:8}}>
            {editingId === item.id ? (
              <>
                <button onClick={save}>Save</button>
                <button className="ghost" onClick={()=>{ setEditingId(null); setEdit(null) }}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={()=>startEdit(item)}>Edit</button>
                <button className="ghost" onClick={()=>onDelete(item.id)}>Delete</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
