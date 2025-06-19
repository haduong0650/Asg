// components/Navbar.js
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

const Navbar = () => {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        EcomApp
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link href="/products/add" className="navbar-link">
              Add Product
            </Link>
            <button className="navbar-link" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="navbar-link">
              Login
            </Link>
            <Link href="/register" className="navbar-link">
              Register
            </Link>
          </>
        )}
      </div>

      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #a3d4f2;
          color: #0288d1;
        }
        .navbar-brand {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
        }
        .navbar-links {
          display: flex;
          gap: 1rem;
        }
        .navbar-link {
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          background: none;
          border: none;
          cursor: pointer;
          font: inherit;
        }
        .navbar-link:hover {
          background-color: #555;
        }
      `}</style>
    </nav>
  )
}

export default Navbar
