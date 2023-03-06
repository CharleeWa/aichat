import request from '@/utils/request'

export async function generate(msg): Promise<any> {
  const playload = {
    model: 'text-davinci-003',
    prompt: msg,
    temperature: 0.3,
    max_tokens: 2000,
    stream: false,
  }
  return request.post('/aiapi/trans/v1/completions', playload)
}
