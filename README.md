# Armando R. Taveras — Portfolio

Portfolio for Armando R. Taveras — Operations Specialist / production engineer in training: Linux infrastructure,
server hardware, firmware, failure analysis and validation automation.

> **Public site.** Follow the confidentiality notes at the top of `src/lib/content.ts`: no customer names,
> internal numbers, IPs, paths, coworker names or unapproved metrics.

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
| `src/lib/content.ts` | All site copy: profile, capabilities, method, case studies, field notes, toolchain, lab |
| `public/resume.pdf` | Not present. Add a real PDF and set `PERSON.resume = '/resume.pdf'` to show résumé links |
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
