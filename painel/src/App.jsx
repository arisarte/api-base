import React, { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/v1'

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    // fetch users example
    fetch(`${API}/users`).then(r => r.json()).then(setUsers).catch(() => {})
  }, [])

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Painel Admin (leve)</h1>
      <p>API base: {API}</p>
      <section>
        <h2>Usuários (exemplo)</h2>
        <ul>
          {users && users.length > 0 ? users.map(u => <li key={u.id}>{u.name} ({u.email})</li>) : (<li>Sem usuários (ou rota /users não disponível)</li>)}
        </ul>
      </section>
    </div>
  )
}

export default App
