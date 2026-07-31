'use client'
import React from 'react'
import { createClient } from '@/utils/supabase/client'

export type GitHubSignInButtonProps = {
  className?: string
  label?: string
}

export function GitHubSignInButton({ className = '', label = 'Se connecter avec GitHub' }: GitHubSignInButtonProps) {
  const supabase = createClient()

  const handleSignIn = async () => {
    try {
      if (typeof window === 'undefined') return

      const returnTo = window.location.pathname + window.location.search
      const redirectTo = `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(returnTo)}`

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo }
      })

      if (error) throw error

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Erreur lors de la connexion GitHub', err)
      if (typeof window !== 'undefined') {
        alert('Erreur lors de la connexion avec GitHub. Veuillez réessayer.')
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition ${className}`}
      aria-label={label}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.02c0 4.43 2.865 8.185 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607 1.004.071 1.532 1.033 1.532 1.033.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.22-.253-4.554-1.112-4.554-4.945 0-1.091.39-1.984 1.03-2.683-.103-.253-.447-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.909-1.295 2.748-1.025 2.748-1.025.547 1.379.203 2.398.1 2.651.64.699 1.03 1.592 1.03 2.683 0 3.842-2.338 4.689-4.566 4.938.36.31.682.922.682 1.859 0 1.341-.012 2.423-.012 2.753 0 .268.18.58.688.482C19.137 20.201 22 16.449 22 12.02 22 6.484 17.523 2 12 2z" clipRule="evenodd" />
      </svg>
      <span>{label}</span>
    </button>
  )
}
