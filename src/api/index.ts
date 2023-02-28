import request from '@/utils/request'

export async function generate(msg): Promise<any> {
  const playload = {
    model: 'text-davinci-003',
    prompt: msg,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: false,
    n: 1,
  }
  return request.post('/aif/aichat', playload)
}
