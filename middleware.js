import { next } from '@vercel/edge';

export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const expected = process.env.DEMO_PASSWORD;
  if (!expected) return new Response('DEMO_PASSWORD is not set', { status: 503 });
  const header = request.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    const [, password = ''] = atob(encoded).split(':'); // any username, password must match
    if (password === expected) return next();
  }
  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Atomic demo", charset="UTF-8"' },
  });
}
