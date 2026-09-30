import { forwardToActivationApi } from '../proxy';

type Params = { params: Promise<{ token: string }> };

export async function POST(request: Request, { params }: Params) {
  const { token } = await params;
  const body = await request.json().catch(() => ({}));
  return forwardToActivationApi(token, '/send-code', {
    method: 'POST',
    body: JSON.stringify({ email: body?.email }),
  });
}
