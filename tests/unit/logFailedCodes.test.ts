import type { Config } from 'payload'
import { describe, expect, it, vi } from 'vitest'
import { logFailedCodes } from '@/lib/twoFactor'

type Ep = { path: string; method: string; handler: (req: unknown) => Promise<Response> }
const wrap = (endpoints: Ep[]) => (logFailedCodes({ endpoints } as unknown as Config) as unknown as { endpoints: Ep[] }).endpoints

const run = async (body: unknown, path = '/verify-totp') => {
  const create = vi.fn(async (_args: { data: { changes: { event: { to: string } } } }) => ({}))
  const eps = wrap([{ path, method: 'POST', handler: async () => Response.json(body) }, { path: '/other', method: 'get', handler: async () => new Response('x') }])
  const e = eps.find((x) => x.path === path) as Ep
  const res = await e.handler({ user: { id: 1, email: 'a@edif.test', role: 'editor' }, payload: { create }, headers: new Headers() })
  return { create, res }
}

describe('logFailedCodes', () => {
  it('writes an audit row for a wrong code and still returns the plugin response', async () => {
    const { create, res } = await run({ ok: false, message: 'bad' })
    expect(create).toHaveBeenCalledTimes(1)
    expect(create.mock.calls[0][0].data.changes.event.to).toMatch(/authenticator code/)
    expect((await res.json()).ok).toBe(false)
  })
  it('also logs a wrong code while setting up and while turning the authenticator off', async () => {
    for (const [path, re] of [['/setup-totp', /setting up/], ['/remove-totp', /turning it off/]] as const) {
      const { create } = await run({ ok: false }, path)
      expect(create).toHaveBeenCalledTimes(1)
      expect(create.mock.calls[0][0].data.changes.event.to).toMatch(re)
    }
  })
  it('writes nothing for a correct code', async () => {
    const { create } = await run({ ok: true })
    expect(create).not.toHaveBeenCalled()
  })
  it('leaves other endpoints untouched', () => {
    const handler = async () => new Response('x')
    expect(wrap([{ path: '/other', method: 'get', handler }])[0].handler).toBe(handler)
  })
})
