'use client'

export default function LogoutPage() {
  // Cancella il token di autenticazione
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-xl font-bold text-center text-gray-900">
          Logout in corso...
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Verrai reindirizzato alla pagina admin.
        </p>
      </div>
    </div>
  )
}
