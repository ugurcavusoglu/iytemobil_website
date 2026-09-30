import { forwardToActivationApi } from './proxy';

type Params = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { token } = await params;
  return forwardToActivationApi(token, '');
}
