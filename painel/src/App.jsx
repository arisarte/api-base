import React, { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/v1'

function useFetch(url, options) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reload = () => {
    setLoading(true)
    fetch(url, options).then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(e => { setError(e); setLoading(false) })
  }

  useEffect(() => { reload() }, [url])
  return { data, loading, error, reload }
}

function TabButton({ label, active, onClick }) {
  return <button onClick={onClick} style={{ marginRight: 8, padding: '6px 12px', background: active ? '#0066ff' : '#eee', color: active ? '#fff' : '#000', border: 'none', borderRadius: 4 }}>{label}</button>
}

export default function App() {
  const [tab, setTab] = useState('articles')
  const token = window.localStorage.getItem('admin_token') || ''

  const headers = token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }

  const articles = useFetch(`${API}/articles`, { headers })
  const webstories = useFetch(`${API}/webstories`, { headers })
  const comments = useFetch(`${API}/comments`, { headers })
  const subscribers = useFetch(`${API}/newsletter/subscribers`, { headers })
  const consents = useFetch(`${API}/cookies/consents`, { headers })

  async function remove(url) {
    await fetch(url, { method: 'DELETE', headers })
    // reload all
    articles.reload(); webstories.reload(); comments.reload(); subscribers.reload(); consents.reload();
  }

  async function createWebstory() {
    const title = prompt('Title')
    if (!title) return
    const payload = { title, slides: [{ text: 'slide 1' }] }
    await fetch(`${API}/webstories`, { method: 'POST', headers, body: JSON.stringify(payload) })
    webstories.reload()
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Painel Admin (leve)</h1>
      <p>API base: {API}</p>
      <div style={{ marginBottom: 12 }}>
        <TabButton label="Articles" active={tab==='articles'} onClick={() => setTab('articles')} />
        <TabButton label="Webstories" active={tab==='webstories'} onClick={() => setTab('webstories')} />
        <TabButton label="Comments" active={tab==='comments'} onClick={() => setTab('comments')} />
        <TabButton label="Subscribers" active={tab==='subscribers'} onClick={() => setTab('subscribers')} />
        <TabButton label="Consents" active={tab==='consents'} onClick={() => setTab('consents')} />
      </div>

      <div>
        {tab === 'articles' && (
          <section>
            <h2>Articles</h2>
            {articles.loading && <div>Loading...</div>}
            {articles.data && Array.isArray(articles.data.data) && (
              <ul>
                {articles.data.data.map(a => <li key={a.id}>{a.title} <button onClick={() => remove(`${API}/articles/${a.id}`)}>Delete</button></li>)}
              </ul>
            )}
          </section>
        )}

        {tab === 'webstories' && (
          <section>
            <h2>Webstories <button onClick={createWebstory}>Create</button></h2>
            {webstories.loading && <div>Loading...</div>}
            {webstories.data && Array.isArray(webstories.data) && (
              <ul>
                {webstories.data.map(w => <li key={w.id}>{w.title} <button onClick={() => remove(`${API}/webstories/${w.id}`)}>Delete</button></li>)}
              </ul>
            )}
          </section>
        )}

        {tab === 'comments' && (
          <section>
            <h2>Comments</h2>
            {comments.loading && <div>Loading...</div>}
            {comments.data && Array.isArray(comments.data.data) && (
              <ul>
                {comments.data.data.map(c => <li key={c.id}>[{c.user_name}] {c.content} <button onClick={() => remove(`${API}/comments/${c.id}`)}>Delete</button></li>)}
              </ul>
            )}
          </section>
        )}

        {tab === 'subscribers' && (
          <section>
            <h2>Subscribers</h2>
            {subscribers.loading && <div>Loading...</div>}
            {subscribers.data && Array.isArray(subscribers.data.data) && (
              <ul>
                {subscribers.data.data.map(s => <li key={s.email}>{s.email}</li>)}
              </ul>
            )}
          </section>
        )}

        {tab === 'consents' && (
          <section>
            <h2>Cookie Consents</h2>
            {consents.loading && <div>Loading...</div>}
            {consents.data && Array.isArray(consents.data.data) && (
              <ul>
                {consents.data.data.map((c, idx) => <li key={idx}>{JSON.stringify(c)}</li>)}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
