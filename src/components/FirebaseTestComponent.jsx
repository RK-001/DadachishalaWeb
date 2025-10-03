import React, { useState, useEffect } from 'react';
import { testFirebaseConnection, testEnvironmentVariables } from '../utils/firebaseTest';

const FirebaseTestComponent = () => {
  const [testResults, setTestResults] = useState({
    envVars: null,
    connection: null,
    loading: true
  });

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setTestResults(prev => ({ ...prev, loading: true }));
    
    try {
      // Test environment variables
      const envResults = testEnvironmentVariables();
      
      // Test Firebase connection
      const connectionResult = await testFirebaseConnection();
      
      setTestResults({
        envVars: envResults,
        connection: connectionResult,
        loading: false
      });
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        envVars: null,
        connection: false,
        loading: false
      });
    }
  };

  if (testResults.loading) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔥 Testing Firebase Connection...</h3>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  const allEnvVarsPresent = testResults.envVars && Object.values(testResults.envVars).every(v => v);

  return (
    <div className={`border rounded-lg p-4 mb-6 ${
      testResults.connection ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <h3 className="text-lg font-semibold mb-3">
        🔥 Firebase Setup Status
      </h3>
      
      {/* Environment Variables Status */}
      <div className="mb-3">
        <h4 className="font-medium mb-2">Environment Variables:</h4>
        <div className={`inline-flex items-center px-2 py-1 rounded text-sm ${
          allEnvVarsPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {allEnvVarsPresent ? '✅ All Present' : '❌ Some Missing'}
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-3">
        <h4 className="font-medium mb-2">Firebase Connection:</h4>
        <div className={`inline-flex items-center px-2 py-1 rounded text-sm ${
          testResults.connection ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {testResults.connection ? '✅ Connected' : '❌ Connection Failed'}
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={runTests}
        className="btn-primary text-sm px-4 py-2 mt-2"
      >
        🔄 Re-test Connection
      </button>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Check Console:</strong> Open DevTools (F12) → Console for detailed test results</p>
      </div>
    </div>
  );
};

export default FirebaseTestComponent;
