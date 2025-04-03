import { http, HttpResponse } from 'msw'
import { samples } from '@/samples'

export const handlers = [
  http.get('/api/samples', () => {
    // Return a list of all available samples
    return HttpResponse.json(Object.keys(samples))
  }),
  
  http.get('/api/samples/:sampleName', ({ params }) => {
    const sampleName = params.sampleName as string
    const sample = samples[sampleName]
    
    if (!sample) {
      return new HttpResponse(
        JSON.stringify({ error: 'Sample not found' }),
        { status: 404 }
      )
    }
    
    return HttpResponse.json(sample)
  })
]