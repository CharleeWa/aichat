import request from '@/utils/request'

export async function generate(msg): Promise<any> {
  const playload = {
    messages: msg,
  }
  return request.post('/aiapi/trans/v1/chat/completions', playload)
}
