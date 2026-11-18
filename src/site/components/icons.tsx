import type { ReactNode } from 'react'

const Ico = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

export const CardIcon = () => <Ico><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M3 10h18M7 15h4" /></Ico>
export const GrowthIcon = () => <Ico><path d="M4 20h16M7 20v-5M12 20v-9M17 20V7" /><path d="m5 10 5-4 3 2 5-4" /></Ico>
export const TermIcon = () => <Ico><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4M12 13.5v2.7l1.8 1.1" /></Ico>
export const UsersIcon = () => <Ico><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="2.6" /><path d="M16 14.3a5 5 0 0 1 5 5.2" /></Ico>
export const KeyIcon = () => <Ico><circle cx="8" cy="15" r="4" /><path d="m11 12 8.5-8.5M16 7l2.5 2.5M13.5 9.5 15.5 11.5" /></Ico>
export const ExchangeIcon = () => <Ico><path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" /></Ico>
export const CoinsIcon = () => <Ico><ellipse cx="12" cy="6" rx="7" ry="2.5" /><path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" /></Ico>
export const RepeatIcon = () => <Ico><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.6M20 4v4.6h-4.6M20 12a8 8 0 0 1-13.7 5.6L4 15.4M4 20v-4.6h4.6" /></Ico>
export const LayersIcon = () => <Ico><path d="m12 3 9 4.8-9 4.8-9-4.8z" /><path d="m3 12.2 9 4.8 9-4.8M3 16.4l9 4.8 9-4.8" /></Ico>
export const ScaleIcon = () => <Ico><path d="M12 4v16M8 20h8M5 7h14" /><path d="m5 7-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z" /></Ico>
export const LockIcon = () => <Ico><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v2" /></Ico>
export const GavelIcon = () => <Ico><path d="m13 3 8 8-3.5 3.5-8-8z" /><path d="M11.5 10.5 4 18a1.4 1.4 0 0 0 2 2l7.5-7.5M12 21h9" /></Ico>
export const BuildingIcon = () => <Ico><path d="M3 9 12 4l9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></Ico>
export const UserXIcon = () => <Ico><circle cx="10" cy="8" r="3.5" /><path d="M3.5 20a6.5 6.5 0 0 1 11-4.7M17 15l4 4M21 15l-4 4" /></Ico>
export const SealIcon = () => <Ico><path d="M12 2.8 4.5 5.6v6c0 4.6 3.2 8.4 7.5 9.6 4.3-1.2 7.5-5 7.5-9.6v-6z" /><path d="m8.6 12 2.4 2.4 4.4-4.6" /></Ico>

/* one icon per entry in `covered`, same order */
export const coveredIcons = [CardIcon, GrowthIcon, TermIcon, UsersIcon, KeyIcon, ExchangeIcon, CoinsIcon, RepeatIcon]
/* one icon per entry in `mainExclusions`, same order */
export const exclusionIcons = [LockIcon, GavelIcon, BuildingIcon, UserXIcon]
