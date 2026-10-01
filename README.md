# Armando R. Taveras — Portfolio

Portfolio for validation & integration work on customer-specific server and industrial PC platforms.

The background is a procedurally generated, real-time 3D dual-socket server motherboard (React Three Fiber).
Scrolling drives a camera along a path through the board — one shot per section — while signal pulses run
along the copper traces and the POST-code display tracks the current section.

## Stack

- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4
- three.js · @react-three/fiber · @react-three/drei · @react-three/postprocessing (bloom, tone mapping)
- Lenis (smooth scroll) · Framer Motion (UI motion)
- Nodemailer contact endpoint (`/api/contact`)

## Where things live

| Path | What |
| --- | --- |
| `src/lib/content.ts` | All site copy (profile, capabilities, line stages, work, toolchain) |
| `src/lib/boardLayout.ts` | Seeded board layout and 45° trace router — shared by texture and geometry |
| `src/components/scene/` | Substrate texture, trace pulse shader, components, camera rig, post-processing |
| `src/components/scene/CameraRig.tsx` | `SHOTS` — one camera position/target per section id |
| `src/components/sections/` | Page sections |

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

### Contact form environment variables

```
EMAIL_USER=<gmail address used to send>
EMAIL_PASSWORD=<gmail app password>
RECIPIENT_EMAIL=<where submissions go>
```

## Accessibility & performance

- `prefers-reduced-motion`: native scrolling, near-static camera, slowed pulses, no marquee.
- Mobile / coarse pointer: lower DPR, 2K board texture, fewer passives, no shadows or MSAA.
