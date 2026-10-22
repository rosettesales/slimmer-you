# Slimmer You & Pamper Spa

A responsive spa website with animated editorial sections and a persistent appointment-request calendar. Built with React, Vinext and Cloudflare D1 through Sites.

## Booking behavior

- Visitors choose a treatment, preferred date and time, then provide contact details and consent.
- Preferred times are offered daily from 9 a.m. to 5 p.m. in America/Toronto, in half-hour increments. The latest selectable start is 4:30 p.m. Dates are restricted to the next 90 days.
- These are requests, not live availability or confirmed reservations. Treatment duration and pricing are intentionally left for the spa to confirm.
- Successful requests are stored in the `appointment_requests` D1 table with status `pending`. Nothing is charged; no card data is requested.
- No email or SMS provider is configured. The receipt explicitly says no confirmation was sent and provides the spa phone number. Requests can be inspected through the owner’s Sites database tools. Before opening to customers, arrange a staff review/notification workflow.
- Server validation checks contact fields, consent, service, dates, hours and same-origin submissions. Requests have idempotency keys and a four-request-per-email rolling 24-hour limit.
- Visitors can download their request details. Rescheduling and deletion requests are handled by telephone.

## Local development

Use Node 22.13+ and `npm run dev`. Run `npm run db:generate` for schema changes and follow the Sites starter instructions for applying local migrations. `npx tsc --noEmit` validates types; use the Sites `build-site.mjs` helper for release builds. Hosted publication applies the committed schema migration. Local QA data does not ship.

## Design and content

Plum, ivory and muted rose palette, Instrument Serif and DM Sans typography, scroll reveals, parallax hero, rotating botanical marks, animated ribbon, treatment filters and responsive navigation. A motion toggle and the visitor’s reduced-motion setting control animation.

Business name and phone are supported by the supplied Instagram account and the existing workspace’s `spa-reel-research/public-profile.json`. Spa imagery comes from the existing project’s Instagram assets and facial treatment video. Address and service categories were cross-checked against public business listings:

- https://www.instagram.com/slimmeryoupamperspa/
- https://ca.nextdoor.com/pages/bodypro-gym/
- https://bookbeauty.ca/listing/slimmer-you-and-pamper-spa/

Editorial images are served locally from Unsplash source images `photo-1570172619644-dfd03ed5d881`, `photo-1544161515-4ab6ce6db874` and `photo-1608571423902-eed4a5ad8108`. The privacy notice distinguishes editorial and business photographs. Google Fonts supplies the webfonts, with local serif/sans-serif fallbacks.

The user specified appointment requests and provisional 9 a.m.–5 p.m. hours. No customer testimonials, treatment outcomes, prices or discounts have been invented.
