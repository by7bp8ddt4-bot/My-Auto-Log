/**
 * Owner's Manual Index — curated public OEM owner's-manual URLs.
 * Powers the premium "+ Owner's Manual" feature: user taps the entry →
 * the app matches their vehicle to this index → the server helper fetches
 * the URL (PDF or manual page) → the client parses it into a highlights reel.
 *
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
 * Per-brand probe summary (2026-08-14 baseline + 2026-08-17 Wave 2):
 *   Toyota  — per-model digital manual pages VALIDATED (2020 + 2024 samples).
 *             Wave 2 (2026-08-17): re-probed camry/corolla 2024 (200); added
 *             tundra, 4runner, sienna — same .../digital/{model}/{year}/
 *             pattern, each validated 200 text/html.
 *   Honda   — owners portal + per-model manual routes return 200 (Salesforce
 *             SPA; manual content renders via JS — parse strategy TBD in the
 *             feature build; upload fallback also fine). Wave 2: civic route
 *             re-probed, still 200 (redirects to mygarage.honda.com shell).
 *   Kia     — manuals hub page VALIDATED (re-probed 200 on 2026-08-17);
 *             per-model PDFs are served behind a VIN-linked lookup
 *             (getvehicleinfo — still returns 301/redirect, NOT directly
 *             fetchable as of 2026-08-17; a VIN API integration is a later,
 *             separate decision, not built).
 *   Subaru  — vehicle-resources hub VALIDATED (re-probed 200 on 2026-08-17);
 *             per-model manual list loads via a JS component
 *             (subaru-800-manual-items), not in raw HTML.
 *   Hyundai — manuals-warranties hub VALIDATED (re-probed 200 on 2026-08-17);
 *             per-model digital manuals live at digitalownersmanual.hyundai.com,
 *             which STILL does not resolve (DNS NXDOMAIN) from the build
 *             environment as of the Wave 2 re-probe.
 *   Ford    — NO endpoint validated in Wave 1 or Wave 2: ford.com/support/
 *             owner-manuals and fordservicecontent.com PDFs time out / drop
 *             the connection from this environment (bot protection). Wave 2
 *             re-probe (2026-08-17): Chrome GET, Safari HEAD, HTTP/1.1 GET
 *             (35s), and the service-content PDF all failed — GET/HEAD both
 *             error or hang with 0 bytes. Keep upload fallback; retry from
 *             Vercel IPs in the feature build.
 *   Tesla   — EXCLUDED entirely (owner direction: "not our market").
 *
 * Wave 2 additions (2026-08-17 — all entries below validated or documented
 * honestly; NO guessed URLs):
 *   Nissan   — NEW. Manuals & Guides hub VALIDATED (200 text/html; title
 *              "All Nissan Owners Vehicle Manuals & Guides | Nissan USA").
 *              Per-model manuals load via AEM SPA (jcr:content.proxy.json),
 *              not in raw HTML; guessed PDF patterns returned 404 — hub
 *              entries only, upload fallback recommended for parse.
 *   Volkswagen — NEW. "Owner's Manuals" page under the owners area VALIDATED
 *              (200 text/html; reached from vw.com/en/owners.html nav).
 *              Manual lookup/PDFs run through the VW owners portal flow
 *              (JS-heavy) — page shell validated only.
 *   Mercedes  — NEW. mbusa.com/en/owners/manuals VALIDATED (200 text/html;
 *              JS-rendered manuals landing page). Per-model manuals are
 *              VIN-linked via the MB owner portal — shell validated only.
 *   Chevrolet — probed: chevrolet.com/support/vehicle/manuals (404),
 *              /ownercenter (404), gm.com/owners (404) — NO valid endpoint;
 *              entries below are honest upload fallbacks.
 *   BMW       — probed: bmwusa.com/owners-manuals.html — HTTP/2 stream error,
 *              then 35s timeout (0 bytes) — NOT fetchable; upload fallback.
 *   Jeep      — probed: mopar.com owner-manual (403 bot wall),
 *              jeep.com/en/owners/ (redirects to jeep.com root) — upload
 *              fallback.
 *   Mazda     — probed: mazdausa.com/owners root 200 but NO manuals URL
 *              exists (owners nav links to a site-search page; PDF patterns
 *              404) — upload fallback.
 *   Lexus     — probed: drivers.lexus.com vehicle-manual + lexus.com/owners
 *              both 404 — no index entries (documented here only).
 *   Acura     — probed: owners.acura.com/vehicles/manuals 200 but redirects
 *              to the mygarage.honda.com login shell; per-model route 404 —
 *              no index entries (documented here only).
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
    }
  },
  hyundai: {
    elantra: {
      '2017-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which does NOT resolve (DNS) from the build environment (re-checked 2026-08-17 — still NXDOMAIN); upload fallback recommended for parse.'
      }
    },
    sonata: {
      '2015-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which does NOT resolve (DNS) from the build environment (re-checked 2026-08-17 — still NXDOMAIN); upload fallback recommended for parse.'
      }
    },
    tucson: {
      '2016-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which does NOT resolve (DNS) from the build environment (re-checked 2026-08-17 — still NXDOMAIN); upload fallback recommended for parse.'
      }
    },
    'santa fe': {
      '2019-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which does NOT resolve (DNS) from the build environment (re-checked 2026-08-17 — still NXDOMAIN); upload fallback recommended for parse.'
      }
    }
  },
  ford: {
    'f-150': {
      '2015-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — ford.com/support/owner-manuals and fordservicecontent.com PDFs (e.g. .../Ford_Content/Catalog/owner_information/2023-Ford-F-150-Owners-Manual-version-1_om_EN-US.pdf) time out / drop the connection from the build environment (bot protection). Re-probed 2026-08-17 (Chrome GET, Safari HEAD, HTTP/1.1) — still blocked; upload fallback for now.'
      }
    },
    escape: {
      '2017-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Ford endpoints time out from the build environment (bot protection). Re-probed 2026-08-17 — still blocked; upload fallback for now.'
      }
    },
    explorer: {
      '2020-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Ford endpoints time out from the build environment (bot protection). Re-probed 2026-08-17 — still blocked; upload fallback for now.'
      }
    },
    mustang: {
      '2015-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Ford endpoints time out from the build environment (bot protection). Re-probed 2026-08-17 — still blocked; upload fallback for now.'
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
    }
  },
  chevrolet: {
    silverado: {
      '2019-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'Wave 2 (2026-08-17): no validated URL — chevrolet.com/support/vehicle/manuals (404), /ownercenter (404), gm.com/owners (404); GM manual portal is login-gated. Upload fallback for now.'
      }
    },
    equinox: {
      '2018-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'Wave 2 (2026-08-17): no validated URL — Chevrolet endpoints 404 from the build environment (see silverado note). Upload fallback for now.'
      }
    },
    malibu: {
      '2016-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'Wave 2 (2026-08-17): no validated URL — Chevrolet endpoints 404 from the build environment (see silverado note). Upload fallback for now.'
      }
    }
  },
  bmw: {
    '3 series': {
      '2012-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'Wave 2 (2026-08-17): no validated URL — bmwusa.com/owners-manuals.html fails (HTTP/2 stream error, then 35s timeout with 0 bytes). Upload fallback for now.'
      }
    },
    x3: {
      '2011-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'Wave 2 (2026-08-17): no validated URL — bmwusa.com/owners-manuals.html fails (HTTP/2 stream error, then 35s timeout with 0 bytes). Upload fallback for now.'
      }
    }
  },
  jeep: {
    wrangler: {
      '2018-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'Wave 2 (2026-08-17): no validated URL — mopar.com owner-manual page returns 403 (bot wall); jeep.com/en/owners/ redirects to the jeep.com root. Upload fallback for now.'
      }
    },
    'grand cherokee': {
      '2011-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'Wave 2 (2026-08-17): no validated URL — mopar.com owner-manual page returns 403 (bot wall); jeep.com/en/owners/ redirects to the jeep.com root. Upload fallback for now.'
      }
    }
  },
  mazda: {
    mazda3: {
      '2014-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'Wave 2 (2026-08-17): no validated URL — mazdausa.com/owners loads (200) but has no manuals page (owners nav links to site search; PDF patterns return 404); manuals live behind the MyMazda login portal. Upload fallback for now.'
      }
    },
    'cx-5': {
      '2017-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'Wave 2 (2026-08-17): no validated URL — Mazda manuals live behind the MyMazda login portal (see mazda3 note). Upload fallback for now.'
      }
    }
  }
};

export default manualIndex;
