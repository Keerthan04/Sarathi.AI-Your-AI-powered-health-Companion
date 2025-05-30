export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Loading, please wait...
        </h1>
        <p className="text-gray-600">
          Your AI-powered health companion is getting ready
        </p>
      </div>
    </div>
  )
}
