
import React from 'react';
import { CodeBlock } from './components/CodeBlock';
import { ApiTestCard } from './components/ApiTestCard';

const getCodeSnippet = `
// Diese Datei existiert bereits im Projekt:
// /api/hello.js

export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Hallo von deiner Live-API!' 
  });
}
`;

const postCodeSnippet = `
// Diese Datei existiert bereits im Projekt:
// /api/submit.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Die gesendeten Daten sind in req.body verfügbar
    const data = req.body;
    res.status(200).json({ 
      message: 'Daten erfolgreich empfangen!',
      receivedData: data 
    });
  } else {
    // Handle andere Methoden (z.B. GET)
    res.setHeader('Allow', ['POST']);
    res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }
}
`;

const productsCodeSnippet = `
// Diese Datei existiert bereits im Projekt:
// /api/products.js

export default function handler(req, res) {
  const products = [
    { id: 'p1', name: 'Quantum Laptop', price: 2499.99 },
    { id: 'p2', name: 'Neural-Interface Headset', price: 799.00 },
    { id: 'p3', name: 'Holographic Display', price: 1800.50 },
  ];

  res.status(200).json(products);
}
`;

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Serverless API Guide
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Eine interaktive Anleitung zum Erstellen und Testen von API-Endpunkten mit Serverless Functions.
          </p>
        </header>

        <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-3 rounded-lg relative mb-12" role="alert">
          <strong className="font-bold">Gute Nachrichten! </strong>
          <span className="block sm:inline">Die benötigten API-Dateien (z.B. `/api/hello.js`) sind jetzt **Teil dieses Projekts**. Wenn du dieses Projekt auf Vercel deployest, werden sie **automatisch zu funktionierenden Live-API-Endpunkten**.</span>
        </div>

        <main className="space-y-16">
          
          {/* GET Request Section */}
          <section id="get-request">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-blue-400 pl-4">1. GET-Request: Daten abrufen</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-gray-300">
                  Die Datei `/api/hello.js` in diesem Projekt ist eine Serverless Function. Eine Plattform wie Vercel erkennt automatisch alle Dateien im `/api`-Verzeichnis und macht sie unter der entsprechenden URL erreichbar.
                </p>
                <CodeBlock code={getCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="GET-Endpunkt testen"
                description="Dieser Endpunkt wird hier für schnelle Tests simuliert. Sobald du das Projekt deployed hast, kannst du deine echte Live-URL (z.B. 'https://dein-projekt.vercel.app/api/hello') in das URL-Feld einfügen und testen."
                method="GET"
                defaultUrl="/api/hello"
                defaultBody=""
              />
            </div>
          </section>

          {/* POST Request Section */}
          <section id="post-request">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-teal-300 pl-4">2. POST-Request: Daten senden</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-gray-300">
                  Genauso funktioniert es mit POST-Requests. Der Code in `/api/submit.js` prüft die Anfrage-Methode (`req.method`) und kann so auf die gesendeten Daten im `req.body` zugreifen.
                </p>
                <CodeBlock code={postCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="POST-Endpunkt testen"
                description="Teste eine POST-Anfrage. Die Simulation gibt deine gesendeten Daten zurück. Auf Vercel deployed, verarbeitet `/api/submit.js` die echten Daten."
                method="POST"
                defaultUrl="/api/submit"
                defaultBody={JSON.stringify({ user: "Alex", value: 42 }, null, 2)}
                showBody={true}
              />
            </div>
          </section>

          {/* Products List Section */}
          <section id="list-request">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-purple-400 pl-4">3. Beispiel: Eine Daten-Liste abrufen</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-gray-300">
                  Hier ein weiteres Beispiel. Der Code in `/api/products.js` gibt eine statische Liste von Produkten als JSON zurück. Perfekt für einen einfachen Katalog.
                </p>
                <CodeBlock code={productsCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="Produktliste testen"
                description="Rufe eine Liste von Produkten vom Endpunkt `/api/products` ab. Auch diese Datei ist bereit für dein Deployment."
                method="GET"
                defaultUrl="/api/products"
              />
            </div>
          </section>

        </main>

        <footer className="text-center mt-20 py-6 border-t border-gray-700">
          <p className="text-gray-500">Erstellt mit React, TypeScript & Tailwind CSS.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;