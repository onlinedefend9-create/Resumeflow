import React from 'react'
import { GitHubSignInButton } from '@/app/components/GitHubSignInButton'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-sm w-full p-6 bg-white rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4">Se connecter</h1>
        <p className="text-sm text-gray-600 mb-6">Connectez-vous pour accéder à votre tableau de bord et vos CV.</p>
        <GitHubSignInButton />
      </div>
    </main>
  )
}
