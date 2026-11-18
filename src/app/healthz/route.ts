/** Liveness: the process is up. Never touches the database, so a database outage does not make the platform restart the app in a loop. */
export const dynamic = 'force-dynamic'
export function GET() {
  return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
}
