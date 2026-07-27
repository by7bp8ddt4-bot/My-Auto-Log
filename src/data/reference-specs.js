/**
 * Quick Reference Specs — fluid types, capacities, tire pressures, bulb types, OBD-II locations.
 * One-stop lookup for the crucial information in the owner's manual.
 *
 * Structure:
 *   make -> model -> yearRange -> { engine, transmission, transferCase, differentials, brakeFluid, tires, bulbs, obd2Location }
 *
 * Engine specs:   { oilViscosity, oilCapacity, oilFilterPN, coolantType, coolantCapacity }
 * Transmission:   { fluidType, capacity }
 * Transfer case:  { fluidType, capacity } | null (null if N/A — 2WD models)
 * Differentials:  { front: {...} | null, rear: {...} | null }
 * Tires:          { frontPSI, rearPSI, oemSizes, lugNutTorque }
 * Bulbs:          { lowBeam, highBeam, frontTurn, rearTurn, tailBrake, interior, license }
 *
 * Notes:
 *   - Capacities are for drain-and-refill (not dry fill) unless noted.
 *   - AWD/4WD fields are marked null when N/A for 2WD models; check vehicle config.
 *   - Hybrid and diesel variants have variant-specific notes inline.
 *   - LED migration: 2020+ models commonly use LED on higher trims; halogen base trim values are listed.
 *   - Specialty fluids: Honda DPSF-II, Mazda ATF-FZ, Nissan NS-3 CVT, Ford MERCON ULV vs LV, GM DEXRON-ULV vs HP.
 *
 * Sources: Toyota/Lexus owner's manuals, Ford service manuals, Honda owner's manuals,
 * GM/Chevrolet service documentation, Mazda workshop manuals, Nissan service data,
 * NHTSA PDFs, startmycar.com (cross-referenced).
 */

export const referenceSpecs = {
  toyota: {
    camry: {
      '2018-2024': {
        engine: {
          oilViscosity: '0W-16 (2.5L) / 0W-20 (3.5L V6)',
          oilCapacity: '4.8 qt (2.5L w/filter) / 6.0 qt (3.5L V6)',
          oilFilterPN: 'Toyota 90915-YZZF1 (2.5L) / 90915-YZZ3 (3.5L V6)',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '6.9 qt (2.5L) / 9.5 qt (3.5L V6)'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (8-speed auto) / eCVT fluid (hybrid)',
          capacity: '3.9 qt drain-and-refill (auto) / consult manual (hybrid)'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'Toyota Differential Gear Oil LT 75W-85 GL-5',
            capacity: '0.5 qt',
            note: 'AWD models only. AWD-e hybrid uses rear electric motor — no gear oil.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['215/55R17 (LE, SE)', '235/45R18 (XLE)', '235/40R19 (XSE, TRD)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'LED (projector standard on most trims) / H11 (halogen base trims)',
          highBeam: 'LED / 9005 (halogen base)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, near the hood release lever and kick panel.'
      }
    },
    rav4: {
      '2019-2024': {
        engine: {
          oilViscosity: '0W-16 (2.5L gas) / 0W-16 (2.5L hybrid)',
          oilCapacity: '4.8 qt (2.5L w/filter)',
          oilFilterPN: 'Toyota 90915-YZZF1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '6.4 qt (gas) / 7.2 qt (hybrid — includes inverter cooling loop)'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (8-speed Direct Shift) / eCVT fluid (hybrid)',
          capacity: '3.9 qt drain-and-refill (gas auto) / consult manual (hybrid eCVT)'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '0.5 qt',
          note: 'AWD gas models only. Hybrid AWD-e uses rear electric motor — no transfer case fluid.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Toyota Differential Gear Oil LT 75W-85 GL-5',
            capacity: '0.5 qt',
            note: 'AWD gas models only. AWD-e hybrid uses rear electric motor — no gear oil.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['225/65R17 (LE, XLE)', '235/55R19 (Limited, XSE)', '225/60R18 (Adventure, TRD Off-Road)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'LED (projector on most trims) / H11 (halogen base LE)',
          highBeam: 'LED / 9005 (halogen base LE)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443 / LED (higher trims)',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, near the hood release lever.'
      }
    },
    tacoma: {
      '2016-2024': {
        engine: {
          oilViscosity: '0W-20 (2.7L I4 & 3.5L V6)',
          oilCapacity: '4.8 qt (2.7L I4 w/filter) / 5.7 qt (3.5L V6 w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1 (3.5L V6) / 90915-YZZF1 (2.7L I4)',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '7.5 qt (2.7L I4) / 9.0 qt (3.5L V6)'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (6-speed auto)',
          capacity: '3.3 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.1 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-85 GL-5 Gear Oil',
            capacity: '1.6 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 GL-5 Gear Oil',
            capacity: '3.4 qt (w/ tow package) / 3.0 qt (standard)'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['245/75R16 (SR, SR5)', '265/70R16 (TRD Off-Road)', '265/65R17 (TRD Sport, Limited)', '265/60R18 (Limited)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED (TRD Pro, Limited)',
          highBeam: '9005 (halogen) / LED (higher trims)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443 / LED tail lights (higher trims)',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, above the kick panel near the hood release.'
      }
    }
  },

  ford: {
    'f-150': {
      '2015-2020': {
        engine: {
          oilViscosity: '5W-30 (2.7L/3.5L EcoBoost, 5.0L V8) / 5W-30 (3.0L Power Stroke diesel — CJ-4)',
          oilCapacity: '6.0 qt (2.7L/3.5L/5.0L w/filter) / 6.5 qt (3.0L diesel)',
          oilFilterPN: 'Motorcraft FL-500S (gas) / FL-2124-S (diesel)',
          coolantType: 'Motorcraft Orange (gas) / Motorcraft Yellow (diesel)',
          coolantCapacity: '13.0 qt (2.7L/3.5L) / 15.1 qt (5.0L) / 16.5 qt (3.0L diesel)'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6-speed 6R80) / MERCON ULV (10-speed 10R80 on 3.5L EcoBoost 2017+ & 5.0L 2018+)',
          capacity: '5.0 qt drain-and-refill (6R80) / 5.5 qt (10R80)'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON LV',
          capacity: '2.0 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 80W-90 Premium Rear Axle Lubricant',
            capacity: '1.8 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 (9.75" standard axle) / SAE 75W-140 (electronic locking differential)',
            capacity: '2.8 qt (8.8" axle) / 3.5 qt (9.75" axle)',
            note: 'Add friction modifier XL-3 for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['245/70R17 (XL)', '275/65R18 (XLT, Lariat)', '275/55R20 (King Ranch, Platinum)', '275/45R22 (Limited)'],
          lugNutTorque: 150
        },
        bulbs: {
          lowBeam: 'H13/9008 (dual-beam halogen) / LED (Lariat+, 2018+)',
          highBeam: 'H13/9008 (dual-beam halogen) / LED (higher trims)',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157 / LED (Lariat+)',
          interior: '578 (dome/map)',
          license: '194 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the parking brake release.'
      },
      '2021-2024': {
        engine: {
          oilViscosity: '5W-30 (2.7L/3.5L EcoBoost, 5.0L V8) / 5W-30 (3.5L PowerBoost hybrid)',
          oilCapacity: '6.0 qt (2.7L/3.5L/5.0L w/filter) / 6.0 qt (PowerBoost hybrid)',
          oilFilterPN: 'Motorcraft FL-500S',
          coolantType: 'Motorcraft Yellow (all engines)',
          coolantCapacity: '13.4 qt (2.7L/3.5L) / 15.1 qt (5.0L) / 18.5 qt (PowerBoost — includes hybrid cooling loop)'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON ULV (10-speed 10R80 — all engines)',
          capacity: '5.5 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON LV',
          capacity: '2.0 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-85 Premium Synthetic',
            capacity: '1.8 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 (standard) / SAE 75W-140 (electronic locking differential)',
            capacity: '3.5 qt (9.75" axle)',
            note: 'Add friction modifier XL-3 for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['245/70R17 (XL)', '275/65R18 (XLT, Lariat)', '275/60R20 (King Ranch, Platinum)', '275/50R22 (Limited)'],
          lugNutTorque: 150
        },
        bulbs: {
          lowBeam: 'LED (standard on all trims — 14th gen)',
          highBeam: 'LED',
          frontTurn: '3157A (amber) / LED (higher trims)',
          rearTurn: '3157A (amber) / LED (higher trims)',
          tailBrake: 'LED (all trims)',
          interior: 'LED (dome/map)',
          license: 'LED (Lariat+) / 194 (XL, XLT)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the parking brake release.'
      }
    },
    'f-250': {
      '2017-2024': {
        engine: {
          oilViscosity: '5W-30 (6.2L gas) / 5W-40 or 15W-40 (6.7L Power Stroke diesel) / 5W-30 (7.3L Godzilla gas)',
          oilCapacity: '7.0 qt (6.2L w/filter) / 13.0 qt (6.7L diesel) / 8.0 qt (7.3L gas)',
          oilFilterPN: 'Motorcraft FL-820S (6.2L) / FL-2124-S (6.7L diesel) / FL-820-S (7.3L)',
          coolantType: 'Motorcraft Orange (gas) / Motorcraft Yellow (diesel)',
          coolantCapacity: '22.4 qt (6.2L) / 31.7 qt (6.7L diesel) / 23.0 qt (7.3L)'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6-speed 6R140) / MERCON ULV (10-speed 10R140, 2020+)',
          capacity: '5.5 qt drain-and-refill (6R140) / 7.0 qt (10R140)'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON LV',
          capacity: '2.0 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 80W-90 (Dana 60)',
            capacity: '2.7 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-140 (Dana M275 / Sterling 10.5")',
            capacity: '3.5 qt (Sterling 10.5") / 4.5 qt (Dana M275)',
            note: 'Add friction modifier XL-3 for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 60,
          rearPSI: 65,
          oemSizes: ['LT245/75R17 (XL)', 'LT275/70R18 (XLT, Lariat)', 'LT275/65R20 (King Ranch, Platinum)', 'LT285/75R18 (Tremor)'],
          lugNutTorque: 165
        },
        bulbs: {
          lowBeam: 'H13/9008 (halogen) / LED (Lariat, 2020+)',
          highBeam: 'H13/9008 (halogen) / LED (higher trims)',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157 / LED (Lariat+)',
          interior: '578 (dome/map)',
          license: '194 (W5W) / LED (2020+ higher trims)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      }
    },
    'e-250': {
      '2009-2024': {
        engine: {
          oilViscosity: '5W-20 (4.6L V8) / 5W-30 (5.4L V8) / 5W-30 (6.8L V10)',
          oilCapacity: '6.0 qt (4.6L/5.4L w/filter) / 7.0 qt (6.8L V10 w/filter)',
          oilFilterPN: 'Motorcraft FL-820S',
          coolantType: 'Motorcraft Orange (gas engines)',
          coolantCapacity: '25.3 qt (4.6L/5.4L) / 28.5 qt (6.8L V10)'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (4R75E / 5R110W)',
          capacity: '4.5 qt drain-and-refill'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'SAE 75W-140 (Dana 60 full-floating)',
            capacity: '3.5 qt',
            note: 'Add friction modifier XL-3 for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 55,
          rearPSI: 80,
          oemSizes: ['LT225/75R16E (standard)', 'LT245/75R16E (upgrade)'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: 'H13/9008 (dual-beam halogen) / 9007 (some model years)',
          highBeam: 'H13/9008 (dual-beam halogen) / 9007 (some model years)',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157',
          interior: '578 (dome/map) / 211-2 (cargo area)',
          license: '194 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near kick panel.'
      }
    },
    escape: {
      '2020-2024': {
        engine: {
          oilViscosity: '5W-30 (1.5L EcoBoost) / 5W-30 (2.0L EcoBoost) / 0W-20 (2.5L hybrid/plug-in hybrid)',
          oilCapacity: '5.0 qt (1.5L w/filter) / 5.5 qt (2.0L w/filter) / 5.7 qt (2.5L hybrid)',
          oilFilterPN: 'Motorcraft FL-910S (1.5L/2.0L) / FL-910-S (hybrid)',
          coolantType: 'Motorcraft Yellow',
          coolantCapacity: '8.0 qt (1.5L) / 9.0 qt (2.0L) / 11.5 qt (hybrid — includes battery cooling loop)'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON ULV (8-speed 8F35) / eCVT fluid (hybrid)',
          capacity: '4.5 qt drain-and-refill (8F35) / consult manual (hybrid eCVT)'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON LV (AWD PTU)',
          capacity: '0.5 qt',
          note: 'AWD models only. PTU (Power Transfer Unit) fluid. 2WD: no transfer case/PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'SAE 80W-90',
            capacity: '0.6 qt',
            note: 'AWD models only. Rear drive unit (RDU).'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['225/65R17 (S, SE)', '225/60R18 (SEL)', '225/55R19 (Titanium)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'LED (standard on most trims) / H11 (halogen base S)',
          highBeam: 'LED / 9005 (halogen base S)',
          frontTurn: '3157A (amber) / LED (higher trims)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (higher trims)',
          interior: '578 (dome/map) / LED (Titanium)',
          license: '168 (W5W) / LED (2022+ higher trims)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, above kick panel.'
      }
    }
  },

  honda: {
    civic: {
      '2016-2021': {
        engine: {
          oilViscosity: '0W-20 (all engines: 2.0L K20C2, 1.5L Turbo L15B7)',
          oilCapacity: '3.7 qt (2.0L w/filter) / 3.5 qt (1.5L Turbo w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '5.5 qt (2.0L) / 5.7 qt (1.5L Turbo)'
        },
        transmission: {
          fluidType: 'Honda HCF-2 (CVT) / Honda ATF DW-1 (6-speed manual)',
          capacity: '3.7 qt drain-and-refill (CVT) / 2.0 qt (6-speed manual)'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: null
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['215/55R16 (LX, EX)', '215/50R17 (EX-T, Touring)', '235/40R18 (Si)', '245/30R20 (Type R)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector LX, EX) / LED (Touring, Si, Type R)',
          highBeam: '9005 (halogen) / LED (Touring, Si, Type R)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (Touring, Si)',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel/fuse box area.'
      },
      '2022-2024': {
        engine: {
          oilViscosity: '0W-20 (2.0L K20C2 / 1.5L Turbo L15CA)',
          oilCapacity: '3.7 qt (2.0L w/filter) / 3.5 qt (1.5L Turbo w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '5.5 qt (2.0L) / 5.7 qt (1.5L Turbo)'
        },
        transmission: {
          fluidType: 'Honda HCF-2 (CVT) / Honda ATF DW-1 (6-speed manual — Si)',
          capacity: '3.7 qt drain-and-refill (CVT) / 2.0 qt (6-speed manual)'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: null
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['215/55R16 (LX)', '235/40R18 (Sport, EX-L)', '235/40R18 (Si)', '265/30R19 (Type R)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'LED (standard on all trims — 11th gen LED headlights standard)',
          highBeam: 'LED (standard on all trims)',
          frontTurn: 'LED (Sport, Touring) / 7444NA (LX — halogen)',
          rearTurn: 'LED (standard on all trims)',
          tailBrake: 'LED (standard on all trims)',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      }
    },
    'cr-v': {
      '2017-2022': {
        engine: {
          oilViscosity: '0W-20 (1.5L Turbo L15BE / 2.4L K24W)',
          oilCapacity: '3.7 qt (1.5L Turbo w/filter) / 4.4 qt (2.4L w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '6.2 qt (1.5L Turbo) / 6.5 qt (2.4L)'
        },
        transmission: {
          fluidType: 'Honda HCF-2 (CVT)',
          capacity: '3.9 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Honda DPSF-II (Dual Pump System Fluid)',
          capacity: '1.3 qt',
          note: 'AWD models only. DPSF-II is specific to Honda Real Time AWD system. 2WD: null.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Honda DPSF-II (Dual Pump System Fluid)',
            capacity: '1.3 qt',
            note: 'AWD models only. Rear differential uses same DPSF-II fluid as transfer case.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['235/65R17 (LX, EX)', '235/60R18 (EX-L, Touring)', '235/55R19 (Touring)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector LX, EX) / LED (EX-L, Touring)',
          highBeam: '9005 (halogen) / LED (EX-L, Touring)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (Touring)',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, above kick panel near fuse box.'
      },
      '2023-2024': {
        engine: {
          oilViscosity: '0W-20 (1.5L Turbo L15BE / 2.0L hybrid)',
          oilCapacity: '3.7 qt (1.5L Turbo w/filter) / 4.0 qt (2.0L hybrid w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02 (1.5L) / 15400-RTA-003 (2.0L hybrid)',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '6.2 qt (1.5L Turbo) / 7.8 qt (hybrid — includes inverter loop)'
        },
        transmission: {
          fluidType: 'Honda HCF-2 (CVT — 1.5L Turbo) / eCVT fluid (2.0L hybrid)',
          capacity: '3.9 qt drain-and-refill (CVT) / consult manual (hybrid eCVT)'
        },
        transferCase: {
          fluidType: 'Honda DPSF-II',
          capacity: '1.3 qt',
          note: 'AWD models only. Hybrid AWD uses electric rear motor — no transfer case fluid. 2WD: null.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Honda DPSF-II',
            capacity: '1.3 qt',
            note: 'AWD gas models only. Hybrid AWD uses rear electric motor — no gear oil.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['235/60R18 (EX, EX-L)', '235/55R19 (Sport Touring)', '235/60R18 (Sport hybrid)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'LED (standard on all trims — 6th gen)',
          highBeam: 'LED (standard on all trims)',
          frontTurn: 'LED (standard on all trims)',
          rearTurn: 'LED (standard on all trims)',
          tailBrake: 'LED (standard on all trims)',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near kick panel/fuse box area.'
      }
    }
  },

  chevrolet: {
    silverado: {
      '2019-2024': {
        engine: {
          oilViscosity: '0W-20 (2.7L Turbo I4 & 5.3L V8) / 0W-20 (6.2L V8) / 15W-40 (3.0L Duramax diesel)',
          oilCapacity: '6.0 qt (2.7L w/filter) / 8.0 qt (5.3L V8 w/filter) / 8.0 qt (6.2L w/filter) / 7.0 qt (3.0L diesel)',
          oilFilterPN: 'ACDelco PF63E (2.7L/5.3L/6.2L) / ACDelco PF66 (3.0L diesel)',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '13.0 qt (2.7L) / 16.5 qt (5.3L V8) / 17.0 qt (6.2L) / 12.5 qt (3.0L diesel)'
        },
        transmission: {
          fluidType: 'DEXRON-ULV (8-speed 8L90) / DEXRON-HP (10-speed 10L90, 2020+)',
          capacity: '5.0 qt drain-and-refill (8L90) / 5.5 qt (10L90)',
          note: 'DEXRON-ULV (ultra-low viscosity) for 8-speed. DEXRON-HP for 10-speed. Do not interchange.'
        },
        transferCase: {
          fluidType: 'DEXRON-VI (AutoTrak) / AutoTrak II (2-speed transfer case)',
          capacity: '2.0 qt',
          note: '4WD models only. 2WD: no transfer case. AutoTrak II is blue — do not mix with standard ATF.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-90 GL-5 Synthetic',
            capacity: '1.8 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 (standard) / SAE 75W-90 (Max Trailering / locking differential)',
            capacity: '2.8 qt (9.5" axle) / 3.6 qt (12-bolt)',
            note: 'Add friction modifier for limited-slip differential. Electronic locking diff uses specific GM fluid.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['255/70R17 (Work Truck)', '275/60R20 (LT, LTZ, High Country)', '275/50R22 (High Country, RST)', '275/65R18 (Trail Boss, Z71)'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: 'H11 (halogen Work Truck, Custom) / LED (LT, LTZ, High Country)',
          highBeam: '9005 (halogen) / LED (higher trims)',
          frontTurn: '3157A (amber) / LED (LTZ+)',
          rearTurn: '3157A (amber) / LED (LTZ+)',
          tailBrake: '3157 / LED (LT, LTZ, High Country)',
          interior: '194 (map) / 578 (dome) / LED (higher trims)',
          license: '194 (W5W) / LED (2022+)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near parking brake/steering column trim.'
      }
    }
  },

  mazda: {
    '3': {
      '2019-2024': {
        engine: {
          oilViscosity: '0W-20 (2.5L SkyActiv-G) / 5W-30 (2.5L Turbo SkyActiv-G)',
          oilCapacity: '4.8 qt (2.5L w/filter) / 4.5 qt (2.5L Turbo w/filter)',
          oilFilterPN: 'Mazda 1WPE-14-302 (OEM) / PE01-14-302A',
          coolantType: 'Mazda FL22 (green)',
          coolantCapacity: '7.0 qt (2.5L) / 7.5 qt (2.5L Turbo)'
        },
        transmission: {
          fluidType: 'Mazda ATF-FZ (6-speed SkyActiv-Drive)',
          capacity: '3.7 qt drain-and-refill',
          note: 'Mazda ATF-FZ is specific to SkyActiv transmissions. Do not substitute with generic ATF.'
        },
        transferCase: {
          fluidType: 'Mazda Long Life Hypoid Gear Oil SG1',
          capacity: '0.4 qt',
          note: 'AWD models only. i-Activ AWD PTU (Power Transfer Unit). 2WD: null.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Mazda Long Life Hypoid Gear Oil SG1',
            capacity: '0.5 qt',
            note: 'AWD models only. Rear differential uses same SG1 fluid.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 36,
          rearPSI: 36,
          oemSizes: ['205/60R16 (base)', '215/45R18 (Select, Preferred, Premium)', '215/45R18 (Turbo)'],
          lugNutTorque: 108
        },
        bulbs: {
          lowBeam: 'LED (standard on all trims — 4th gen)',
          highBeam: 'LED (standard on all trims)',
          frontTurn: 'LED (standard on all trims)',
          rearTurn: 'LED (standard on all trims) / 7440A (2019 base — verify VIN)',
          tailBrake: 'LED (signature lighting ring)',
          interior: 'LED (dome/map)',
          license: 'LED / 168 (W5W — some 2019 base models)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, above kick panel near fuse box.'
      }
    }
  },

  gmc: {
    'yukon xl': {
      '2015-2024': {
        engine: {
          oilViscosity: '0W-20 (5.3L V8, 6.2L V8 — 2015-2020) / 0W-20 (5.3L/6.2L — 2021+) / 15W-40 (3.0L Duramax diesel — 2021+)',
          oilCapacity: '8.0 qt (5.3L/6.2L w/filter) / 7.0 qt (3.0L diesel w/filter)',
          oilFilterPN: 'ACDelco PF63E (gas) / ACDelco PF66 (3.0L diesel)',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '16.5 qt (5.3L) / 17.0 qt (6.2L) / 12.5 qt (3.0L diesel)'
        },
        transmission: {
          fluidType: 'DEXRON-VI (6-speed 6L80 — 2015-2019) / DEXRON-HP (10-speed 10L90 — 2021+)',
          capacity: '5.0 qt drain-and-refill (6L80) / 5.5 qt (10L90)',
          note: '2015-2019 uses 6L80 with DEXRON-VI. 2021+ uses 10L90 with DEXRON-HP.'
        },
        transferCase: {
          fluidType: 'DEXRON-VI / AutoTrak II (2-speed transfer case)',
          capacity: '2.0 qt',
          note: '4WD models only. AutoTrak II (blue) for 2-speed transfer case. 2WD: null.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-90 GL-5 Synthetic',
            capacity: '1.8 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 (standard) / SAE 75W-90 (Max Trailering)',
            capacity: '2.8 qt (9.5" axle) / 3.6 qt (9.76" axle)',
            note: 'Add friction modifier for limited-slip differential. GM electronic locking diff may use specific fluid.'
          }
        },
        brakeFluid: 'DOT 3 (2015-2020) / DOT 4 (2021+)',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['265/65R18 (SLE)', '275/55R20 (SLT, Denali)', '275/50R22 (Denali)', '285/45R22 (Denali Ultimate)'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: 'H11 (halogen SLE 2015-2020) / LED (SLT, Denali; all trims 2021+)',
          highBeam: '9005 (halogen) / LED (SLT, Denali; all trims 2021+)',
          frontTurn: '3157A (amber) / LED (Denali 2015+)',
          rearTurn: '3157A (amber) / LED (Denali)',
          tailBrake: '3157 / LED (Denali, SLT)',
          interior: '194 (map) / 578 (dome) / LED (Denali)',
          license: '194 (W5W) / LED (Denali, 2021+)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the parking brake assembly.'
      }
    }
  },

  nissan: {
    rogue: {
      '2014-2024': {
        engine: {
          oilViscosity: '0W-20 (2.5L QR25DE — 2014-2020) / 0W-20 (2.5L PR25DD — 2021+) / 0W-20 (1.5L VC-Turbo KR15DDT — 2022+)',
          oilCapacity: '4.8 qt (2.5L w/filter) / 5.1 qt (1.5L VC-Turbo w/filter)',
          oilFilterPN: 'Nissan 15208-65F0E (2.5L) / 15208-65F1E (1.5L VC-Turbo)',
          coolantType: 'Nissan Long Life Coolant (blue)',
          coolantCapacity: '7.2 qt (2.5L) / 7.8 qt (1.5L VC-Turbo)'
        },
        transmission: {
          fluidType: 'Nissan NS-3 CVT Fluid',
          capacity: '4.5 qt drain-and-refill (CVT)',
          note: 'Nissan NS-3 is specific to Nissan CVTs. Do NOT use NS-2 or generic CVT fluid. Use only NS-3.'
        },
        transferCase: {
          fluidType: 'Nissan Differential Oil Hypoid Super GL-5 80W-90',
          capacity: '0.5 qt',
          note: 'AWD models only. Transfer case on AWD Rogues. 2WD: null.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Nissan Differential Oil Hypoid Super GL-5 80W-90',
            capacity: '0.6 qt',
            note: 'AWD models only. Rear differential.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33,
          rearPSI: 33,
          oemSizes: ['225/65R17 (S, SV)', '225/60R18 (SL, Platinum)', '235/55R19 (Platinum)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: 'H11 (halogen S, SV 2014-2021) / LED (SL, Platinum; all trims 2022+)',
          highBeam: '9005 (halogen) / LED (SL, Platinum; all trims 2022+)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber) / LED (2021+ SL, Platinum)',
          tailBrake: '7443 / LED (SL, Platinum)',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W) / LED (2021+)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel and fuse box.'
      }
    },
    murano: {
      '2015-2024': {
        engine: {
          oilViscosity: '0W-20 (3.5L V6 VQ35DE)',
          oilCapacity: '5.1 qt (w/filter)',
          oilFilterPN: 'Nissan 15208-65F0E',
          coolantType: 'Nissan Long Life Coolant (blue)',
          coolantCapacity: '9.0 qt (3.5L V6)'
        },
        transmission: {
          fluidType: 'Nissan NS-3 CVT Fluid',
          capacity: '5.0 qt drain-and-refill (CVT)',
          note: 'Nissan NS-3 is specific to Nissan CVTs. Do NOT use NS-2. V6 Murano CVT holds more fluid than Rogue CVT.'
        },
        transferCase: {
          fluidType: 'Nissan Differential Oil Hypoid Super GL-5 80W-90',
          capacity: '0.5 qt',
          note: 'AWD models only. 2WD: null.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Nissan Differential Oil Hypoid Super GL-5 80W-90',
            capacity: '0.6 qt',
            note: 'AWD models only.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33,
          rearPSI: 33,
          oemSizes: ['235/65R18 (S, SV)', '235/55R20 (SL, Platinum)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: 'H11 (halogen S, SV 2015-2020) / LED (SL, Platinum; all trims 2021+)',
          highBeam: '9005 (halogen) / LED (SL, Platinum; all trims 2021+)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber) / LED (2021+)',
          tailBrake: '7443 / LED (SL, Platinum)',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W) / LED (2021+)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      }
    }
  }
};

export default referenceSpecs;
