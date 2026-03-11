import { API_BASE_URL } from '../config';

export const generatePetition = async (data: {
  caseType: string;
  parties: string;
  summary: string;
  documentType: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/ai/petition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Dilekçe oluşturulurken bir hata oluştu.");
  }

  const result = await response.json();
  return result.text;
};

export const analyzeCaseFile = async (content: string) => {
  const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    return { missingPoints: ["Sunucu Hatası"], risks: [], suggestions: [], laws: [] };
  }

  return await response.json();
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
