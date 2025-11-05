
import React, { useState, useCallback } from 'react';

interface ApiTestCardProps {
  title: string;
  description: string;
  method: 'GET' | 'POST';
  defaultUrl: string;
  defaultBody?: string;
  showBody?: boolean;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
  </div>
);

const ScrapedProductCard: React.FC<{ data: any }> = ({ data }) => (
    <div className="font-sans not-italic text-white bg-gray-800 rounded-lg p-4 mb-4 border border-gray-600 shadow-md">
      {data.imageUrl && <img src={data.imageUrl} alt={data.name || 'Produktbild'} className="w-full h-48 object-contain rounded-md mb-4 bg-white" />}
      {data.name && <h5 className="font-bold text-lg mb-2">{data.name}</h5>}
      {data.description && <p className="text-sm text-gray-300 mb-2">{data.description}</p>}
      {data.price && <p className="text-lg font-semibold text-teal-300">{data.price}</p>}
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

    try {
      const options: RequestInit = {
        method,
        headers: {},
      };

      if (method === 'POST' && body) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = body;
      }
      
      const res = await fetch(url, options);
      setStatus(res.status);

      const responseText = await res.text();
      
      if (!res.ok) {
          throw new Error(`HTTP-Fehler ${res.status}: ${responseText}`);
      }
      
      // Versuche, als JSON zu parsen, aber falle auf Text zurück, wenn es fehlschlägt
      try {
          const responseData = JSON.parse(responseText);
          setResponse(JSON.stringify(responseData, null, 2));
      } catch(e) {
          setResponse(responseText);
      }

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

  const renderResponse = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>;
    if (response) {
      try {
        const data = JSON.parse(response);
        // Prüfe, ob es sich um unsere Scraper-Produktdaten handelt
        if (data.name || data.imageUrl) {
          return (
            <>
              <ScrapedProductCard data={data} />
              <hr className="border-gray-700 my-4" />
              <h6 className="font-sans not-italic text-xs text-gray-400 mb-2">ROHDATEN (JSON):</h6>
              <pre className="text-green-300 whitespace-pre-wrap">{response}</pre>
            </>
          );
        }
      } catch (e) { /* Fallback auf reinen Text, wenn JSON-Parsing fehlschlägt */ }
      return <pre className="text-green-300 whitespace-pre-wrap">{response}</pre>;
    }
    return <span className="text-gray-500 font-sans not-italic">Die Antwort der API wird hier angezeigt.</span>;
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
          {renderResponse()}
        </div>
      </div>
    </div>
  );
};
