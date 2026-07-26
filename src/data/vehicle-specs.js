/**
 * Vehicle Reference Specifications
 *
 * Quick-reference specs for common vehicles: engine oil, coolant, transmission,
 * differential, transfer case, brake fluid, tire pressures, bulb types, and
 * OBD2 port location. Mirrors the kind of data you'd find in an owner's manual.
 *
 * Structure:
 *   make -> model -> yearRange -> { engineOil, coolant, transmission, ... }
 *
 * Conventions:
 *   - Use `null` for not-applicable fields (e.g., transferCase on FWD vehicles).
 *   - Mark AWD/4WD-specific fluids with `awdOnly: true` on differential/transferCase.
 *   - Note hybrid, diesel, and other variant-specific details in `notes` fields.
 *   - Capacities are in quarts (qts) unless otherwise noted.
 *   - Filter part numbers are OEM or equivalent aftermarket.
 *
 * Sources: Manufacturer owner's manuals, ACDelco/Motorcraft/Toyota/Honda/Nissan
 * service data, NHTSA PDFs, AMSOIL product guides, RockAuto catalog data.
 *
 * Last updated: 2026-07-26 — 17 vehicle variants, 7 manufacturers.
 */

export const vehicleSpecs = {

  // ── TOYOTA ──────────────────────────────────────────────────────────
  toyota: {
    camry: {
      '2018-2024': {
        engineOil: {
          viscosity: '0W-16',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 4.8,
          filterPart: 'Toyota 90915-YZZN1 (or 04152-YZZA1)',
          note: '2.5L A25A-FKS engine. 3.5L V6 (2GR-FKS) uses 0W-20, 6.0 qt. Hybrid (A25A-FXS) uses 0W-16, 4.4 qt.'
        },
        coolant: {
          type: 'Toyota Super Long Life Coolant (SLLC, pink)',
          capacityQts: 7.1,
          note: '2.5L engine. 3.5L V6: ~9.0 qt. Hybrid: ~7.4 qt.'
        },
        transmission: {
          type: 'Toyota ATF WS (8-speed automatic UA80E/F)',
          capacityQts: 7.8,
          drainFillQts: 3.5,
          note: 'eCVT (hybrid): Toyota ATF WS, ~4.0 qt drain and fill.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: null,
          awdOnly: {
            transferCase: { type: 'Toyota ATF WS', capacityQts: 0.8 },
            rearDiff: { type: 'Toyota Gear Oil LX 75W-85 GL-5', capacityQts: 0.5 }
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          pressureF: 35,
          pressureR: 35,
          oemSizes: ['P235/45R18', 'P235/40R19', 'P215/55R17 (LE)'],
          lugNutTorqueFtLbs: 76
        },
        bulbs: {
          lowBeam: 'H11 (halogen) or LED projector (XLE/XSE)',
          highBeam: '9005 (halogen) or LED (XLE/XSE)',
          frontTurn: '7444NA',
          rearTurn: '7440',
          tailBrake: '7443',
          interior: 'DE3175 (dome), 194 (map)',
          note: 'LED headlights on XLE and above trims. Fog lights: H16.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near hood release'
      }
    },

    rav4: {
      '2019-2024': {
        engineOil: {
          viscosity: '0W-16',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 4.8,
          filterPart: 'Toyota 90915-YZZN1',
          note: '2.5L A25A-FKS engine. Hybrid (A25A-FXS): 0W-16, 4.4 qt. Prime (PHEV): 0W-16, 4.5 qt.'
        },
        coolant: {
          type: 'Toyota Super Long Life Coolant (SLLC, pink)',
          capacityQts: 6.6,
          note: '2.5L gas. Hybrid: ~7.1 qt (includes inverter cooling circuit).'
        },
        transmission: {
          type: 'Toyota ATF WS (8-speed automatic UA80E)',
          capacityQts: 7.8,
          drainFillQts: 3.5,
          note: 'eCVT (hybrid): Toyota ATF WS, ~4.0 qt drain and fill.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: null,
          awdOnly: {
            transferCase: { type: 'Toyota Gear Oil LX 75W-85', capacityQts: 0.8 },
            rearDiff: { type: 'Toyota Gear Oil LX 75W-85 GL-5', capacityQts: 0.5 },
            note: 'AWD models (non-hybrid) use mechanical transfer case + rear diff. Hybrid AWD uses an independent rear electric motor (no transfer case fluid).'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          pressureF: 35,
          pressureR: 35,
          oemSizes: ['P225/65R17', 'P235/55R19', 'P225/60R18'],
          lugNutTorqueFtLbs: 76,
          note: '33 PSI on some trims (check door placard). Spare: T165/80D17 (compact).'
        },
        bulbs: {
          lowBeam: 'H11 (halogen) or LED projector',
          highBeam: '9005 (halogen) or LED',
          frontTurn: '7444NA',
          rearTurn: '7440',
          tailBrake: '7443',
          interior: 'DE3175 (dome), 194 (map)',
          note: 'LED headlights on XLE Premium and above. Fog lights: H16.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column'
      }
    },

    tacoma: {
      '2016-2024': {
        engineOil: {
          viscosity: '0W-20',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 6.2,
          filterPart: 'Toyota 90915-YZZD1 (V6) / 90915-YZZN1 (2.4L turbo)',
          note: '2016-2023: 2GR-FKS 3.5L V6, 0W-20, 6.2 qt. 2024+: T24A-FTS 2.4L turbo I4, 0W-20, 5.9 qt. Both full synthetic.'
        },
        coolant: {
          type: 'Toyota Super Long Life Coolant (SLLC, pink)',
          capacityQts: 10.1,
          note: '3.5L V6 (2016-2023): ~10.1 qt. 2.4L turbo (2024+): ~8.5 qt.'
        },
        transmission: {
          type: 'Toyota ATF WS',
          capacityQts: 10.6,
          drainFillQts: 4.0,
          note: '2016-2023: 6-speed Aisin automatic (AC60E). 2024+: 8-speed automatic (AL80E). Manual (2016-2023 only): Toyota 75W-85 GL-4, ~2.5 qt.'
        },
        transferCase: {
          type: 'Toyota Gear Oil LF 75W (SAE 75W)',
          capacityQts: 1.1,
          note: '4WD models only. 2WD models: null.'
        },
        differential: {
          front: { type: 'Toyota 75W-85 GL-5', capacityQts: 1.6, note: '4WD models only' },
          rear: { type: 'Toyota 75W-85 GL-5', capacityQts: 3.7, note: '3.5L V6. 2.4L turbo (2024+): ~3.5 qt.' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          pressureF: 30,
          pressureR: 33,
          oemSizes: ['P245/75R16', 'P265/70R16', 'P265/65R17', 'P265/60R18'],
          lugNutTorqueFtLbs: 83,
          note: 'Pressures vary by tire size and load. 29 PSI front / 32 PSI rear on some SR trims. Spare: full-size matching on most trims.'
        },
        bulbs: {
          lowBeam: 'H11 (halogen) or LED projector (TRD/Limited)',
          highBeam: '9005 (halogen) or LED',
          frontTurn: '7444NA',
          rearTurn: '7440',
          tailBrake: '7443',
          interior: 'DE3175 (dome), 194 (map)',
          note: 'LED headlights on TRD Sport/Off-Road/Limited/Pro. Fog lights: H16 (halogen) or LED.'
        },
        obd2Location: 'Under driver side dashboard, above the hood release lever'
      }
    }
  },

  // ── FORD ────────────────────────────────────────────────────────────
  ford: {
    'f-150': {
      '2015-2020': {
        engineOil: {
          viscosity: '5W-20',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 6.0,
          filterPart: 'Motorcraft FL-500S',
          note: '5.0L V8, 2.7L/3.5L EcoBoost: 5W-20, 6.0 qt. 3.3L V6: 5W-30, 6.0 qt. 3.0L Power Stroke diesel: 5W-30 (CJ-4), 7.0 qt, filter: FL-2124S.'
        },
        coolant: {
          type: 'Motorcraft Orange (OAT, WSS-M97B44-D)',
          capacityQts: 14.7,
          note: '3.5L EcoBoost: ~14.7 qt. 5.0L V8: ~13.1 qt. 2.7L: ~14.5 qt. 3.0L diesel: ~16.0 qt.'
        },
        transmission: {
          type: 'Mercon LV (6R80 6-speed) / Mercon ULV (10R80 10-speed, 2017+)',
          capacityQts: 12.0,
          drainFillQts: 5.0,
          note: '6R80 (2015-2016): Mercon LV. 10R80 (2017-2020): Mercon ULV. Full flush capacity ~13 qt for 10R80.'
        },
        transferCase: {
          type: 'Mercon LV',
          capacityQts: 1.9,
          note: '4x4 models only (BorgWarner 44-06/44-07). 2WD: null.'
        },
        differential: {
          front: { type: 'SAE 80W-90', capacityQts: 1.7, note: '4x4 models only. Ford 8.8" IFS.' },
          rear: {
            type: 'SAE 75W-85 (9.75" axle) / 75W-140 (8.8" axle)',
            capacityQts: 3.5,
            note: '9.75": 75W-85, ~3.5 qt. 8.8": 75W-140, ~2.6 qt. Add friction modifier for limited-slip (XL-3). Electronic locking diff uses same fluid without modifier.'
          }
        },
        brakeFluid: 'DOT 4 LV (Motorcraft PM-20)',
        tires: {
          pressureF: 35,
          pressureR: 35,
          oemSizes: ['P265/70R17', 'P275/65R18', 'P275/55R20'],
          lugNutTorqueFtLbs: 150,
          note: 'Pressures vary by tire and load. LT tires: 40-50 PSI front, 45-55 PSI rear.'
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / D3S HID (Lariat+) / LED (2018+ Lariat/Platinum)',
          highBeam: '9005 (halogen) / LED',
          frontTurn: '7444NA',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '194 (map/dome), 578 (vanity)',
          note: 'Quad-beam LED on 2018+ Lariat/King Ranch/Platinum/Limited. Fog lights: H10 (9145). Cargo lamp: 912.'
        },
        obd2Location: 'Under driver side dashboard, to the left of the steering column, near parking brake pedal'
      },

      '2021-2024': {
        engineOil: {
          viscosity: '5W-30',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 6.0,
          filterPart: 'Motorcraft FL-500S',
          note: 'All gasoline engines (3.5L EcoBoost, 5.0L V8, 2.7L EcoBoost, 3.3L V6): 5W-30, 6.0 qt. PowerBoost hybrid (3.5L): 5W-30, 6.0 qt. 3.0L diesel: 5W-30 CJ-4, 7.0 qt.'
        },
        coolant: {
          type: 'Motorcraft Yellow (P-OAT, WSS-M97B57-A1)',
          capacityQts: 14.4,
          note: '3.5L EcoBoost: ~14.4 qt. 5.0L V8: ~13.5 qt. PowerBoost hybrid includes additional inverter cooling loop.'
        },
        transmission: {
          type: 'Mercon ULV (10R80 10-speed automatic)',
          capacityQts: 13.0,
          drainFillQts: 5.5,
          note: 'PowerBoost hybrid: 10R80 MHT (modular hybrid transmission). Same Mercon ULV fluid.'
        },
        transferCase: {
          type: 'Mercon LV',
          capacityQts: 1.9,
          note: '4x4 models only. 2WD: null.'
        },
        differential: {
          front: { type: 'SAE 80W-90', capacityQts: 1.7, note: '4x4 models only.' },
          rear: {
            type: 'SAE 75W-85 (9.75") / 75W-140 (8.8")',
            capacityQts: 3.5,
            note: 'Max Trailer Tow includes 9.75" axle. Add XL-3 friction modifier for limited-slip.'
          }
        },
        brakeFluid: 'DOT 4 LV (Motorcraft PM-20)',
        tires: {
          pressureF: 35,
          pressureR: 35,
          oemSizes: ['P265/70R17', 'P275/65R18', 'P275/60R20', 'LT265/70R18 (HD Payload)'],
          lugNutTorqueFtLbs: 150,
          note: 'Lightning (EV): 42 PSI front/rear recommended. LT tires carry different pressures.'
        },
        bulbs: {
          lowBeam: 'LED projector (all trims, 2021+)',
          highBeam: 'LED',
          frontTurn: 'LED (OEM) / 7444NA (base halogen)',
          rearTurn: 'LED (OEM) / 3157 (base)',
          tailBrake: 'LED (OEM) / 3157 (base)',
          interior: 'LED (map/dome)',
          note: 'All 2021+ trims have LED headlights standard. Fog lights: LED (OEM) or H10.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column'
      }
    },

    'f-250': {
      '2017-2024': {
        engineOil: {
          viscosity: '5W-30 (gas) / 10W-30 (diesel)',
          type: 'Full Synthetic',
          capacityQts: 7.0,
          filterPart: 'Motorcraft FL-820S (6.2L gas) / FL-2051S (6.7L diesel)',
          note: '6.2L gas V8: 5W-30, 7.0 qt. 6.7L Power Stroke diesel: 10W-30 (CK-4), 13.0 qt. 7.3L Godzilla gas V8 (2020+): 5W-30, 8.0 qt, filter FL-820S. 6.8L gas V8 (2023+): 5W-30, 7.0 qt.'
        },
        coolant: {
          type: 'Motorcraft Orange (OAT) for diesel / Motorcraft Yellow (P-OAT) for gas (2021+)',
          capacityQts: 28.8,
          note: '6.7L diesel: ~28.8 qt. 6.2L gas: ~20.0 qt. 7.3L gas: ~22.0 qt. Use specified coolant type per engine.'
        },
        transmission: {
          type: 'Mercon LV (6R140) / Mercon ULV (10R140, 2020+)',
          capacityQts: 18.0,
          drainFillQts: 8.0,
          note: '2017-2019: TorqShift 6-speed (6R140), Mercon LV. 2020+: TorqShift 10-speed (10R140), Mercon ULV. Full flush ~18 qt for both.'
        },
        transferCase: {
          type: 'Mercon LV',
          capacityQts: 2.0,
          note: '4x4 models only (NV271F or BorgWarner 44-07). 2WD: null.'
        },
        differential: {
          front: { type: 'SAE 80W-90', capacityQts: 2.5, note: '4x4 models only. Dana 60 (F-250) / Dana Super 60 (F-350 DRW).' },
          rear: { type: 'SAE 75W-140 (synthetic)', capacityQts: 3.8, note: 'Ford/Sterling 10.5" (F-250), Dana M275 (F-350). Add XL-3 friction modifier for limited-slip.' }
        },
        brakeFluid: 'DOT 4 LV (Motorcraft PM-20)',
        tires: {
          pressureF: 60,
          pressureR: 70,
          oemSizes: ['LT245/75R17', 'LT275/65R18', 'LT275/70R18', 'LT275/65R20'],
          lugNutTorqueFtLbs: 165,
          note: 'Pressures are load-dependent; door placard shows minimum. Max pressure per tire sidewall typically 80 PSI for LT tires.'
        },
        bulbs: {
          lowBeam: 'H13 (halogen) / LED (Lariat+)',
          highBeam: 'H13 (dual-filament halogen) / LED',
          frontTurn: '7444NA (halogen) / LED',
          rearTurn: '3157 (halogen) / LED',
          tailBrake: '3157 (halogen) / LED',
          interior: '194 (map/dome)',
          note: 'LED headlights standard on Lariat, King Ranch, Platinum, Limited (2020+). Quad-beam LED on higher trims. Cab clearance lights: 194.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near parking brake'
      }
    },

    'e-250': {
      '2009-2024': {
        engineOil: {
          viscosity: '5W-20',
          type: 'Full Synthetic or Synthetic Blend',
          capacityQts: 6.0,
          filterPart: 'Motorcraft FL-820S',
          note: '4.6L 2V V8 and 5.4L 2V V8. Both use 5W-20, 6.0 qt. E-350 (5.4L): same specs. 6.8L V10 (E-350): 5W-30, 7.0 qt.'
        },
        coolant: {
          type: 'Motorcraft Orange (OAT)',
          capacityQts: 21.0,
          note: 'E-250/E-350. Large-capacity radiator due to commercial-duty cooling requirements.'
        },
        transmission: {
          type: 'Mercon LV (5R110W TorqShift 5-speed)',
          capacityQts: 17.5,
          drainFillQts: 7.0,
          note: '5R110W (2009-2010) or 6R140 (2011-2024). Both use Mercon LV. Drain and fill ~7-8 qt. Full flush ~17.5 qt.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: { type: 'SAE 75W-140 (synthetic)', capacityQts: 3.5, note: 'Dana 60 or Ford 10.5" full-floating rear axle. Add friction modifier for limited-slip.' }
        },
        brakeFluid: 'DOT 4 (Motorcraft PM-20)',
        tires: {
          pressureF: 55,
          pressureR: 80,
          oemSizes: ['LT225/75R16', 'LT245/75R16'],
          lugNutTorqueFtLbs: 150,
          note: 'E-250 GVWR determines tire pressure. Check door placard. Front may range 50-60 PSI, rear 70-80 PSI.'
        },
        bulbs: {
          lowBeam: 'H13 (dual-filament sealed beam replacement or composite)',
          highBeam: 'H13 (dual-filament)',
          frontTurn: '3157',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '194 (dome), 912 (cargo)',
          note: 'Composite headlight housings on later models (2011+). Earlier models may use sealed beam units. Cargo area: 912 or 921.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel'
      }
    },

    escape: {
      '2020-2024': {
        engineOil: {
          viscosity: '5W-20',
          type: 'Full Synthetic (API SP)',
          capacityQts: 5.0,
          filterPart: 'Motorcraft FL-910S',
          note: '1.5L EcoBoost I3: 5W-20, 5.0 qt. 2.0L EcoBoost I4: 5W-20, 5.5 qt. Hybrid (2.5L Atkinson): 0W-20, 5.0 qt, filter FL-910S. PHEV: same as hybrid.'
        },
        coolant: {
          type: 'Motorcraft Yellow (P-OAT)',
          capacityQts: 8.0,
          note: '1.5L: ~7.7 qt. 2.0L: ~8.3 qt. Hybrid/PHEV includes inverter cooling: ~8.5 qt.'
        },
        transmission: {
          type: 'Mercon ULV (8-speed automatic 8F35)',
          capacityQts: 8.5,
          drainFillQts: 3.5,
          note: 'Hybrid/PHEV: HF35 eCVT, uses Mercon ULV for gearbox section. Drain and fill ~4.0 qt.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: null,
          awdOnly: {
            transferCase: { type: 'SAE 75W-85 (PTU — Power Transfer Unit)', capacityQts: 0.5, note: 'AWD models only. Small PTU fill — critical to maintain.' },
            rearDiff: { type: 'SAE 75W-85 (Dana rear drive unit)', capacityQts: 0.7, note: 'AWD models only.' }
          }
        },
        brakeFluid: 'DOT 4 LV (Motorcraft PM-20)',
        tires: {
          pressureF: 33,
          pressureR: 33,
          oemSizes: ['P225/65R17', 'P225/60R18', 'P225/55R19'],
          lugNutTorqueFtLbs: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED projector (Titanium/ST-Line)',
          highBeam: '9005 (halogen) / LED',
          frontTurn: '7444NA',
          rearTurn: '7440 (halogen) / LED',
          tailBrake: 'LED (all trims, 2020+)',
          interior: '194 (map), DE3175 (dome)',
          note: 'LED headlights on SEL, Titanium, ST-Line. LED signature DRL on all trims. Fog lights: H11.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column'
      }
    }
  },

  // ── HONDA ───────────────────────────────────────────────────────────
  honda: {
    civic: {
      '2016-2021': {
        engineOil: {
          viscosity: '0W-20',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 3.7,
          filterPart: 'Honda 15400-PLM-A02',
          note: '2.0L K20C2: 0W-20, 3.7 qt with filter. 1.5L Turbo L15B7: 0W-20, 3.5 qt with filter. Type R (K20C1 2.0L turbo): 0W-20, 5.7 qt.'
        },
        coolant: {
          type: 'Honda Type 2 (blue, pre-mixed)',
          capacityQts: 5.9,
          note: '2.0L: ~5.9 qt. 1.5L turbo: ~5.4 qt. Type R: ~6.5 qt.'
        },
        transmission: {
          type: 'HCF-2 (CVT fluid)',
          capacityQts: 7.6,
          drainFillQts: 3.9,
          note: 'CVT models: HCF-2, drain and fill ~3.9 qt. 6-speed manual (Si/Type R): Honda MTF, ~2.0 qt.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: null,
          note: 'All 10th-gen Civics are FWD (except Type R which has a helical limited-slip front differential using Honda MTF).'
        },
        brakeFluid: 'DOT 3 (Honda Heavy Duty Brake Fluid)',
        tires: {
          pressureF: 32,
          pressureR: 30,
          oemSizes: ['P215/55R16', 'P215/50R17', 'P235/40R18 (Si)', 'P245/30R20 (Type R)'],
          lugNutTorqueFtLbs: 80,
          note: 'Type R: 35 PSI front / 33 PSI rear. Si: 33 PSI front / 32 PSI rear. Spare: T125/70D16 (compact).'
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED (Touring/Si/Type R)',
          highBeam: '9005 (halogen) / LED',
          frontTurn: '7444NA',
          rearTurn: '7440',
          tailBrake: '7443 (halogen) / LED (Touring)',
          interior: 'DE3175 (dome), 194 (map)',
          note: 'Full LED headlights on Touring, Si, and Type R. Fog lights: H8 (halogen) or LED (Si).'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, behind a small access panel'
      },

      '2022-2024': {
        engineOil: {
          viscosity: '0W-20',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 3.7,
          filterPart: 'Honda 15400-PLM-A02',
          note: '2.0L K20C2: 0W-20, 3.7 qt with filter. 1.5L Turbo L15B7/L15CA: 0W-20, 3.5 qt. Si (L15CA 1.5L turbo): 0W-20, 3.5 qt. Type R (K20C1): 0W-20, 5.7 qt. Hybrid (2.0L LFC2): 0W-20, 3.6 qt.'
        },
        coolant: {
          type: 'Honda Type 2 (blue, pre-mixed)',
          capacityQts: 5.9,
          note: 'Similar to 10th gen. Hybrid includes inverter cooling loop.'
        },
        transmission: {
          type: 'HCF-2 (CVT fluid)',
          capacityQts: 7.6,
          drainFillQts: 3.9,
          note: 'CVT: HCF-2, drain and fill ~3.9 qt. 6-speed manual (Si/Type R): Honda MTF, ~2.0 qt. eCVT (hybrid): Honda ATF DW-1.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: null
        },
        brakeFluid: 'DOT 3 (Honda Heavy Duty Brake Fluid)',
        tires: {
          pressureF: 33,
          pressureR: 32,
          oemSizes: ['P215/55R16', 'P215/50R17', 'P235/40R18 (Si)', 'P265/30R19 (Type R)'],
          lugNutTorqueFtLbs: 80,
          note: 'Type R: 35/33 PSI. Si: 33/32 PSI.'
        },
        bulbs: {
          lowBeam: 'LED (all trims, 2022+)',
          highBeam: 'LED',
          frontTurn: 'LED (all trims)',
          rearTurn: 'LED (all trims)',
          tailBrake: 'LED (all trims)',
          interior: 'LED (map/dome, all trims)',
          note: 'Full LED lighting standard on all 11th-gen Civics. Fog lights: LED (Sport Touring/Si).'
        },
        obd2Location: 'Under driver side dashboard, left of steering column'
      }
    },

    'cr-v': {
      '2017-2022': {
        engineOil: {
          viscosity: '0W-20',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 3.7,
          filterPart: 'Honda 15400-PLM-A02',
          note: '1.5L Turbo L15BE: 0W-20, 3.7 qt with filter. 2.4L K24W (2017-2019 LX): 0W-20, 4.4 qt. Hybrid (LFA1 2.0L, 2020+): 0W-16, 4.2 qt.'
        },
        coolant: {
          type: 'Honda Type 2 (blue, pre-mixed)',
          capacityQts: 6.0,
          note: '1.5L: ~5.5 qt. 2.4L: ~6.0 qt. Hybrid: ~6.5 qt with inverter cooling.'
        },
        transmission: {
          type: 'HCF-2 (CVT fluid)',
          capacityQts: 7.6,
          drainFillQts: 3.9,
          note: 'CVT: HCF-2, drain and fill ~3.9 qt. eCVT (hybrid): Honda ATF DW-1.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: null,
          awdOnly: {
            rearDiff: { type: 'Honda DPSF-II (Dual Pump System Fluid)', capacityQts: 1.3, note: 'AWD models only. Rear differential uses Honda-specific DPSF-II, NOT gear oil.' }
          }
        },
        brakeFluid: 'DOT 3 (Honda Heavy Duty Brake Fluid)',
        tires: {
          pressureF: 32,
          pressureR: 30,
          oemSizes: ['P235/60R18', 'P235/55R19'],
          lugNutTorqueFtLbs: 80,
          note: 'Touring trim: 33 PSI front / 33 PSI rear (19" wheels).'
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED (EX-L/Touring)',
          highBeam: '9005 (halogen) / LED',
          frontTurn: '7444NA',
          rearTurn: '7440',
          tailBrake: '7443 (halogen) / LED (Touring)',
          interior: 'DE3175 (dome), 194 (map)',
          note: 'LED headlights on EX, EX-L, and Touring. Fog lights: H8.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel'
      },

      '2023-2024': {
        engineOil: {
          viscosity: '0W-20',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 3.7,
          filterPart: 'Honda 15400-PLM-A02',
          note: '1.5L Turbo L15BE: 0W-20, 3.7 qt. Hybrid (LFC2 2.0L): 0W-16, 4.2 qt.'
        },
        coolant: {
          type: 'Honda Type 2 (blue, pre-mixed)',
          capacityQts: 6.0,
          note: '6th-gen CR-V. Hybrid includes inverter cooling loop.'
        },
        transmission: {
          type: 'HCF-2 (CVT fluid)',
          capacityQts: 7.6,
          drainFillQts: 3.9,
          note: 'CVT (1.5L turbo): HCF-2. eCVT (hybrid): Honda ATF DW-1.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: null,
          awdOnly: {
            rearDiff: { type: 'Honda DPSF-II', capacityQts: 1.3, note: 'AWD models only (Real Time AWD with Intelligent Control). Rear diff is electric-motor-driven on hybrid AWD (no driveshaft).' }
          }
        },
        brakeFluid: 'DOT 3 (Honda Heavy Duty Brake Fluid)',
        tires: {
          pressureF: 33,
          pressureR: 33,
          oemSizes: ['P235/60R18', 'P235/55R19'],
          lugNutTorqueFtLbs: 80
        },
        bulbs: {
          lowBeam: 'LED (all trims, 2023+)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (map/dome)',
          note: 'Full LED exterior lighting standard on all 2023+ CR-V trims.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column'
      }
    }
  },

  // ── CHEVROLET ───────────────────────────────────────────────────────
  chevrolet: {
    'silverado-1500': {
      '2019-2024': {
        engineOil: {
          viscosity: '0W-20',
          type: 'Dexos1 Gen 3 Full Synthetic',
          capacityQts: 8.0,
          filterPart: 'ACDelco PF63E (5.3L/6.2L) / PF66 (2.7L Turbo) / PF26 (3.0L diesel)',
          note: '5.3L L84 V8: 0W-20, 8.0 qt. 6.2L L87 V8: 0W-20, 8.0 qt. 2.7L L3B Turbo I4: 5W-30, 6.0 qt. 3.0L LM2/LZ0 Duramax diesel: 0W-20 DexosD, 7.0 qt.'
        },
        coolant: {
          type: 'Dex-Cool Orange (OAT, 50/50 pre-mixed)',
          capacityQts: 16.0,
          note: '5.3L: ~16.0 qt. 6.2L: ~16.5 qt. 2.7L Turbo: ~14.0 qt. 3.0L diesel: ~17.0 qt.'
        },
        transmission: {
          type: 'Dexron ULV (8L90 8-speed / 10L80 10-speed)',
          capacityQts: 12.0,
          drainFillQts: 6.0,
          note: '5.3L/6.2L (2019-2021): 8L90 8-speed, Dexron HP. 5.3L/6.2L (2022+): 10L80 10-speed, Dexron ULV. 2.7L Turbo: 8L90. 3.0L diesel: 10L80. Always verify with RPO code.'
        },
        transferCase: {
          type: 'Dexron VI / ATF',
          capacityQts: 2.0,
          note: '4WD models only (MP3024 2-speed or MP1625 single-speed). 2WD: null.'
        },
        differential: {
          front: { type: 'SAE 75W-85 (GM 8.25" IFS)', capacityQts: 1.6, note: '4WD models only.' },
          rear: {
            type: 'SAE 75W-85 (non-limited-slip) / 75W-90 (limited-slip G80)',
            capacityQts: 3.3,
            note: 'GM 9.5" or 9.76" axle. G80 locking diff: use 75W-90 with limited-slip additive (ACDelco 10-4003).'
          }
        },
        brakeFluid: 'DOT 3 (ACDelco 10-4022)',
        tires: {
          pressureF: 35,
          pressureR: 35,
          oemSizes: ['P265/70R17', 'P275/60R20', 'P275/50R22', 'LT275/70R18 (Trail Boss)'],
          lugNutTorqueFtLbs: 140,
          note: 'LT tires: 45-55 PSI front, 55-65 PSI rear. Check door placard for specific trim.'
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED reflector (LT/RST) / LED projector (LTZ/High Country)',
          highBeam: '9005 (halogen) / LED',
          frontTurn: '7444NA (halogen) / LED',
          rearTurn: '3157 (halogen) / LED',
          tailBrake: '3157 (halogen) / LED',
          interior: '194 (map/dome)',
          note: 'LED headlights on LT and above (2022+). Fog lights: H11 (halogen) or LED. Cargo light: 912.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, above the parking brake pedal'
      }
    }
  },

  // ── MAZDA ───────────────────────────────────────────────────────────
  mazda: {
    '3': {
      '2019-2024': {
        engineOil: {
          viscosity: '0W-20',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 4.8,
          filterPart: 'Mazda 1WPE-14-302 (or PE01-14-302A)',
          note: '2.5L Skyactiv-G: 0W-20, 4.8 qt with filter. 2.5L Skyactiv-G Turbo: 5W-30 (recommended for turbo), 5.1 qt with filter. 2.0L Skyactiv-G (global): 0W-20, 4.4 qt.'
        },
        coolant: {
          type: 'Mazda FL22 (green, pre-mixed, ethylene glycol)',
          capacityQts: 6.1,
          note: '2.5L: ~6.1 qt. 2.5L turbo: ~6.3 qt. 2.0L: ~5.5 qt.'
        },
        transmission: {
          type: 'Mazda ATF FZ (Skyactiv-Drive 6-speed automatic)',
          capacityQts: 7.7,
          drainFillQts: 4.0,
          note: '6-speed auto: Mazda ATF FZ (blue), drain and fill ~3.7-4.0 qt. 6-speed manual (SKYACTIV-MT): Mazda 75W-80 GL-4, ~1.8 qt.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: null,
          awdOnly: {
            transferCase: { type: 'Mazda SG1 75W-85 (PTU)', capacityQts: 0.4, note: 'AWD models only. i-Activ AWD system.' },
            rearDiff: { type: 'Mazda SG1 75W-85 GL-5', capacityQts: 0.7, note: 'AWD models only.' }
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          pressureF: 36,
          pressureR: 36,
          oemSizes: ['P205/60R16', 'P215/45R18'],
          lugNutTorqueFtLbs: 94,
          note: 'Tire pressures are for 18" wheel configuration. 16": 34 PSI front / 33 PSI rear. Turbo models with 18": 36/36 PSI.'
        },
        bulbs: {
          lowBeam: 'LED projector (all trims, 2019+)',
          highBeam: 'LED (all trims)',
          frontTurn: 'LED (Premium/Turbo) / 7444NA (base)',
          rearTurn: 'LED (Premium/Turbo) / 7440 (base)',
          tailBrake: 'LED signature (all trims)',
          interior: 'LED (map/dome)',
          note: 'Full LED headlights and tail lights standard on all 2019+ Mazda3 trims. Fog lights: LED (Premium/Turbo).'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, above the kick panel'
      }
    }
  },

  // ── GMC ─────────────────────────────────────────────────────────────
  gmc: {
    'yukon-xl': {
      '2015-2024': {
        engineOil: {
          viscosity: '5W-30',
          type: 'Dexos1 Gen 3 Full Synthetic',
          capacityQts: 8.0,
          filterPart: 'ACDelco PF63E',
          note: '2015-2020: 5.3L L83 V8 (5W-30) or 6.2L L86 V8 (5W-30), both 8.0 qt. 2021-2024: 5.3L L84 V8 (0W-20), 6.2L L87 V8 (0W-20), both 8.0 qt. 3.0L LM2/LZ0 Duramax diesel (2021+): 0W-20 DexosD, 7.0 qt, filter PF26.'
        },
        coolant: {
          type: 'Dex-Cool Orange (OAT, 50/50 pre-mixed)',
          capacityQts: 16.9,
          note: '5.3L: ~16.5 qt. 6.2L: ~16.9 qt. 3.0L diesel: ~17.5 qt.'
        },
        transmission: {
          type: 'Dexron VI (6L80) / Dexron ULV (10L80)',
          capacityQts: 12.0,
          drainFillQts: 6.0,
          note: '2015-2020: 6L80 6-speed (Dexron VI) or 8L90 8-speed (Dexron HP, 2018+). 2021+: 10L80 10-speed (Dexron ULV).'
        },
        transferCase: {
          type: 'Dexron VI / ATF',
          capacityQts: 2.0,
          note: '4WD models only (MP3024 2-speed transfer case). 2WD: null.'
        },
        differential: {
          front: { type: 'SAE 75W-85 (GM 8.25" IFS)', capacityQts: 1.6, note: '4WD models only.' },
          rear: {
            type: 'SAE 75W-85 (non-limited-slip) / 75W-90 (limited-slip G80)',
            capacityQts: 3.5,
            note: 'GM 9.5" or 9.76" rear axle. G80 automatic locking diff: use 75W-90 with limited-slip additive.'
          }
        },
        brakeFluid: 'DOT 3 (ACDelco 10-4022)',
        tires: {
          pressureF: 35,
          pressureR: 35,
          oemSizes: ['P265/65R18', 'P275/55R20', 'P285/45R22'],
          lugNutTorqueFtLbs: 140,
          note: '22" wheels may recommend 36 PSI. Max trailering package includes LT tires with different pressure specs.'
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / HID D3S (SLT/Denali) / LED (2021+ Denali)',
          highBeam: '9005 (halogen) / HID / LED',
          frontTurn: '7444NA (halogen) / LED (Denali)',
          rearTurn: '3157 (halogen) / LED (Denali)',
          tailBrake: '3157 (halogen) / LED',
          interior: '194 (map/dome)',
          note: 'LED headlights on 2021+ Denali. HID on 2015-2020 SLT/Denali. Halogen on SLE. Fog lights: H11 (halogen) or LED (Denali).'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, above the parking brake pedal'
      }
    }
  },

  // ── NISSAN ──────────────────────────────────────────────────────────
  nissan: {
    rogue: {
      '2014-2024': {
        engineOil: {
          viscosity: '0W-20',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 4.9,
          filterPart: 'Nissan 15208-65F0E (2014-2020) / 15208-6LB0A (2021+)',
          note: '2014-2020 (T32): 2.5L QR25DE, 0W-20, 4.9 qt with filter. 2021-2024 (T33): 2.5L PR25DD, 0W-20, 4.9 qt. 1.5L VC-Turbo KR15DDT (2022+): 0W-20, 4.5 qt.'
        },
        coolant: {
          type: 'Nissan Blue Long Life Coolant (LLC, pre-mixed)',
          capacityQts: 7.0,
          note: '2.5L engine. 1.5L VC-Turbo: ~6.5 qt.'
        },
        transmission: {
          type: 'Nissan NS-3 (CVT fluid)',
          capacityQts: 8.0,
          drainFillQts: 4.0,
          note: 'XTronic CVT. Drain and fill ~4.0 qt of NS-3 fluid. Full flush capacity ~8.0 qt. Never use aftermarket CVT fluid.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: null,
          awdOnly: {
            transferCase: { type: 'Nissan Matic D (ATF)', capacityQts: 0.5, note: 'AWD models only. Electronic coupling unit.' },
            rearDiff: { type: 'SAE 80W-90 GL-5', capacityQts: 0.7, note: 'AWD models only. Rear final drive.' }
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          pressureF: 33,
          pressureR: 33,
          oemSizes: ['P225/65R17', 'P235/55R19'],
          lugNutTorqueFtLbs: 80,
          note: '2014-2020 (T32): 33 PSI all around. 2021+ (T33): 35 PSI all around. Lug torque: 83 ft-lbs (2021+).'
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED (SL/Platinum)',
          highBeam: '9005 (halogen) / LED',
          frontTurn: '7444NA',
          rearTurn: '7440',
          tailBrake: '7443 (halogen) / LED (SL/Platinum)',
          interior: 'DE3175 (dome), 194 (map)',
          note: 'LED headlights on SV (2021+), SL, and Platinum. Fog lights: H8 (halogen) or LED.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the hood release'
      }
    },

    murano: {
      '2015-2024': {
        engineOil: {
          viscosity: '0W-20',
          type: 'Full Synthetic (API SP / ILSAC GF-6)',
          capacityQts: 5.1,
          filterPart: 'Nissan 15208-65F0E',
          note: '3.5L VQ35DE V6. All model years use 0W-20, 5.1 qt with filter.'
        },
        coolant: {
          type: 'Nissan Blue Long Life Coolant (LLC, pre-mixed)',
          capacityQts: 9.0,
          note: 'VQ35DE V6. Large-capacity cooling system.'
        },
        transmission: {
          type: 'Nissan NS-3 (CVT fluid)',
          capacityQts: 8.5,
          drainFillQts: 4.5,
          note: 'XTronic CVT (JF017E for V6). Drain and fill ~4.5 qt of NS-3. Use only genuine Nissan NS-3 fluid.'
        },
        transferCase: null,
        differential: {
          front: null,
          rear: null,
          awdOnly: {
            transferCase: { type: 'Nissan Matic D (ATF)', capacityQts: 0.5, note: 'AWD models only. Electronic coupling for rear axle engagement.' },
            rearDiff: { type: 'SAE 80W-90 GL-5', capacityQts: 0.8, note: 'AWD models only. Rear final drive.' }
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          pressureF: 33,
          pressureR: 33,
          oemSizes: ['P235/65R18', 'P235/55R20'],
          lugNutTorqueFtLbs: 80,
          note: '20" wheel configuration may list 35 PSI. Check door placard.'
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED (SL/Platinum)',
          highBeam: '9005 (halogen) / LED',
          frontTurn: '7444NA',
          rearTurn: '7440',
          tailBrake: '7443 (halogen) / LED (SL/Platinum)',
          interior: 'DE3175 (dome), 194 (map)',
          note: 'LED headlights on SL and Platinum trims. Signature LED DRL on all trims (2019+). Fog lights: H8 (halogen) or LED.'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the hood release'
      }
    }
  }
};

/**
 * Helper: Look up the spec block for a given make/model/year.
 * Returns null if no match is found.
 *
 * @param {string} make  - Normalized make name (e.g., "toyota", "ford")
 * @param {string} model - Normalized model name (e.g., "camry", "f-150")
 * @param {number} year  - Model year
 * @returns {object|null} The spec block, or null
 */
export function getVehicleSpecs(make, model, year) {
  if (!make || !model || !year) return null;

  const m = make.toLowerCase().trim();
  const mo = model.toLowerCase().trim();

  const makeData = vehicleSpecs[m];
  if (!makeData) return null;

  const modelData = makeData[mo];
  if (!modelData) return null;

  // Find matching year range
  for (const [range, specs] of Object.entries(modelData)) {
    const [start, end] = range.split('-').map(Number);
    if (year >= start && year <= end) {
      return specs;
    }
  }

  return null;
}
