import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State to store the fetched data
  const [data, setData] = useState(null);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to manage any errors during the fetch
  const [error, setError] = useState(null);

  // useEffect hook to perform the API call when the component mounts
  useEffect(() => {
    // Define the API endpoint
    // Ensure this URL matches your .NET Core Web API's actual address and port
    //const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:57050'; // Fallback for safety
    const apiBaseUrl = import.meta.env.VITE_APP_API_BASE_URL || 'http://127.0.0.1:8080'
    const apiUrl = `${apiBaseUrl}/api/employees`; 

    // Async function to fetch data
    const fetchData = async () => {
      try {
        // Set loading to true before starting the fetch
        setLoading(true);
        // Clear any previous errors
        setError(null);

        // Make the HTTP GET request
        const response = await fetch(apiUrl);
        // console.log(response.body); // response.body is a ReadableStream, not directly loggable as content here

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
          // If not OK, throw an error with the status text
          // Attempt to read response body for more detailed error from API
          const errorBody = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorBody || response.statusText}`);
        }

        // Parse the JSON response
        const result = await response.json();
        // Set the fetched data to state
        setData(result);
      } catch (err) {
        // Catch any errors during the fetch or parsing and set the error state
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        // Set loading to false once the fetch is complete (whether successful or not)
        setLoading(false);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  const renderEmployee = (employee) => (
    <div key={employee.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 last:mb-0">
      <p className="text-gray-600">
        <span className="font-medium">ID:</span> {employee.id}
      </p>
      <p className="text-gray-600">
        <span className="font-medium">Name:</span> {employee.name}
      </p>
      <p className="text-gray-600">
        <span className="font-medium">Age:</span> {employee.age}
      </p>
      <p className="text-gray-600">
        <span className="font-medium">Position:</span> {employee.position}
      </p>
      {/* <p className="text-gray-600">
        <span className="font-medium">Salary:</span> {employee.salary}
      </p> */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          API Data Fetcher
        </h1>

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading data...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {data && !loading && !error && (
          <div className="mt-6 text-left">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Fetched Data:</h2>
            {/* Check if data is an array and map over it, otherwise render as a single object */}
            {Array.isArray(data) ? (
              data.length > 0 ? (
                data.map(employee => renderEmployee(employee))
              ) : (
                <p className="text-gray-500">No employees found.</p>
              )
            ) : (
              renderEmployee(data)
            )}
          </div>
        )}

        {!data && !loading && !error && (
          <p className="text-gray-500 mt-6">No data fetched yet. Check your API endpoint or network.</p>
        )}
      </div>
    </div>
  );
};

export default App;
