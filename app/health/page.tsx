async function getHealthData() {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch health data");
    }
    return res.json();
  }
  
  export default async function HealthPage() {
    const data = await getHealthData();
  
    return (
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Health Check</h1>
        <p className="mt-2 text-sm text-gray-500">Fetched data from a live API:</p>
        <pre className="mt-4 rounded-lg bg-gray-900 p-4 text-xs text-green-400">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }