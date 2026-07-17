import { useState, useEffect } from 'react'
import { AuthClient } from '@my-org/auth-client'
import './App.css'

// IMPORTANT: Replace this with an actual appId from your dashboard!
const auth = new AuthClient({
  appId: '46a7715d-3656-47cb-b6d2-8df6ce910060', // We will ask the user to configure this
  serverUrl: 'http://localhost:3000'
})

function App() {
  const [token, setToken] = useState<string | null>(auth.getToken())
  const [isSignup, setIsSignup] = useState(false)
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      // The container needs to exist before we render
      setTimeout(() => {
        auth.renderGoogleButton('#google-login', {
          onSuccess: (newToken) => {
            setToken(newToken)
          },
          onError: (err) => console.error("Google Auth Error", err)
        })
      }, 500)
    }
  }, [token, isSignup]) // Re-render google button if we switch views and mount it again

  const handleLogout = () => {
    auth.logout()
    setToken(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      let newToken;
      if (isSignup) {
        newToken = await auth.signup({ userName, email, password });
      } else {
        newToken = await auth.login(email, password);
      }
      setToken(newToken);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  }

  if (token) {
    return (
      <div className="card">
        <h1>Welcome!</h1>
        <p>You are logged in.</p>
        <p style={{wordBreak: 'break-all', fontSize: '0.8rem', color: '#666'}}>Token: {token}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  return (
    <div className="card">
      <h1>React Auth Demo</h1>
      <p>{isSignup ? 'Create a new account' : 'Sign in using the SDK'}</p>
      
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto'}}>
        {isSignup && (
          <input 
            type="text" 
            placeholder="Username" 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            style={{padding: '8px'}}
          />
        )}
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{padding: '8px'}}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{padding: '8px'}}
        />
        {error && <p style={{color: 'red', margin: 0, fontSize: '0.9rem'}}>{error}</p>}
        <button type="submit">{isSignup ? 'Sign Up' : 'Sign In'}</button>
      </form>

      <div style={{marginTop: '1rem'}}>
        <button 
          onClick={() => { setIsSignup(!isSignup); setError(''); }}
          style={{background: 'transparent', border: 'none', color: '#646cff', cursor: 'pointer', textDecoration: 'underline'}}>
          {isSignup ? 'Already have an account? Log in' : 'Need an account? Sign up'}
        </button>
      </div>

      <div style={{margin: '1.5rem 0', color: '#888'}}>OR</div>

      <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
        <div id="google-login"></div>
      </div>
    </div>
  )
}

export default App
