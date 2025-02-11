function Skeleton() {
  return (
    <div className="p-8 w-[55rem] mx-auto bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Mini Dashboard
      </h1>
      {/* Skeleton Loader */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 h-12 w-full rounded-lg flex items-center justify-between px-4"
          >
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
