import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Reads a vendored font from the filesystem at render time → needs Node runtime.
export const runtime = 'nodejs'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const cormorant = readFileSync(
  join(process.cwd(), 'app/_og/CormorantGaramond-Light.woff')
)

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0f0f',
          color: '#ffffff',
          fontFamily: 'Cormorant',
          fontSize: 140,
          lineHeight: 1,
          paddingBottom: 10,
        }}
      >
        A
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Cormorant', data: cormorant, style: 'normal', weight: 400 }],
    }
  )
}
