import request from '@/utils/request'

export async function generate(msg): Promise<any> {
  const playload = {
    model: 'text-davinci-003',
    prompt: msg,
    temperature: 0.7,
    max_tokens: 2000,
    stream: false,
  }
  return request.post('/aif/aichat', playload)
}
