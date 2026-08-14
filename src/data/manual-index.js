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
 *     application/pdf) on 2026-08-14 from the build environment
 *     (Mozilla UA, -L, 25-40s timeout). NEVER guess URLs.
 *   - `fetchable: true`  → validated 200, server helper may fetch.
 *   - `fetchable: false` → no validated URL exists (bot-blocked / JS-gated /
 *     unresolvable); the app falls back to user upload for those models.
 *   - `source: 'oem'`    → manufacturer-public URL.
 *   - `source: 'upload'` → upload fallback only.
 *
 * Per-brand probe summary (2026-08-14):
 *   Toyota  — per-model digital manual pages VALIDATED (2020 + 2024 samples).
 *   Honda   — owners portal + per-model manual routes return 200 (Salesforce
 *             SPA; manual content renders via JS — parse strategy TBD in the
 *             feature build; upload fallback also fine).
 *   Kia     — manuals hub page VALIDATED; per-model PDFs are served behind a
 *             VIN-linked lookup (getvehicleinfo), not directly fetchable.
 *   Subaru  — vehicle-resources hub VALIDATED; per-model manual list loads via
 *             a JS component (subaru-800-manual-items), not in raw HTML.
 *   Hyundai — manuals-warranties hub VALIDATED; per-model digital manuals live
 *             at digitalownersmanual.hyundai.com, which did NOT resolve from
 *             the build environment (DNS) at probe time.
 *   Ford    — NO endpoint validated: ford.com/support/owner-manuals and
 *             fordservicecontent.com PDFs time out / drop the connection from
 *             this environment (bot protection). Retry from Vercel IPs in the
 *             feature build; upload fallback for now.
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
        notes: 'Manuals hub page (200 text/html, model/year search). Per-model PDFs are served behind a VIN-linked lookup (getvehicleinfo) — not directly fetchable; upload fallback recommended for parse.'
      }
    },
    forte: {
      '2014-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals hub page (200 text/html, model/year search). Per-model PDFs are served behind a VIN-linked lookup (getvehicleinfo) — not directly fetchable; upload fallback recommended for parse.'
      }
    },
    sportage: {
      '2017-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals hub page (200 text/html, model/year search). Per-model PDFs are served behind a VIN-linked lookup (getvehicleinfo) — not directly fetchable; upload fallback recommended for parse.'
      }
    },
    sorento: {
      '2016-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals hub page (200 text/html, model/year search). Per-model PDFs are served behind a VIN-linked lookup (getvehicleinfo) — not directly fetchable; upload fallback recommended for parse.'
      }
    },
    telluride: {
      '2020-2026': {
        url: 'https://owners.kia.com/us/en/manuals.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals hub page (200 text/html, model/year search). Per-model PDFs are served behind a VIN-linked lookup (getvehicleinfo) — not directly fetchable; upload fallback recommended for parse.'
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
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which did NOT resolve (DNS) from the build environment at probe time; upload fallback recommended for parse.'
      }
    },
    sonata: {
      '2015-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which did NOT resolve (DNS) from the build environment at probe time; upload fallback recommended for parse.'
      }
    },
    tucson: {
      '2016-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which did NOT resolve (DNS) from the build environment at probe time; upload fallback recommended for parse.'
      }
    },
    'santa fe': {
      '2019-2026': {
        url: 'https://owners.hyundaiusa.com/us/en/resources/manuals-warranties.html',
        fetchable: true,
        source: 'oem',
        notes: 'Manuals & Warranties hub page (200 text/html). Per-model digital manuals live at digitalownersmanual.hyundai.com, which did NOT resolve (DNS) from the build environment at probe time; upload fallback recommended for parse.'
      }
    }
  },
  ford: {
    'f-150': {
      '2015-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — ford.com/support/owner-manuals and fordservicecontent.com PDFs (e.g. .../Ford_Content/Catalog/owner_information/2023-Ford-F-150-Owners-Manual-version-1_om_EN-US.pdf) time out / drop the connection from the build environment (bot protection). Retry from Vercel IPs during the feature build; upload fallback for now.'
      }
    },
    escape: {
      '2017-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Ford endpoints time out from the build environment (bot protection). Retry from Vercel IPs during the feature build; upload fallback for now.'
      }
    },
    explorer: {
      '2020-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Ford endpoints time out from the build environment (bot protection). Retry from Vercel IPs during the feature build; upload fallback for now.'
      }
    },
    mustang: {
      '2015-2026': {
        url: null,
        fetchable: false,
        source: 'upload',
        notes: 'No validated URL — Ford endpoints time out from the build environment (bot protection). Retry from Vercel IPs during the feature build; upload fallback for now.'
      }
    }
  }
};

export default manualIndex;
