'use client'
import React, { useEffect } from 'react'

/**
 * Payload's admin renders some controls without an accessible name (icon-only buttons, select inputs,
 * the rich-text box). This names them after the fact so screen-reader and keyboard users get the same
 * admin as everyone else. It only adds attributes; it never changes behaviour or content.
 */
const nameOf = (el: Element) => {
  const field = el.closest('.field-type, .field-label-wrap, [class*="field-type"]')
  const t = field?.querySelector('label, .field-label')?.textContent?.replace(/\*/g, '').trim()
  return t || ''
}
const set = (el: Element, name: string, value: string) => { if (!el.getAttribute(name)) el.setAttribute(name, value) }

export function applyA11y(root: ParentNode = document) {
  root.querySelectorAll('input[type=checkbox]').forEach((el) => {
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', el.closest('thead') ? 'Select all rows' : 'Select this row')
  })
  root.querySelectorAll('.clickable-arrow--left').forEach((el) => set(el, 'aria-label', 'Previous'))
  root.querySelectorAll('.clickable-arrow--right').forEach((el) => set(el, 'aria-label', 'Next'))
  root.querySelectorAll('.popup-button').forEach((el) => {
    if (!el.textContent?.trim()) set(el, 'aria-label', el.classList.contains('array-actions__button') ? 'Row actions' : 'More actions')
  })
  root.querySelectorAll('.upload-relationship-details__edit').forEach((el) => set(el, 'aria-label', 'Edit file'))
  root.querySelectorAll('.upload-relationship-details__remove').forEach((el) => set(el, 'aria-label', 'Remove file'))
  root.querySelectorAll('.date-time-picker__clear-button').forEach((el) => set(el, 'aria-label', 'Clear date'))
  root.querySelectorAll('.collapsible__drag').forEach((el) => set(el, 'aria-label', 'Drag to reorder'))
  root.querySelectorAll('.dropdown-indicator[aria-hidden], .clear-indicator[aria-hidden]').forEach((el) => el.setAttribute('tabindex', '-1'))
  root.querySelectorAll('input.rs__input, input[role=combobox]').forEach((el) => set(el, 'aria-label', nameOf(el) || 'Choose an option'))
  root.querySelectorAll('.ContentEditable__root').forEach((el) => set(el, 'aria-label', nameOf(el) || 'Text editor'))
  root.querySelectorAll('.field-type input:not([type=checkbox]):not([type=hidden]):not([aria-label]):not([id])').forEach((el) => {
    if (!el.closest('label')) set(el, 'aria-label', nameOf(el) || (el as HTMLInputElement).placeholder || 'Value')
  })
  root.querySelectorAll('.field-type input[disabled]:not([aria-label])').forEach((el) => set(el, 'aria-label', nameOf(el) || 'Value'))
  root.querySelectorAll('ul.doc-tabs__tabs').forEach((el) => el.setAttribute('role', 'group'))
}

export const AdminA11y: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    applyA11y()
    let queued = false
    const mo = new MutationObserver(() => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => { queued = false; applyA11y() })
    })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [])
  return <>{children}</>
}
