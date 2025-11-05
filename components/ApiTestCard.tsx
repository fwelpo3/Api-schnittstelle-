
import React, { useState, useCallback } from 'react';

interface ApiTestCardProps {
  title: string;
  description: string;
  method: 'GET' | 'POST';
  defaultUrl: string;
  defaultBody?: string;
  showBody?: boolean;
}

const mockApiEndpoints: Record<string, any> = {
  '/api/hello': {
    GET: () => ({
      status: 200,
      body: { message: 'Hallo von der simulierten Vercel API!' },
    }),
  },
  '/api/submit': {
    POST: (requestBody: string) => {
      try {
        const data = JSON.parse(requestBody);
        return {
          status: 200,
          body: { message: 'Daten erfolgreich empfangen!', receivedData: data },
        };
      } catch (e) {
        return { status: 400, body: { error: 'Invalid JSON in request body' } };
      }
    },
  },
  '/api/products': {
      GET: () => ({
          status: 200,
          body: [
              { id: 'p1', name: 'Quantum Laptop', price: 2499.99 },
              { id: 'p2', name: 'Neural-Interface Headset', price: 799.00 },
              { id: 'p3', name: 'Holographic Display', price: 1800.50 },
          ]
      })
  }
};


const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
  </div>
);

export const ApiTestCard: React.FC<ApiTestCardProps> = ({
  title,
  description,
  method,
  defaultUrl,
  defaultBody = '',
  showBody = false,
}) => {
  const [url, setUrl] = useState(defaultUrl);
  const [body, setBody] = useState(defaultBody);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [isBodyValid, setIsBodyValid] = useState(true);

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBody = e.target.value;
    setBody(newBody);
    if (method === 'POST') {
      try {
        JSON.parse(newBody);
        setIsBodyValid(true);
      } catch (e) {
        setIsBodyValid(false);
      }
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!url) {
      setError('Bitte gib eine URL ein.');
      return;
    }
    if (method === 'POST' && !isBodyValid) {
        setError('Der JSON-Body ist ungültig.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setStatus(null);

    // Mock API simulation for local paths
    if (url.startsWith('/api/')) {
      const endpoint = mockApiEndpoints[url];
      if (endpoint && endpoint[method]) {
        setTimeout(() => {
          const res = endpoint[method](body);
          setStatus(res.status);
          if (res.status >= 200 && res.status < 400) {
            setResponse(JSON.stringify(res.body, null, 2));
          } else {
            setError(`Fehler: ${JSON.stringify(res.body, null, 2)}`);
          }
          setIsLoading(false);
        }, 800); // Simulate network delay
      } else {
        setTimeout(() => {
          setStatus(404);
          setError(`Simulierter API Endpunkt nicht gefunden: ${method} ${url}`);
          setIsLoading(false);
        }, 500);
      }
      return;
    }

    // Real fetch for external URLs
    try {
      const options: RequestInit = {
        method,
        headers: {},
      };

      if (method === 'POST') {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = body;
      }
      
      const res = await fetch(url, options);
      setStatus(res.status);

      const responseData = await res.json();
      setResponse(JSON.stringify(responseData, null, 2));

    } catch (err: any) {
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [url, body, method, isBodyValid]);
  
  const getStatusColor = () => {
    if (!status) return 'bg-gray-500';
    if (status >= 200 && status < 300) return 'bg-green-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500';
    if (status >= 500) return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 flex flex-col h-full">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-2 mb-4">{description}</p>
      
      <div className="space-y-4 flex-grow flex flex-col">
        <div className="flex items-center bg-gray-900 rounded-md border border-gray-600 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
          <span className={`px-3 font-semibold text-sm ${method === 'GET' ? 'text-blue-400' : 'text-teal-300'}`}>{method}</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="z.B. /api/hello oder eine externe URL"
            className="w-full bg-transparent p-2 text-gray-200 outline-none"
          />
        </div>

        {showBody && (
            <div className='flex-grow flex flex-col'>
                <label className="text-sm font-medium text-gray-300 mb-1">Request Body (JSON)</label>
                <textarea
                    value={body}
                    onChange={handleBodyChange}
                    placeholder='{ "key": "value" }'
                    className={`w-full flex-grow bg-gray-900 p-2 rounded-md border text-sm font-mono text-gray-200 outline-none focus:ring-1 ${isBodyValid ? 'border-gray-600 focus:border-blue-400 focus:ring-blue-400' : 'border-red-500 focus:border-red-500 focus:ring-red-500'}`}
                    rows={5}
                />
                 {!isBodyValid && <p className="text-xs text-red-400 mt-1">Ungültiges JSON-Format.</p>}
            </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !url || (method === 'POST' && !isBodyValid)}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? 'Senden...' : 'Anfrage senden'}
        </button>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
          Antwort
          {status && <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${getStatusColor()}`}>{status}</span>}
        </h4>
        <div className="w-full bg-gray-900 rounded-md border border-gray-700 min-h-[120px] text-sm p-4 font-mono overflow-auto">
          {isLoading && <LoadingSpinner />}
          {error && <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>}
          {response && <pre className="text-green-300 whitespace-pre-wrap">{response}</pre>}
          {!isLoading && !error && !response && <span className="text-gray-500">Die Antwort der API wird hier angezeigt.</span>}
        </div>
      </div>
    </div>
  );
};
