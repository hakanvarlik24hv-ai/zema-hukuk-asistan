import { API_BASE_URL } from '../config';

export const generatePetition = async (data: {
  caseType: string;
  parties: string;
  summary: string;
  documentType: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/petition`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({ error: "Sunucu hatası (veya JSON dönmedi)." }));
      throw new Error(errorJson.error || `HTTP Hata: ${response.status}`);
    }

    const result = await response.json();
    return result.text;
  } catch (err: any) {
    console.error("Fetch Exception:", err);
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error("Sunucuya bağlanılamadı (CORS veya network hatası). Lütfen backend çalışanından emin olun.");
    }
    throw err;
  }
};

export const analyzeCaseFile = async (content: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      let errorMsg = "Sunucu Hatası";
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (e) {
        // Backend returned HTML or non-JSON content
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (!data || typeof data !== 'object') {
     throw new Error("Geçersiz veri formatı alındı.");
    }
    return data;
  } catch (err: any) {
     console.error("Analysis Fetch Error:", err);
     throw new Error(err.message || "Analiz yapılamadı.");
  }
};

export const searchPrecedents = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/api/ai/precedents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    return [];
  }

  return await response.json();
};

export const generateContract = async (data: {
  contractType: string;
  details: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/ai/contract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Sözleşme oluşturulurken bir hata oluştu.");
  }

  const result = await response.json();
  return result.text;
};
