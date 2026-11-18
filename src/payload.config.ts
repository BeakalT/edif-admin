import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { readEnv } from './lib/env'
import { ADMIN_ROUTE } from './lib/adminRoute'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, type CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { payloadTotp } from 'payload-totp'
import { emailAdapter } from './lib/mailer'

import { Users } from './collections/Users'
import { Notifications } from './collections/Notifications'
import { dailyChecks } from './jobs/dailyChecks'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Publications } from './collections/Publications'
import { Faqs } from './collections/Faqs'
import { Members } from './collections/Members'
import { SeoPages } from './collections/SeoPages'
import { Redirects } from './collections/Redirects'
import { AuditLog } from './collections/AuditLog'
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'
import { BrandTheme } from './globals/BrandTheme'
import { Pages } from './collections/Pages'
import { Tenders } from './collections/Tenders'
import { Vacancies } from './collections/Vacancies'
import { Events } from './collections/Events'
import { People } from './collections/People'
import { KeyFigures } from './collections/KeyFigures'
import { Notices } from './collections/Notices'
import { Messages } from './collections/Messages'
import { PageViews } from './collections/PageViews'
import { Subscribers } from './collections/Subscribers'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const env = readEnv()
const isProd = process.env.NODE_ENV === 'production'

/**
 * PostgreSQL in production (DATABASE_URL=postgres://...), SQLite for the local demo.
 * Production never auto-changes the schema: changes ship as reviewed migrations (npm run migrate).
 */
const db =
  env.dialect === 'postgres'
    ? postgresAdapter({ pool: { connectionString: env.db, max: Number(process.env.DB_POOL_MAX || 10) }, push: !isProd, migrationDir: path.resolve(dirname, 'migrations') })
    : sqliteAdapter({ client: { url: env.db }, push: true })

/** Uploads go to S3-compatible object storage when S3_BUCKET is set; otherwise to the local media folder. */
const storage = process.env.S3_BUCKET
  ? [s3Storage({ collections: { media: true }, bucket: process.env.S3_BUCKET, config: { region: process.env.S3_REGION || 'us-east-1', endpoint: process.env.S3_ENDPOINT || undefined, forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true', credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID || '', secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '' } } })]
  : []

/** Lists of draftable content get WordPress-style status tabs (All | Published | Draft ...). */
function withStatusTabs<T extends CollectionConfig>(c: T): T {
  if (!c.versions || !(c.versions as { drafts?: unknown }).drafts) return c
  const before = c.admin?.components?.beforeListTable ?? []
  return { ...c, admin: { ...c.admin, components: { ...c.admin?.components, beforeListTable: ['/components/admin/StatusTabs#StatusTabs', ...before] } } }
}

/** Draftable content gets the WordPress-style Publish box in the sidebar; Payload's top-bar buttons move into it. */
function withPublishBox<T extends CollectionConfig>(c: T): T {
  if (!c.versions || !(c.versions as { drafts?: unknown }).drafts) return c
  const none = '/components/admin/NullButton#NullButton'
  const box = { name: 'publishBox', type: 'ui' as const, admin: { position: 'sidebar' as const, components: { Field: '/components/admin/PublishBox#PublishBox' } } }
  return {
    ...c,
    fields: [box, ...c.fields],
    admin: { ...c.admin, components: { ...c.admin?.components, edit: { ...c.admin?.components?.edit, PreviewButton: none, SaveDraftButton: none, PublishButton: none } } },
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · EDIF Admin', description: 'EDIF website administration', defaultOGImageType: 'off', icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/images/logoB.svg' }] },
    components: { providers: ['/components/admin/AdminA11y#AdminA11y', '/components/admin/RowActions#RowActions'], beforeNavLinks: ['/components/admin/NavHome#NavHome'], actions: ['/components/admin/NotificationBell#NotificationBell', '/components/admin/SignOut#SignOut'], beforeDashboard: ['/components/admin/Dashboard#default'], beforeLogin: ['/components/admin/BeforeLogin#default'], graphics: { Logo: '/components/admin/Logo#Logo', Icon: '/components/admin/Icon#Icon' } },
    avatar: 'default', // no third-party (Gravatar) requests
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Pages, News, Publications, Faqs, Members, KeyFigures, People, Tenders, Vacancies, Events, Notices, Messages, Notifications, Subscribers, PageViews, Media, SeoPages, Redirects, Users, AuditLog].map(withStatusTabs).map(withPublishBox),
  globals: [SiteSettings, Navigation, BrandTheme],
  editor: lexicalEditor(),
  jobs: { tasks: [dailyChecks], autoRun: [{ cron: '* * * * *', limit: 10, queue: 'default' }], shouldAutoRun: async () => true, deleteJobOnComplete: true },
  routes: { admin: ADMIN_ROUTE },
  secret: env.secret,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db,
  sharp,
  graphQL: { disable: true }, // fewer public entry points
  email: emailAdapter(),
  auth: { passwordHashIterations: 600000 }, // OWASP-recommended work factor for stored passwords
  csrf: [env.site], // only our own site may send cookie-authenticated requests
  cors: [env.site],
  plugins: [
    ...storage,
    // two-factor sign-in for every staff account; must stay last
    payloadTotp({ collection: 'users', forceSetup: true, totp: { issuer: 'EDIF Admin', digits: 6, period: 30, algorithm: 'SHA1' } }),
  ],
})
