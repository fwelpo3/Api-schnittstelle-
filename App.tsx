
import React from 'react';
import { CodeBlock } from './components/CodeBlock';
import { ApiTestCard } from './components/ApiTestCard';

const getCodeSnippet = `
// In deinem Projekt (z. B. Next.js), erstelle die Datei:
// /api/hello.js

export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Hallo von der Vercel API!' 
  });
}
`;

const postCodeSnippet = `
// Erweitere deine API, um POST-Requests zu verarbeiten:
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
    // Handle andere Methoden
    res.setHeader('Allow', ['POST']);
    res.status(405).end(\`Method \${req.method} Not Allowed\`);
  }
}
`;

const productsCodeSnippet = `
// Ein weiterer Endpunkt, der eine Liste von Daten zurückgibt.
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
            Eine interaktive Anleitung zum Erstellen und Testen von einfachen API-Endpunkten mit Serverless Functions.
          </p>
        </header>

        <main className="space-y-16">
          
          {/* GET Request Section */}
          <section id="get-request">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-blue-400 pl-4">1. GET-Request: Daten abrufen</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <p className="text-gray-300">
                  Um einen einfachen API-Endpunkt zu erstellen, der Daten zurückgibt (ein GET-Request), legst du in deinem Projekt eine Datei an, wie hier gezeigt. Vercel oder ähnliche Plattformen machen diese Datei automatisch als API-Endpunkt verfügbar.
                </p>
                <CodeBlock code={getCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="GET-Endpunkt testen"
                description="Dieser Endpunkt ist bereits simuliert. Klicke auf 'Anfrage senden', um ihn zu testen. Du kannst auch eine andere, externe URL eingeben."
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
                  Deine API kann auch Daten empfangen, z. B. von einem Formular. Dafür verwendest du POST-Requests. Der folgende Code zeigt, wie man auf die gesendeten JSON-Daten zugreift und sie zurückgibt.
                </p>
                <CodeBlock code={postCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="POST-Endpunkt testen"
                description="Teste eine POST-Anfrage an den simulierten Endpunkt /api/submit oder eine eigene URL. Die API sollte deine gesendeten Daten zurückgeben."
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
                  APIs werden oft verwendet, um Sammlungen oder Listen von Daten bereitzustellen, z. B. eine Liste von Produkten. Der Code dafür ist sehr einfach: Du erstellst ein Array von Objekten und gibst es als JSON zurück.
                </p>
                <CodeBlock code={productsCodeSnippet} language="javascript" />
              </div>
              <ApiTestCard 
                title="Produktliste testen"
                description="Rufe eine Liste von Produkten vom simulierten Endpunkt /api/products ab."
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
