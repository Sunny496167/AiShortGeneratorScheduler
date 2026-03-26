'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function SupabaseTestPage() {
  const [status, setStatus] = useState<'testing' | 'success' | 'fail'>('testing')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      const supabase = createClient()
      try {
        // Try a simple ping by fetching the current user session
        const { error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus('fail')
          setErrorMsg(error.message)
        } else {
          setStatus('success')
        }
      } catch (err: any) {
        setStatus('fail')
        setErrorMsg(err.message)
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Supabase Connection Diagnostic</h1>
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        borderRadius: '8px',
        backgroundColor: status === 'testing' ? '#eee' : status === 'success' ? '#dcfce7' : '#fee2e2',
        color: status === 'testing' ? '#333' : status === 'success' ? '#166534' : '#991b1b',
        border: '1px solid currentColor'
      }}>
        {status === 'testing' && 'Testing connection...'}
        {status === 'success' && '✅ Client-side Supabase connection successful! Environment variables are correctly configured.'}
        {status === 'fail' && (
          <div>
            <p>❌ Connection failed.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}><strong>Error:</strong> {errorMsg}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>To fix connection issues:</strong></p>
        <ul style={{ marginTop: '0.5rem' }}>
          <li>Double check <code>NEXT_PUBLIC_SUPABASE_URL</code> in your <code>.env</code> file.</li>
          <li>Double check <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your <code>.env</code> file.</li>
          <li>Make sure you restarted your development server (<code>npm run dev</code>) after updating <code>.env</code>.</li>
        </ul>
      </div>
    </div>
  )
}
