function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mt-2 text-3xl font-bold">Vite + React</h1>
      <div className="mt-4 space-x-4">
        <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">1번버튼</button>
        <button className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">2번버튼</button>
      </div>
      <p className="read-the-docs mt-4">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
