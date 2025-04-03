// src/api/samples.ts
export async function getSamplesList() {
  const response = await fetch('/api/samples');

  if (response.status === 304) {
    throw new Error('API call failed. Ensure the backend is up or enable MSW mocking.');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch samples list');
  }

  return response.json();
}

export async function getSampleByName(sampleName: string) {
  const response = await fetch(`/api/samples/${sampleName}`);

  if (response.status === 304) {
    throw new Error('API call failed. Ensure the backend is up or enable MSW mocking.');
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch sample: ${sampleName}`);
  }

  return response.json();
}