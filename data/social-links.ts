export const SOCIAL_LINKS = [
  {
    platform: 'instagram' as const,
    label: 'Instagram',
    url: 'https://www.instagram.com/giorgioantro/',
  },
  {
    platform: 'tiktok' as const,
    label: 'TikTok',
    url: 'https://www.tiktok.com/@g.antro',
  },
] as const

export type SocialPlatform = typeof SOCIAL_LINKS[number]['platform']
