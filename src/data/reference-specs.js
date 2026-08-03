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
 *   - Specialty fluids: Honda DPSF-II, Mazda ATF-FZ, Nissan NS-3 CVT, Ford MERCON ULV vs LV, GM DEXRON-ULV vs HP,
 *     ZF Lifeguard 8 (Honda 9-speed), Toyota CVTF-TC, eCVT fluids for hybrid transaxles.
 *   - Values marked "approx" or "confirm in owner's manual" should be verified against the vehicle
 *     owner's manual before service (see /home/team/shared/vehicle-data/wave1-notes.md for the Wave 2 list).
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
    },
    corolla: {
      '2005-2008': {
        engine: {
          oilViscosity: '5W-30',
          oilCapacity: '4.5 qt (1.8L 1ZZ-FE w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Genuine Long Life Coolant (red) / Super Long Life Coolant (pink)',
          coolantCapacity: '6.1 qt (1.8L) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF Type T-IV (4-speed auto) / API GL-4 75W-90 (5-speed manual)',
          capacity: '2.5 qt drain-and-refill (auto) / 2.0 qt (manual)'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['P185/65R15 (CE, LE)', 'P195/65R15 (S)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: '9003 (H4)',
          highBeam: '9003 (H4)',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: '168 (map) / 211-2 (dome)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, above the kick panel near the hood release lever.'
      },
      '2009-2013': {
        engine: {
          oilViscosity: '0W-20 (5W-30 acceptable)',
          oilCapacity: '4.5 qt (1.8L 2ZR-FE w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '6.3 qt (1.8L) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF Type T-IV (4-speed auto) / API GL-4 75W-90 (5/6-speed manual)',
          capacity: '2.5 qt drain-and-refill (auto) / 2.1 qt (manual)'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['P195/65R15 (L, LE, S)', 'P205/55R16 (XLE, S)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: '168 (map) / 211-2 (dome)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, above the kick panel near the hood release lever.'
      },
      '2014-2018': {
        engine: {
          oilViscosity: '0W-20',
          oilCapacity: '4.5 qt (1.8L 2ZR-FAE w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '6.4 qt (1.8L) — approx'
        },
        transmission: {
          fluidType: 'Toyota Genuine CVT Fluid TC (K313 CVT) / API GL-4 75W-90 (6-speed manual — S)',
          capacity: '2.5 qt drain-and-refill (CVT) / 2.1 qt (manual)',
          note: 'Use Toyota CVTF-TC only. Do not substitute regular ATF.'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['195/65R15 (L)', '205/55R16 (LE, S)', '215/45R17 (S Plus, S Premium)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / LED (2017+ S Premium)',
          highBeam: '9005 / LED (2017+ S Premium)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (S Premium)',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, above the kick panel near the hood release lever.'
      },
      '2019-2022': {
        engine: {
          oilViscosity: '0W-20 (1.8L 2ZR-FAE — L, LE) / 0W-16 (2.0L M20A-FKS — SE, XSE)',
          oilCapacity: '4.5 qt (1.8L w/filter) / 4.6 qt (2.0L w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1 (1.8L) / 90915-YZZF1 (2.0L)',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '6.3 qt (1.8L) / 6.6 qt (2.0L) — approx'
        },
        transmission: {
          fluidType: 'Toyota Genuine CVT Fluid TC (K313 CVT) / GL-4 75W-90 (6-speed manual — hatchback SE/XSE)',
          capacity: '2.5 qt drain-and-refill (CVT) / consult manual (6MT)',
          note: 'Use Toyota CVTF-TC only. Do not substitute regular ATF.'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['195/65R15 (L)', '205/55R16 (LE)', '215/45R17 (hatchback SE, XSE)', '225/40R18 (sedan SE, XSE)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'LED (all trims — 12th gen)',
          highBeam: 'LED / 9005 (halogen base L)',
          frontTurn: 'LED / 7444NA (halogen base)',
          rearTurn: 'LED (all trims)',
          tailBrake: 'LED',
          interior: 'LED (dome/map) / DE3175 (base)',
          license: '194 / LED (2022+ higher trims)'
        },
        obd2Location: 'Under driver side dashboard, near the hood release lever and kick panel.'
      },
      '2023-2025': {
        engine: {
          oilViscosity: '0W-20 (1.8L gas & 1.8L hybrid) / 0W-16 (2.0L)',
          oilCapacity: '4.5 qt (1.8L gas w/filter) / 4.4 qt (1.8L hybrid w/filter) / 4.6 qt (2.0L w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1 (1.8L gas/hybrid) / 90915-YZZF1 (2.0L)',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '6.3 qt (1.8L/hybrid) / 6.6 qt (2.0L) — approx'
        },
        transmission: {
          fluidType: 'Toyota Genuine CVT Fluid TC (K313 CVT) / eCVT fluid (1.8L hybrid)',
          capacity: '2.5 qt drain-and-refill (CVT) / consult manual (hybrid eCVT)',
          note: '1.8L hybrid (LE Hybrid) added for 2023. Use Toyota CVTF-TC only in CVT.'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['195/65R15 (L)', '205/55R16 (LE, SE)', '225/40R18 (XSE)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'LED (all trims)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, near the hood release lever and kick panel.'
      }
    },
    highlander: {
      '2005-2013': {
        engine: {
          oilViscosity: '5W-30',
          oilCapacity: '4.5 qt (2.4L I4 — 2005-2007) / 5.8 qt (3.3L V6 — 2005-2006) / 6.4 qt (3.5L V6 — 2007-2013)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '6.9 qt (2.4L) / 9.5 qt (3.3L V6) / 9.9 qt (3.5L V6) — approx; hybrid adds inverter loop'
        },
        transmission: {
          fluidType: 'Toyota ATF Type T-IV (4-speed auto 2005-2006 / 5-speed auto 2007-2013) / eCVT (hybrid)',
          capacity: '3.4 qt drain-and-refill (4AT) / 3.7 qt (5AT) / consult manual (hybrid)'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.0 qt',
          note: 'AWD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Toyota Differential Gear Oil LT 75W-85 GL-5',
            capacity: '0.8 qt',
            note: 'AWD models only. Hybrid AWD uses rear electric motor — no gear oil.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P225/70R16 (2005-2006)', 'P245/65R17 (2005-2013)', 'P245/55R19 (Limited)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: '9006 (2005-2006) / H11 (2008-2013)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157 / LED (2011+ Limited)',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, above the kick panel near the hood release lever.'
      },
      '2014-2019': {
        engine: {
          oilViscosity: '0W-20 (2.7L I4 & 3.5L V6 / 3.5L hybrid)',
          oilCapacity: '5.7 qt (2.7L I4 w/filter) / 6.4 qt (3.5L V6 w/filter)',
          oilFilterPN: 'Toyota 90915-YZZF1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '9.9 qt (2.7L) / 10.4 qt (3.5L) / 12.1 qt (hybrid — includes inverter loop) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (6-speed auto) / eCVT fluid (hybrid)',
          capacity: '3.3 qt drain-and-refill (auto) / consult manual (hybrid)'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.0 qt',
          note: 'AWD models only. Hybrid AWD uses rear electric motor — no transfer case fluid.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Toyota Differential Gear Oil LT 75W-85 GL-5',
            capacity: '0.8 qt',
            note: 'AWD models only.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['245/60R18 (LE, XLE)', '245/55R19 (Limited)', '235/55R20 (Limited Platinum)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED (Limited 2017+)',
          highBeam: '9005 / LED (Limited)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (Limited)',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '168'
        },
        obd2Location: 'Under driver side dashboard, above the kick panel near the hood release lever.'
      },
      '2020-2022': {
        engine: {
          oilViscosity: '0W-16 (3.5L V6 2GR-FKS & 2.5L hybrid A25A-FXS)',
          oilCapacity: '6.4 qt (3.5L w/filter) / 4.8 qt (2.5L hybrid w/filter)',
          oilFilterPN: 'Toyota 90915-YZZF1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '10.0 qt (3.5L) / 10.5 qt (hybrid — includes inverter loop) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (8-speed auto) / eCVT fluid (hybrid)',
          capacity: '3.9 qt drain-and-refill (8AT) / consult manual (hybrid)'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '0.5 qt',
          note: 'AWD gas models only. Hybrid AWD uses rear electric motor — no fluid.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Toyota Differential Gear Oil LT 75W-85 GL-5',
            capacity: '0.5 qt',
            note: 'AWD gas models only. Hybrid AWD uses rear electric motor.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33,
          rearPSI: 33,
          oemSizes: ['235/65R18 (L, LE)', '235/55R20 (XLE, Limited, Platinum)', '235/55R20 (hybrid)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'LED (all trims)',
          highBeam: 'LED',
          frontTurn: 'LED / 7444NA (L)',
          rearTurn: 'LED (all trims)',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED / 168 (L)'
        },
        obd2Location: 'Under driver side dashboard, near the hood release lever and kick panel.'
      },
      '2023-2025': {
        engine: {
          oilViscosity: '0W-16 (2.4L turbo T24A-FTS & 2.5L hybrid A25A-FXS)',
          oilCapacity: '6.1 qt (2.4L w/filter — approx) / 4.8 qt (2.5L hybrid w/filter)',
          oilFilterPN: 'Toyota 90915-YZZN1 (2.4L turbo) / 90915-YZZF1 (2.5L hybrid)',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '10.0 qt (2.4L turbo) / 10.5 qt (hybrid — includes inverter loop) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (8-speed auto) / eCVT fluid (hybrid)',
          capacity: '3.9 qt drain-and-refill (8AT) / consult manual (hybrid)',
          note: '3.5L V6 (2GR-FKS) offered on 2023 trims only — 2.4L turbo replaced it for 2024+.'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '0.5 qt',
          note: 'AWD gas models only. Hybrid AWD uses rear electric motor — no fluid.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Toyota Differential Gear Oil LT 75W-85 GL-5',
            capacity: '0.5 qt',
            note: 'AWD gas models only. Hybrid AWD uses rear electric motor.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33,
          rearPSI: 33,
          oemSizes: ['235/65R18 (LE, XLE)', '235/55R20 (Limited, Platinum)', '235/55R20 (hybrid)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'LED (all trims)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, near the hood release lever and kick panel.'
      }
    },
    '4runner': {
      '2005-2009': {
        engine: {
          oilViscosity: '5W-30',
          oilCapacity: '6.2 qt (4.0L V6 1GR-FE w/filter) / 6.9 qt (4.7L V8 2UZ-FE w/filter — approx)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '10.6 qt (4.0L V6) / 11.5 qt (4.7L V8) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF Type T-IV (5-speed auto A750F) — some later years spec ATF WS; check manual',
          capacity: '3.4 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.1 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '1.6 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '3.2 qt (V6) / 3.4 qt (V8) — approx',
            note: 'Add friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['P265/70R16 (SR5)', 'P245/70R17 (Limited)', 'P265/65R17 (Sport)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: 'H11 (2006-2009) / 9006 (2003-2005)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: '168 (map) / DE3175 (dome)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2010-2024': {
        engine: {
          oilViscosity: '0W-20',
          oilCapacity: '6.2 qt (4.0L V6 1GR-FE w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '11.6 qt (4.0L V6) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (5-speed auto A750F)',
          capacity: '3.4 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.1 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '1.6 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '3.4 qt',
            note: 'TRD Off-Road locking differential: use Toyota Differential Gear Oil LT 75W-85.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33,
          rearPSI: 33,
          oemSizes: ['265/70R17 (SR5, TRD Off-Road)', '265/60R20 (Limited)', '265/70R17 (TRD Pro)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / LED (Limited, TRD Pro 2018+)',
          highBeam: '9005 / LED',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (Limited)',
          interior: 'DE3175 (dome/map)',
          license: '168'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the hood release.'
      },
      '2025-2025': {
        engine: {
          oilViscosity: '0W-16',
          oilCapacity: '6.1 qt (2.4L turbo T24A-FTS w/filter — approx)',
          oilFilterPN: 'Toyota 90915-YZZN1 (2.4L turbo)',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '10.0 qt (2.4L turbo) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (8-speed auto)',
          capacity: 'Consult owner\'s manual'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.1 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '1.6 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '3.4 qt',
            note: 'TRD Off-Road locking differential: use Toyota Differential Gear Oil LT 75W-85.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33,
          rearPSI: 33,
          oemSizes: ['245/70R17 (SR5)', '265/70R17 (TRD Off-Road)', '265/60R20 (Limited)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: 'LED (all trims — 6th gen)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the hood release.'
      }
    },
    tundra: {
      '2005-2006': {
        engine: {
          oilViscosity: '5W-30',
          oilCapacity: '6.2 qt (4.0L V6 1GR-FE w/filter) / 6.9 qt (4.7L V8 2UZ-FE w/filter — approx)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '11.0 qt (4.0L V6) / 12.8 qt (4.7L V8) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF Type T-IV (5-speed auto A750F)',
          capacity: '3.4 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.1 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '1.6 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '3.2 qt (V6) / 3.5 qt (V8) — approx',
            note: 'Add friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['P245/70R16 (SR5)', 'P265/70R16 (Limited)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: '9006 (halogen)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: '168 (map) / DE3175 (dome)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2007-2009': {
        engine: {
          oilViscosity: '5W-30',
          oilCapacity: '6.2 qt (4.0L V6 w/filter) / 6.9 qt (4.7L V8 w/filter — approx) / 6.5 qt (5.7L V8 w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '11.0 qt (4.0L V6) / 12.8 qt (4.7L V8) / 14.5 qt (5.7L V8) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (6-speed auto AB60F — 5.7L) / ATF Type T-IV (5-speed auto — 4.0L/4.7L)',
          capacity: '3.7 qt drain-and-refill (6AT) / 3.4 qt (5AT)'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.1 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '1.6 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '3.2 qt (4.0L/4.7L) / 3.5 qt (5.7L) — approx',
            note: 'Add friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['P245/70R16 (SR5)', 'P265/70R16 (Limited)', 'P275/55R20 (Limited 2008+)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: '9006 (halogen) / HID (Limited)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: '168 (map) / DE3175 (dome)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2010-2013': {
        engine: {
          oilViscosity: '0W-20 (4.0L V6 & 4.6L V8) / 5W-30 (5.7L V8)',
          oilCapacity: '6.2 qt (4.0L w/filter) / 7.4 qt (4.6L w/filter — approx) / 6.5 qt (5.7L w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '11.0 qt (4.0L) / 13.2 qt (4.6L) / 14.5 qt (5.7L) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (6-speed auto AB60F)',
          capacity: '3.7 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.1 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '1.9 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '3.5 qt',
            note: 'Add friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P245/70R17 (SR)', 'P275/65R18 (SR5)', 'P275/55R20 (Limited)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: '9006 (halogen) / HID (Limited)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2014-2021': {
        engine: {
          oilViscosity: '0W-20 (4.6L V8 1UR-FE) / 5W-30 (5.7L V8 3UR-FE)',
          oilCapacity: '7.4 qt (4.6L w/filter — approx) / 6.5 qt (5.7L w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '13.2 qt (4.6L) / 14.5 qt (5.7L) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (6-speed auto AB60F)',
          capacity: '3.7 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.3 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '1.9 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '3.5 qt',
            note: 'Add friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P245/75R17 (SR)', 'P275/65R18 (SR5, Limited)', 'P275/55R20 (1794, Platinum)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED (Limited, Platinum 2018+)',
          highBeam: '9005 / LED',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (2018+)',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '168'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2022-2025': {
        engine: {
          oilViscosity: '0W-20 (3.5L twin-turbo V35A-FTS & 3.4L twin-turbo hybrid i-Force Max)',
          oilCapacity: '6.4 qt (w/filter — approx)',
          oilFilterPN: 'Toyota 90915-YZZN1 (turbo V6)',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '13.2 qt (3.5TT) / 14.0 qt (hybrid — includes hybrid cooling loop) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (10-speed auto AWR10L65)',
          capacity: 'Consult owner\'s manual'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.3 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '1.9 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 GL-5',
            capacity: '3.5 qt',
            note: 'Add friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P265/70R17 (SR)', 'P265/65R18 (SR5)', 'P275/65R18 (Limited)', 'P265/60R20 (1794, Platinum)', 'P285/65R18 (TRD Pro)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: 'LED (all trims — 3rd gen)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      }
    },
    prius: {
      '2005-2009': {
        engine: {
          oilViscosity: '0W-20',
          oilCapacity: '3.9 qt (1.5L 1NZ-FXE w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '4.6 qt (engine) + 1.7 qt (inverter loop) — approx'
        },
        transmission: {
          fluidType: 'Toyota Genuine ATF WS (P112 eCVT transaxle)',
          capacity: 'Consult owner\'s manual'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P185/65R15 (standard)', 'P195/55R16 (Touring)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: '9003 (H4)',
          highBeam: '9003 (H4)',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: '168 (map) / 211-2 (dome)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2010-2015': {
        engine: {
          oilViscosity: '0W-20',
          oilCapacity: '4.4 qt (1.8L 2ZR-FXE w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '5.6 qt (engine) + 2.2 qt (inverter loop) — approx'
        },
        transmission: {
          fluidType: 'Toyota Genuine ATF WS (P410 eCVT)',
          capacity: 'Consult owner\'s manual'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P195/65R15 (Two, Three)', 'P215/45R17 (Four, Five)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector)',
          highBeam: '9005',
          frontTurn: '1157A (amber) / 7444NA (2013+)',
          rearTurn: '7440A (amber)',
          tailBrake: 'LED (all trims)',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '168 / LED (2013+)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2016-2022': {
        engine: {
          oilViscosity: '0W-20',
          oilCapacity: '4.4 qt (1.8L 2ZR-FXE w/filter)',
          oilFilterPN: 'Toyota 90915-YZZF1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '6.6 qt (engine) + 2.4 qt (inverter loop) — approx'
        },
        transmission: {
          fluidType: 'Toyota Genuine ATF WS (P610 eCVT)',
          capacity: 'Consult owner\'s manual'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P195/65R15 (Two, Three)', 'P205/60R16 (Four)', 'P215/45R17 (Four Touring, Advanced)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'LED (all trims — 4th gen)',
          highBeam: 'LED / 9005 (some base trims)',
          frontTurn: '7444NA (amber) / LED (Touring)',
          rearTurn: 'LED (all trims)',
          tailBrake: 'LED',
          interior: 'LED (dome/map) / DE3175 (base)',
          license: '168 / LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2023-2025': {
        engine: {
          oilViscosity: '0W-16 (2.0L M20A-FXS hybrid)',
          oilCapacity: '4.6 qt (2.0L w/filter)',
          oilFilterPN: 'Toyota 90915-YZZF1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: 'Engine + inverter loops — consult owner\'s manual'
        },
        transmission: {
          fluidType: 'Toyota Genuine ATF WS (eCVT)',
          capacity: 'Consult owner\'s manual'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33,
          rearPSI: 33,
          oemSizes: ['P195/60R17 (LE)', 'P195/50R19 (XLE, Limited)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'LED (all trims — 5th gen)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      }
    },
    sienna: {
      '2005-2010': {
        engine: {
          oilViscosity: '5W-30',
          oilCapacity: '5.8 qt (3.3L V6 3MZ-FE — 2005-2006) / 6.4 qt (3.5L V6 2GR-FE — 2007-2010)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '9.5 qt (3.3L) / 10.3 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF Type T-IV (5-speed auto U151E)',
          capacity: '3.4 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '1.0 qt',
          note: 'AWD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Toyota Differential Gear Oil LT 75W-85 GL-5',
            capacity: '0.8 qt',
            note: 'AWD models only.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P215/65R16 (CE, LE)', 'P225/60R17 (XLE, Limited)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: '9006 (2005-2006) / H11 (2007-2010)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2011-2020': {
        engine: {
          oilViscosity: '0W-20 (3.5L V6 2GR-FE — 2011-2016 / 2GR-FKS — 2017-2020)',
          oilCapacity: '6.4 qt (3.5L w/filter)',
          oilFilterPN: 'Toyota 90915-YZZF1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '10.3 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (6-speed auto — 2011-2016 / 8-speed auto — 2017-2020)',
          capacity: '3.3 qt drain-and-refill (6AT) / 3.9 qt (8AT)'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '0.7 qt',
          note: 'AWD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Toyota Differential Gear Oil LT 75W-85 GL-5',
            capacity: '0.5 qt',
            note: 'AWD models only.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33,
          rearPSI: 33,
          oemSizes: ['P235/60R17 (L, LE)', 'P235/55R18 (SE, XLE)', 'P235/50R19 (Limited)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED (Limited 2015+)',
          highBeam: '9005 / LED (Limited)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (Limited)',
          interior: 'DE3175 (dome/map)',
          license: '168'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2021-2025': {
        engine: {
          oilViscosity: '0W-16 (2.5L A25A-FXS hybrid)',
          oilCapacity: '4.8 qt (2.5L hybrid w/filter)',
          oilFilterPN: 'Toyota 90915-YZZF1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '11.0 qt (hybrid — includes inverter loop) — approx'
        },
        transmission: {
          fluidType: 'Toyota Genuine ATF WS (eCVT)',
          capacity: 'Consult owner\'s manual'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'None (AWD uses rear electric drive unit)',
            capacity: 'N/A',
            note: 'Hybrid AWD — no differential gear oil required.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33,
          rearPSI: 33,
          oemSizes: ['235/60R17 (LE, XLE)', '235/50R20 (Limited, Platinum)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'LED (all trims — 4th gen)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      }
    }
  },

  ford: {
    'f-150': {
      '2005-2008': {
        engine: {
          oilViscosity: '5W-20 (4.2L V6, 4.6L V8, 5.4L V8)',
          oilCapacity: '5.5 qt (4.2L w/filter) / 6.0 qt (4.6L w/filter) / 6.0 qt (5.4L w/filter)',
          oilFilterPN: 'Motorcraft FL-820S',
          coolantType: 'Motorcraft Premium Gold (yellow)',
          coolantCapacity: '19.5 qt (4.2L) / 19.0 qt (4.6L) / 19.5 qt (5.4L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON V (4-speed auto 4R70E/4R75E)',
          capacity: '4.6 qt drain-and-refill (approx)'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON V',
          capacity: '2.0 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 80W-90',
            capacity: '2.5 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-140 (limited-slip) / SAE 80W-90 (standard)',
            capacity: '3.0 qt (8.8" axle) / 3.5 qt (9.75" axle)',
            note: 'Add Motorcraft XL-3 friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['P235/70R17 (XL)', 'P255/70R17 (XLT)', 'P275/65R18 (FX4, Lariat)', 'P275/55R20 (King Ranch)'],
          lugNutTorque: 150
        },
        bulbs: {
          lowBeam: '9007 (halogen)',
          highBeam: '9007 (halogen)',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the parking brake release.'
      },
      '2009-2010': {
        engine: {
          oilViscosity: '5W-20 (4.6L V8 & 5.4L V8)',
          oilCapacity: '6.0 qt (4.6L w/filter) / 6.0 qt (5.4L w/filter)',
          oilFilterPN: 'Motorcraft FL-820S',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '19.0 qt (4.6L) / 19.5 qt (5.4L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6-speed 6R80) — MERCON SP originally spec\'d; LV is the approved replacement',
          capacity: '5.0 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON LV',
          capacity: '2.0 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 80W-90',
            capacity: '2.5 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-140 (limited-slip) / SAE 80W-90 (standard)',
            capacity: '3.0 qt (8.8" axle) / 3.5 qt (9.75" axle)',
            note: 'Add Motorcraft XL-3 friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['P235/70R17 (XL)', 'P255/70R17 (XLT)', 'P275/65R18 (FX4)', 'P275/55R20 (Lariat, King Ranch)'],
          lugNutTorque: 150
        },
        bulbs: {
          lowBeam: 'H13/9008 (dual-beam halogen)',
          highBeam: 'H13/9008 (dual-beam halogen)',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the parking brake release.'
      },
      '2011-2014': {
        engine: {
          oilViscosity: '5W-20 (3.7L V6 & 5.0L V8) / 5W-30 (3.5L EcoBoost)',
          oilCapacity: '6.0 qt (3.7L w/filter) / 6.0 qt (5.0L w/filter) / 6.0 qt (3.5L EcoBoost w/filter)',
          oilFilterPN: 'Motorcraft FL-500S',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '13.2 qt (3.7L) / 14.5 qt (5.0L) / 14.0 qt (3.5L EcoBoost) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6-speed 6R80)',
          capacity: '5.0 qt drain-and-refill'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON LV',
          capacity: '2.0 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 80W-90',
            capacity: '1.8 qt',
            note: '4WD models only'
          },
          rear: {
            fluidType: 'SAE 75W-85 (9.75" standard) / SAE 75W-140 (electronic locking differential)',
            capacity: '3.5 qt (9.75" axle)',
            note: 'Add Motorcraft XL-3 friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['P235/70R17 (XL)', 'P265/70R17 (XLT)', 'P275/65R18 (FX4, Lariat)', 'P275/55R20 (King Ranch, Platinum)'],
          lugNutTorque: 150
        },
        bulbs: {
          lowBeam: 'H13/9008 (halogen) / HID (King Ranch, Platinum 2013+)',
          highBeam: 'H13/9008 / HID',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157 / LED (2013+ higher trims)',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the parking brake release.'
      },
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
      '2021-2025': {
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
    },
    explorer: {
      '2005-2010': {
        engine: {
          oilViscosity: '5W-30 (4.0L V6) / 5W-20 (4.6L V8)',
          oilCapacity: '5.0 qt (4.0L V6 w/filter) / 6.0 qt (4.6L V8 w/filter)',
          oilFilterPN: 'Motorcraft FL-820S',
          coolantType: 'Motorcraft Premium Gold (yellow — 2005-2008) / Orange (2009-2010)',
          coolantCapacity: '13.5 qt (4.0L) / 16.0 qt (4.6L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON V (5-speed 5R55S) / MERCON SP (6-speed 6R60 — V8 2006+)',
          capacity: '4.2 qt drain-and-refill (5R55S) / 4.5 qt (6R60)'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON V (ControlTrac)',
          capacity: '1.5 qt',
          note: '4WD models only. 2WD: no transfer case.'
        },
        differentials: {
          front: {
            fluidType: 'SAE 80W-90',
            capacity: '1.8 qt',
            note: '4WD models only — independent front axle'
          },
          rear: {
            fluidType: 'SAE 75W-140 (limited-slip) / SAE 80W-90 (standard)',
            capacity: '2.8 qt (8.8" axle)',
            note: 'Add friction modifier XL-3 for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['P235/70R16 (XLS)', 'P245/65R17 (XLT)', 'P255/55R18 (Eddie Bauer, Limited)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (2006-2010) / 9007 (2005)',
          highBeam: '9005 (2006-2010) / 9007 (2005)',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2011-2015': {
        engine: {
          oilViscosity: '5W-30 (3.5L V6 & 3.5L EcoBoost Sport) / 5W-30 (2.0L EcoBoost)',
          oilCapacity: '6.0 qt (3.5L w/filter) / 5.5 qt (2.0L EcoBoost w/filter)',
          oilFilterPN: 'Motorcraft FL-500S (3.5L) / FL-910S (2.0L)',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '12.7 qt (3.5L) / 9.5 qt (2.0L) / 12.0 qt (3.5L EcoBoost) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6-speed 6F50 — 3.5L / 6F35 — 2.0L)',
          capacity: '4.4 qt drain-and-refill (6F50) / 4.2 qt (6F35)'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON LV (AWD PTU)',
          capacity: '1.0 qt',
          note: 'AWD models only — Power Transfer Unit. 2WD: no PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Motorcraft SAE 75W-140 (RDU)',
            capacity: '1.1 qt',
            note: 'AWD models only — Rear Drive Unit.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['P245/60R18 (base, XLT)', 'P255/50R20 (Limited)', 'P255/45R20 (Sport)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / HID (Limited 2013+)',
          highBeam: '9005 / HID',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157 / LED (Limited)',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2016-2019': {
        engine: {
          oilViscosity: '5W-30 (3.5L V6, 2.3L EcoBoost, 3.5L EcoBoost Sport)',
          oilCapacity: '6.0 qt (3.5L w/filter) / 5.5 qt (2.3L EcoBoost w/filter)',
          oilFilterPN: 'Motorcraft FL-500S (3.5L) / FL-910S (2.3L)',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '12.7 qt (3.5L) / 11.0 qt (2.3L) / 12.0 qt (3.5L EcoBoost) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6-speed 6F50/6F55)',
          capacity: '4.4 qt drain-and-refill (approx)'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON LV (AWD PTU)',
          capacity: '1.0 qt',
          note: 'AWD models only — Power Transfer Unit. 2WD: no PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Motorcraft SAE 75W-140 (RDU)',
            capacity: '1.1 qt',
            note: 'AWD models only — Rear Drive Unit.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['P245/60R18 (base, XLT)', 'P255/50R20 (Limited, Sport)', 'P255/45R20 (Platinum)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED (2018+ Limited, Platinum)',
          highBeam: '9005 / LED',
          frontTurn: '3157A (amber) / LED',
          rearTurn: '3157A (amber) / LED',
          tailBrake: '3157 / LED',
          interior: '578 (dome) / 194 (map) / LED (Platinum)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2020-2025': {
        engine: {
          oilViscosity: '5W-30 (2.3L EcoBoost & 3.0L EcoBoost) / 5W-30 (3.3L hybrid — 2020-2024)',
          oilCapacity: '5.5 qt (2.3L w/filter) / 6.0 qt (3.0L w/filter) / 5.7 qt (3.3L hybrid w/filter)',
          oilFilterPN: 'Motorcraft FL-910S (2.3L) / FL-500S (3.0L)',
          coolantType: 'Motorcraft Yellow',
          coolantCapacity: '11.0 qt (2.3L) / 12.8 qt (3.0L) / 13.5 qt (hybrid — includes battery loop) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON ULV (10-speed 10R60 — all engines)',
          capacity: '5.5 qt drain-and-refill (approx)'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON LV (AWD PTU)',
          capacity: '1.0 qt',
          note: 'AWD models only — Power Transfer Unit. Hybrid AWD uses rear electric motor.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'SAE 75W-85 (RDU — confirm in owner\'s manual)',
            capacity: '1.1 qt',
            note: 'AWD models only — Rear Drive Unit. Hybrid AWD uses rear electric motor.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['P255/65R18 (base, XLT)', 'P255/60R19 (Limited)', 'P255/55R20 (ST, Platinum, King Ranch)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'LED (all trims — 6th gen)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      }
    },
    mustang: {
      '2005-2010': {
        engine: {
          oilViscosity: '5W-20 (4.0L V6 & 4.6L V8)',
          oilCapacity: '5.0 qt (4.0L V6 w/filter) / 6.0 qt (4.6L V8 w/filter)',
          oilFilterPN: 'Motorcraft FL-820S',
          coolantType: 'Motorcraft Premium Gold (yellow)',
          coolantCapacity: '12.5 qt (4.0L) / 15.0 qt (4.6L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON V (5-speed auto 5R55S) / Motorcraft XT-M5-QS Full Synthetic Manual Transmission Fluid (5-speed manual TR-3650)',
          capacity: '4.2 qt drain-and-refill (auto) / 2.8 qt (manual)'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'SAE 75W-140 (limited-slip) / SAE 80W-90 (standard)',
            capacity: '2.0 qt (8.8" axle)',
            note: 'Add Motorcraft XL-3 friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['P235/55R17 (V6)', 'P235/50R18 (GT)', 'P255/45R18 (GT 2007+)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: '9007 (2005-2009) / H13 (2010)',
          highBeam: '9007 (2005-2009) / H13 (2010)',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2011-2014': {
        engine: {
          oilViscosity: '5W-20 (3.7L V6 & 5.0L Coyote)',
          oilCapacity: '6.0 qt (3.7L w/filter) / 8.0 qt (5.0L w/filter)',
          oilFilterPN: 'Motorcraft FL-910S (3.7L) / FL-500S (5.0L)',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '13.5 qt (3.7L) / 14.5 qt (5.0L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft XT-M5-QS Full Synthetic Manual Transmission Fluid (6-speed MT-82) / Motorcraft MERCON LV (6-speed auto 6R80)',
          capacity: '2.8 qt (manual) / 5.0 qt drain-and-refill (auto)'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'SAE 75W-140 (limited-slip — GT) / SAE 80W-90 (V6)',
            capacity: '2.0 qt (8.8" axle)',
            note: 'GT and Boss 302 use 75W-140 with XL-3 friction modifier.'
          }
        },
        brakeFluid: 'DOT 3 (standard) / DOT 4 (Brembo package)',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['P235/50ZR18 (V6)', 'P235/50ZR18 (GT 2011-2012)', 'P255/40ZR19 (GT 2013+)', 'P275/40ZR19 (GT Brembo)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / HID (GT with HID option)',
          highBeam: '9005 / HID',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157 / LED (2013+ GT)',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2015-2017': {
        engine: {
          oilViscosity: '5W-20 (3.7L V6 & 5.0L Coyote) / 5W-30 (2.3L EcoBoost)',
          oilCapacity: '6.0 qt (3.7L w/filter) / 8.0 qt (5.0L w/filter) / 5.5 qt (2.3L EcoBoost w/filter)',
          oilFilterPN: 'Motorcraft FL-500S (5.0L) / FL-910S (2.3L, 3.7L)',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '14.0 qt (3.7L) / 15.0 qt (5.0L) / 12.0 qt (2.3L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft XT-M5-QS Full Synthetic Manual Transmission Fluid (6-speed MT-82) / Motorcraft MERCON LV (6-speed auto 6R80)',
          capacity: '2.8 qt (manual) / 5.0 qt drain-and-refill (auto)'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'SAE 75W-140 (GT limited-slip) / SAE 80W-90 (V6, EcoBoost)',
            capacity: '2.0 qt (8.8" axle)',
            note: 'Add Motorcraft XL-3 friction modifier for limited-slip differentials.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P235/55R17 (V6)', 'P235/50R18 (EcoBoost)', 'P255/40R19 (GT)', 'P275/40R19 (GT Performance Pack)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / HID (GT Premium)',
          highBeam: '9005 / HID',
          frontTurn: '3157A (amber) / LED (2018+)',
          rearTurn: '3157A (amber) / LED',
          tailBrake: 'LED (all trims — sequential tail lights)',
          interior: '578 (dome) / 194 (map) / LED (higher trims)',
          license: '194 / LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2018-2023': {
        engine: {
          oilViscosity: '5W-30 (2.3L EcoBoost & 5.0L Coyote gen 3)',
          oilCapacity: '5.5 qt (2.3L w/filter) / 8.8 qt (5.0L w/filter)',
          oilFilterPN: 'Motorcraft FL-910S (2.3L) / FL-500S (5.0L)',
          coolantType: 'Motorcraft Yellow',
          coolantCapacity: '12.0 qt (2.3L) / 15.2 qt (5.0L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft XT-M5-QS Full Synthetic Manual Transmission Fluid (6-speed MT-82) / Motorcraft MERCON ULV (10-speed auto 10R80)',
          capacity: '2.8 qt (manual) / 5.5 qt drain-and-refill (10R80)'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'SAE 75W-140 (GT limited-slip)',
            capacity: '2.0 qt (8.8" axle)',
            note: 'Shelby GT350/GT500 use unique fluids — consult owner\'s manual.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P235/55R17 (base)', 'P235/50R18 (EcoBoost)', 'P255/40R19 (GT)', 'P305/30R19 (GT350)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'LED (all trims — 2018 refresh)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED (sequential tail lights)',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2024-2025': {
        engine: {
          oilViscosity: '5W-30 (2.3L EcoBoost & 5.0L Coyote gen 4)',
          oilCapacity: '5.5 qt (2.3L w/filter) / 8.8 qt (5.0L w/filter)',
          oilFilterPN: 'Motorcraft FL-910S (2.3L) / FL-500S (5.0L)',
          coolantType: 'Motorcraft Yellow',
          coolantCapacity: 'Consult owner\'s manual'
        },
        transmission: {
          fluidType: 'Motorcraft XT-M5-QS Full Synthetic Manual Transmission Fluid (6-speed manual TR-3160 — GT) / Motorcraft MERCON ULV (10-speed auto 10R80)',
          capacity: 'Consult owner\'s manual'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'SAE 75W-140 (GT limited-slip)',
            capacity: 'Consult owner\'s manual'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P235/55R17 (base EcoBoost)', 'P235/50R18 (EcoBoost)', 'P255/40R19 (GT)', 'P275/40R19 (GT Performance Pack)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'LED (all trims — 7th gen)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      }
    },
    edge: {
      '2007-2010': {
        engine: {
          oilViscosity: '5W-20 (3.5L V6)',
          oilCapacity: '5.5 qt (3.5L w/filter)',
          oilFilterPN: 'Motorcraft FL-500S',
          coolantType: 'Motorcraft Premium Gold (yellow — 2007-2009) / Orange (2010)',
          coolantCapacity: '11.0 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6-speed 6F50)',
          capacity: '4.4 qt drain-and-refill (approx)'
        },
        transferCase: {
          fluidType: 'Motorcraft SAE 75W-140 (PTU)',
          capacity: '0.5 qt',
          note: 'AWD models only — Power Transfer Unit. 2WD: no PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Motorcraft SAE 75W-140 (RDU)',
            capacity: '1.0 qt',
            note: 'AWD models only — Rear Drive Unit.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['P245/70R17 (SE)', 'P245/60R18 (SEL)', 'P255/50R19 (Limited)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / HID (Limited)',
          highBeam: '9005',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157 / LED (Limited)',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2011-2014': {
        engine: {
          oilViscosity: '5W-20 (3.5L V6) / 5W-30 (3.7L V6 Sport) / 5W-30 (2.0L EcoBoost)',
          oilCapacity: '5.5 qt (3.5L w/filter) / 5.5 qt (3.7L w/filter) / 5.0 qt (2.0L EcoBoost w/filter)',
          oilFilterPN: 'Motorcraft FL-500S (3.5L/3.7L) / FL-910S (2.0L)',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '11.0 qt (3.5L/3.7L) / 9.5 qt (2.0L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6F50 — 3.5L/3.7L / 6F35 — 2.0L)',
          capacity: '4.4 qt drain-and-refill (6F50) / 4.2 qt (6F35)'
        },
        transferCase: {
          fluidType: 'Motorcraft SAE 75W-140 (PTU)',
          capacity: '0.5 qt',
          note: 'AWD models only — Power Transfer Unit. 2WD: no PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Motorcraft SAE 75W-140 (RDU)',
            capacity: '1.0 qt',
            note: 'AWD models only — Rear Drive Unit.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['P245/70R17 (SE)', 'P245/60R18 (SEL, Limited)', 'P255/50R19 (Sport)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / HID (Limited, Sport)',
          highBeam: '9005',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157 / LED (Limited, Sport)',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2015-2018': {
        engine: {
          oilViscosity: '5W-30 (2.0L EcoBoost & 2.7L EcoBoost) / 5W-20 (3.5L V6 — 2015-2016)',
          oilCapacity: '5.0 qt (2.0L w/filter) / 6.0 qt (2.7L w/filter) / 5.5 qt (3.5L w/filter)',
          oilFilterPN: 'Motorcraft FL-910S (2.0L) / FL-500S (2.7L, 3.5L)',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '9.5 qt (2.0L) / 11.0 qt (2.7L) / 11.0 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6F35 — 2.0L / 6F55 — 2.7L)',
          capacity: '4.2 qt drain-and-refill (approx)'
        },
        transferCase: {
          fluidType: 'Motorcraft SAE 75W-140 (PTU)',
          capacity: '0.5 qt',
          note: 'AWD models only — Power Transfer Unit. 2WD: no PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Motorcraft SAE 75W-140 (RDU)',
            capacity: '1.0 qt',
            note: 'AWD models only — Rear Drive Unit.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['P245/60R18 (SE, SEL)', 'P245/55R19 (Titanium)', 'P265/40R21 (Sport)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen SE, SEL) / LED (Titanium, Sport)',
          highBeam: '9005 / LED',
          frontTurn: '3157A (amber) / LED',
          rearTurn: '3157A (amber) / LED',
          tailBrake: '3157 / LED',
          interior: '578 (dome) / 194 (map)',
          license: '194 / LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2019-2024': {
        engine: {
          oilViscosity: '5W-30 (2.0L EcoBoost & 2.7L EcoBoost ST — through 2023)',
          oilCapacity: '5.0 qt (2.0L w/filter) / 6.0 qt (2.7L w/filter)',
          oilFilterPN: 'Motorcraft FL-910S (2.0L) / FL-500S (2.7L)',
          coolantType: 'Motorcraft Yellow',
          coolantCapacity: '9.5 qt (2.0L) / 11.0 qt (2.7L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON ULV (8-speed 8F35)',
          capacity: '4.5 qt drain-and-refill (approx)'
        },
        transferCase: {
          fluidType: 'Motorcraft MERCON LV (AWD PTU)',
          capacity: '0.5 qt',
          note: 'AWD models only — Power Transfer Unit. 2WD: no PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Motorcraft SAE 75W-85 (RDU — confirm in owner\'s manual)',
            capacity: '1.0 qt',
            note: 'AWD models only — Rear Drive Unit.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['P245/60R18 (SE, SEL)', 'P245/55R19 (Titanium)', 'P265/40R21 (ST)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'LED (all trims — 2019 refresh)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      }
    },
    fusion: {
      '2006-2009': {
        engine: {
          oilViscosity: '5W-20 (2.3L I4 & 3.0L V6)',
          oilCapacity: '4.5 qt (2.3L w/filter) / 5.5 qt (3.0L w/filter)',
          oilFilterPN: 'Motorcraft FL-910S (2.3L) / FL-820S (3.0L)',
          coolantType: 'Motorcraft Premium Gold (yellow)',
          coolantCapacity: '7.5 qt (2.3L) / 10.5 qt (3.0L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON V (Aisin 5-speed auto / 6-speed auto — V6)',
          capacity: '4.0 qt drain-and-refill (approx)'
        },
        transferCase: {
          fluidType: 'Motorcraft SAE 75W-140 (PTU)',
          capacity: '0.5 qt',
          note: 'AWD models only (2007+ V6 AWD) — Power Transfer Unit. 2WD: no PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Motorcraft SAE 75W-140 (RDU)',
            capacity: '1.0 qt',
            note: 'AWD models only — Rear Drive Unit.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P205/60R16 (S, SE)', 'P225/50R17 (SEL, AWD)', 'P225/45R18 (SEL V6)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: '9006 (halogen) / HID (SEL)',
          highBeam: '9005',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2010-2012': {
        engine: {
          oilViscosity: '5W-20 (2.5L I4, 3.0L V6, 3.5L V6 Sport)',
          oilCapacity: '4.5 qt (2.5L w/filter) / 5.5 qt (3.0L & 3.5L w/filter)',
          oilFilterPN: 'Motorcraft FL-910S (2.5L) / FL-820S (3.0L, 3.5L)',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '8.5 qt (2.5L) / 10.5 qt (3.0L/3.5L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6-speed 6F35 — all engines) / Motorcraft MERCON LV (eCVT — hybrid)',
          capacity: '4.2 qt drain-and-refill (6F35) / consult manual (hybrid eCVT)'
        },
        transferCase: {
          fluidType: 'Motorcraft SAE 75W-140 (PTU)',
          capacity: '0.5 qt',
          note: 'AWD models only (V6) — Power Transfer Unit. 2WD: no PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Motorcraft SAE 75W-140 (RDU)',
            capacity: '1.0 qt',
            note: 'AWD models only — Rear Drive Unit.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P205/60R16 (S, SE)', 'P225/50R17 (SEL)', 'P225/45R18 (Sport)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / HID (SEL, Sport)',
          highBeam: '9005',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157',
          interior: '578 (dome) / 194 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2013-2016': {
        engine: {
          oilViscosity: '5W-20 (2.5L) / 5W-30 (1.5L & 2.0L EcoBoost) / 5W-20 (1.6L EcoBoost — 2013)',
          oilCapacity: '4.5 qt (2.5L w/filter) / 4.0 qt (1.5L w/filter) / 5.0 qt (2.0L w/filter) / 4.5 qt (1.6L w/filter)',
          oilFilterPN: 'Motorcraft FL-910S (2.5L, 1.5L, 1.6L) / FL-500S (2.0L)',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '8.5 qt (2.5L) / 7.5 qt (1.5L) / 9.5 qt (2.0L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6-speed 6F35) / Motorcraft MERCON LV (eCVT — hybrid/Energi)',
          capacity: '4.2 qt drain-and-refill (6F35) / consult manual (eCVT)'
        },
        transferCase: {
          fluidType: 'Motorcraft SAE 75W-140 (PTU)',
          capacity: '0.5 qt',
          note: 'AWD models only (2.0L EcoBoost) — Power Transfer Unit. 2WD: no PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Motorcraft SAE 75W-140 (RDU)',
            capacity: '1.0 qt',
            note: 'AWD models only — Rear Drive Unit.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P215/60R16 (S)', 'P235/50R17 (SE)', 'P235/45R18 (Titanium)', 'P235/40R19 (Titanium)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / LED (Titanium 2013+)',
          highBeam: '9005 / LED',
          frontTurn: '3157A (amber) / LED (Titanium)',
          rearTurn: '3157A (amber) / LED',
          tailBrake: '3157 / LED (Titanium)',
          interior: '578 (dome) / 194 (map)',
          license: '194 / LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
      },
      '2017-2020': {
        engine: {
          oilViscosity: '5W-20 (2.5L) / 5W-30 (1.5L & 2.0L EcoBoost)',
          oilCapacity: '4.5 qt (2.5L w/filter) / 4.0 qt (1.5L w/filter) / 5.0 qt (2.0L w/filter)',
          oilFilterPN: 'Motorcraft FL-910S (2.5L, 1.5L) / FL-500S (2.0L)',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '8.5 qt (2.5L) / 7.5 qt (1.5L) / 9.5 qt (2.0L) — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6-speed 6F35) / Motorcraft MERCON LV (eCVT — hybrid/Energi)',
          capacity: '4.2 qt drain-and-refill (6F35) / consult manual (eCVT)'
        },
        transferCase: {
          fluidType: 'Motorcraft SAE 75W-140 (PTU)',
          capacity: '0.5 qt',
          note: 'AWD models only (2.0L EcoBoost) — Power Transfer Unit. 2WD: no PTU.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Motorcraft SAE 75W-140 (RDU)',
            capacity: '1.0 qt',
            note: 'AWD models only — Rear Drive Unit.'
          }
        },
        brakeFluid: 'DOT 4 LV',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P215/60R16 (S)', 'P235/50R17 (SE)', 'P235/45R18 (Titanium)', 'P235/40R19 (Titanium)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'LED (standard on all trims — 2017 refresh) / 9005 (halogen S)',
          highBeam: 'LED / 9005 (S)',
          frontTurn: 'LED / 3157A (S)',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map) / 578 (base)',
          license: '194 / LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column near the kick panel.'
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
      '2005-2006': {
        engine: {
          oilViscosity: '5W-20',
          oilCapacity: '4.5 qt (2.4L K24A1 w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '5.8 qt (2.4L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF-Z1 (4-speed auto) / Honda MTF (5-speed manual)',
          capacity: '2.6 qt drain-and-refill (auto) / 2.1 qt (manual)'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'Honda Dual Pump System Fluid (DPSF)',
            capacity: '1.3 qt',
            note: 'Real Time 4WD models only. 2WD: no rear unit.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['P205/70R15 (LX)', 'P215/65R16 (EX)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: '9006 (halogen)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: '168 (map) / 211-2 (dome)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2007-2011': {
        engine: {
          oilViscosity: '5W-20',
          oilCapacity: '4.5 qt (2.4L K24Z1 w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '5.9 qt (2.4L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF-Z1 / DW-1 (5-speed auto) / Honda MTF (5-speed manual)',
          capacity: '2.9 qt drain-and-refill (auto) / 2.1 qt (manual)'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'Honda Dual Pump System Fluid (DPSF)',
            capacity: '1.3 qt',
            note: 'Real Time 4WD models only. 2WD: no rear unit.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P225/65R17 (LX, EX)', 'P225/60R18 (EX-L)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: '168 (map) / 211-2 (dome)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2012-2016': {
        engine: {
          oilViscosity: '0W-20 (2.4L K24Z7 — 2012-2014 / 2.4L Earth Dreams K24W1 — 2015-2016)',
          oilCapacity: '4.5 qt (2.4L w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '6.0 qt (2.4L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF DW-1 (5-speed auto — 2012-2014) / Honda HCF-2 (CVT — 2015-2016)',
          capacity: '2.9 qt drain-and-refill (5AT) / 3.9 qt (CVT)'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'Honda DPSF-II (Dual Pump System Fluid)',
            capacity: '1.3 qt',
            note: 'AWD models only. Real Time AWD rear unit. 2WD: no rear unit.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P225/65R17 (LX, EX)', 'P225/60R18 (EX-L, Touring)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / LED (Touring 2015-2016)',
          highBeam: '9005 / LED',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (Touring)',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '168'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, above kick panel near fuse box.'
      },
      '2017-2022': {
        engine: {
          oilViscosity: '0W-20 (1.5L Turbo L15BE / 2.0L hybrid — 2020+)',
          oilCapacity: '3.7 qt (1.5L Turbo w/filter) / 4.0 qt (2.0L hybrid w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02 (1.5L) / 15400-RTA-003 (2.0L hybrid)',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '6.2 qt (1.5L Turbo) / 7.8 qt (hybrid — includes inverter loop)'
        },
        transmission: {
          fluidType: 'Honda HCF-2 (CVT) / eCVT fluid (2.0L hybrid — 2020+)',
          capacity: '3.9 qt drain-and-refill (CVT) / consult manual (hybrid eCVT)'
        },
        transferCase: {
          fluidType: 'Honda DPSF-II (Dual Pump System Fluid)',
          capacity: '1.3 qt',
          note: 'AWD gas models only. Hybrid AWD uses rear electric motor — no transfer case fluid. 2WD: null.'
        },
        differentials: {
          front: null,
          rear: {
            fluidType: 'Honda DPSF-II (Dual Pump System Fluid)',
            capacity: '1.3 qt',
            note: 'AWD gas models only. Hybrid AWD uses rear electric motor — no gear oil.'
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
      '2023-2025': {
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
          note: 'AWD gas models only. Hybrid AWD uses rear electric motor — no transfer case fluid. 2WD: null.'
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
    },
    accord: {
      '2005-2007': {
        engine: {
          oilViscosity: '5W-20',
          oilCapacity: '4.5 qt (2.4L K24 w/filter) / 4.5 qt (3.0L J30 V6 w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '6.1 qt (2.4L) / 6.9 qt (3.0L V6) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF-Z1 (5-speed auto — DW-1 supersedes) / Honda MTF (5-speed manual)',
          capacity: '2.9 qt drain-and-refill (auto) / 2.1 qt (manual)'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30,
          rearPSI: 30,
          oemSizes: ['P205/65R15 (DX, LX)', 'P205/60R16 (EX)', 'P215/50R17 (EX V6)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: '9006 (halogen)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2008-2012': {
        engine: {
          oilViscosity: '5W-20',
          oilCapacity: '4.5 qt (2.4L K24Z2/K24Z3 w/filter) / 4.6 qt (3.5L J35Z2 V6 w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02 (2.4L) / 15400-RTA-003 (3.5L V6)',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '6.1 qt (2.4L) / 6.9 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF-Z1 / DW-1 (5-speed auto) / Honda MTF (5/6-speed manual)',
          capacity: '2.9 qt drain-and-refill (auto) / 2.1 qt (manual)'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P215/60R16 (LX)', 'P225/50R17 (EX, EX-L)', 'P225/45R18 (EX-L V6)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / HID (EX-L V6 2011-2012)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2013-2017': {
        engine: {
          oilViscosity: '0W-20',
          oilCapacity: '4.4 qt (2.4L K24W1 w/filter) / 4.5 qt (3.5L J35Y1 V6 w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02 (2.4L) / 15400-RTA-003 (3.5L V6)',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '6.5 qt (2.4L) / 7.0 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Honda HCF-2 (CVT — 2.4L) / Honda ATF DW-1 (6-speed auto — V6) / Honda MTF (6-speed manual — Sport)',
          capacity: '3.7 qt drain-and-refill (CVT) / 2.9 qt (6AT) / 2.1 qt (6MT)'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P215/60R16 (LX)', 'P225/55R17 (Sport, EX)', 'P235/45R18 (EX-L V6, Touring)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / LED (Touring V6 2016+)',
          highBeam: '9005 / LED',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (Touring)',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '168'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2018-2022': {
        engine: {
          oilViscosity: '0W-20 (1.5L Turbo L15B7, 2.0L Turbo K20C4, 2.0L hybrid)',
          oilCapacity: '4.2 qt (1.5T w/filter) / 4.5 qt (2.0T w/filter) / 3.8 qt (2.0L hybrid w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02 (1.5T/2.0T) / 15400-RTA-003 (hybrid)',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '6.5 qt (1.5T) / 7.5 qt (2.0T) / 8.2 qt (hybrid — includes battery loop) — approx'
        },
        transmission: {
          fluidType: 'Honda HCF-2 (CVT — 1.5T) / Honda ATF DW-1 (10-speed auto — 2.0T) / eCVT fluid (hybrid)',
          capacity: '3.7 qt drain-and-refill (CVT) / 3.4 qt (10AT) / consult manual (hybrid)',
          note: 'Honda 10-speed automatic uses ATF DW-1 per owner\'s manual.'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P225/50R17 (LX)', 'P235/40R19 (Sport, EX-L)', 'P235/40R19 (Touring)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'LED (all trims — 10th gen)',
          highBeam: 'LED (higher trims) / 9005 (LX, Sport)',
          frontTurn: 'LED (higher trims) / 7444NA (LX)',
          rearTurn: 'LED (all trims) / 7440A (LX)',
          tailBrake: 'LED (all trims)',
          interior: 'LED (dome/map) / DE3175 (LX)',
          license: '168 / LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2023-2025': {
        engine: {
          oilViscosity: '0W-20 (1.5L Turbo — LX, EX through 2024) / 0W-20 (2.0L hybrid — 2025 standard)',
          oilCapacity: '4.2 qt (1.5T w/filter) / 3.8 qt (2.0L hybrid w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02 (1.5T) / 15400-RTA-003 (hybrid)',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '6.5 qt (1.5T) / 8.2 qt (hybrid — includes battery loop) — approx'
        },
        transmission: {
          fluidType: 'Honda HCF-2 (CVT — 1.5T) / eCVT fluid (2.0L hybrid)',
          capacity: '3.7 qt drain-and-refill (CVT) / consult manual (hybrid)',
          note: '2025 Accord: 1.5T discontinued — 2.0L hybrid only.'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P225/50R17 (LX)', 'P235/40R19 (EX, Sport)', 'P235/40R19 (EX-L, Sport-L, Touring)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'LED (all trims — 11th gen)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      }
    },
    pilot: {
      '2005-2008': {
        engine: {
          oilViscosity: '5W-20',
          oilCapacity: '4.5 qt (3.5L J35A7 w/filter)',
          oilFilterPN: 'Honda 15400-RTA-003',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '7.1 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF-Z1 / DW-1 (5-speed auto)',
          capacity: '2.9 qt drain-and-refill'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'SAE 80W-90 (hypoid) + Honda VTM-4 Fluid (clutch unit)',
            capacity: '2.0 qt (hypoid) + 1.1 qt (VTM-4 unit) — approx',
            note: 'VTM-4 AWD models. 2WD (LX): standard open rear differential.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P245/65R17 (LX, EX)', 'P245/65R17 (EX-L)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: '9006 (halogen) / HID (EX-L 2006+)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: '168 (map) / 211-2 (dome)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2009-2015': {
        engine: {
          oilViscosity: '5W-20 (2009-2012) / 0W-20 (2013-2015)',
          oilCapacity: '4.5 qt (3.5L J35Z4 — 2009-2012 / J35Y4 — 2013-2015 w/filter)',
          oilFilterPN: 'Honda 15400-RTA-003',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '7.1 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF-Z1 / DW-1 (5-speed auto)',
          capacity: '2.9 qt drain-and-refill'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'Honda VTM-4 Fluid (rear unit) + SAE 80W-90 (hypoid)',
            capacity: '1.1 qt (VTM-4) + 2.0 qt (hypoid) — approx',
            note: 'VTM-4 AWD models. 2WD: standard open rear differential.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P245/60R18 (LX, EX)', 'P245/60R18 (EX-L, Touring)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2016-2022': {
        engine: {
          oilViscosity: '0W-20 (3.5L J35Y5 — 2016-2019 / J35Y6 — 2020-2022)',
          oilCapacity: '4.5 qt (3.5L w/filter)',
          oilFilterPN: 'Honda 15400-RTA-003',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '7.1 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'ZF Lifeguard 8 (9-speed ZF 9HP48)',
          capacity: 'Consult owner\'s manual',
          note: 'Requires ZF Lifeguard 8 fluid. Do NOT use Honda DW-1 in the 9-speed.'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'Honda VTM-4 Fluid (rear unit)',
            capacity: '1.1 qt',
            note: 'AWD (i-VTM4) models only. 2WD: open rear diff — SAE 80W-90.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P245/60R18 (LX, EX, EX-L)', 'P245/50R20 (Touring, Elite, Black Edition)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'LED (EX+ 2019+) / H11 (halogen LX, EX 2016-2018)',
          highBeam: 'LED / 9005',
          frontTurn: '7444NA (amber) / LED (2019+)',
          rearTurn: '7440A (amber) / LED',
          tailBrake: 'LED (EX-L+ 2016+) / 7443',
          interior: 'DE3175 (dome/map) / LED (higher trims)',
          license: '168 / LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2023-2025': {
        engine: {
          oilViscosity: '0W-20 (3.5L J35Y6)',
          oilCapacity: '4.5 qt (3.5L w/filter)',
          oilFilterPN: 'Honda 15400-RTA-003',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '7.1 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF DW-1 (10-speed auto)',
          capacity: '3.4 qt drain-and-refill (approx)',
          note: 'Honda 10-speed automatic. Confirm fluid type in owner\'s manual.'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: {
            fluidType: 'Honda VTM-4 Fluid (rear unit)',
            capacity: '1.1 qt',
            note: 'AWD (i-VTM4) models only.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33,
          rearPSI: 33,
          oemSizes: ['P255/50R20 (LX, EX, EX-L)', 'P255/50R20 (Touring, Elite, TrailSport)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'LED (all trims — 4th gen)',
          highBeam: 'LED',
          frontTurn: 'LED',
          rearTurn: 'LED',
          tailBrake: 'LED',
          interior: 'LED (dome/map)',
          license: 'LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      }
    },
    odyssey: {
      '2005-2010': {
        engine: {
          oilViscosity: '5W-20',
          oilCapacity: '4.5 qt (3.5L J35A7 — 2005-2006 / J35Z1 — 2007-2010 w/filter)',
          oilFilterPN: 'Honda 15400-RTA-003',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '7.1 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF-Z1 / DW-1 (5-speed auto)',
          capacity: '2.9 qt drain-and-refill'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P225/65R17 (LX, EX, EX-L)', 'P235/60R17 (Touring)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: '9006 (2005-2006) / H11 (2007-2010)',
          highBeam: '9005',
          frontTurn: '1157A (amber)',
          rearTurn: '1156',
          tailBrake: '1157',
          interior: 'DE3175 (dome) / 168 (map)',
          license: '194'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2011-2017': {
        engine: {
          oilViscosity: '0W-20 (3.5L J35Y1)',
          oilCapacity: '4.5 qt (3.5L w/filter)',
          oilFilterPN: 'Honda 15400-RTA-003',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '7.1 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF DW-1 (6-speed auto) / ZF Lifeguard 8 (9-speed auto — Touring Elite 2014-2017)',
          capacity: '2.9 qt drain-and-refill (6AT) / consult manual (9AT)',
          note: '9-speed requires ZF Lifeguard 8. Do NOT use DW-1 in the 9-speed.'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P225/65R17 (LX, EX)', 'P235/60R18 (Touring, Touring Elite)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) / LED (Touring Elite 2015+)',
          highBeam: '9005 / LED',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440A (amber)',
          tailBrake: '7443 / LED (Touring)',
          interior: 'DE3175 (dome/map)',
          license: '168'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
      },
      '2018-2025': {
        engine: {
          oilViscosity: '0W-20 (3.5L J35Y6)',
          oilCapacity: '4.5 qt (3.5L w/filter)',
          oilFilterPN: 'Honda 15400-RTA-003',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '7.1 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF DW-1 (10-speed auto) / ZF Lifeguard 8 (9-speed auto — 2018 LX, EX, EX-L)',
          capacity: '3.4 qt drain-and-refill (10AT) / consult manual (9AT)',
          note: '2019+ Odyssey: 10-speed standard on all trims. 9-speed requires ZF Lifeguard 8.'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32,
          rearPSI: 32,
          oemSizes: ['P235/60R18 (LX, EX, EX-L)', 'P235/55R19 (Touring, Elite)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'LED (EX+ 2019+) / H11 (LX 2018)',
          highBeam: 'LED / 9005',
          frontTurn: 'LED / 7444NA (LX)',
          rearTurn: 'LED / 7440A (LX)',
          tailBrake: 'LED (all trims 2018+)',
          interior: 'LED (dome/map) / DE3175 (LX)',
          license: '168 / LED'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, near the kick panel.'
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


// Wave 2 reference data: Chevrolet, Nissan, Hyundai, and Kia model generations.
const wave2Specs = {
  "chevrolet": {
    "silverado 1500": {
      "2007-2013": { engine: { oilViscosity: "0W-20 (4.8L / 5.3L / 6.0L / 6.2L V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2014-2018": { engine: { oilViscosity: "0W-20 (4.3L V6 / 5.3L V8 / 6.2L V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (2.7L Turbo / 5.3L V8 / 6.2L V8 / 3.0L Duramax)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "equinox": {
      "2010-2017": { engine: { oilViscosity: "0W-20 (2.4L I4)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2018-2024": { engine: { oilViscosity: "0W-20 (1.5L Turbo / 2.0L Turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "malibu": {
      "2008-2015": { engine: { oilViscosity: "0W-20 (2.4L I4 / 3.6L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2016-2024": { engine: { oilViscosity: "0W-20 (1.5L Turbo / 2.0L Turbo / hybrid)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "tahoe": {
      "2007-2014": { engine: { oilViscosity: "0W-20 (5.3L / 6.0L V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2015-2020": { engine: { oilViscosity: "0W-20 (5.3L / 6.2L V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2021-2024": { engine: { oilViscosity: "0W-20 (5.3L / 6.2L V8 / 3.0L Duramax)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "traverse": {
      "2009-2017": { engine: { oilViscosity: "5W-30 (3.6L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2018-2024": { engine: { oilViscosity: "5W-30 (3.6L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "colorado": {
      "2015-2022": { engine: { oilViscosity: "0W-20 (2.5L / 3.6L V6 / 2.8L Duramax)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2023-2024": { engine: { oilViscosity: "0W-20 (2.7L Turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "ACDelco PF63E", coolantType: "Dex-Cool (orange)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DEXRON-VI / DEXRON-HP automatic", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
  },
  "nissan": {
    "altima": {
      "2007-2012": { engine: { oilViscosity: "0W-20 (2.5L / 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2013-2018": { engine: { oilViscosity: "0W-20 (2.5L / 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (2.5L / 2.0L VC-Turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "sentra": {
      "2007-2012": { engine: { oilViscosity: "0W-20 (2.0L)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2013-2019": { engine: { oilViscosity: "0W-20 (1.8L)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2020-2024": { engine: { oilViscosity: "0W-20 (2.0L)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "pathfinder": {
      "2005-2012": { engine: { oilViscosity: "0W-20 (4.0L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2013-2021": { engine: { oilViscosity: "0W-20 (3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2022-2024": { engine: { oilViscosity: "0W-20 (3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "frontier": {
      "2005-2019": { engine: { oilViscosity: "0W-20 (2.5L / 4.0L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2020-2024": { engine: { oilViscosity: "0W-20 (3.8L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Nissan 15208-65F0E", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Nissan NS-2 / NS-3 CVT Fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
  },
  "hyundai": {
    "elantra": {
      "2007-2016": { engine: { oilViscosity: "0W-20 (2.0L / 1.8L)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Hyundai 26300-35505", coolantType: "Hyundai Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2017-2024": { engine: { oilViscosity: "0W-20 (2.0L / 1.6L Turbo / 1.4L Turbo / hybrid)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Hyundai 26300-35505", coolantType: "Hyundai Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "sonata": {
      "2006-2014": { engine: { oilViscosity: "0W-20 (2.4L / 2.0L Turbo / hybrid)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Hyundai 26300-35505", coolantType: "Hyundai Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2015-2024": { engine: { oilViscosity: "0W-20 (2.4L / 2.0L Turbo / 1.6L Turbo / hybrid)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Hyundai 26300-35505", coolantType: "Hyundai Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "tucson": {
      "2010-2015": { engine: { oilViscosity: "0W-20 (2.0L / 2.4L)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Hyundai 26300-35505", coolantType: "Hyundai Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2016-2021": { engine: { oilViscosity: "0W-20 (2.0L / 2.4L / 1.6L Turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Hyundai 26300-35505", coolantType: "Hyundai Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2022-2024": { engine: { oilViscosity: "0W-20 (2.5L / hybrid)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Hyundai 26300-35505", coolantType: "Hyundai Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "santa fe": {
      "2007-2018": { engine: { oilViscosity: "0W-20 (2.4L / 3.5L V6 / 2.0L Turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Hyundai 26300-35505", coolantType: "Hyundai Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (2.4L / 2.0L Turbo / hybrid)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Hyundai 26300-35505", coolantType: "Hyundai Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "palisade": {
      "2020-2024": { engine: { oilViscosity: "0W-20 (3.8L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Hyundai 26300-35505", coolantType: "Hyundai Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
  },
  "kia": {
    "soul": {
      "2010-2019": { engine: { oilViscosity: "0W-20 (1.6L / 2.0L)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Kia 26300-35505", coolantType: "Kia Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2020-2024": { engine: { oilViscosity: "0W-20 (2.0L / 1.6L Turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Kia 26300-35505", coolantType: "Kia Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "sportage": {
      "2007-2016": { engine: { oilViscosity: "0W-20 (2.0L / 2.4L)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Kia 26300-35505", coolantType: "Kia Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2017-2022": { engine: { oilViscosity: "0W-20 (2.4L / 1.6L Turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Kia 26300-35505", coolantType: "Kia Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2023-2024": { engine: { oilViscosity: "0W-20 (2.5L / hybrid)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Kia 26300-35505", coolantType: "Kia Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "sorento": {
      "2007-2020": { engine: { oilViscosity: "0W-20 (2.4L / 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Kia 26300-35505", coolantType: "Kia Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2021-2024": { engine: { oilViscosity: "0W-20 (2.5L Turbo / hybrid / PHEV)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Kia 26300-35505", coolantType: "Kia Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "telluride": {
      "2020-2024": { engine: { oilViscosity: "0W-20 (3.8L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Kia 26300-35505", coolantType: "Kia Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD/4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
    "forte": {
      "2010-2018": { engine: { oilViscosity: "0W-20 (2.0L / 1.6L Turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Kia 26300-35505", coolantType: "Kia Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (2.0L / 1.6L Turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Kia 26300-35505", coolantType: "Kia Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Hyundai/Kia SP-IV ATF / SP-IVT CVT / hybrid transaxle fluid", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 32, rearPSI: 32, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, near the steering column and interior fuse panel.' }
    },
  },
};
for (const [model, years] of Object.entries(wave2Specs.chevrolet)) referenceSpecs.chevrolet = { ...referenceSpecs.chevrolet, [model]: years };
for (const [model, years] of Object.entries(wave2Specs.nissan)) referenceSpecs.nissan = { ...referenceSpecs.nissan, [model]: years };
referenceSpecs.hyundai = referenceSpecs.hyundai || {};
for (const [model, years] of Object.entries(wave2Specs.hyundai)) referenceSpecs.hyundai = { ...referenceSpecs.hyundai, [model]: years };
referenceSpecs.kia = referenceSpecs.kia || {};
for (const [model, years] of Object.entries(wave2Specs.kia)) referenceSpecs.kia = { ...referenceSpecs.kia, [model]: years };

export default referenceSpecs;
