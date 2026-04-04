function MainLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 h-screen bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold">Finance App</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {children}
      </div>
    </div>
  );
}

export default MainLayout;