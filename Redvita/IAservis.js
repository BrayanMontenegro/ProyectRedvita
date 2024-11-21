export const fetchHealthContent = async (query) => {
    const apiKey = 'AIzaSyAl02V0gJYHM5bVEPPQx50pgUKpo4Gk-tw'; // Tu API key de Gemmis
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey;
  
    const body = {
      contents: [
        {
          parts: [
            { text: query }
          ]
        }
      ]
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data && data.generatedText) {
          return data.generatedText; // Devuelve el contenido generado
        } else {
          console.error('Error: Respuesta incompleta de Gemmis');
          return null;
        }
      } else {
        console.error(`Error en la API: ${data.error.message}`);
        return null;
      }
    } catch (error) {
      console.error('Error al generar contenido: ', error);
      return null;
    }
  };
  