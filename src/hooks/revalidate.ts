import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

/** After any content change, ask the website to rebuild its pages in the background so visitors see the update within seconds. */
const refresh = (req: any) => {
  if (req.context?.seeding) return
  try {
    revalidatePath('/', 'layout')
  } catch {
    // running outside the web server (for example an import script): nothing to refresh
  }
}

export const revalidateChange: CollectionAfterChangeHook = ({ doc, req }) => { refresh(req); return doc }
export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req }) => { refresh(req); return doc }
export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => { refresh(req); return doc }
