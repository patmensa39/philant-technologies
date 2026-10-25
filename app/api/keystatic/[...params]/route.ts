import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';
import { adminEnabled } from '@/lib/admin-guard';

const handler = makeRouteHandler({ config });
const off = () => new Response('Not found', { status: 404 });

export async function GET(req: Request) { return adminEnabled() ? handler.GET(req) : off(); }
export async function POST(req: Request) { return adminEnabled() ? handler.POST(req) : off(); }
