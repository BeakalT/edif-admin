'use client'
import React from 'react'
import { useAuth, useDocumentInfo, PublishButton, SaveDraftButton } from '@payloadcms/ui'

/**
 * The WordPress "Publish" box: status, last change, then Preview / Save draft / Publish in one place at the
 * top of the right-hand column. These are Payload's own buttons, so the two-person approval rules, scheduling
 * and keyboard shortcuts behave exactly as before.
 */
export const PublishBox: React.FC = () => {
  const { id, hasSavePermission, data, collectionSlug, hasPublishedDoc } = useDocumentInfo() as {
    id?: string | number; hasSavePermission?: boolean; data?: { updatedAt?: string; _status?: string }; collectionSlug?: string; hasPublishedDoc?: boolean
  }
  const st = data?._status === 'published' ? { t: 'Published', k: 'published' } : hasPublishedDoc ? { t: 'Published, with unpublished changes', k: 'changed' } : { t: 'Draft', k: 'draft' }
  const { user } = useAuth() as { user?: { role?: string } }
  const canPublish = ['admin', 'publisher'].includes(user?.role ?? '')
  const when = data?.updatedAt ? new Date(data.updatedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null
  const hasPreview = !!collectionSlug && ['pages', 'news', 'tenders', 'vacancies', 'events'].includes(collectionSlug)
  return (
    <section className="edif-publishbox" aria-label="Publish">
      <h3 className="edif-publishbox__h">Publish</h3>
      <dl className="edif-publishbox__meta">
        <div><dt>Status</dt><dd>{id ? <span className={`edif-chip edif-chip--${st.k}`}>{st.t}</span> : 'New (not saved yet)'}</dd></div>
        {when && <div><dt>Last changed</dt><dd>{when}</dd></div>}
      </dl>
      {hasSavePermission !== false ? (
        <div className="edif-publishbox__actions">
          <div className="edif-publishbox__secondary">
            {hasPreview && id ? <a className="edif-publishbox__preview" href={`/preview/${collectionSlug}/${id}`} target="_blank" rel="noopener">Preview</a> : null}
            <SaveDraftButton />
          </div>
          {canPublish ? <PublishButton /> : <p className="edif-publishbox__ro">Set <strong>Review</strong> to “Ready for review” and save the draft. A Publisher approves and publishes it.</p>}
        </div>
      ) : (
        <p className="edif-publishbox__ro">You can view this item but not change it.</p>
      )}
    </section>
  )
}
