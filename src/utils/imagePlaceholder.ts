/**
 * Tiny inline placeholder shared by lazy-loaded travel imagery.
 * Next/Image removes it automatically when the real image finishes loading,
 * so users see a calm branded skeleton without adding client-side state or
 * keeping dozens of off-screen animations running during a scroll.
 */
export const IMAGE_SKELETON =
  "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='64'%20height='40'%20viewBox='0%200%2064%2040'%20preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='0'%3E%3Cstop%20offset='0'%20stop-color='%23dce8e3'/%3E%3Cstop%20offset='.5'%20stop-color='%23f4f7f5'/%3E%3Cstop%20offset='1'%20stop-color='%23dce8e3'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='64'%20height='40'%20fill='url(%23g)'/%3E%3C/svg%3E" as const;
