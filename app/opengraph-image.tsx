import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Reads the vendored font + pre-generated background from the filesystem → Node runtime.
export const runtime = 'nodejs'

export const alt = 'ANTRO — Elegance and Technology'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const cormorant = readFileSync(
  join(process.cwd(), 'app/_og/CormorantGaramond-Light.woff')
)

// og-bg.jpg is a pre-downscaled 1200×630 crop (~13 KB) of the hero product photo,
// generated once via sharp — never decode the 5 MB source per request.
const bgData = readFileSync(join(process.cwd(), 'app/_og/og-bg.jpg')).toString(
  'base64'
)
const bgUri = `data:image/jpeg;base64,${bgData}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#0f0f0f',
          fontFamily: 'Cormorant',
        }}
      >
        {/*
          og-bg.jpg is a 1200×630 band cut from the hero photo, dropped so the frame
          catches the jacket's architectural collar rather than the model's face.
        */}
        <img
          src={bgUri}
          alt=""
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/*
          Scrim rising from the bottom only. The collar sits in the upper half and
          stays untouched; this just guarantees the lockup reads no matter how the
          fabric falls in the bottom-left corner.
        */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(180deg, rgba(15,15,15,0) 45%, rgba(15,15,15,0.45) 75%, rgba(15,15,15,0.85) 100%)',
          }}
        />
        {/*
          The backdrop behind the lockup is pale studio wall, so the bottom scrim
          alone leaves the tagline low-contrast. This deepens the bottom-left corner
          specifically — it reads as an editorial vignette and keeps the collar clear.
        */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            // Corner gradient rather than a fixed-height band — a band leaves a hard
            // horizontal seam where it starts.
            background:
              'linear-gradient(to top right, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.45) 22%, rgba(15,15,15,0) 52%)',
          }}
        />
        {/* Brand lockup — anchored bottom-left, clear of the collar */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            width: '100%',
            height: '100%',
            paddingLeft: 68,
            paddingBottom: 54,
            color: '#ffffff',
          }}
        >
          <div
            style={{
              fontSize: 82,
              lineHeight: 1,
              letterSpacing: 18,
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}
          >
            ANTRO
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 18,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              textShadow: '0 1px 14px rgba(0,0,0,0.6)',
            }}
          >
            Elegance and Technology
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Cormorant', data: cormorant, style: 'normal', weight: 400 },
      ],
    }
  )
}
