/**
 * Owner's Manual Index — curated public OEM owner's-manual URLs.
 * Powers the premium "+ Owner's Manual" feature: user taps the entry →
 * the app matches their vehicle to this index → the server helper fetches
 * the URL (PDF or manual page) → the client parses it into a highlights reel.
 *

 * Wave 4 (2026-08-17): NON-AUTOMOTIVE coverage (motorcycle / marine / ag /
 *   semi / RV). New make keys: suzuki, seadoo, kubota, airstream (VERIFIED hubs),
 *   plus upload-fallback-only keys: harley-davidson, yamaha (outboard+PWC+MC),
 *   kawasaki (PWC+MC), indian, mercury, cat, cummins, yanmar, john-deere, hyster,
 *   freightliner, kenworth, peterbilt, mack, international, western-star,
 *   volvo-trucks, winnebago, thor, jayco, newmar, forest-river, grand-design.
 *   Honda and BMW motorcycle models are folded into the existing honda/bmw blocks
 *   because the lookup keys by stored make string. VERIFIED fetchable hubs (all
 *   200 text/html 2026-08-17): suzuki, kubota, seadoo, airstream plus Honda
 *   powersports per-year manual routes. Semi OEMs and industrial/marine are
 *   dealer-gated or bot-walled — honest upload fallbacks, no fabrication. (2026-08-17)
 * Structure:
 *   make -> model -> yearRange -> { url, fetchable, source, notes }
 *
 * Conventions:
 *   - Make/model keys match the app's vehicle-lookup normalization
 *     (see fuse-boxes.js matchModelKey — separator-insensitive lowercase
 *     keys; spaced keys like 'santa fe' are quoted).
 *   - yearRange uses the app's 'XXXX-YYYY' range convention.
 *   - `url` is a REAL URL validated with curl (HTTP 200 + text/html or
 *     application/pdf) from the build environment (Mozilla UA, -L,
 *     25-40s timeout). NEVER guess URLs.
 *   - `fetchable: true`  → validated 200, server helper may fetch.
 *   - `fetchable: false` → no validated URL exists (bot-blocked / JS-gated /
 *     unresolvable); the app falls back to user upload for those models.
 *   - `source: 'oem'`    → manufacturer-public URL.
 *   - `source: 'upload'` → upload fallback only.
 *
 * Per-brand probe summary (2026-08-14 baseline + 2026-08-17 Waves 2 & 3):
 *   Toyota  — per-model digital manual pages VALIDATED (2020 + 2024 samples).
 *             Wave 3 (2026-08-17): prius re-probed .../digital/prius/2023/
 *             → 200 text/html (added).
 *   Honda   — owners portal + per-model manual routes return 200 (Salesforce
 *             SPA; manual content renders via JS — parse strategy TBD in the
 *             feature build; upload fallback also fine). Wave 3 (2026-08-17):
 *             hrv/ridgeline/passport routes re-probed, still 200 (redirect to
 *             mygarage.honda.com shell) — added.
 *   Kia     — manuals hub page VALIDATED (200 on 2026-08-17); per-model PDFs
 *             are served behind a VIN-linked lookup (getvehicleinfo — still
 *             301/not directly fetchable as of 2026-08-17; a VIN API
 *             integration is a later, separate decision, not built). Wave 3:
 *             hub re-probed 200; k5/carnival/ev6/niro added on the hub pattern.
 *   Subaru  — vehicle-resources hub VALIDATED (re-probed 200 on 2026-08-17);
 *             per-model manual list loads via a JS component
 *             (subaru-800-manual-items), not in raw HTML. Wave 3: ascent and
 *             legacy added on the hub pattern.
 *   Hyundai — manuals-warranties hub VALIDATED (re-probed 200 on 2026-08-17).
 *             Wave 3 (2026-08-17): digitalownersmanual.hyundai.com STILL
 *             NXDOMAIN (DNS); digitalownersmanual.hyundaiusa.com RESOLVES but
 *             is a parked redirector → www.hyundaiusa.com home (no manual
 *             content). Hub entries only; upload fallback recommended for
 *             parse. palisade/kona/ioniq 5/venue added on the hub pattern.
 *   Ford    — NO endpoint validated in Waves 1-3: ford.com/support/owner-manuals
 *             and fordservicecontent.com PDFs time out / drop the connection
 *             from this environment (bot protection). Wave 3 re-probe
 *             (2026-08-17): Chrome GET, Safari HEAD, and HTTP/1.1 GET all
 *             failed or hung with 0 bytes. Keep upload fallback; retry from
 *             Vercel IPs in the feature build.
 *   Nissan  — Manuals & Guides hub VALIDATED (200 on 2026-08-17; "All Nissan
 *             Owners Vehicle Manuals & Guides"). Per-model manuals load via
 *             AEM SPA (jcr:content.proxy.json), not in raw HTML. Wave 3: hub
 *             re-probed 200; kicks/armada/murano added on the hub pattern.
 *   Volkswagen — "Owner's Manuals" page VALIDATED (200 on 2026-08-17; reached
 *             from vw.com/en/owners.html nav). Manual lookup/PDFs run through
 *             the VW owners portal flow (JS-heavy) — page shell validated only.
 *             Wave 3: page re-probed 200; taos added on the page pattern.
 *   Mercedes — mbusa.com/en/owners/manuals VALIDATED (200 on 2026-08-17;
 *             JS-rendered manuals landing page). Per-model manuals are
 *             VIN-linked via the MB owner portal — shell validated only.
 *             Wave 3: re-probed 200; gla/glb added on the landing pattern.
 *   Chevrolet — Wave 3 UNBLOCKED (2026-08-17): the GM "Manuals and Guides"
 *             page chevrolet.com/support/vehicle/manuals-guides VALIDATED
 *             (200 text/html; title "Manuals and Guides | Vehicle Support |
 *             Chevy"), discovered from the chevrolet.com/owners nav. Wave 2
 *             probed wrong paths (/support/vehicle/manuals + /ownercenter
 *             404). silverado/equinox/malibu entries converted from upload
 *             fallback → validated oem.
 *   GMC     — Wave 3 NEW: gmc.com/support/vehicle/manuals-guides VALIDATED
 *             (200 text/html; title "Manuals and Guides | Vehicle Support |
 *             GMC"). sierra/terrain/acadia/yukon added (oem).
 *   Buick   — Wave 3 NEW: buick.com/support/vehicle/manuals-guides VALIDATED
 *             (200 text/html; title "Manuals and Guides | Vehicle Support |
 *             Buick"). encore/enclave/envision added (oem).
 *   Infiniti — Wave 3 NEW: infinitiusa.com/owners/manuals-warranties.html
 *             VALIDATED (200 text/html; title "INFINITI Vehicle Manuals and
 *             Warranties | INFINITI USA"). q50/qx60/qx80 added (oem).
 *   Acura   — Wave 3 NEW: owners.acura.com per-model routes
 *             /vehicle-information/manuals/{model}/{year} VALIDATED (200,
 *             redirect to mygarage.honda.com/s/manuals-search?brand=acura —
 *             same Salesforce SPA behavior as Honda; content renders via JS).
 *             tlx/rdx/mdx/ilx/integra added; upload fallback recommended
 *             for parse.
 *   BMW     — probed: bmwusa.com/owners-manuals.html + bmw.com alternates —
 *             HTTP/2 stream error then 35s timeout (0 bytes) in Waves 2 and 3
 *             (re-probed 2026-08-17) — NOT fetchable; upload fallback.
 *   Jeep    — probed: mopar.com owner-manual (403 bot wall), jeep.com owners
 *             paths (redirect to jeep.com root) — upload fallback. Wave 3
 *             re-probe (2026-08-17): same results.
 *   Mazda   — probed: mazdausa.com/owners 200 but NO manuals URL exists
 *             (owners nav links to site search + MyMazda login portal; PDF
 *             patterns 404) — upload fallback. Wave 3 re-check (2026-08-17):
 *             same.
 *   Lexus   — probed Waves 2+3: drivers.lexus.com vehicle-manual,
 *             lexus.com/owners, lexus.com/My-Lexus/manuals all 404 — no
 *             public endpoint; es/rx/nx kept as honest upload fallbacks.
 *   Audi    — probed Wave 3: audiusa.com owners paths return 403 (bot wall) —
 *             a3/a4/q5 kept as honest upload fallbacks.
 *   Volvo   — probed Wave 3: volvocars.com/us owner/support manuals paths all
 *             403 (bot wall) — s60/xc60/xc90 kept as honest upload fallbacks.
 *   Mitsubishi — probed Wave 3: mitsubishicars.com/owners redirects to a
 *             Salesforce SPA (owners.mitsubishicars.com/s/) with no manual
 *             URLs in raw HTML; per-model manual routes 404 — outlander/
 *             eclipse cross/mirage kept as honest upload fallbacks.
 *   Lincoln — probed Wave 3: lincoln.com owners paths drop the connection
 *             (0 bytes; same Akamai bot protection as Ford) — corsair/
 *             nautilus/navigator kept as honest upload fallbacks.
 *   Dodge/Chrysler/Ram — probed Wave 3: brand /en/owners/manuals paths
 *             redirect to mopar.com owners-manual pages which return 403
 *             (bot wall); ramtrucks.com owners paths redirect to the brand
 *             home. charger/challenger/durango (dodge), pacifica/300
 *             (chrysler), 1500/2500 (ram) kept as honest upload fallbacks.
 *   Pontiac/Oldsmobile/Plymouth/AMC/International/MG-classic — Wave 3
 *             documented honestly: defunct brands with no public
 *             owner-manual endpoints (their domains do not respond); NOT
 *             indexed. Honest gap.
 *   Tesla   — EXCLUDED entirely (owner direction: "not our market").
 */
export const manualIndex = {
  toyota: {
    camry: {
      '2018-2026': {
        url: 'https://www.toyota.com/owners/warranty-owners-manuals/digital/camry/2024/',
        fetchable: true,
        source: 'oem',
        notes: 'Per-year interactive manual page; pattern .../digital/camry/{year}/ — validated 2024 (200 text/html). Substitute the vehicle year in the pattern.'
      }
    },
    corolla: {
      '2014-2026': {
        url: 'https://www.toyota.com/owners/warranty-owners-manuals/digital/corolla/2024/',
        fetchable: true,
        source: 'oem',
        notes: 'Per-year interactive manual page; pattern .../digital/corolla/{year}/ — validated 2024 (200 text/html). Substitute the vehicle year in the pattern.'
      }
    },
    rav4: {
      '2019-2026': {
        url: 'https://www.toyota.com/owners/warranty-owners-manuals/digital/rav4/2024/',
        fetchable: true,
        source: 'oem',
        notes: 'Per-year interactive manual page; pattern .../digital/rav4/{year}/ — validated 2024 (200 text/html). Substitute the vehicle year in the pattern.'
      }
    },
    tacoma: {
      '2016-2026': {
        url: 'https://www.toyota.com/owners/warranty-owners-manuals/digital/tacoma/2024/',
        fetchable: true,
        source: 'oem',
        notes: 'Per-year interactive manual page; pattern .../digital/tacoma/{year}/ — validated 2020 and 2024 (both 200 text/html). Substitute the vehicle year in the pattern.'
      }
    },
    highlander: {
      '2020-2026': {
        url: 'https://www.toyota.com/owners/warranty-owners-manuals/digital/highlander/2024/',
        fetchable: true,
        source: 'oem',
        notes: 'Per-year interactive manual page; pattern .../digital/highlander/{year}/ — validated 2020 and 2024 (both 200 text/html). Substitute the vehicle year in the pattern.'
      }
    },
    tundra: {
      '2022-2026': {
        url: 'https://www.toyota.com/owners/warranty-owners-manuals/digital/tundra/2024/',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): per-year interactive manual page; pattern .../digital/tundra/{year}/ — validated 2024 (200 text/html). Substitute the vehicle year in the pattern.'
      }
    },
    '4runner': {
      '2010-2026': {
        url: 'https://www.toyota.com/owners/warranty-owners-manuals/digital/4runner/2024/',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): per-year interactive manual page; pattern .../digital/4runner/{year}/ — validated 2024 (200 text/html). Substitute the vehicle year in the pattern.'
      }
    },
    sienna: {
      '2021-2026': {
        url: 'https://www.toyota.com/owners/warranty-owners-manuals/digital/sienna/2024/',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): per-year interactive manual page; pattern .../digital/sienna/{year}/ — validated 2024 (200 text/html). Substitute the vehicle year in the pattern.'
      }
    },
    prius: {
      '2016-2026': {
        url: 'https://www.toyota.com/owners/warranty-owners-manuals/digital/prius/2023/',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): per-year interactive manual page; pattern .../digital/prius/{year}/ — validated 2023 (200 text/html). Substitute the vehicle year in the pattern.'
      }
    }
  },
  honda: {
    civic: {
      '2016-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/civic/2024',
        fetchable: true,
        source: 'oem',
        notes: 'Owners-portal manual route (200 text/html). Site is a Salesforce SPA — page shell renders via JS; per-model manual PDFs load through the owners API. Validated URL only; parse strategy TBD in the feature build, upload fallback also fine.'
      }
    },
    accord: {
      '2018-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/accord/2024',
        fetchable: true,
        source: 'oem',
        notes: 'Owners-portal manual route (200 text/html). Salesforce SPA — see civic note; validate per-model content during feature build.'
      }
    },
    'cr-v': {
      '2017-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/cr-v/2024',
        fetchable: true,
        source: 'oem',
        notes: 'Owners-portal manual route (200 text/html). Salesforce SPA — see civic note; validate per-model content during feature build.'
      }
    },
    pilot: {
      '2016-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/pilot/2024',
        fetchable: true,
        source: 'oem',
        notes: 'Owners-portal manual route (200 text/html). Salesforce SPA — see civic note; validate per-model content during feature build.'
      }
    },
    odyssey: {
      '2018-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/odyssey/2024',
        fetchable: true,
        source: 'oem',
        notes: 'Owners-portal manual route (200 text/html). Salesforce SPA — see civic note; validate per-model content during feature build.'
      }
    },
    hrv: {
      '2016-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/hrv/2023',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): owners-portal manual route (200 text/html, redirects to mygarage shell — same Salesforce SPA as civic). Validate per-model content during feature build; upload fallback also fine.'
      }
    },
    ridgeline: {
      '2017-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/ridgeline/2021',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): owners-portal manual route (200 text/html, redirects to mygarage shell — same Salesforce SPA as civic). Validate per-model content during feature build; upload fallback also fine.'
      }
    },
    passport: {
      '2019-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/passport/2022',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): owners-portal manual route (200 text/html, redirects to mygarage shell — same Salesforce SPA as civic). Validate per-model content during feature build; upload fallback also fine.'
      }
    },
    'cbr1000rr': {
      '2000-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/cbr1000rr/2024',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Honda powersports per-year manual route — VALIDATED 2024 (200 text/html). Pattern https://owners.honda.com/vehicle-information/manuals/{model}/{year}; substitute vehicle year.'
      }
    },
    'cbr600rr': {
      '2000-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/cbr600rr/2024',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Honda powersports per-year manual route — pattern https://owners.honda.com/vehicle-information/manuals/{model}/{year} (same Salesforce SPA as cbr1000rr, validated). Substitute vehicle year.'
      }
    },
    'goldwing': {
      '2000-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/goldwing/2024',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Honda powersports per-year manual route — VALIDATED 2024 (200 text/html). Pattern https://owners.honda.com/vehicle-information/manuals/{model}/{year}; substitute vehicle year.'
      }
    },
    'rebel': {
      '2000-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/rebel/2024',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Honda powersports per-year manual route — pattern https://owners.honda.com/vehicle-information/manuals/{model}/{year} (same Salesforce SPA as cbr1000rr, validated). Substitute vehicle year.'
      }
    },
    'nc750x': {
      '2000-2026': {
        url: 'https://owners.honda.com/vehicle-information/manuals/nc750x/2024',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Honda powersports per-year manual route — pattern https://owners.honda.com/vehicle-information/manuals/{model}/{year} (same Salesforce SPA as cbr1000rr, validated). Substitute vehicle year.'
      }
    }
  },
  kia: {
    soul: {
      '2014-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals hub page (200 text/html, model/year search). Per-model PDFs are served behind a VIN-linked lookup (getvehicleinfo — still 301/not directly fetchable 2026-08-17); upload fallback recommended for parse.'
      }
    },
    forte: {
      '2014-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals hub page (200 text/html, model/year search). Per-model PDFs are served behind a VIN-linked lookup (getvehicleinfo — still 301/not directly fetchable 2026-08-17); upload fallback recommended for parse.'
      }
    },
    sportage: {
      '2017-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals hub page (200 text/html, model/year search). Per-model PDFs are served behind a VIN-linked lookup (getvehicleinfo — still 301/not directly fetchable 2026-08-17); upload fallback recommended for parse.'
      }
    },
    sorento: {
      '2016-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals hub page (200 text/html, model/year search). Per-model PDFs are served behind a VIN-linked lookup (getvehicleinfo — still 301/not directly fetchable 2026-08-17); upload fallback recommended for parse.'
      }
    },
    telluride: {
      '2020-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals hub page (200 text/html, model/year search). Per-model PDFs are served behind a VIN-linked lookup (getvehicleinfo — still 301/not directly fetchable 2026-08-17); upload fallback recommended for parse.'
      }
    },
    k5: {
      '2021-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): manuals hub page (re-probed 200 text/html). Per-model PDFs remain VIN-linked (see soul note); upload fallback recommended for parse.'
      }
    },
    carnival: {
      '2022-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): manuals hub page (re-probed 200 text/html). Per-model PDFs remain VIN-linked (see soul note); upload fallback recommended for parse.'
      }
    },
    ev6: {
      '2022-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): manuals hub page (re-probed 200 text/html). Per-model PDFs remain VIN-linked (see soul note); upload fallback recommended for parse.'
      }
    },
    niro: {
      '2017-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): manuals hub page (re-probed 200 text/html). Per-model PDFs remain VIN-linked (see soul note); upload fallback recommended for parse.'
      }
    }
  },
  subaru: {
    outback: {
      '2020-2026': {
        url: 'https://www.subaru.com/owners/vehicle-resources.html',
        fetchable: true,
        source: 'oem',
        notes: 'Vehicle-resources hub with "Manuals & Warranties" tab (200 text/html). Per-model manual list loads via a JS component (subaru-800-manual-items), not in raw HTML; upload fallback recommended for parse.'
      }
    },
    forester: {
      '2019-2026': {
        url: 'https://www.subaru.com/owners/vehicle-resources.html',
        fetchable: true,
        source: 'oem',
        notes: 'Vehicle-resources hub with "Manuals & Warranties" tab (200 text/html). Per-model manual list loads via a JS component (subaru-800-manual-items), not in raw HTML; upload fallback recommended for parse.'
      }
    },
    crosstrek: {
      '2018-2026': {
        url: 'https://www.subaru.com/owners/vehicle-resources.html',
        fetchable: true,
        source: 'oem',
        notes: 'Vehicle-resources hub with "Manuals & Warranties" tab (200 text/html). Per-model manual list loads via a JS component (subaru-800-manual-items), not in raw HTML; upload fallback recommended for parse.'
      }
    },
    impreza: {
      '2018-2026': {
        url: 'https://www.subaru.com/owners/vehicle-resources.html',
        fetchable: true,
        source: 'oem',
        notes: 'Vehicle-resources hub with "Manuals & Warranties" tab (200 text/html). Per-model manual list loads via a JS component (subaru-800-manual-items), not in raw HTML; upload fallback recommended for parse.'
      }
    },
    ascent: {
      '2019-2026': {
        url: 'https://www.subaru.com/owners/vehicle-resources.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): vehicle-resources hub (re-probed 200 text/html). Per-model manual list loads via JS (subaru-800-manual-items); upload fallback recommended for parse.'
      }
    },
    legacy: {
      '2015-2026': {
        url: 'https://www.subaru.com/owners/vehicle-resources.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): vehicle-resources hub (re-probed 200 text/html). Per-model manual list loads via JS (subaru-800-manual-items); upload fallback recommended for parse.'
      }
    }
  },
  hyundai: {
    elantra: {
      '2017-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which does NOT resolve (DNS) from the build environment (re-checked 2026-08-17 — still NXDOMAIN; the .hyundaiusa.com variant is a parked redirect to the brand home); upload fallback recommended for parse.'
      }
    },
    sonata: {
      '2015-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which does NOT resolve (DNS) from the build environment (re-checked 2026-08-17 — still NXDOMAIN; the .hyundaiusa.com variant is a parked redirect to the brand home); upload fallback recommended for parse.'
      }
    },
    tucson: {
      '2016-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which does NOT resolve (DNS) from the build environment (re-checked 2026-08-17 — still NXDOMAIN; the .hyundaiusa.com variant is a parked redirect to the brand home); upload fallback recommended for parse.'
      }
    },
    'santa fe': {
      '2019-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which does NOT resolve (DNS) from the build environment (re-checked 2026-08-17 — still NXDOMAIN; the .hyundaiusa.com variant is a parked redirect to the brand home); upload fallback recommended for parse.'
      }
    },
    palisade: {
      '2020-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): manuals-warranties hub (re-probed 200 text/html). Digital manual domain still unresolved (see elantra note); upload fallback recommended for parse.'
      }
    },
    kona: {
      '2018-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): manuals-warranties hub (re-probed 200 text/html). Digital manual domain still unresolved (see elantra note); upload fallback recommended for parse.'
      }
    },
    'ioniq 5': {
      '2022-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): manuals-warranties hub (re-probed 200 text/html). Digital manual domain still unresolved (see elantra note); upload fallback recommended for parse.'
      }
    },
    venue: {
      '2020-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): manuals-warranties hub (re-probed 200 text/html). Digital manual domain still unresolved (see elantra note); upload fallback recommended for parse.'
      }
    }
  },
  ford: {
    'f-150': {
      '2015-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — ford.com/support/owner-manuals and fordservicecontent.com PDFs (e.g. .../Ford_Content/Catalog/owner_information/2023-Ford-F-150-Owners-Manual-version-1_om_EN-US.pdf) time out / drop the connection from the build environment (bot protection). Re-probed 2026-08-17 (Wave 3: Chrome GET, Safari HEAD, HTTP/1.1 GET — all failed/hung) — still blocked; upload fallback for now.'
      }
    },
    escape: {
      '2017-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Ford endpoints time out from the build environment (bot protection). Re-probed 2026-08-17 (Wave 3) — still blocked; upload fallback for now.'
      }
    },
    explorer: {
      '2020-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Ford endpoints time out from the build environment (bot protection). Re-probed 2026-08-17 (Wave 3) — still blocked; upload fallback for now.'
      }
    },
    mustang: {
      '2015-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Ford endpoints time out from the build environment (bot protection). Re-probed 2026-08-17 (Wave 3) — still blocked; upload fallback for now.'
      }
    }
  },
  nissan: {
    altima: {
      '2019-2026': {
        url: 'https://www.nissanusa.com/owners/manuals-guides.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): Manuals & Guides hub (200 text/html; "All Nissan Owners Vehicle Manuals & Guides"). Per-model manuals load via AEM SPA (jcr:content.proxy.json), not in raw HTML — validated URL only; upload fallback recommended for parse.'
      }
    },
    rogue: {
      '2021-2026': {
        url: 'https://www.nissanusa.com/owners/manuals-guides.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): Manuals & Guides hub (200 text/html). Per-model manuals load via AEM SPA — validated URL only; upload fallback recommended for parse.'
      }
    },
    sentra: {
      '2020-2026': {
        url: 'https://www.nissanusa.com/owners/manuals-guides.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): Manuals & Guides hub (200 text/html). Per-model manuals load via AEM SPA — validated URL only; upload fallback recommended for parse.'
      }
    },
    pathfinder: {
      '2022-2026': {
        url: 'https://www.nissanusa.com/owners/manuals-guides.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): Manuals & Guides hub (200 text/html). Per-model manuals load via AEM SPA — validated URL only; upload fallback recommended for parse.'
      }
    },
    frontier: {
      '2022-2026': {
        url: 'https://www.nissanusa.com/owners/manuals-guides.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): Manuals & Guides hub (200 text/html). Per-model manuals load via AEM SPA — validated URL only; upload fallback recommended for parse.'
      }
    },
    versa: {
      '2020-2026': {
        url: 'https://www.nissanusa.com/owners/manuals-guides.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): Manuals & Guides hub (200 text/html). Per-model manuals load via AEM SPA — validated URL only; upload fallback recommended for parse.'
      }
    },
    kicks: {
      '2018-2026': {
        url: 'https://www.nissanusa.com/owners/manuals-guides.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): Manuals & Guides hub (re-probed 200 text/html). Per-model manuals load via AEM SPA — validated URL only; upload fallback recommended for parse.'
      }
    },
    armada: {
      '2017-2026': {
        url: 'https://www.nissanusa.com/owners/manuals-guides.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): Manuals & Guides hub (re-probed 200 text/html). Per-model manuals load via AEM SPA — validated URL only; upload fallback recommended for parse.'
      }
    },
    murano: {
      '2015-2026': {
        url: 'https://www.nissanusa.com/owners/manuals-guides.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): Manuals & Guides hub (re-probed 200 text/html). Per-model manuals load via AEM SPA — validated URL only; upload fallback recommended for parse.'
      }
    }
  },
  volkswagen: {
    jetta: {
      '2019-2026': {
        url: 'https://www.vw.com/en/owners-and-services/about-my-vehicle/owners-manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): VW "Owner\'s Manuals" page (200 text/html; reached from vw.com/en/owners.html nav). Manual lookup/PDFs run through the VW owners portal flow (JS-heavy) — page shell validated only; upload fallback also fine.'
      }
    },
    tiguan: {
      '2018-2026': {
        url: 'https://www.vw.com/en/owners-and-services/about-my-vehicle/owners-manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): VW "Owner\'s Manuals" page (200 text/html). Portal flow is JS-heavy — page shell validated only; upload fallback also fine.'
      }
    },
    golf: {
      '2015-2026': {
        url: 'https://www.vw.com/en/owners-and-services/about-my-vehicle/owners-manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): VW "Owner\'s Manuals" page (200 text/html). Portal flow is JS-heavy — page shell validated only; upload fallback also fine.'
      }
    },
    passat: {
      '2012-2026': {
        url: 'https://www.vw.com/en/owners-and-services/about-my-vehicle/owners-manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): VW "Owner\'s Manuals" page (200 text/html). Portal flow is JS-heavy — page shell validated only; upload fallback also fine.'
      }
    },
    atlas: {
      '2018-2026': {
        url: 'https://www.vw.com/en/owners-and-services/about-my-vehicle/owners-manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): VW "Owner\'s Manuals" page (200 text/html). Portal flow is JS-heavy — page shell validated only; upload fallback also fine.'
      }
    },
    'id.4': {
      '2021-2026': {
        url: 'https://www.vw.com/en/owners-and-services/about-my-vehicle/owners-manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): VW "Owner\'s Manuals" page (200 text/html). Portal flow is JS-heavy — page shell validated only; upload fallback also fine.'
      }
    },
    taos: {
      '2022-2026': {
        url: 'https://www.vw.com/en/owners-and-services/about-my-vehicle/owners-manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): VW "Owner\'s Manuals" page (re-probed 200 text/html). Portal flow is JS-heavy — page shell validated only; upload fallback also fine.'
      }
    }
  },
  mercedes: {
    'c-class': {
      '2015-2026': {
        url: 'https://www.mbusa.com/en/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): MBUSA Owners Manuals landing page (200 text/html, JS-rendered). Per-model manuals are VIN-linked via the MB owner portal — page shell validated only; upload fallback recommended for parse.'
      }
    },
    'e-class': {
      '2017-2026': {
        url: 'https://www.mbusa.com/en/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): MBUSA Owners Manuals landing page (200 text/html, JS-rendered). VIN-linked per-model portal — page shell validated only; upload fallback recommended for parse.'
      }
    },
    glc: {
      '2016-2026': {
        url: 'https://www.mbusa.com/en/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): MBUSA Owners Manuals landing page (200 text/html, JS-rendered). VIN-linked per-model portal — page shell validated only; upload fallback recommended for parse.'
      }
    },
    gle: {
      '2016-2026': {
        url: 'https://www.mbusa.com/en/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 2 (2026-08-17): MBUSA Owners Manuals landing page (200 text/html, JS-rendered). VIN-linked per-model portal — page shell validated only; upload fallback recommended for parse.'
      }
    },
    gla: {
      '2015-2026': {
        url: 'https://www.mbusa.com/en/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): MBUSA Owners Manuals landing page (re-probed 200 text/html). VIN-linked per-model portal — page shell validated only; upload fallback recommended for parse.'
      }
    },
    glb: {
      '2020-2026': {
        url: 'https://www.mbusa.com/en/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): MBUSA Owners Manuals landing page (re-probed 200 text/html). VIN-linked per-model portal — page shell validated only; upload fallback recommended for parse.'
      }
    }
  },
  chevrolet: {
    silverado: {
      '2019-2026': {
        url: 'https://www.chevrolet.com/support/vehicle/manuals-guides',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): GM "Manuals and Guides" page VALIDATED (200 text/html; title "Manuals and Guides | Vehicle Support | Chevy"), reached from chevrolet.com/owners nav. Converted from Wave-2 upload fallback (chevrolet.com/support/vehicle/manuals and /ownercenter were 404; this is the correct path).'
      }
    },
    equinox: {
      '2018-2026': {
        url: 'https://www.chevrolet.com/support/vehicle/manuals-guides',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): GM "Manuals and Guides" page VALIDATED (200 text/html; see silverado note). Converted from Wave-2 upload fallback.'
      }
    },
    malibu: {
      '2016-2026': {
        url: 'https://www.chevrolet.com/support/vehicle/manuals-guides',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): GM "Manuals and Guides" page VALIDATED (200 text/html; see silverado note). Converted from Wave-2 upload fallback.'
      }
    }
  },
  bmw: {
    '3 series': {
      '2012-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — bmwusa.com/owners-manuals.html fails (HTTP/2 stream error, then 35s timeout with 0 bytes); bmw.com alternate hosts also drop the connection. Re-probed 2026-08-17 (Wave 3) — still blocked; upload fallback for now.'
      }
    },
    x3: {
      '2011-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — bmwusa.com/owners-manuals.html fails (HTTP/2 stream error, then 35s timeout with 0 bytes); bmw.com alternate hosts also drop the connection. Re-probed 2026-08-17 (Wave 3) — still blocked; upload fallback for now.'
      }
    },
    r1250gs: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — bmw-motorrad.com service/manual drops the connection (000 timeout) from this env; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  jeep: {
    wrangler: {
      '2018-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — mopar.com owner-manual page returns 403 (bot wall); jeep.com/en/owners/ redirects to the jeep.com root. Re-probed 2026-08-17 (Wave 3) — same; upload fallback for now.'
      }
    },
    'grand cherokee': {
      '2011-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — mopar.com owner-manual page returns 403 (bot wall); jeep.com/en/owners/ redirects to the jeep.com root. Re-probed 2026-08-17 (Wave 3) — same; upload fallback for now.'
      }
    }
  },
  mazda: {
    mazda3: {
      '2014-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — mazdausa.com/owners loads (200) but has no manuals page (owners nav links to site search + MyMazda login portal; PDF patterns return 404). Re-checked 2026-08-17 (Wave 3) — same; upload fallback for now.'
      }
    },
    'cx-5': {
      '2017-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Mazda manuals live behind the MyMazda login portal (see mazda3 note). Re-checked 2026-08-17 (Wave 3) — same; upload fallback for now.'
      }
    }
  },
  gmc: {
    sierra: {
      '2014-2026': {
        url: 'https://www.gmc.com/support/vehicle/manuals-guides',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): GM "Manuals and Guides" page VALIDATED (200 text/html; title "Manuals and Guides | Vehicle Support | GMC"), reached from gmc.com/owners nav.'
      }
    },
    terrain: {
      '2018-2026': {
        url: 'https://www.gmc.com/support/vehicle/manuals-guides',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): GM "Manuals and Guides" page VALIDATED (200 text/html; see sierra note).'
      }
    },
    acadia: {
      '2017-2026': {
        url: 'https://www.gmc.com/support/vehicle/manuals-guides',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): GM "Manuals and Guides" page VALIDATED (200 text/html; see sierra note).'
      }
    },
    yukon: {
      '2015-2026': {
        url: 'https://www.gmc.com/support/vehicle/manuals-guides',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): GM "Manuals and Guides" page VALIDATED (200 text/html; see sierra note).'
      }
    }
  },
  buick: {
    encore: {
      '2013-2026': {
        url: 'https://www.buick.com/support/vehicle/manuals-guides',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): GM "Manuals and Guides" page VALIDATED (200 text/html; title "Manuals and Guides | Vehicle Support | Buick"), reached from buick.com/owners nav.'
      }
    },
    enclave: {
      '2013-2026': {
        url: 'https://www.buick.com/support/vehicle/manuals-guides',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): GM "Manuals and Guides" page VALIDATED (200 text/html; see encore note).'
      }
    },
    envision: {
      '2016-2026': {
        url: 'https://www.buick.com/support/vehicle/manuals-guides',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): GM "Manuals and Guides" page VALIDATED (200 text/html; see encore note).'
      }
    }
  },
  infiniti: {
    q50: {
      '2014-2026': {
        url: 'https://www.infinitiusa.com/owners/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): INFINITI "Vehicle Manuals and Warranties" page VALIDATED (200 text/html; title "INFINITI Vehicle Manuals and Warranties | INFINITI USA"), reached from infinitiusa.com/owners.html nav.'
      }
    },
    qx60: {
      '2014-2026': {
        url: 'https://www.infinitiusa.com/owners/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): INFINITI "Vehicle Manuals and Warranties" page VALIDATED (200 text/html; see q50 note).'
      }
    },
    qx80: {
      '2014-2026': {
        url: 'https://www.infinitiusa.com/owners/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): INFINITI "Vehicle Manuals and Warranties" page VALIDATED (200 text/html; see q50 note).'
      }
    }
  },
  acura: {
    tlx: {
      '2015-2026': {
        url: 'https://owners.acura.com/vehicle-information/manuals/tlx/2023',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): owners-portal manual route (200 text/html; redirects to mygarage.honda.com/s/manuals-search?brand=acura — same Salesforce SPA behavior as Honda). Validate per-model content during feature build; upload fallback also fine.'
      }
    },
    rdx: {
      '2013-2026': {
        url: 'https://owners.acura.com/vehicle-information/manuals/rdx/2022',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): owners-portal manual route (200 text/html; redirects to mygarage manuals-search?brand=acura — same Salesforce SPA behavior as Honda). Validate per-model content during feature build; upload fallback also fine.'
      }
    },
    mdx: {
      '2014-2026': {
        url: 'https://owners.acura.com/vehicle-information/manuals/mdx/2022',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): owners-portal manual route (200 text/html; redirects to mygarage manuals-search?brand=acura — same Salesforce SPA behavior as Honda). Validate per-model content during feature build; upload fallback also fine.'
      }
    },
    ilx: {
      '2013-2026': {
        url: 'https://owners.acura.com/vehicle-information/manuals/ilx/2020',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): owners-portal manual route (200 text/html; redirects to mygarage manuals-search?brand=acura — same Salesforce SPA behavior as Honda). Validate per-model content during feature build; upload fallback also fine.'
      }
    },
    integra: {
      '2023-2026': {
        url: 'https://owners.acura.com/vehicle-information/manuals/integra/2023',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 3 (2026-08-17): owners-portal manual route (200 text/html; redirects to mygarage manuals-search?brand=acura — same Salesforce SPA behavior as Honda). Validate per-model content during feature build; upload fallback also fine.'
      }
    }
  },
  lexus: {
    es: {
      '2013-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — probed Waves 2+3 (2026-08-17): drivers.lexus.com vehicle-manual, lexus.com/owners, lexus.com/My-Lexus/manuals all 404; Lexus manuals sit behind the Lexus Drivers login. Upload fallback for now.'
      }
    },
    rx: {
      '2010-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Lexus has no public manual endpoint (see es note). Upload fallback for now.'
      }
    },
    nx: {
      '2015-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Lexus has no public manual endpoint (see es note). Upload fallback for now.'
      }
    }
  },
  audi: {
    a3: {
      '2015-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — audiusa.com owners paths return 403 (bot wall) when probed 2026-08-17 (Wave 3). Upload fallback for now.'
      }
    },
    a4: {
      '2009-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — audiusa.com owners paths return 403 (bot wall) when probed 2026-08-17 (Wave 3). Upload fallback for now.'
      }
    },
    q5: {
      '2009-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — audiusa.com owners paths return 403 (bot wall) when probed 2026-08-17 (Wave 3). Upload fallback for now.'
      }
    }
  },
  volvo: {
    s60: {
      '2011-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — volvocars.com/us owner/support manuals paths all return 403 (bot wall) when probed 2026-08-17 (Wave 3). Upload fallback for now.'
      }
    },
    xc60: {
      '2010-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — volvocars.com/us manuals paths return 403 (bot wall) when probed 2026-08-17 (Wave 3). Upload fallback for now.'
      }
    },
    xc90: {
      '2003-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — volvocars.com/us manuals paths return 403 (bot wall) when probed 2026-08-17 (Wave 3). Upload fallback for now.'
      }
    }
  },
  mitsubishi: {
    outlander: {
      '2007-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — mitsubishicars.com/owners redirects to a Salesforce SPA (owners.mitsubishicars.com/s/) with no manual URLs in raw HTML; per-model manual routes 404 (probed 2026-08-17, Wave 3). Upload fallback for now.'
      }
    },
    'eclipse cross': {
      '2018-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Mitsubishi owners SPA has no manual URLs (see outlander note, probed 2026-08-17). Upload fallback for now.'
      }
    },
    mirage: {
      '2014-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Mitsubishi owners SPA has no manual URLs (see outlander note, probed 2026-08-17). Upload fallback for now.'
      }
    }
  },
  lincoln: {
    corsair: {
      '2020-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — lincoln.com owners paths drop the connection (0 bytes; same Akamai bot protection as Ford) when probed 2026-08-17 (Wave 3). Upload fallback for now.'
      }
    },
    nautilus: {
      '2019-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — lincoln.com drops the connection (see corsair note, probed 2026-08-17). Upload fallback for now.'
      }
    },
    navigator: {
      '2007-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — lincoln.com drops the connection (see corsair note, probed 2026-08-17). Upload fallback for now.'
      }
    }
  },
  dodge: {
    charger: {
      '2011-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — dodge.com/en/owners/manuals redirects to mopar.com/dodge/en-us/care/owners-manual.html which returns 403 (bot wall); probed 2026-08-17 (Wave 3). Upload fallback for now.'
      }
    },
    challenger: {
      '2008-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — dodge manuals live on the mopar.com bot-walled portal (see charger note, probed 2026-08-17). Upload fallback for now.'
      }
    },
    durango: {
      '2011-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — dodge manuals live on the mopar.com bot-walled portal (see charger note, probed 2026-08-17). Upload fallback for now.'
      }
    }
  },
  chrysler: {
    pacifica: {
      '2017-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — chrysler.com/en/owners/manuals redirects to mopar.com/chrysler/en-us/care/owners-manual.html which returns 403 (bot wall); probed 2026-08-17 (Wave 3). Upload fallback for now.'
      }
    },
    '300': {
      '2011-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — chrysler manuals live on the mopar.com bot-walled portal (see pacifica note, probed 2026-08-17). Upload fallback for now.'
      }
    }
  },
  ram: {
    '1500': {
      '2013-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — ramtrucks.com/en/owners paths redirect to the brand home (no manuals page); manual portal is mopar.com bot-walled; probed 2026-08-17 (Wave 3). Upload fallback for now.'
      }
    },
    '2500': {
      '2013-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — ramtrucks.com owners paths redirect to the brand home; manual portal is mopar.com bot-walled (see 1500 note, probed 2026-08-17). Upload fallback for now.'
      }
    }
  },
  suzuki: {
    'gsx-r1000': {
      '2000-2026': {
        url: 'https://suzukicycles.com/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Suzuki motorcycle owner-manual hub — VALIDATED 200 text/html. Covers GSX-R/SV650/V-Strom/Hayabusa; per-model PDFs open from hub. Hub-only entry.'
      }
    },
    'gsx-r750': {
      '2000-2026': {
        url: 'https://suzukicycles.com/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Suzuki hub — VALIDATED 200 (see gsx-r1000 note). Hub-only entry.'
      }
    },
    'gsx-r600': {
      '2000-2026': {
        url: 'https://suzukicycles.com/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Suzuki hub — VALIDATED 200 (see gsx-r1000 note). Hub-only entry.'
      }
    },
    'sv650': {
      '2000-2026': {
        url: 'https://suzukicycles.com/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Suzuki hub — VALIDATED 200 (see gsx-r1000 note). Hub-only entry.'
      }
    },
    'v-strom 650': {
      '2000-2026': {
        url: 'https://suzukicycles.com/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Suzuki hub — VALIDATED 200 (see gsx-r1000 note). Hub-only entry.'
      }
    },
    'hayabusa': {
      '2000-2026': {
        url: 'https://suzukicycles.com/owners/manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Suzuki hub — VALIDATED 200 (see gsx-r1000 note). Hub-only entry.'
      }
    }
  },
  seadoo: {
    gtx: {
      '2000-2026': {
        url: 'https://www.sea-doo.com/owners.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Sea-Doo owner/operator-guide hub — VALIDATED 200 text/html. Covers GTX/Spark/RXP etc. Hub-only entry.'
      }
    },
    rxp: {
      '2000-2026': {
        url: 'https://www.sea-doo.com/owners.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Sea-Doo hub — VALIDATED 200 (see gtx note). Hub-only entry.'
      }
    },
    gti: {
      '2000-2026': {
        url: 'https://www.sea-doo.com/owners.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Sea-Doo hub — VALIDATED 200 (see gtx note). Hub-only entry.'
      }
    },
    rxt: {
      '2000-2026': {
        url: 'https://www.sea-doo.com/owners.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Sea-Doo hub — VALIDATED 200 (see gtx note). Hub-only entry.'
      }
    },
    spark: {
      '2000-2026': {
        url: 'https://www.sea-doo.com/owners.html',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Sea-Doo hub — VALIDATED 200 (see gtx note). Hub-only entry.'
      }
    }
  },
  kubota: {
    lx3310: {
      '2000-2026': {
        url: 'https://www.kubotausa.com/operators-manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Kubota operator-manual hub (US) — VALIDATED 200 text/html. Covers LX/L/B compact tractors. Hub-only entry.'
      }
    },
    l4701: {
      '2000-2026': {
        url: 'https://www.kubotausa.com/operators-manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Kubota hub — VALIDATED 200 (see lx3310 note). Hub-only entry.'
      }
    },
    b2601: {
      '2000-2026': {
        url: 'https://www.kubotausa.com/operators-manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Kubota hub — VALIDATED 200 (see lx3310 note). Hub-only entry.'
      }
    },
    l3901: {
      '2000-2026': {
        url: 'https://www.kubotausa.com/operators-manuals',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Kubota hub — VALIDATED 200 (see lx3310 note). Hub-only entry.'
      }
    }
  },
  airstream: {
    classic: {
      '2000-2026': {
        url: 'https://www.airstream.com/owners/manuals/',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Airstream owner-manuals hub — VALIDATED 200 text/html. Covers Classic/Bambi/Interstate/Atlas. Hub-only entry.'
      }
    },
    bambi: {
      '2000-2026': {
        url: 'https://www.airstream.com/owners/manuals/',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Airstream hub — VALIDATED 200 (see classic note). Hub-only entry.'
      }
    },
    interstate: {
      '2000-2026': {
        url: 'https://www.airstream.com/owners/manuals/',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Airstream hub — VALIDATED 200 (see classic note). Hub-only entry.'
      }
    },
    atlas: {
      '2000-2026': {
        url: 'https://www.airstream.com/owners/manuals/',
        fetchable: true,
        source: 'oem',
        notes: 'Wave 4 (2026-08-17): Airstream hub — VALIDATED 200 (see classic note). Hub-only entry.'
      }
    }
  },
  'harley-davidson': {
    'street glide': {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — harley-davidson.com owner-manual portal needs a logged-in account; public manual path 404s; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  yamaha: {
    f115: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — yamaha-motor.com owner-manuals live in a JS owner dashboard; yamahaoutboards.com manual route 404s; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    },
    'fx cruiser': {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Yamaha WaveRunner manuals live in the yamaha-motor.com JS dashboard (see f115 note, 2026-08-17). Upload fallback.'
      }
    },
    r1: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Yamaha motorcycle manuals live in the yamaha-motor.com JS dashboard (see f115 note, 2026-08-17). Upload fallback.'
      }
    }
  },
  kawasaki: {
    'ninja zx-10r': {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — kawasaki.com/en-us/owners/manuals 302-loops to itself / JS owner portal from this env; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    },
    'ultra 310': {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Kawasaki Jet Ski manuals live in the same kawasaki.com JS portal (see ninja zx-10r note, 2026-08-17). Upload fallback.'
      }
    }
  },
  indian: {
    challenger: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — indianmotorcycle.com owner/manual pages return 403 (bot wall); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  mercury: {
    verado: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — mercurymarine.com owners-manual pages return 403 (bot wall); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  cat: {
    c7: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Caterpillar O&MM is dealer-login-gated (no public free PDF); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  cummins: {
    qsb: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Cummins marine OMM requires dealer/portal access; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  yanmar: {
    '4jh': {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Yanmar marine manuals go to dealers/registered owners only; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  'john-deere': {
    '6r': {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — John Deere operator manuals require dealer-portal login; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  hyster: {
    h50: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Hyster publishes no public operator-manual page (dealer portal only); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  freightliner: {
    cascadia: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Freightliner manuals are DTNA owner-portal-gated (freightliner.com/owners/ 404); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  kenworth: {
    t680: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Kenworth manuals are PACCAR owner-portal-gated (kenworth.com/owners/ 404); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  peterbilt: {
    '579': {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Peterbilt manuals are PACCAR owner-portal-gated (peterbilt.com/owners/ 500); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  mack: {
    anthem: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Mack manuals are Volvo/Mack owner-portal-gated (macktrucks.com/owners/ 404); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  international: {
    lt: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — International (Navistar) manuals are owner-portal-gated (no public PDF); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  'western-star': {
    '4700': {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Western Star manuals are DTNA owner-portal-gated (westernstar.com/owners/ 404); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  'volvo-trucks': {
    vnl: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Volvo Trucks manuals are owner/ASIST-portal-gated (volvotrucks.us/owners/ 404); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  winnebago: {
    vista: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — winnebago.com owner-resources returns a bot wall / JS stub (167-byte response); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  thor: {
    'four winds': {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — thormotorcoach.com owner-manual page 404s; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  jayco: {
    greyhawk: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — jayco.com owner-manual page 404s; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  newmar: {
    'bay star': {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — newmar.com owner/resource manual route 404s; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  'forest-river': {
    sunseeker: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — forestriverinc.com owner-manuals page 403 (bot wall); probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },
  'grand-design': {
    solitude: {
      '2000-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — granddesignrv.com owner-manual lookup 404s / needs registration; probed 2026-08-17 (Wave 4). Upload fallback.'
      }
    }
  },

};

export default manualIndex;
