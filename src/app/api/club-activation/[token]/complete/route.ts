import { forwardToActivationApi } from '../proxy';

type Params = { params: Promise<{ token: string }> };

export async function POST(request: Request, { params }: Params) {
  const { token } = await params;
  const body = await request.json().catch(() => ({}));
  return forwardToActivationApi(token, '/complete', {
    method: 'POST',
    body: JSON.stringify({ email: body?.email, code: body?.code, password: body?.password }),
  });
}
