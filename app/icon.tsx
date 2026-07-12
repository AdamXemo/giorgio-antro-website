import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Reads a vendored font from the filesystem at render time → needs Node runtime.
export const runtime = 'nodejs'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

const cormorant = readFileSync(
  join(process.cwd(), 'app/_og/CormorantGaramond-Light.woff')
)

export default function Icon() {
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
          fontSize: 26,
          lineHeight: 1,
          // nudge the optical center of the "A" a hair up
          paddingBottom: 2,
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
