import path from 'path'
/** Runtime folders. Point these at persistent volumes in production (see RUNBOOKS). */
export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'))
export const BACKUP_DIR = path.resolve(process.env.BACKUP_DIR || path.join(process.cwd(), 'backups'))
