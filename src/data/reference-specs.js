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
 * Subaru/Jeep/RAM (FCA)/VW/BMW/Mercedes owner's manual data (Wave 3),
 * Audi/Volvo/Lexus/Acura/Dodge/Chrysler/Tesla/Mitsubishi/Lincoln/Infiniti/Buick/Pontiac (Wave 4),
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

const wave3Specs = {
  "subaru": {
    "outback": {
      "2005-2009": { engine: { oilViscosity: "5W-30 (2.5L EJ253 / 2.5T EJ255 XT / 3.0R H6 EZ30)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Subaru 15208AA12A (EJ/EZ engines)", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru 75W-90 MT gear oil (manual) / Subaru ATF-HP (5EAT auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru 75W-90 MT gear oil (MT) / ATF-HP (5EAT)", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' },
      "2010-2014": { engine: { oilViscosity: "0W-20 (2.5L FB25) / 5W-30 (3.6R EZ36)", oilCapacity: '5.1 qt (2.5L w/filter) / Consult owner\'s manual (3.6R)', oilFilterPN: "Subaru 15208AA15A (FB25) / 15208AA12A (EZ36)", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru Lineartronic CVT Fluid (CVT) / Subaru ATF-HP (3.6R 5EAT)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF / ATF-HP", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' },
      "2015-2019": { engine: { oilViscosity: "0W-20 (2.5L FB25) / 5W-30 (3.6R EZ36)", oilCapacity: '5.1 qt (2.5L w/filter) / Consult owner\'s manual (3.6R)', oilFilterPN: "Subaru 15208AA15A (FB25) / 15208AA12A (EZ36)", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru High Torque CVT Fluid (CVTF-II)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF-II", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' },
      "2020-2024": { engine: { oilViscosity: "0W-20 (2.5L FB25 / 2.4L Turbo FA24F XT)", oilCapacity: '5.1 qt (2.5L w/filter) / Consult owner\'s manual (2.4T)', oilFilterPN: "Subaru 15208AA15A (FB25) / 15208AA15A (FA24F)", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru High Torque CVT Fluid (CVTF-II)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF-II", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' }
    },
    "forester": {
      "2005-2010": { engine: { oilViscosity: "5W-30 (2.5L EJ253 / 2.5T EJ255 XT)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Subaru 15208AA12A (EJ engines)", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru 75W-90 MT gear oil (manual) / Subaru ATF-HP (4EAT auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru 75W-90 MT gear oil (MT) / ATF-HP (4EAT)", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' },
      "2011-2013": { engine: { oilViscosity: "0W-20 (2.5L FB25) / 5W-30 (2.5T EJ255 XT)", oilCapacity: '5.1 qt (2.5L w/filter) / Consult owner\'s manual (2.5T)', oilFilterPN: "Subaru 15208AA15A (FB25) / 15208AA12A (EJ255)", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru Lineartronic CVT Fluid (CVT) / 75W-90 MT gear oil (manual) / ATF-HP (XT 4EAT/5EAT)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF / 75W-90 / ATF-HP", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' },
      "2014-2018": { engine: { oilViscosity: "0W-20 (2.5L FB25) / 5W-30 (2.0T FA20F XT)", oilCapacity: '5.1 qt (2.5L w/filter) / Consult owner\'s manual (2.0T)', oilFilterPN: "Subaru 15208AA15A", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru High Torque CVT Fluid (CVTF-II)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF-II", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (2.5L FB25 / hybrid)", oilCapacity: '5.1 qt (2.5L w/filter)', oilFilterPN: "Subaru 15208AA15A", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru High Torque CVT Fluid (CVTF-II)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF-II", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' }
    },
    "crosstrek": {
      "2013-2017": { engine: { oilViscosity: "0W-20 (2.0L FB20)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Subaru 15208AA15A", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru High Torque CVT Fluid (CVTF-II) / 75W-90 MT gear oil (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF-II / 75W-90", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' },
      "2018-2020": { engine: { oilViscosity: "0W-20 (2.0L FB20)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Subaru 15208AA15A", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru High Torque CVT Fluid (CVTF-II) / 75W-90 MT gear oil (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF-II / 75W-90", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' },
      "2021-2024": { engine: { oilViscosity: "0W-20 (2.0L FB20 / 2.5L FB25 / hybrid)", oilCapacity: 'Consult owner\'s manual (2.0L) / 5.1 qt (2.5L w/filter)', oilFilterPN: "Subaru 15208AA15A", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru High Torque CVT Fluid (CVTF-II) / 75W-90 MT gear oil (manual, 2.0L)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF-II / 75W-90", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' }
    },
    "impreza": {
      "2005-2011": { engine: { oilViscosity: "5W-30 (2.5L EJ253 — RS/2.5i, WRX/STI use their own spec)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Subaru 15208AA12A (EJ engines)", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru 75W-90 MT gear oil (manual) / Subaru ATF-HP (4EAT)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru 75W-90 MT gear oil (MT) / ATF-HP (4EAT)", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' },
      "2012-2023": { engine: { oilViscosity: "0W-20 (2.0L FB20)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Subaru 15208AA15A", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru High Torque CVT Fluid (CVTF-II) / 75W-90 MT gear oil (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF-II / 75W-90", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' },
      "2024-2024": { engine: { oilViscosity: "0W-20 (2.5L FB25 RS)", oilCapacity: '5.1 qt (w/filter)', oilFilterPN: "Subaru 15208AA15A", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru High Torque CVT Fluid (CVTF-II) / 75W-90 MT gear oil (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF-II / 75W-90", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' }
    },
    "ascent": {
      "2019-2024": { engine: { oilViscosity: "0W-20 (2.4L Turbo FA24F)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Subaru 15208AA15A", coolantType: "Subaru Super Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Subaru High Torque CVT Fluid (CVTF-II)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: "Subaru CVTF-II", capacity: 'Consult owner\'s manual', note: 'Symmetrical AWD: center differential integrated into transaxle; no separate transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'Front differential is part of the transaxle. AWD standard.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (Subaru Extra-Hypoid)', capacity: 'Consult owner\'s manual', note: 'AWD standard on all Subaru models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 85 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the fuse panel.' }
    },
  },
  "jeep": {
    "grand cherokee": {
      "2005-2010": { engine: { oilViscosity: "5W-20 (4.7L V8 / 5.7L HEMI) / 0W-40 (6.1L SRT8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mopar 04884919AB (5.7L) / Consult owner\'s manual (4.7L, 6.1L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (545RFE / NAG1)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar ATF+4', capacity: 'Consult owner\'s manual', note: 'Quadra-Trac I/II / Quadra-Drive (NV140/NV245). 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 100 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' },
      "2011-2013": { engine: { oilViscosity: "5W-20 (3.6L Pentastar / 5.7L HEMI) / 0W-40 (6.4L SRT)", oilCapacity: '6.0 qt (3.6L w/filter) / 7.0 qt (5.7L w/filter) / 7.0 qt (6.4L w/filter)', oilFilterPN: "Mopar 04884919AB", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP70 8-speed) / Mopar ATF+4 (5-speed W5A580)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar ATF+4 / Mopar Transfer Case Fluid (Quadra-Trac/Quadra-Drive)', capacity: 'Consult owner\'s manual', note: 'Quadra-Trac II / Quadra-Drive II. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT, heavy duty)', capacity: 'Consult owner\'s manual', note: '4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 100 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' },
      "2014-2015": { engine: { oilViscosity: "5W-20 (3.6L) / 0W-20 (5.7L HEMI) / 0W-40 (6.4L SRT)", oilCapacity: '6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L w/filter)', oilFilterPN: "Mopar 04884919AB", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP70 8-speed)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar ATF+4 / Mopar Transfer Case Fluid (Quadra-Trac/Quadra-Drive)', capacity: 'Consult owner\'s manual', note: 'Quadra-Trac II / Quadra-Drive II. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT)', capacity: 'Consult owner\'s manual', note: '4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 100 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' },
      "2016-2021": { engine: { oilViscosity: "0W-20 (3.6L Pentastar / 5.7L HEMI) / 0W-40 (6.4L SRT / Trackhawk 6.2L)", oilCapacity: '6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L w/filter) / Consult owner\'s manual (6.2L)', oilFilterPN: "Mopar 04884919AB", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP70/8HP75 8-speed)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid', capacity: 'Consult owner\'s manual', note: 'Quadra-Trac II / Quadra-Drive II. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT/Trackhawk)', capacity: 'Consult owner\'s manual', note: '4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 100 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' },
      "2022-2024": { engine: { oilViscosity: "0W-20 (3.6L / 2.0L Turbo 4xe PHEV) / 0W-40 (6.4L 392)", oilCapacity: '6.0 qt (3.6L w/filter) / 5.5 qt (2.0T w/filter) / 7.0 qt (6.4L w/filter)', oilFilterPN: "Mopar 04884919AB (3.6L/6.4L) / Consult owner\'s manual (2.0T)", coolantType: "Mopar OAT Coolant (purple) — 4xe adds dedicated EV/high-voltage cooling loops", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed — 3.6L/6.4L) / ZF Lifeguard 8 (8-speed — 4xe e-transmission)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid', capacity: 'Consult owner\'s manual', note: 'Quadra-Trac II / Quadra-Drive II. 4xe: eAWD — no mechanical transfer case (rear e-motor).' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only. 4xe: front drive unit is electric.' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (392)', capacity: 'Consult owner\'s manual', note: '4WD models only. 4xe: rear axle driven by electric motor.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 100 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' }
    },
    "wrangler": {
      "2007-2011": { engine: { oilViscosity: "5W-20 (3.8L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual', coolantType: "Mopar OAT Coolant (purple) / Mopar 5/150 OAT (2010+)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (42RLE auto) / Mopar MT fluid (NSG370 manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar ATF+4 (NV241) / Mopar Transfer Case Fluid', capacity: 'Consult owner\'s manual', note: 'Part-time 4WD — all Wranglers have a transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All Wranglers are 4WD.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All Wranglers are 4WD. Add friction modifier for limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 37, rearPSI: 37, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 95 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' },
      "2012-2017": { engine: { oilViscosity: "5W-20 (3.6L — 2012-2015) / 0W-20 (3.6L — 2016-2017)", oilCapacity: '6.0 qt (3.6L w/filter)', oilFilterPN: "Mopar 04884919AB", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (3.6L auto W5A580) / Mopar MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar ATF+4 (NV241) / Mopar Transfer Case Fluid', capacity: 'Consult owner\'s manual', note: 'Part-time 4WD — all Wranglers have a transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All Wranglers are 4WD.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All Wranglers are 4WD. Add friction modifier for limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 37, rearPSI: 37, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 95 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' },
      "2018-2024": { engine: { oilViscosity: "0W-20 (3.6L / 2.0T) / 5W-40 (3.0L EcoDiesel) / 0W-40 (392 6.4L)", oilCapacity: '6.0 qt (3.6L w/filter) / 5.5 qt (2.0T w/filter) / 7.0 qt (6.4L w/filter) / Consult owner\'s manual (EcoDiesel)', oilFilterPN: "Mopar 04884919AB (3.6L/6.4L) / Consult owner\'s manual (2.0T, EcoDiesel)", coolantType: "Mopar OAT Coolant (purple) — 4xe adds dedicated high-voltage cooling loops", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed auto) / Mopar MT fluid (6-speed manual) / ZF 8-speed (4xe e-transmission)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid (NV241/MP3022 — Rock-Trac/Command-Trac)', capacity: 'Consult owner\'s manual', note: 'Part-time 4WD. 4xe: eAWD — no mechanical transfer case (rear e-motor).' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All Wranglers are 4WD.' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (392)', capacity: 'Consult owner\'s manual', note: 'All Wranglers are 4WD. Add friction modifier for limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 37, rearPSI: 37, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 95 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' }
    },
    "cherokee": {
      "2014-2018": { engine: { oilViscosity: "0W-20 (2.4L Tigershark) / 5W-20 (3.2L Pentastar)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mopar 04884919AB (2.4L/3.2L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 9 (9HP48 9-speed)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid', capacity: 'Consult owner\'s manual', note: 'Active Drive I/II (PTU + RDM). 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD models only. Front drive unit is a PTU off the transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD models only. Rear drive module (RDM).' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 100 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (2.4L Tigershark / 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mopar 04884919AB (2.4L) / Consult owner\'s manual (2.0T)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 9 (9HP50 9-speed)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid', capacity: 'Consult owner\'s manual', note: 'Active Drive I/II. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD models only. Front drive unit is a PTU off the transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD models only. Rear drive module (RDM).' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 100 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' }
    },
    "compass": {
      "2007-2016": { engine: { oilViscosity: "5W-20 (2.0L / 2.4L World Engine)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual', coolantType: "Mopar OAT Coolant (purple)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (5-speed/6-speed auto) / Chrysler CVT2 fluid (CVT) / Mopar MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid (Freedom Drive I/II)', capacity: 'Consult owner\'s manual', note: '4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only. PTU off the transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only. RDM.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 100 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' },
      "2017-2024": { engine: { oilViscosity: "0W-20 (2.4L Tigershark) / 0W-20 (2.0L Tigershark)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mopar 04884919AB", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 9 (9-speed auto) / Mopar ATF+4 (6-speed 948TE)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid', capacity: 'Consult owner\'s manual', note: 'Active Drive / Active Drive Low. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD models only. PTU off the transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'AWD models only. RDM.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 100 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the interior fuse panel.' }
    },
  },
  "ram": {
    "1500": {
      "2009-2012": { engine: { oilViscosity: "5W-20 (4.7L V8 / 5.7L HEMI) / 5W-20 (3.7L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mopar 04884919AB (5.7L) / Consult owner\'s manual (3.7L, 4.7L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (45RFE/545RFE/65RFE/42RLE)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid / ATF+4 (BW 44-40/44-41)', capacity: 'Consult owner\'s manual', note: '4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 130 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2013-2018": { engine: { oilViscosity: "0W-20 (5.7L HEMI 2014+) / 5W-20 (5.7L 2013, 3.6L 2013-2015) / 0W-20 (3.6L 2016+) / 5W-40 (3.0L EcoDiesel)", oilCapacity: '7.0 qt (5.7L w/filter) / 6.0 qt (3.6L w/filter) / Consult owner\'s manual (EcoDiesel)', oilFilterPN: "Mopar 04884919AB (5.7L/3.6L) / Consult owner\'s manual (EcoDiesel)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP70 8-speed) / Mopar ATF+4 (65RFE 2013)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid / ATF+4 (BW 44-40/44-41, MP3023)', capacity: 'Consult owner\'s manual', note: '4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 130 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (3.6L eTorque / 5.7L eTorque) / 5W-40 (3.0L EcoDiesel) / 0W-40 (6.2L TRX)", oilCapacity: '6.0 qt (3.6L w/filter) / 7.0 qt (5.7L w/filter) / 7.0 qt (6.2L w/filter) / Consult owner\'s manual (EcoDiesel)', oilFilterPN: "Mopar 04884919AB (3.6L/5.7L/6.2L) / Consult owner\'s manual (EcoDiesel)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP75 8-speed) / ZF Lifeguard 8 (EcoDiesel 8HP70)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid (MP3023/MP3024)', capacity: 'Consult owner\'s manual', note: '4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only. TRX: 75W-140 in rear axle.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 130 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' }
    },
    "2500": {
      "2010-2012": { engine: { oilViscosity: "5W-20 (5.7L HEMI) / 5W-40 (6.7L Cummins diesel)", oilCapacity: '7.0 qt (5.7L w/filter) / 12.0 qt (6.7L w/filter)', oilFilterPN: "Mopar 04884919AB (5.7L) / Fleetguard LF3972 (6.7L Cummins)", coolantType: "Mopar OAT Coolant (purple) / Cummins: Mopar OAT or ELCO — heavy-duty spec", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (65RFE/68RFE/AS69RC Aisin)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar ATF+4 / Mopar Transfer Case Fluid (NV261/NV271)', capacity: 'Consult owner\'s manual', note: '4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'Heavy towing/4WD: 75W-140 per severe-duty manual.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 60, rearPSI: 65, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2013-2018": { engine: { oilViscosity: "0W-20 (5.7L 2014+) / 5W-20 (5.7L 2013) / 5W-40 (6.7L Cummins) / Consult owner\'s manual (6.4L HEMI)", oilCapacity: '7.0 qt (5.7L w/filter) / 12.0 qt (6.7L w/filter) / Consult owner\'s manual (6.4L)', oilFilterPN: "Mopar 04884919AB (5.7L/6.4L) / Fleetguard LF3972 (6.7L Cummins)", coolantType: "Mopar OAT Coolant (purple) / Cummins: heavy-duty spec", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (66RFE/68RFE) / Aisin AS69RC: consult owner\'s manual", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar ATF+4 / Mopar Transfer Case Fluid (NV261/NV271/MP3023)', capacity: 'Consult owner\'s manual', note: '4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (heavy duty)', capacity: 'Consult owner\'s manual', note: 'Heavy towing/4WD: 75W-140 per severe-duty manual.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 60, rearPSI: 65, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2019-2024": { engine: { oilViscosity: "5W-40 (6.7L Cummins) / Consult owner\'s manual (6.4L HEMI)", oilCapacity: '12.0 qt (6.7L w/filter) / Consult owner\'s manual (6.4L)', oilFilterPN: "Fleetguard LF3972 (6.7L Cummins) / Mopar 04884919AB (6.4L)", coolantType: "Mopar OAT Coolant (purple) / Cummins: heavy-duty spec", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (66RFE/68RFE) / Aisin AS69RC: consult owner\'s manual", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid (MP3023)', capacity: 'Consult owner\'s manual', note: '4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (heavy duty)', capacity: 'Consult owner\'s manual', note: 'Heavy towing/4WD: 75W-140 per severe-duty manual.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 60, rearPSI: 65, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' }
    },
    "3500": {
      "2010-2012": { engine: { oilViscosity: "5W-20 (5.7L HEMI) / 5W-40 (6.7L Cummins)", oilCapacity: '7.0 qt (5.7L w/filter) / 12.0 qt (6.7L w/filter)', oilFilterPN: "Mopar 04884919AB (5.7L) / Fleetguard LF3972 (6.7L Cummins)", coolantType: "Mopar OAT Coolant (purple) / Cummins: heavy-duty spec", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (65RFE/68RFE/AS69RC Aisin)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar ATF+4 / Mopar Transfer Case Fluid (NV261/NV271)', capacity: 'Consult owner\'s manual', note: '4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'Heavy towing/4WD: 75W-140 per severe-duty manual.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 60, rearPSI: 65, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2013-2018": { engine: { oilViscosity: "0W-20 (5.7L 2014+) / 5W-20 (5.7L 2013) / 5W-40 (6.7L Cummins) / Consult owner\'s manual (6.4L HEMI)", oilCapacity: '7.0 qt (5.7L w/filter) / 12.0 qt (6.7L w/filter) / Consult owner\'s manual (6.4L)', oilFilterPN: "Mopar 04884919AB (5.7L/6.4L) / Fleetguard LF3972 (6.7L Cummins)", coolantType: "Mopar OAT Coolant (purple) / Cummins: heavy-duty spec", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (66RFE/68RFE) / Aisin AS69RC: consult owner\'s manual", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar ATF+4 / Mopar Transfer Case Fluid (NV261/NV271/MP3023)', capacity: 'Consult owner\'s manual', note: '4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (heavy duty)', capacity: 'Consult owner\'s manual', note: 'Heavy towing/4WD: 75W-140 per severe-duty manual.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 60, rearPSI: 65, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2019-2024": { engine: { oilViscosity: "5W-40 (6.7L Cummins) / Consult owner\'s manual (6.4L HEMI)", oilCapacity: '12.0 qt (6.7L w/filter) / Consult owner\'s manual (6.4L)', oilFilterPN: "Fleetguard LF3972 (6.7L Cummins) / Mopar 04884919AB (6.4L)", coolantType: "Mopar OAT Coolant (purple) / Cummins: heavy-duty spec", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mopar ATF+4 (66RFE/68RFE) / Aisin AS69RC: consult owner\'s manual", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mopar Transfer Case Fluid (MP3023)', capacity: 'Consult owner\'s manual', note: '4WD models only. 2WD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4WD models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (heavy duty)', capacity: 'Consult owner\'s manual', note: 'Heavy towing/4WD: 75W-140 per severe-duty manual.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 60, rearPSI: 65, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 140 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' }
    },
  },
  "volkswagen": {
    "golf": {
      "2006-2009": { engine: { oilViscosity: "5W-30 / 5W-40 (VW 502.00 — 2.5L I5 / 2.0T FSI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual', coolantType: "VW G12 / G12+ (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF G 055 025 A2 (09G 6-speed auto) / VW MT fluid (manual) / DSG: VW G 052 182 A2 (6-speed wet DSG — GTI)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'VW Haldex clutch fluid (G 055 175 A2)', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only (GTI/GTI 4Motion variants). FWD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2010-2014": { engine: { oilViscosity: "5W-30 / 5W-40 (VW 502.00 — 2.5L I5 / 2.0T TSI / 2.0L TDI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (2.0T TSI) / Consult owner\'s manual (2.5L, TDI)", coolantType: "VW G12+ / G13 (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DSG: VW G 052 182 A2 (6-speed wet) / VW ATF G 055 025 A2 (09G auto) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'VW Haldex clutch fluid (G 055 175 A2)', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only. FWD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2015-2017": { engine: { oilViscosity: "5W-40 (VW 502.00 — 1.8T / 2.0T GTI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (EA888 1.8T/2.0T)", coolantType: "VW G13 (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DSG: VW G 052 182 A2 (6-speed wet — GTI) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'VW Haldex clutch fluid (G 055 175 A2)', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only (Golf R). FWD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only (Golf R)' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2018-2021": { engine: { oilViscosity: "5W-40 (VW 502.00 — 1.4T / 2.0T GTI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (2.0T) / Consult owner\'s manual (1.4T)", coolantType: "VW G13 (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DSG: VW G 052 182 A2 (6-speed wet — GTI) / VW ATF G 055 025 A2 (8-speed auto — Golf 2019+) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'VW Haldex clutch fluid (G 055 175 A2)', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only (Golf R). FWD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only (Golf R)' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2022-2024": { engine: { oilViscosity: "0W-20 (VW 508.00 — 2.0T GTI / Golf R)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (EA888 Evo4)", coolantType: "VW G12 EVO (pink/purple)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DSG: VW G 052 182 A2 (6-speed wet — GTI) / VW G 055 540 A2 (7-speed wet DSG — Golf R) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'VW Haldex clutch fluid (G 055 175 A2)', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only (Golf R). FWD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only (Golf R)' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' }
    },
    "gti": {
      "2006-2009": { engine: { oilViscosity: "5W-30 / 5W-40 (VW 502.00 — 2.0T FSI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual', coolantType: "VW G12 / G12+ (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DSG: VW G 052 182 A2 (6-speed wet DSG) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2010-2014": { engine: { oilViscosity: "5W-30 / 5W-40 (VW 502.00 — 2.0T TSI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (2.0T TSI)", coolantType: "VW G12+ / G13 (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DSG: VW G 052 182 A2 (6-speed wet DSG) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2015-2017": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.0T TSI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (EA888)", coolantType: "VW G13 (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DSG: VW G 052 182 A2 (6-speed wet DSG) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2018-2021": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.0T TSI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (EA888)", coolantType: "VW G13 (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DSG: VW G 052 182 A2 (6-speed wet DSG) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2022-2024": { engine: { oilViscosity: "0W-20 (VW 508.00 — 2.0T EA888 Evo4)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (EA888 Evo4)", coolantType: "VW G12 EVO (pink/purple)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "DSG: VW G 052 182 A2 (6-speed wet DSG) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' }
    },
    "jetta": {
      "2005-2010": { engine: { oilViscosity: "5W-30 / 5W-40 (VW 502.00 — 2.5L I5 / 2.0T / 2.0L TDI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (2.0T) / Consult owner\'s manual (2.5L, TDI)", coolantType: "VW G12 / G12+ (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF G 055 025 A2 (09G 6-speed auto) / VW MT fluid (manual) / DSG: VW G 052 182 A2 (6-speed wet — TDI, GLI)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2011-2014": { engine: { oilViscosity: "5W-30 / 5W-40 (VW 502.00 — 2.0L / 2.5L / 2.0T GLI / 2.0L TDI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (2.0T) / Consult owner\'s manual (2.0L, 2.5L, TDI)", coolantType: "VW G12+ / G13 (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF G 055 025 A2 (09G auto) / VW MT fluid (manual) / DSG: VW G 052 182 A2 (6-speed wet — TDI, GLI)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2015-2018": { engine: { oilViscosity: "5W-40 (VW 502.00 — 1.4T / 1.8T GLI / 2.0L TDI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (1.8T) / Consult owner\'s manual (1.4T, TDI)", coolantType: "VW G13 (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF G 055 025 A2 (09G auto) / VW MT fluid (manual) / DSG: VW G 052 182 A2 (6-speed wet — TDI, GLI)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2019-2021": { engine: { oilViscosity: "5W-40 (VW 502.00 — 1.4T) / 0W-20 (VW 508.00 — 2.0T GLI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (2.0T) / Consult owner\'s manual (1.4T)", coolantType: "VW G13 (pink) / G12 EVO (GLI)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF G 055 025 A2 (8-speed auto — 1.4T) / DSG: VW G 052 182 A2 (6-speed wet — GLI) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2022-2024": { engine: { oilViscosity: "0W-20 (VW 508.00 — 1.5T / 2.0T GLI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (2.0T) / Consult owner\'s manual (1.5T)", coolantType: "VW G12 EVO (pink/purple)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF G 055 025 A2 (8-speed auto — 1.5T) / DSG: VW G 052 182 A2 (6-speed wet — GLI) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' }
    },
    "passat": {
      "2006-2010": { engine: { oilViscosity: "5W-30 / 5W-40 (VW 502.00 — 2.0T / 3.6L VR6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (2.0T) / Consult owner\'s manual (VR6)", coolantType: "VW G12 / G12+ (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF G 055 025 A2 (09G/09M auto) / DSG: VW G 052 182 A2 (6-speed wet) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'VW Haldex clutch fluid (G 055 175 A2)', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only. FWD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2012-2019": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.5L / 1.8T / 2.0T) / 5W-30 (VW 507.00 — 2.0L TDI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (1.8T/2.0T) / Consult owner\'s manual (2.5L, TDI)", coolantType: "VW G13 (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF G 055 025 A2 (09G/09M auto) / DSG: VW G 052 182 A2 (6-speed wet — TDI)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2020-2022": { engine: { oilViscosity: "0W-20 (VW 508.00 — 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (EA888)", coolantType: "VW G13 / G12 EVO (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF (8-speed auto — AQ450, consult manual for spec)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' }
    },
    "tiguan": {
      "2009-2017": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.0T TSI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (EA888)", coolantType: "VW G12+ / G13 (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF G 055 025 A2 (09M 6-speed auto) / DSG: VW G 052 182 A2 (6-speed wet — 2012+) / VW MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'VW Haldex clutch fluid (G 055 175 A2)', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only. FWD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2018-2024": { engine: { oilViscosity: "0W-20 (VW 508.00 — 2.0T TSI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (EA888 Gen3B)", coolantType: "VW G13 / G12 EVO (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF (8-speed auto — AQ450, consult manual for spec)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'VW Haldex clutch fluid (G 055 175 A2)', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only. FWD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' }
    },
    "atlas": {
      "2018-2023": { engine: { oilViscosity: "0W-20 (VW 508.00 — 2.0T) / 5W-30 (VW 502.00 — 3.6L VR6 — verify against manual)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (2.0T) / Consult owner\'s manual (VR6)", coolantType: "VW G13 / G12 EVO (pink)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF (8-speed auto — AQ450, consult manual for spec)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'VW Haldex clutch fluid (G 055 175 A2)', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only. FWD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' },
      "2024-2024": { engine: { oilViscosity: "0W-20 (VW 508.00 — 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "VW 06J115403C (EA888)", coolantType: "VW G12 EVO (pink/purple)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "VW ATF (8-speed auto — AQ450, consult manual for spec)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'VW Haldex clutch fluid (G 055 175 A2)', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only. FWD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4Motion AWD models only' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 89 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, above the footwell near the hood release.' }
    },
  },
  "mazda": {
    "3": {
      "2005-2009": { engine: { oilViscosity: "5W-20 (2.0L / 2.3L MZR)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mazda B6Y1-14-302 (MZR)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-MV (5-speed auto) / 75W-90 GL-4 MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2010-2013": { engine: { oilViscosity: "5W-20 (2.0L / 2.5L MZR)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mazda B6Y1-14-302 (MZR)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-MV (5-speed auto) / 75W-90 GL-4 MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2014-2018": { engine: { oilViscosity: "0W-20 (2.0L / 2.5L SkyActiv-G)", oilCapacity: '4.5 qt (2.0L w/filter) / 4.8 qt (2.5L w/filter)', oilFilterPN: "Mazda 1WPE-14-302 (SkyActiv)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-FZ (6-speed SkyActiv-Drive) / 75W-90 GL-4 MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' }
    },
    "6": {
      "2005-2008": { engine: { oilViscosity: "5W-20 (2.3L MZR / 3.0L V6 MZI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mazda B6Y1-14-302 (MZR) / 1WPE-14-302 (V6)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-MV (5-speed auto) / 75W-90 GL-4 MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2009-2013": { engine: { oilViscosity: "5W-20 (2.5L MZR)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mazda B6Y1-14-302 (MZR)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-MV (5-speed auto) / 75W-90 GL-4 MT fluid (manual)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2014-2017": { engine: { oilViscosity: "0W-20 (2.5L SkyActiv-G)", oilCapacity: '4.8 qt (w/filter)', oilFilterPN: "Mazda 1WPE-14-302 (SkyActiv)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-FZ (6-speed SkyActiv-Drive)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2018-2021": { engine: { oilViscosity: "0W-20 (2.5L SkyActiv-G) / 5W-30 (2.5T)", oilCapacity: '4.8 qt (2.5L w/filter) / Consult owner\'s manual (2.5T)', oilFilterPN: "Mazda 1WPE-14-302 (SkyActiv)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-FZ (6-speed SkyActiv-Drive)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' }
    },
    "cx-5": {
      "2013-2016": { engine: { oilViscosity: "0W-20 (2.0L / 2.5L SkyActiv-G)", oilCapacity: '4.5 qt (2.0L w/filter) / 4.8 qt (2.5L w/filter)', oilFilterPN: "Mazda 1WPE-14-302 (SkyActiv)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-FZ (6-speed SkyActiv-Drive)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'AWD models only. i-Activ AWD PTU. 2WD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'AWD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2017-2024": { engine: { oilViscosity: "0W-20 (2.5L SkyActiv-G) / 5W-30 (2.5T 2019+)", oilCapacity: '4.8 qt (2.5L w/filter) / Consult owner\'s manual (2.5T)', oilFilterPN: "Mazda 1WPE-14-302 (SkyActiv)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-FZ (6-speed SkyActiv-Drive)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'AWD models only. i-Activ AWD PTU. 2WD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'AWD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' }
    },
    "cx-9": {
      "2007-2015": { engine: { oilViscosity: "5W-30 (3.7L V6 MZI)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mazda 1WPE-14-302 (MZI)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-MV (6-speed auto — 2010+) / Mazda ATF-MV (5-speed — 2007-2009)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'AWD models only. 2WD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'AWD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2016-2024": { engine: { oilViscosity: "5W-30 (2.5T SkyActiv-G)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mazda 1WPE-14-302 (SkyActiv)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-FZ (6-speed SkyActiv-Drive)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'AWD models only. 2WD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'AWD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' }
    },
    "cx-30": {
      "2020-2024": { engine: { oilViscosity: "0W-20 (2.5L SkyActiv-G) / 5W-30 (2.5T)", oilCapacity: '4.8 qt (2.5L w/filter) / Consult owner\'s manual (2.5T)', oilFilterPN: "Mazda 1WPE-14-302 (SkyActiv)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "Mazda ATF-FZ (6-speed SkyActiv-Drive)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'AWD models only. i-Activ AWD PTU. 2WD: no transfer case.' }, differentials: { front: null, rear: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'AWD models only' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' }
    },
    "mx-5 miata": {
      "2006-2015": { engine: { oilViscosity: "5W-20 (2.0L MZR — NC)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mazda B6Y1-14-302 (MZR)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "75W-90 GL-4 MT fluid (manual) / Mazda ATF-MV (6-speed auto)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'Rear-wheel drive — all models have a rear differential. Add friction modifier for LSD.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 29, rearPSI: 29, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' },
      "2016-2024": { engine: { oilViscosity: "0W-20 (2.0L SkyActiv-G — ND)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mazda 1WPE-14-302 (SkyActiv)", coolantType: "Mazda FL22 (green)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "75W-90 GL-4 MT fluid (manual) / Mazda ATF-FZ (6-speed auto)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'Mazda Long Life Hypoid Gear Oil SG1', capacity: 'Consult owner\'s manual', note: 'Rear-wheel drive — all models have a rear differential. Add friction modifier for LSD.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 29, rearPSI: 29, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 80 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column above the kick panel.' }
    },
  },
  "bmw": {
    "328i": {
      "2007-2011": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N52 3.0L NA)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427512301 (N52)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 (6HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only — part varies by generation)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2012-2016": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N20 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (N20)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 (6HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2017-2018": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B48 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B48)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "330i": {
      "2016-2018": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B48 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B48)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B48 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B48)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "335i": {
      "2007-2010": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N54 3.0L twin-turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427541827 (N54)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 (6HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2011-2015": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N55 3.0L turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427541827 (N55)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 (6HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "340i": {
      "2016-2018": { engine: { oilViscosity: "5W-30 (BMW LL-01 — B58 3.0L turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B58)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B58 3.0L turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B58)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "330e": {
      "2016-2018": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B48 2.0T PHEV)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B48)", coolantType: "BMW Long Life Coolant (blue) — separate high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto, PHEV-specific housing)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B48 2.0T PHEV)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B48)", coolantType: "BMW Long Life Coolant (blue) — separate high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto, PHEV-specific housing)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "m3": {
      "2008-2013": { engine: { oilViscosity: "10W-60 (BMW M TwinPower — S65 4.0L V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual', coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "BMW MTF-LT-2 (6MT manual) / BMW DCT fluid (7-speed M DCT)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5 (M: 75W-140 per manual)', capacity: 'Consult owner\'s manual', note: 'All M3 models are rear-wheel drive.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2015-2018": { engine: { oilViscosity: "10W-60 (BMW M TwinPower — S55 3.0L twin-turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual', coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "BMW DCT fluid (7-speed M DCT) / BMW MTF-LT-2 (6MT)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'BMW hypoid gear oil 75W-140 GL-5 (M active differential)', capacity: 'Consult owner\'s manual', note: 'All M3 models are rear-wheel drive.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2021-2024": { engine: { oilViscosity: "0W-30 (BMW M TwinPower Turbo — S58 3.0L twin-turbo — verify)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual', coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed M Steptronic) / BMW MTF-LT-2 (6MT)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'BMW hypoid gear oil 75W-140 GL-5 (M active differential)', capacity: 'Consult owner\'s manual', note: 'All M3 models are rear-wheel drive. xDrive (M3 Competition xDrive): front diff + transfer case.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "528i": {
      "2005-2010": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N52 3.0L NA)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427512301 (N52)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 (6HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2011-2016": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N20 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (N20)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "530i": {
      "2006-2007": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N52 3.0L NA)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427512301 (N52)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 (6HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2017-2024": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B48 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B48)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "535i": {
      "2005-2010": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N54 3.0L twin-turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427541827 (N54)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 (6HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2011-2016": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N55 3.0L turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427541827 (N55)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "540i": {
      "2017-2024": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B58 3.0L turbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B58)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "530e": {
      "2017-2024": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B48 2.0T PHEV)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B48)", coolantType: "BMW Long Life Coolant (blue) — separate high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto, PHEV-specific housing)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "m5": {
      "2005-2010": { engine: { oilViscosity: "10W-60 (BMW M TwinPower — S85 5.0L V10)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual', coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "BMW SMG III fluid (7-speed SMG) / BMW MTF-LT-2 (6MT)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'BMW hypoid gear oil 75W-140 GL-5 (M differential)', capacity: 'Consult owner\'s manual', note: 'All M5 models are rear-wheel drive.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2012-2016": { engine: { oilViscosity: "5W-30 (BMW LL-01 — S63 4.4L twin-turbo V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual', coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "BMW DCT fluid (7-speed M DCT)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'BMW hypoid gear oil 75W-140 GL-5 (M differential)', capacity: 'Consult owner\'s manual', note: 'All M5 models are rear-wheel drive.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2018-2024": { engine: { oilViscosity: "5W-30 (BMW LL-01 — S63 4.4L twin-turbo V8 — verify)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual', coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed M Steptronic)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'BMW hypoid gear oil 75W-140 GL-5 (M differential)', capacity: 'Consult owner\'s manual', note: 'M5 xDrive (M xDrive): front diff + transfer case; M5 Competition: RWD bias.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "x3": {
      "2006-2010": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N52 3.0L NA)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427512301 (N52)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 (6HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. sDrive RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2011-2017": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N52 3.0L NA / N20 2.0T / N55 3.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427512301 (N52) / 11428637821 (N20) / 11427541827 (N55)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 (6HP) / ZF Lifeguard 8 (8HP — 2015+)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. sDrive RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2018-2024": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B48 2.0T 30i / B58 3.0T M40i)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B48/B58)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. sDrive RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "x5": {
      "2006-2013": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N52 3.0L NA / N55 3.0T 2011+ / N63 4.4T 50i)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427512301 (N52) / 11427541827 (N55/N63)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 (6HP auto — 2007-2010) / ZF Lifeguard 8 (8HP — 2011+)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD standard. sDrive RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 41, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2014-2018": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N55 3.0T / N63 4.4T 50i)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427541827 (N55/N63)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD standard. sDrive RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 41, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B58 3.0T 40i / 45e PHEV) / 5W-30 (N63 4.4T M50i — verify)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B58) / Consult owner\'s manual (N63)", coolantType: "BMW Long Life Coolant (blue) — 45e adds high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto) / ZF 8-speed PHEV-specific (45e)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD standard. sDrive RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 41, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "3 series": {
      "2006-2018": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N52/N54/N55/N20)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427512301 (N52) / 11427541827 (N54/N55) / 11428637821 (N20)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 / ZF Lifeguard 8 (auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2019-2024": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B46/B48 2.0T / B58 3.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B-series)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto) / BMW MTF-LT-2 (manual)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
    "5 series": {
      "2005-2016": { engine: { oilViscosity: "5W-30 (BMW LL-01 — N52/N54/N55/N20)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11427512301 (N52) / 11427541827 (N54/N55) / 11428637821 (N20)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 6 / ZF Lifeguard 8 (auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' },
      "2017-2024": { engine: { oilViscosity: "0W-20 (BMW LL-17FE+ — B48 2.0T / B58 3.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "BMW 11428637821 (B-series)", coolantType: "BMW Long Life Coolant (blue)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "ZF Lifeguard 8 (8HP auto)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: 'Consult owner\'s manual', note: 'xDrive AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'xDrive models only' }, rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 103 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the OBD port cover.' }
    },
  },
  "mercedes": {
    "c300": {
      "2008-2011": { engine: { oilViscosity: "5W-30 (MB 229.5 — M272 3.0L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2721800109 (M272)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2012-2014": { engine: { oilViscosity: "5W-30 (MB 229.5 — M276 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2015-2021": { engine: { oilViscosity: "5W-30 (MB 229.5 — M274 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2701800109 (M274)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic) / MB ATF 236.17 (9G-Tronic — 4MATIC)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2022-2024": { engine: { oilViscosity: "0W-20 (MB 229.71 — M254 2.0T mild hybrid)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M254)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "c43": {
      "2016-2022": { engine: { oilViscosity: "5W-30 (MB 229.5 — M276 3.0L biturbo V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic — AMG SPEEDSHIFT)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: 'AMG 4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2023-2024": { engine: { oilViscosity: 'Consult owner\'s manual (M139 2.0T PHEV)', oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M139)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic — AMG SPEEDSHIFT)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: 'AMG 4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "c63": {
      "2008-2014": { engine: { oilViscosity: "0W-40 (MB 229.5 — M156 6.2L V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M156)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (AMG SPEEDSHIFT MCT 7-speed)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All C63 models are rear-wheel drive.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2015-2021": { engine: { oilViscosity: "0W-40 (MB 229.5 — M177 4.0L biturbo V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M177)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (AMG SPEEDSHIFT MCT 7-speed)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All C63 models are rear-wheel drive.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2023-2024": { engine: { oilViscosity: 'Consult owner\'s manual (M139 2.0T PHEV)', oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M139)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (AMG SPEEDSHIFT 9G — 9G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: 'C63 S E PERFORMANCE — 4MATIC AWD with rear e-motor.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'Rear axle driven by electric motor + engine.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "e350": {
      "2006-2009": { engine: { oilViscosity: "5W-30 (MB 229.5 — M272 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2721800109 (M272)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2010-2016": { engine: { oilViscosity: "5W-30 (MB 229.5 — M272/M276 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2721800109 (M272) / 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2017-2018": { engine: { oilViscosity: "5W-30 (MB 229.5 — M276 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "e300": {
      "2017-2020": { engine: { oilViscosity: "5W-30 (MB 229.5 — M274 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2701800109 (M274)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2021-2024": { engine: { oilViscosity: "0W-20 (MB 229.71 — M254 2.0T mild hybrid)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M254)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "e450": {
      "2019-2020": { engine: { oilViscosity: "5W-30 (MB 229.5 — M276 3.0L biturbo V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2021-2024": { engine: { oilViscosity: "0W-30 (MB 229.52 — M256 3.0L turbo I6 mild hybrid — verify)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M256)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "e63": {
      "2007-2009": { engine: { oilViscosity: "0W-40 (MB 229.5 — M156 6.2L V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M156)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (AMG SPEEDSHIFT 7G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: null, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All E63 models are rear-wheel drive.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2010-2016": { engine: { oilViscosity: "0W-40 (MB 229.5 — M157 5.5L biturbo V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M157)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (AMG SPEEDSHIFT MCT 7-speed)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: 'E63 4MATIC (2014+) AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2017-2024": { engine: { oilViscosity: "0W-40 (MB 229.5 — M177 4.0L biturbo V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M177)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (AMG SPEEDSHIFT 9G — 9G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC+ models only)', capacity: 'Consult owner\'s manual', note: 'E63 S 4MATIC+ AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC+ models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "gle350": {
      "2016-2019": { engine: { oilViscosity: "5W-30 (MB 229.5 — M276 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2020-2024": { engine: { oilViscosity: "0W-20 (MB 229.71 — M264 2.0T mild hybrid — verify)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M264)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "gle450": {
      "2016-2019": { engine: { oilViscosity: "5W-30 (MB 229.5 — M276 3.0L biturbo V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2020-2024": { engine: { oilViscosity: "0W-30 (MB 229.52 — M256 3.0L turbo I6 mild hybrid — verify)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M256)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "gle53": {
      "2020-2024": { engine: { oilViscosity: "0W-30 (MB 229.52 — M256 3.0L turbo I6 mild hybrid — verify)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M256)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (AMG SPEEDSHIFT 9G — 9G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC+ models only)', capacity: 'Consult owner\'s manual', note: 'AMG 4MATIC+ AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC+ models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "gle63": {
      "2016-2019": { engine: { oilViscosity: "0W-40 (MB 229.5 — M157 5.5L biturbo V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M157)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (AMG SPEEDSHIFT 7G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: 'AMG 4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2020-2024": { engine: { oilViscosity: "0W-40 (MB 229.5 — M177 4.0L biturbo V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M177)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (AMG SPEEDSHIFT 9G — 9G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC+ models only)', capacity: 'Consult owner\'s manual', note: 'AMG 4MATIC+ AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC+ models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "glc300": {
      "2016-2022": { engine: { oilViscosity: "5W-30 (MB 229.5 — M274 2.0T)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2701800109 (M274)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2023-2024": { engine: { oilViscosity: "0W-20 (MB 229.71 — M254 2.0T mild hybrid)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M254)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "glc43": {
      "2017-2023": { engine: { oilViscosity: "5W-30 (MB 229.5 — M276 3.0L biturbo V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (AMG SPEEDSHIFT 9G — 9G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: 'AMG 4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2024-2024": { engine: { oilViscosity: "0W-30 (MB 229.52 — M256 3.0L turbo I6 mild hybrid — verify)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M256)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (AMG SPEEDSHIFT 9G — 9G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: 'AMG 4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "glc63": {
      "2017-2021": { engine: { oilViscosity: "0W-40 (MB 229.5 — M177 4.0L biturbo V8)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M177)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (AMG SPEEDSHIFT 9G — 9G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: 'AMG 4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2023-2024": { engine: { oilViscosity: 'Consult owner\'s manual (M139 2.0T PHEV)', oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M139)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (AMG SPEEDSHIFT 9G — 9G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: 'AMG 4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5 (AMG limited-slip)', capacity: 'Consult owner\'s manual', note: 'Rear axle driven by electric motor + engine.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "ml350": {
      "2006-2011": { engine: { oilViscosity: "5W-30 (MB 229.5 — M272 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2721800109 (M272)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2012-2015": { engine: { oilViscosity: "5W-30 (MB 229.5 — M276 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "c-class": {
      "2008-2014": { engine: { oilViscosity: "5W-30 (MB 229.5 — 3.0L/3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2721800109 (M272) / 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2015-2024": { engine: { oilViscosity: "5W-30 (MB 229.5 — 2.0T) / 0W-20 (MB 229.71 — 2022+ M254)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2701800109 (M274) / Consult owner\'s manual (M254)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic) / MB ATF 236.17 (9G-Tronic)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "e-class": {
      "2006-2016": { engine: { oilViscosity: "5W-30 (MB 229.5 — 3.5L V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2721800109 (M272) / 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2017-2024": { engine: { oilViscosity: "5W-30 (MB 229.5 — 2.0T / 3.0T) / 0W-30 (MB 229.52 — 2021+ M256)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2701800109 (M274) / 2761800109 (M276) / Consult owner\'s manual (M256)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "gle": {
      "2016-2019": { engine: { oilViscosity: "5W-30 (MB 229.5 — 3.5L V6 / 3.0L biturbo V6)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.14/236.15 (7G-Tronic 722.9)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2020-2024": { engine: { oilViscosity: "0W-20 (MB 229.71 — 2.0T) / 0W-30 (MB 229.52 — 3.0T M256) — verify", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Consult owner\'s manual (M264 / M256)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 38, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
    "glc": {
      "2016-2022": { engine: { oilViscosity: "5W-30 (MB 229.5 — 2.0T / 3.0T biturbo)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: "Mercedes 2701800109 (M274) / 2761800109 (M276)", coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0)", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' },
      "2023-2024": { engine: { oilViscosity: "0W-20 (MB 229.71 — 2.0T M254) / 0W-30 (MB 229.52 — 3.0T M256)", oilCapacity: 'Consult owner\'s manual', oilFilterPN: 'Consult owner\'s manual (M254 / M256)', coolantType: "Mercedes-Benz Antifreeze/Anticorrosion (blue — MB 325.0) — plus high-voltage cooling circuit", coolantCapacity: 'Consult owner\'s manual' }, transmission: { fluidType: "MB ATF 236.17 (9G-Tronic 725)", capacity: 'Consult owner\'s manual' }, transferCase: { fluidType: 'Mercedes transfer case fluid (4MATIC models only)', capacity: 'Consult owner\'s manual', note: '4MATIC AWD models only. RWD: no transfer case.' }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: '4MATIC models only' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: 'Consult owner\'s manual', note: 'All models' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 36, oemSizes: ['Consult owner\'s manual'], lugNutTorque: 110 }, bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' }, obd2Location: 'Under driver side dashboard, left of steering column near the footwell.' }
    },
  },
};


const wave4Specs = {
  "audi": {
    "a4": {
      "2005-2008": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.0T FSI) / 5W-30 or 5W-40 (VW 502.00 — 3.2L V6) / 5W-40 (S4 4.2L V8)", oilCapacity: "4.8 qt (2.0T w/filter) / 6.3 qt (3.2L V6 w/filter) / 7.4 qt (S4 4.2L w/filter)", oilFilterPN: "VW 06A115561B (2.0T) / Consult owner's manual (3.2L, 4.2L)", coolantType: "VW G12 / G12+ (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "VW ATF G 055 025 A2 (6-speed Tiptronic ZF 6HP) / CVT multitronic fluid G 052 190 A2 (FWD 2.0T) / VW MT fluid (manual)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case. FWD CVT models: none." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle (quattro).' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Quattro models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release and fuse panel." },
      "2009-2012": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.0T TSI) / 5W-30 or 5W-40 (3.2L V6) / 5W-40 (S4 3.0T supercharged)", oilCapacity: "5.0 qt (2.0T w/filter) / 6.3 qt (3.2L w/filter) / 6.4 qt (S4 3.0T w/filter)", oilFilterPN: "VW 06J115403C (2.0T) / Audi 06E115561Q (3.2L, 3.0T)", coolantType: "VW G12+ / G13 (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "VW ATF G 055 025 A2 (6-speed Tiptronic) / CVT multitronic fluid (FWD 2.0T) / DSG G 052 182 A2 (S4 7-speed S tronic)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case. FWD: none." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle (quattro).' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Quattro models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release and fuse panel." },
      "2013-2016": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.0T TSI) / 0W-40 (S4 3.0T supercharged)", oilCapacity: "5.0 qt (2.0T w/filter) / 6.4 qt (S4 3.0T w/filter)", oilFilterPN: "VW 06J115403C (2.0T) / Audi 06E115561Q (3.0T)", coolantType: "VW G13 (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed Tiptronic — quattro) / CVT multitronic fluid (FWD) / DSG G 055 540 A2 (S4 7-speed S tronic)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case. FWD: none." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle (quattro).' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Quattro models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release and fuse panel." },
      "2017-2024": { engine: { oilViscosity: "0W-20 (VW 508.00 — 2.0T, 2019+) / 5W-40 (VW 502.00 — 2.0T, 2017-2018) / 0W-30 or 5W-30 (VW 504.00 — S4 3.0T)", oilCapacity: "5.5 qt (2.0T w/filter) / 6.4 qt (S4 3.0T w/filter)", oilFilterPN: "VW 06J115403C (2.0T) / Audi 06E115561Q (3.0T)", coolantType: "VW G13 / G12 EVO (pink) — plus 48V mild-hybrid cooling loop (2020+)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "DSG G 055 540 A2 (7-speed S tronic — 2.0T quattro, S4) / ZF Lifeguard 8 (8-speed Tiptronic — 2017-2018 variants)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (center differential)", capacity: "Consult owner's manual", note: "Quattro (Torsen / quattro ultra clutch): center differential integrated into transaxle; no separate transfer case. FWD: none." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle (quattro).' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Quattro models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual (LED on most trims)", highBeam: "Consult owner's manual (LED on most trims)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release and fuse panel." }
    },
    "a6": {
      "2005-2008": { engine: { oilViscosity: "5W-30 or 5W-40 (VW 502.00 — 3.2L V6) / 5W-40 (4.2L V8) / 5W-40 (S6 5.2L V10 — verify)", oilCapacity: "6.3 qt (3.2L w/filter) / 7.4 qt (4.2L w/filter) / Consult owner's manual (5.2L V10)", oilFilterPN: "Audi 06E115561Q (3.2L, 4.2L) / Consult owner's manual (5.2L)", coolantType: "VW G12 / G12+ (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "VW ATF G 055 025 A2 (6-speed Tiptronic ZF 6HP) / CVT multitronic fluid (FWD 3.2L) / Consult owner's manual (S6)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case. FWD: none." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle (quattro).' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Quattro models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2009-2011": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.0T) / 5W-30 or 5W-40 (3.0T supercharged / 3.2L V6)", oilCapacity: "5.0 qt (2.0T w/filter) / 6.4 qt (3.0T w/filter) / 6.3 qt (3.2L w/filter)", oilFilterPN: "VW 06J115403C (2.0T) / Audi 06E115561Q (3.0T, 3.2L)", coolantType: "VW G12+ (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed Tiptronic — 3.0T/3.2L) / CVT multitronic fluid (2.0T FWD)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case. FWD: none." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle (quattro).' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Quattro models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2012-2018": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.0T, 2013-2014) / 0W-30 or 5W-30 (VW 504.00 — 3.0T supercharged) / 0W-40 (S6 4.0T — verify)", oilCapacity: "5.0 qt (2.0T w/filter) / 6.4 qt (3.0T w/filter) / Consult owner's manual (S6 4.0T)", oilFilterPN: "VW 06J115403C (2.0T) / Audi 06E115561Q (3.0T) / Consult owner's manual (4.0T)", coolantType: "VW G13 (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed Tiptronic — 2.0T/3.0T) / DSG G 055 540 A2 (7-speed S tronic — S6)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle (quattro).' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Quattro models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2019-2024": { engine: { oilViscosity: "0W-30 or 5W-30 (VW 504.00 — 3.0T 55 TFSI mild hybrid) / 0W-30 or 5W-30 (S6 2.9T biturbo)", oilCapacity: "6.4 qt (3.0T w/filter) / Consult owner's manual (2.9T)", oilFilterPN: "Audi 06E115561Q (3.0T) / Consult owner's manual (2.9T)", coolantType: "VW G12 EVO (pink) — plus 48V mild-hybrid cooling loop", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed Tiptronic — 3.0T / S6)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (center differential)", capacity: "Consult owner's manual", note: "Quattro (quattro ultra): center differential integrated into transaxle; no separate transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." }
    },
    "q5": {
      "2009-2012": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.0T TSI) / 5W-30 or 5W-40 (3.2L V6)", oilCapacity: "5.0 qt (2.0T w/filter) / 6.3 qt (3.2L w/filter)", oilFilterPN: "VW 06J115403C (2.0T) / Consult owner's manual (3.2L)", coolantType: "VW G12+ (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed Tiptronic)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case. All US Q5 models are AWD." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2013-2017": { engine: { oilViscosity: "5W-40 (VW 502.00 — 2.0T TSI) / 0W-30 or 5W-30 (VW 504.00 — SQ5 3.0T supercharged)", oilCapacity: "5.0 qt (2.0T w/filter) / 6.4 qt (SQ5 3.0T w/filter)", oilFilterPN: "VW 06J115403C (2.0T) / Audi 06E115561Q (3.0T)", coolantType: "VW G13 (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed Tiptronic — all)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case. All US Q5 models are AWD." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2018-2024": { engine: { oilViscosity: "0W-20 (VW 508.00 — 2.0T, 2019+) / 5W-40 (VW 502.00 — 2.0T, 2018) / 0W-30 or 5W-30 (VW 504.00 — SQ5 3.0T)", oilCapacity: "5.5 qt (2.0T w/filter) / 6.4 qt (SQ5 3.0T w/filter)", oilFilterPN: "VW 06J115403C (2.0T) / Audi 06E115561Q (3.0T)", coolantType: "VW G13 / G12 EVO (pink) — PHEV (55 TFSIe) adds high-voltage cooling circuit", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "DSG G 055 540 A2 (7-speed S tronic — 2.0T) / ZF Lifeguard 8 (8-speed Tiptronic — SQ5, PHEV)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (center differential)", capacity: "Consult owner's manual", note: "Quattro (Torsen/ultra): center differential in transaxle; no separate transfer case. 55 TFSIe PHEV: rear axle driven by e-motor — no mechanical propshaft." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models. PHEV: rear e-motor — no gear oil.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." }
    },
    "q7": {
      "2007-2010": { engine: { oilViscosity: "5W-30 or 5W-40 (VW 502.00 — 3.6L VR6) / 5W-40 (4.2L V8)", oilCapacity: "6.3 qt (3.6L w/filter) / 8.0 qt (4.2L w/filter — verify)", oilFilterPN: "Consult owner's manual (3.6L, 4.2L)", coolantType: "VW G12+ (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 6 (6-speed Tiptronic)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case. All US Q7 models are AWD." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2011-2015": { engine: { oilViscosity: "0W-30 or 5W-30 (VW 504.00 — 3.0T supercharged) / 5W-30 or 5W-40 (3.6L VR6)", oilCapacity: "6.4 qt (3.0T w/filter) / 6.3 qt (3.6L w/filter)", oilFilterPN: "Audi 06E115561Q (3.0T) / Consult owner's manual (3.6L)", coolantType: "VW G13 (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed Tiptronic)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2016-2019": { engine: { oilViscosity: "0W-30 or 5W-30 (VW 504.00 — 3.0T supercharged) / 5W-40 (2.0T, 2017-2018) / 0W-40 (SQ7 4.0T — verify)", oilCapacity: "6.4 qt (3.0T w/filter) / 5.5 qt (2.0T w/filter) / Consult owner's manual (SQ7 4.0T)", oilFilterPN: "Audi 06E115561Q (3.0T) / VW 06J115403C (2.0T) / Consult owner's manual (4.0T)", coolantType: "VW G13 (pink)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed Tiptronic — all)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (Torsen center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models. SQ7: sport rear differential (active).' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2020-2024": { engine: { oilViscosity: "0W-30 or 5W-30 (VW 504.00 — 3.0T 55 TFSI) / 0W-40 (SQ7 4.0T — verify)", oilCapacity: "6.4 qt (3.0T w/filter) / Consult owner's manual (SQ7 4.0T)", oilFilterPN: "Audi 06E115561Q (3.0T) / Consult owner's manual (4.0T)", coolantType: "VW G12 EVO (pink) — plus 48V mild-hybrid cooling loop", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8-speed Tiptronic — all)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "SAE 75W-90 GL-5 (center differential)", capacity: "Consult owner's manual", note: "Quattro: center differential integrated into transaxle; no separate transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models. SQ7: sport rear differential (active).' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 89 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." }
    },
  },
  "volvo": {
    "s60": {
      "2005-2009": { engine: { oilViscosity: "5W-30 (Volvo spec — 2.5T / T5 / R)", oilCapacity: "5.8 qt (2.5T w/filter) / Consult owner's manual (R)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Volvo ATF (Aisin AW55-51SN 5-speed auto) / Volvo MT fluid (manual)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (AWD models only)", capacity: "Consult owner's manual", note: "AWD models (2.5T AWD / R): Haldex 3rd-generation coupling. FWD: no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2011-2013": { engine: { oilViscosity: "5W-30 (Volvo spec — 2.5T / T6 3.0T)", oilCapacity: "5.5 qt (2.5T w/filter) / 5.9 qt (3.0T w/filter)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Aisin Warner ATF (TF-80SC 6-speed auto)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (AWD models only)", capacity: "Consult owner's manual", note: "T6 AWD models only. FWD (2.5T/T5): no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2014-2018": { engine: { oilViscosity: "0W-20 (Volvo spec — 2.0T Drive-E) / 5W-30 (3.0T T6, 2014-2015)", oilCapacity: "5.8 qt (2.0T w/filter) / 5.9 qt (3.0T w/filter)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Volvo 8-speed ATF (Aisin TG-81SC — AW-1 spec) / Aisin Warner ATF (TF-80SC 6-speed — 3.0T T6)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (AWD models only)", capacity: "Consult owner's manual", note: "T6 AWD models only (2016-2018). FWD (T5): no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual (LED on higher trims)", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2019-2024": { engine: { oilViscosity: "0W-20 (Volvo spec — 2.0T Drive-E / T8 PHEV / B5 mild hybrid)", oilCapacity: "5.8 qt (w/filter)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green) — T8 adds high-voltage cooling circuit", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Volvo 8-speed ATF (Aisin TG-81SC — AW-1 spec) / T8: 8-speed auto + rear e-motor drive unit", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (T6 AWD models only)", capacity: "Consult owner's manual", note: "T8 e-AWD: rear axle driven by electric motor — no mechanical transfer case. T5/T6: Haldex coupling (AWD only)." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only. T8: rear e-motor — no gear oil.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." }
    },
    "xc60": {
      "2009-2014": { engine: { oilViscosity: "5W-30 (Volvo spec — 3.2L I6 / T6 3.0T / T5 2.5T)", oilCapacity: "6.4 qt (3.2L w/filter) / 5.9 qt (3.0T w/filter) / 5.5 qt (2.5T w/filter)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Aisin Warner ATF (TF-80SC 6-speed Geartronic)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (AWD models only)", capacity: "Consult owner's manual", note: "AWD models (T6 standard; 3.2L AWD option). FWD 3.2L: no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2015-2017": { engine: { oilViscosity: "0W-20 (Volvo spec — 2.0T Drive-E)", oilCapacity: "5.8 qt (w/filter)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Volvo 8-speed ATF (Aisin TG-81SC — AW-1 spec)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (AWD models only)", capacity: "Consult owner's manual", note: "T6 AWD models only. FWD (T5): no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2018-2024": { engine: { oilViscosity: "0W-20 (Volvo spec — 2.0T / T8 PHEV / B5-B6 mild hybrid)", oilCapacity: "5.8 qt (w/filter)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green) — T8 adds high-voltage cooling circuit", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Volvo 8-speed ATF (Aisin TG-81SC — AW-1 spec) / T8: 8-speed auto + rear e-motor drive unit", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (AWD models only)", capacity: "Consult owner's manual", note: "T8 e-AWD: rear axle driven by electric motor — no mechanical transfer case. T6/B6 AWD: Haldex coupling." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only. T8: rear e-motor — no gear oil.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." }
    },
    "xc90": {
      "2005-2006": { engine: { oilViscosity: "5W-30 (2.5T / 4.4L V8)", oilCapacity: "5.8 qt (2.5T w/filter) / 6.9 qt (4.4L V8 w/filter)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Volvo ATF (Aisin AW55-51SN 5-speed — 2.5T) / Aisin Warner ATF (TF-80SC 6-speed — V8)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (AWD standard)", capacity: "Consult owner's manual", note: "XC90: AWD standard — Haldex coupling." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2007-2014": { engine: { oilViscosity: "5W-30 (3.2L I6 / 4.4L V8)", oilCapacity: "6.4 qt (3.2L w/filter) / 6.9 qt (4.4L V8 w/filter)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Aisin Warner ATF (TF-80SC 6-speed Geartronic)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (AWD standard)", capacity: "Consult owner's manual", note: "XC90: AWD standard — Haldex coupling." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2016-2019": { engine: { oilViscosity: "0W-20 (Volvo spec — 2.0T Drive-E / T8 PHEV)", oilCapacity: "5.8 qt (w/filter)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green) — T8 adds high-voltage cooling circuit", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Volvo 8-speed ATF (Aisin TG-81SC — AW-1 spec) / T8: 8-speed auto + rear e-motor drive unit", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (T6 models)", capacity: "Consult owner's manual", note: "T8 e-AWD: rear axle driven by electric motor — no mechanical transfer case. T6: Haldex coupling." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'T6 models. T8: rear e-motor — no gear oil.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2020-2024": { engine: { oilViscosity: "0W-20 (Volvo spec — 2.0T / B5-B6 mild hybrid / T8 PHEV)", oilCapacity: "5.8 qt (w/filter)", oilFilterPN: "Consult owner's manual", coolantType: "Volvo Genuine Coolant (green) — hybrids add high-voltage cooling circuit", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Volvo 8-speed ATF (Aisin TG-81SC — AW-1 spec) / T8: 8-speed auto + rear e-motor drive unit", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Haldex coupling fluid (B6 AWD models)", capacity: "Consult owner's manual", note: "T8 e-AWD: rear axle driven by electric motor — no mechanical transfer case. B6: Haldex coupling." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'B6 models. T8: rear e-motor — no gear oil.' } }, brakeFluid: 'DOT 4', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 103 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." }
    },
  },
  "lexus": {
    "rx": {
      "2005-2009": { engine: { oilViscosity: "5W-30 (3.3L 3MZ-FE — 2005-2006) / 5W-30 or 0W-20 (3.5L 2GR-FE — 2007+)", oilCapacity: "5.5 qt (3.3L w/filter) / 6.4 qt (3.5L w/filter)", oilFilterPN: "Toyota 90915-YZZF1 (2GR-FE) / Consult owner's manual (3MZ-FE)", coolantType: "Toyota Super Long Life Coolant (pink)", coolantCapacity: "6.9 qt (3.5L) / Consult owner's manual (3.3L)" }, transmission: { fluidType: "Toyota ATF WS (5-speed — 2005-2006) / Toyota ATF WS (6-speed U660E — 2007+)", capacity: "3.9 qt drain-and-refill (6-speed) / Consult owner's manual (5-speed)" }, transferCase: { fluidType: "Toyota Transfer Gear Oil LF 75W", capacity: "0.5 qt", note: "AWD models only. FWD models: no transfer case." }, differentials: { front: null, rear: { fluidType: "Toyota Differential Gear Oil LT 75W-85 GL-5", capacity: "0.5 qt", note: "AWD models only." } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 76 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the kick panel." },
      "2010-2015": { engine: { oilViscosity: "0W-20 (3.5L 2GR-FE / 2GR-FXE hybrid)", oilCapacity: "6.4 qt (w/filter)", oilFilterPN: "Toyota 90915-YZZF1", coolantType: "Toyota Super Long Life Coolant (pink)", coolantCapacity: "7.0 qt (RX350) / Consult owner's manual (RX450h — includes inverter loop)" }, transmission: { fluidType: "Toyota ATF WS (6-speed U660E — RX350) / Toyota eCVT fluid (RX450h)", capacity: "3.9 qt drain-and-refill (RX350) / Consult owner's manual (hybrid)" }, transferCase: { fluidType: "Toyota Transfer Gear Oil LF 75W", capacity: "0.5 qt", note: "RX350 AWD models only. RX450h: rear axle driven by electric motor — no transfer case." }, differentials: { front: null, rear: { fluidType: "Toyota Differential Gear Oil LT 75W-85 GL-5", capacity: "0.5 qt", note: "RX350 AWD models only. RX450h: rear e-motor — no gear oil." } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 76 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the kick panel." },
      "2016-2022": { engine: { oilViscosity: "0W-20 (3.5L 2GR-FKS / 2GR-FXS hybrid)", oilCapacity: "6.4 qt (w/filter)", oilFilterPN: "Toyota 90915-YZZF1", coolantType: "Toyota Super Long Life Coolant (pink)", coolantCapacity: "7.0 qt (RX350) / Consult owner's manual (RX450h — includes inverter loop)" }, transmission: { fluidType: "Toyota ATF WS (8-speed U880E — RX350) / Toyota eCVT fluid (RX450h)", capacity: "3.9 qt drain-and-refill (8-speed) / Consult owner's manual (hybrid)" }, transferCase: { fluidType: "Toyota Transfer Gear Oil LF 75W", capacity: "0.5 qt", note: "RX350 AWD models only. RX450h: rear e-motor — no transfer case." }, differentials: { front: null, rear: { fluidType: "Toyota Differential Gear Oil LT 75W-85 GL-5", capacity: "0.5 qt", note: "RX350 AWD models only. RX450h: rear e-motor — no gear oil." } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 76 }, bulbs: { lowBeam: "Consult owner's manual (LED standard on most trims)", highBeam: "Consult owner's manual (LED)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the kick panel." },
      "2023-2024": { engine: { oilViscosity: "0W-16 (2.5L A25A-FXS hybrid) / 0W-16 or 0W-20 (2.4L T24A-FTS)", oilCapacity: "5.0 qt (2.5L w/filter) / 5.4 qt (2.4T w/filter)", oilFilterPN: "Toyota 90915-YZZF1 (A25A) / 90915-YZZN1 (T24A — verify)", coolantType: "Toyota Super Long Life Coolant (pink) — hybrids add high-voltage cooling loop", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Toyota ATF WS (8-speed Direct Shift — RX350) / Toyota eCVT fluid (RX350h) / Hybrid transaxle + rear e-axle (RX500h)", capacity: "3.9 qt drain-and-refill (RX350) / Consult owner's manual (hybrids)" }, transferCase: { fluidType: "Toyota Transfer Gear Oil LF 75W", capacity: "0.5 qt", note: "RX350 AWD models only. RX350h / RX500h: e-AWD rear motor — no mechanical transfer case." }, differentials: { front: null, rear: { fluidType: "Toyota Differential Gear Oil LT 75W-85 GL-5", capacity: "0.5 qt", note: "RX350 AWD models only. Hybrids: rear e-motor — no gear oil." } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 76 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the kick panel." }
    },
    "es": {
      "2007-2012": { engine: { oilViscosity: "5W-30 or 0W-20 (3.5L 2GR-FE)", oilCapacity: "6.4 qt (w/filter)", oilFilterPN: "Toyota 90915-YZZF1", coolantType: "Toyota Super Long Life Coolant (pink)", coolantCapacity: "6.9 qt" }, transmission: { fluidType: "Toyota ATF WS (6-speed U660E)", capacity: "3.9 qt drain-and-refill" }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 76 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the kick panel." },
      "2013-2018": { engine: { oilViscosity: "0W-20 (3.5L 2GR-FE / 2GR-FKS) / 0W-20 (2.5L 2AR-FXE hybrid)", oilCapacity: "6.4 qt (3.5L w/filter) / 4.8 qt (2.5L hybrid w/filter)", oilFilterPN: "Toyota 90915-YZZF1", coolantType: "Toyota Super Long Life Coolant (pink)", coolantCapacity: "6.9 qt (3.5L) / Consult owner's manual (ES300h — includes inverter loop)" }, transmission: { fluidType: "Toyota ATF WS (6-speed U660E — 2013-2015) / Toyota ATF WS (8-speed U880 — 2016+) / Toyota eCVT fluid (ES300h)", capacity: "3.9 qt drain-and-refill (8-speed) / Consult owner's manual (hybrid)" }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 76 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the kick panel." },
      "2019-2024": { engine: { oilViscosity: "0W-20 (3.5L 2GR-FKS) / 0W-16 (2.5L A25A-FXS hybrid)", oilCapacity: "6.4 qt (3.5L w/filter) / 4.9 qt (2.5L hybrid w/filter)", oilFilterPN: "Toyota 90915-YZZF1", coolantType: "Toyota Super Long Life Coolant (pink)", coolantCapacity: "6.9 qt (3.5L) / Consult owner's manual (ES300h — includes inverter loop)" }, transmission: { fluidType: "Toyota ATF WS (8-speed U880 — ES350) / Toyota eCVT fluid (ES300h)", capacity: "3.9 qt drain-and-refill (ES350) / Consult owner's manual (hybrid)" }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 76 }, bulbs: { lowBeam: "Consult owner's manual (LED standard on most trims)", highBeam: "Consult owner's manual (LED)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the kick panel." }
    },
    "is": {
      "2006-2013": { engine: { oilViscosity: "0W-20 (2.5L 4GR-FSE / 3.5L 2GR-FSE)", oilCapacity: "6.1 qt (2.5L w/filter) / 6.4 qt (3.5L w/filter)", oilFilterPN: "Toyota 90915-YZZF1", coolantType: "Toyota Super Long Life Coolant (pink)", coolantCapacity: "6.9 qt (3.5L) / 6.4 qt (2.5L)" }, transmission: { fluidType: "Toyota ATF WS (6-speed A960E/A760E — RWD) / Toyota ATF WS (5-speed A750F — IS250 AWD)", capacity: "3.9 qt drain-and-refill" }, transferCase: { fluidType: "Toyota Transfer Gear Oil LF 75W", capacity: "0.5 qt", note: "IS250 AWD models only. RWD: no transfer case." }, differentials: { front: { fluidType: "Toyota Differential Gear Oil LT 75W-85 GL-5", capacity: "0.5 qt", note: "IS250 AWD models only." }, rear: { fluidType: "Toyota Differential Gear Oil LT 75W-85 GL-5", capacity: "0.6 qt", note: "All models. IS350: limited-slip option." } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 76 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the kick panel." },
      "2014-2020": { engine: { oilViscosity: "0W-20 (2.5L 4GR-FSE — 2014-2015 / 3.5L 2GR-FSE / 2.0T 8AR-FTS)", oilCapacity: "6.1 qt (2.5L w/filter) / 6.4 qt (3.5L w/filter) / 5.5 qt (2.0T w/filter)", oilFilterPN: "Toyota 90915-YZZF1", coolantType: "Toyota Super Long Life Coolant (pink)", coolantCapacity: "6.9 qt (3.5L) / 6.4 qt (2.5L) / 6.6 qt (2.0T)" }, transmission: { fluidType: "Toyota ATF WS (8-speed AA80E — IS350 RWD, IS200t/IS300) / Toyota ATF WS (6-speed A760F — AWD)", capacity: "3.9 qt drain-and-refill" }, transferCase: { fluidType: "Toyota Transfer Gear Oil LF 75W", capacity: "0.5 qt", note: "AWD models only (IS250/IS300 AWD). RWD: no transfer case." }, differentials: { front: { fluidType: "Toyota Differential Gear Oil LT 75W-85 GL-5", capacity: "0.5 qt", note: "AWD models only." }, rear: { fluidType: "Toyota Differential Gear Oil LT 75W-85 GL-5", capacity: "0.6 qt", note: "All models. IS350 F Sport: Torsen LSD." } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 76 }, bulbs: { lowBeam: "Consult owner's manual (LED on most trims)", highBeam: "Consult owner's manual (LED)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the kick panel." },
      "2021-2024": { engine: { oilViscosity: "0W-20 (3.5L 2GR-FKS) / 0W-20 (5.0L 2UR-GSE — IS500)", oilCapacity: "6.4 qt (3.5L w/filter) / 7.4 qt (5.0L w/filter)", oilFilterPN: "Toyota 90915-YZZF1 (3.5L) / 90915-YZZE2 (5.0L — verify)", coolantType: "Toyota Super Long Life Coolant (pink)", coolantCapacity: "6.9 qt (3.5L) / 8.2 qt (5.0L)" }, transmission: { fluidType: "Toyota ATF WS (8-speed AA80E — RWD) / Toyota ATF WS (6-speed A760F — IS350 AWD)", capacity: "3.9 qt drain-and-refill" }, transferCase: { fluidType: "Toyota Transfer Gear Oil LF 75W", capacity: "0.5 qt", note: "IS350 AWD models only. RWD (IS300/IS350/IS500): no transfer case." }, differentials: { front: { fluidType: "Toyota Differential Gear Oil LT 75W-85 GL-5", capacity: "0.5 qt", note: "AWD models only." }, rear: { fluidType: "Toyota Differential Gear Oil LT 75W-85 GL-5", capacity: "0.6 qt", note: "All models. IS500: Torsen LSD." } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 76 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the kick panel." }
    },
  },

  "acura": {
    "mdx": {
      "2007-2013": { engine: { oilViscosity: "5W-20 (3.7L J37 — 2007-2010) / 0W-20 (3.7L J37 — 2011-2013)", oilCapacity: "4.5 qt (w/filter)", oilFilterPN: "Honda 15400-RTA-003 (J37)", coolantType: "Honda Long Life Antifreeze/Coolant Type 2 (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Honda ATF DW-1 (5-speed — 2007-2009 / 6-speed — 2010-2013)", capacity: "3.1 qt drain-and-refill" }, transferCase: { fluidType: "Acura SH-AWD PTU / rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: "SH-AWD standard on MDX: front PTU off the transaxle + rear drive unit; no separate transfer case." }, differentials: { front: { fluidType: 'Honda ATF DW-1 (front drive)', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: "Acura SH-AWD rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: 'SH-AWD rear drive unit with twin clutches.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2014-2020": { engine: { oilViscosity: "0W-20 (3.5L J35Y6)", oilCapacity: "4.9 qt (w/filter)", oilFilterPN: "Honda 15400-RTA-003 (J35Y6)", coolantType: "Honda Long Life Antifreeze/Coolant Type 2 (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (9-speed 9HP48)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Acura SH-AWD PTU / rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: "SH-AWD: front PTU off the transaxle + rear drive unit; no separate transfer case. FWD (2014-2016 base): no PTU." }, differentials: { front: { fluidType: 'Honda ATF DW-1 (front drive)', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: "Acura SH-AWD rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: 'SH-AWD rear drive unit. FWD models: none.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual (LED on higher trims)", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2022-2024": { engine: { oilViscosity: "0W-20 (3.5L J35Y6) / 0W-20 (3.0T Type S)", oilCapacity: "4.9 qt (3.5L w/filter) / 5.2 qt (3.0T w/filter)", oilFilterPN: "Honda 15400-RTA-003 (3.5L) / Honda 15400-PLM-A02 (3.0T)", coolantType: "Honda Long Life Antifreeze/Coolant Type 2 (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Honda ATF DW-1 (10-speed auto)", capacity: "3.4 qt drain-and-refill" }, transferCase: { fluidType: "Acura SH-AWD PTU / rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: "SH-AWD: front PTU off the transaxle + rear drive unit; no separate transfer case." }, differentials: { front: { fluidType: 'Honda ATF DW-1 (front drive)', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: "Acura SH-AWD rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: 'SH-AWD rear drive unit.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." }
    },
    "rdx": {
      "2007-2012": { engine: { oilViscosity: "5W-30 (2.3L turbo K23A1)", oilCapacity: "4.5 qt (w/filter)", oilFilterPN: "Honda 15400-PLM-A02 (K23)", coolantType: "Honda Long Life Antifreeze/Coolant Type 2 (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Honda ATF DW-1 (5-speed auto)", capacity: "3.1 qt drain-and-refill" }, transferCase: { fluidType: "Acura SH-AWD PTU / rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: "SH-AWD standard: front PTU off the transaxle + rear drive unit; no separate transfer case." }, differentials: { front: { fluidType: 'Honda ATF DW-1 (front drive)', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: "Acura SH-AWD rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: 'SH-AWD rear drive unit.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2013-2018": { engine: { oilViscosity: "0W-20 (3.5L J35Y1)", oilCapacity: "4.9 qt (w/filter)", oilFilterPN: "Honda 15400-RTA-003 (J35Y1)", coolantType: "Honda Long Life Antifreeze/Coolant Type 2 (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Honda ATF DW-1 (6-speed auto)", capacity: "3.3 qt drain-and-refill" }, transferCase: { fluidType: "Acura AWD PTU / rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: "Intelligent Control AWD: front PTU off the transaxle + rear differential with clutch pack; no separate transfer case. FWD: no PTU." }, differentials: { front: { fluidType: 'Honda ATF DW-1 (front drive)', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: "Acura AWD rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2019-2024": { engine: { oilViscosity: "0W-20 (2.0T K20C4)", oilCapacity: "4.8 qt (w/filter)", oilFilterPN: "Honda 15400-PLM-A02 (K20C4)", coolantType: "Honda Long Life Antifreeze/Coolant Type 2 (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Honda ATF DW-1 (10-speed auto)", capacity: "3.4 qt drain-and-refill" }, transferCase: { fluidType: "Acura SH-AWD PTU / rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: "SH-AWD (A-Spec/Advance): front PTU + rear drive unit; no separate transfer case. FWD: no PTU." }, differentials: { front: { fluidType: 'Honda ATF DW-1 (front drive)', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: "Acura SH-AWD rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: 'SH-AWD rear drive unit. FWD models: none.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." }
    },
    "tlx": {
      "2015-2020": { engine: { oilViscosity: "0W-20 (2.4L K24W7 / 3.5L J35Y6)", oilCapacity: "4.6 qt (2.4L w/filter) / 4.9 qt (3.5L w/filter)", oilFilterPN: "Honda 15400-PLM-A02 (2.4L) / Honda 15400-RTA-003 (3.5L)", coolantType: "Honda Long Life Antifreeze/Coolant Type 2 (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Honda ATF DW-1 (8-speed DCT — 2.4L) / ZF Lifeguard 8 (9-speed — 3.5L)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Acura SH-AWD PTU / rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: "SH-AWD (3.5L V6 models): front PTU + rear drive unit; no separate transfer case. 2.4L: FWD only." }, differentials: { front: { fluidType: 'Honda ATF DW-1 (front drive)', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: "Acura SH-AWD rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: 'SH-AWD rear drive unit. 2.4L FWD: none.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual (LED on higher trims)", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2021-2024": { engine: { oilViscosity: "0W-20 (2.0T K20C4 / 3.0T Type S)", oilCapacity: "4.8 qt (2.0T w/filter) / 5.2 qt (3.0T w/filter)", oilFilterPN: "Honda 15400-PLM-A02 (2.0T) / Consult owner's manual (3.0T)", coolantType: "Honda Long Life Antifreeze/Coolant Type 2 (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Honda ATF DW-1 (10-speed auto)", capacity: "3.4 qt drain-and-refill" }, transferCase: { fluidType: "Acura SH-AWD PTU / rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: "SH-AWD (Type S, A-Spec): front PTU + rear drive unit; no separate transfer case. Base 2.0T: FWD." }, differentials: { front: { fluidType: 'Honda ATF DW-1 (front drive)', capacity: "Consult owner's manual", note: 'Front differential integrated into transaxle.' }, rear: { fluidType: "Acura SH-AWD rear differential fluid (genuine Acura fluid)", capacity: "Consult owner's manual", note: 'SH-AWD rear drive unit. FWD models: none.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." }
    },
  },
  "dodge": {
    "charger": {
      "2006-2010": { engine: { oilViscosity: "5W-20 (2.7L V6 / 3.5L V6 / 5.7L HEMI) / 0W-40 (6.1L SRT8)", oilCapacity: "5.0 qt (2.7L/3.5L w/filter) / 7.0 qt (5.7L w/filter) / 7.0 qt (6.1L w/filter)", oilFilterPN: "Mopar 04884919AB (5.7L/6.1L) / Consult owner's manual (2.7L, 3.5L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mopar ATF+4 (5-speed NAG1/W5A580 — V8) / Mopar ATF+4 (4-speed 42RLE — V6)", capacity: "Consult owner's manual" }, transferCase: null, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT8)', capacity: "Consult owner's manual", note: 'All models are rear-wheel drive. SRT8: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." },
      "2011-2014": { engine: { oilViscosity: "5W-20 (3.6L — 2011-2012) / 0W-20 (3.6L — 2013+) / 5W-20 (5.7L — 2011) / 0W-20 (5.7L — 2012+) / 0W-40 (6.4L SRT8)", oilCapacity: "6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L w/filter)", oilFilterPN: "Mopar 04884919AB (3.6L/5.7L/6.4L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mopar ATF+4 (5-speed NAG1 — 2011) / ZF Lifeguard 8 (8-speed — 2012+)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mopar Transfer Case Fluid", capacity: "Consult owner's manual", note: "AWD models (2011-2014 V6/V8) only. RWD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT8)', capacity: "Consult owner's manual", note: 'All models. SRT8: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." },
      "2015-2023": { engine: { oilViscosity: "0W-20 (3.6L / 5.7L) / 0W-40 (6.4L SRT 392 / 6.2L Hellcat)", oilCapacity: "6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L/6.2L w/filter)", oilFilterPN: "Mopar 04884919AB (all engines)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8HP45 — 3.6L / 8HP70 — 5.7L, 6.4L / 8HP90 — Hellcat)", capacity: "Consult owner's manual" }, transferCase: null, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT 392, Hellcat)', capacity: "Consult owner's manual", note: 'All models are rear-wheel drive. SRT/Hellcat: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual (LED on higher trims)", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." }
    },
    "challenger": {
      "2008-2010": { engine: { oilViscosity: "5W-20 (3.5L V6 / 5.7L HEMI) / 0W-40 (6.1L SRT8)", oilCapacity: "5.0 qt (3.5L w/filter) / 7.0 qt (5.7L/6.1L w/filter)", oilFilterPN: "Mopar 04884919AB (5.7L/6.1L) / Consult owner's manual (3.5L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mopar ATF+4 (5-speed NAG1 — auto) / Mopar MT fluid (6-speed manual)", capacity: "Consult owner's manual" }, transferCase: null, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT8)', capacity: "Consult owner's manual", note: 'All models are rear-wheel drive. SRT8: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." },
      "2011-2014": { engine: { oilViscosity: "5W-20 (3.6L — 2011-2012) / 0W-20 (3.6L — 2013+) / 5W-20 (5.7L — 2011) / 0W-20 (5.7L — 2012+) / 0W-40 (6.4L SRT8 392)", oilCapacity: "6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L w/filter)", oilFilterPN: "Mopar 04884919AB (3.6L/5.7L/6.4L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mopar ATF+4 (5-speed NAG1 — 2011-2014 auto) / Mopar MT fluid (6-speed manual) / ZF Lifeguard 8 (8-speed — 2014 V8)", capacity: "Consult owner's manual" }, transferCase: null, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT8 392)', capacity: "Consult owner's manual", note: 'All models are rear-wheel drive. SRT8: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." },
      "2015-2023": { engine: { oilViscosity: "0W-20 (3.6L / 5.7L) / 0W-40 (6.4L SRT 392 / 6.2L Hellcat / Demon)", oilCapacity: "6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L/6.2L w/filter)", oilFilterPN: "Mopar 04884919AB (all engines)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8HP45 — 3.6L / 8HP70 — 5.7L, 6.4L / 8HP90 — Hellcat, Demon) / Mopar MT fluid (6-speed manual)", capacity: "Consult owner's manual" }, transferCase: null, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT 392, Hellcat, Demon)', capacity: "Consult owner's manual", note: 'All models are rear-wheel drive. SRT/Hellcat/Demon: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual (LED on higher trims)", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." }
    },
    "durango": {
      "2011-2013": { engine: { oilViscosity: "5W-20 (3.6L — 2011) / 0W-20 (3.6L — 2012+) / 5W-20 (5.7L) / 0W-40 (6.4L SRT)", oilCapacity: "6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L w/filter)", oilFilterPN: "Mopar 04884919AB (3.6L/5.7L/6.4L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mopar ATF+4 (6-speed 62TE — 3.6L / 65RFE — 5.7L) / ZF Lifeguard 8 (8-speed — SRT)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mopar Transfer Case Fluid / Mopar ATF+4", capacity: "Consult owner's manual", note: "AWD/4WD models only. 2WD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT)', capacity: "Consult owner's manual", note: 'All models. SRT: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." },
      "2014-2020": { engine: { oilViscosity: "0W-20 (3.6L / 5.7L) / 0W-40 (6.4L SRT)", oilCapacity: "6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L w/filter)", oilFilterPN: "Mopar 04884919AB (3.6L/5.7L/6.4L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8HP45 — 3.6L / 8HP70 — 5.7L, 6.4L)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mopar Transfer Case Fluid", capacity: "Consult owner's manual", note: "AWD models only (R/T, Citadel, SRT). 2WD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT)', capacity: "Consult owner's manual", note: 'All models. SRT: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual (LED on higher trims)", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." },
      "2021-2024": { engine: { oilViscosity: "0W-20 (3.6L / 5.7L) / 0W-40 (6.4L SRT 392 / 6.2L Hellcat)", oilCapacity: "6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L/6.2L w/filter)", oilFilterPN: "Mopar 04884919AB (all engines)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8HP45 — 3.6L / 8HP70 — 5.7L, 6.4L / 8HP90 — Hellcat)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mopar Transfer Case Fluid", capacity: "Consult owner's manual", note: "AWD models only (GT, Citadel). 2WD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT 392, Hellcat)', capacity: "Consult owner's manual", note: 'All models. SRT/Hellcat: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." }
    },
  },
  "chrysler": {
    "300": {
      "2005-2010": { engine: { oilViscosity: "5W-20 (2.7L V6 / 3.5L V6 / 5.7L HEMI) / 0W-40 (6.1L SRT8)", oilCapacity: "5.0 qt (2.7L/3.5L w/filter) / 7.0 qt (5.7L/6.1L w/filter)", oilFilterPN: "Mopar 04884919AB (5.7L/6.1L) / Consult owner's manual (2.7L, 3.5L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mopar ATF+4 (5-speed NAG1 — V8) / Mopar ATF+4 (4-speed 42RLE — V6 2005-2009)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mopar ATF+4 (transfer case)", capacity: "Consult owner's manual", note: "AWD models (3.5L / 5.7L — 2005-2010) only. RWD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT8)', capacity: "Consult owner's manual", note: 'All models. SRT8: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." },
      "2011-2014": { engine: { oilViscosity: "5W-20 (3.6L — 2011) / 0W-20 (3.6L — 2012+) / 0W-20 (5.7L — 2012+) / 5W-20 (5.7L — 2011) / 0W-40 (6.4L SRT8)", oilCapacity: "6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L w/filter)", oilFilterPN: "Mopar 04884919AB (3.6L/5.7L/6.4L)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mopar ATF+4 (5-speed NAG1 — 2011) / ZF Lifeguard 8 (8-speed — 2012+)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mopar Transfer Case Fluid", capacity: "Consult owner's manual", note: "AWD models (2011-2014) only. RWD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (SRT8)', capacity: "Consult owner's manual", note: 'All models. SRT8: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." },
      "2015-2023": { engine: { oilViscosity: "0W-20 (3.6L / 5.7L) / 0W-40 (6.4L 300C)", oilCapacity: "6.0 qt (3.6L w/filter) / 7.0 qt (5.7L/6.4L w/filter)", oilFilterPN: "Mopar 04884919AB (all engines)", coolantType: "Mopar OAT Coolant (purple — 10 yr / 150k mi)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "ZF Lifeguard 8 (8HP45 — 3.6L / 8HP70 — 5.7L, 6.4L)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mopar Transfer Case Fluid", capacity: "Consult owner's manual", note: "AWD models (3.6L — all years) only. RWD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5 / 75W-140 (300C)', capacity: "Consult owner's manual", note: 'All models. 300C: limited-slip.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 36, rearPSI: 36, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual (LED on higher trims)", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column above the kick panel." }
    },
  },
  "tesla": {
    "model 3": {
      "2017-2024": { engine: { oilViscosity: "N/A (EV — no engine oil)", oilCapacity: "N/A (EV — no engine oil)", oilFilterPN: "N/A (EV — no oil filter)", coolantType: "Tesla-approved coolant (G-48 spec ethylene glycol — verify exact type per model in service mode)", coolantCapacity: "Consult owner's manual / service mode (battery + drive unit cooling loops)" }, transmission: { fluidType: "Single-speed gear reduction — Tesla drive unit oil (sealed; no scheduled fluid service)", capacity: "Consult Tesla service manual (drive unit oil)" }, transferCase: null, differentials: { front: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Front drive unit on Dual Motor / Long Range / Performance only. RWD: none." }, rear: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Rear drive unit on all Model 3 variants." } }, brakeFluid: "DOT 3 (Tesla-specified; DOT 4 acceptable — verify against manual)", tires: { frontPSI: 42, rearPSI: 42, oemSizes: ["235/45R18 (18\" Aero)", "235/40R19 (19\" Sport)", "235/35R20 (20\" — Performance)"], lugNutTorque: 129 }, bulbs: { lowBeam: "LED (all — not user-serviceable; replace complete assembly)", highBeam: "LED (all — not user-serviceable)", frontTurn: "LED (all — not user-serviceable)", rearTurn: "LED (all — not user-serviceable)", tailBrake: "LED (all — not user-serviceable)", interior: "LED (all — not user-serviceable)", license: "LED (all — not user-serviceable)" }, obd2Location: "Under driver side dashboard behind trim — Tesla uses a proprietary diagnostic connector (OBD-II pins); diagnostics via Service Mode." }
    },
    "model y": {
      "2020-2024": { engine: { oilViscosity: "N/A (EV — no engine oil)", oilCapacity: "N/A (EV — no engine oil)", oilFilterPN: "N/A (EV — no oil filter)", coolantType: "Tesla-approved coolant (G-48 spec ethylene glycol — verify exact type per model in service mode)", coolantCapacity: "Consult owner's manual / service mode (battery + drive unit cooling loops)" }, transmission: { fluidType: "Single-speed gear reduction — Tesla drive unit oil (sealed; no scheduled fluid service)", capacity: "Consult Tesla service manual (drive unit oil)" }, transferCase: null, differentials: { front: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Front drive unit on Dual Motor / Long Range / Performance only. RWD: none." }, rear: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Rear drive unit on all Model Y variants." } }, brakeFluid: "DOT 3 (Tesla-specified; DOT 4 acceptable — verify against manual)", tires: { frontPSI: 42, rearPSI: 42, oemSizes: ["255/45R19 (19\" Gemini)", "255/40R20 (20\" Induction)", "255/35R21 (21\" — Performance)"], lugNutTorque: 129 }, bulbs: { lowBeam: "LED (all — not user-serviceable; replace complete assembly)", highBeam: "LED (all — not user-serviceable)", frontTurn: "LED (all — not user-serviceable)", rearTurn: "LED (all — not user-serviceable)", tailBrake: "LED (all — not user-serviceable)", interior: "LED (all — not user-serviceable)", license: "LED (all — not user-serviceable)" }, obd2Location: "Under driver side dashboard behind trim — Tesla uses a proprietary diagnostic connector (OBD-II pins); diagnostics via Service Mode." }
    },
    "model s": {
      "2012-2020": { engine: { oilViscosity: "N/A (EV — no engine oil)", oilCapacity: "N/A (EV — no engine oil)", oilFilterPN: "N/A (EV — no oil filter)", coolantType: "Tesla-approved coolant (G-48 spec ethylene glycol — verify exact type per model in service mode)", coolantCapacity: "Consult owner's manual / service mode (battery + drive unit cooling loops)" }, transmission: { fluidType: "Single-speed gear reduction — Tesla drive unit oil (sealed; no scheduled fluid service)", capacity: "Consult Tesla service manual (drive unit oil)" }, transferCase: null, differentials: { front: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Front drive unit on Dual Motor / P100D only. RWD: none." }, rear: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Rear drive unit on all Model S variants." } }, brakeFluid: "DOT 3 (Tesla-specified; DOT 4 acceptable — verify against manual)", tires: { frontPSI: 45, rearPSI: 45, oemSizes: ["245/45R19 (19\" — 2012-2020)", "265/35R21 (21\" — performance)"], lugNutTorque: 129 }, bulbs: { lowBeam: "LED (all — not user-serviceable; replace complete assembly)", highBeam: "LED (all — not user-serviceable)", frontTurn: "LED (all — not user-serviceable)", rearTurn: "LED (all — not user-serviceable)", tailBrake: "LED (all — not user-serviceable)", interior: "LED (all — not user-serviceable)", license: "LED (all — not user-serviceable)" }, obd2Location: "Under driver side dashboard behind trim — Tesla uses a proprietary diagnostic connector (OBD-II pins); diagnostics via Service Mode." },
      "2021-2024": { engine: { oilViscosity: "N/A (EV — no engine oil)", oilCapacity: "N/A (EV — no engine oil)", oilFilterPN: "N/A (EV — no oil filter)", coolantType: "Tesla-approved coolant (G-48 spec ethylene glycol — verify exact type per model in service mode)", coolantCapacity: "Consult owner's manual / service mode (battery + drive unit cooling loops)" }, transmission: { fluidType: "Single-speed gear reduction — Tesla drive unit oil (sealed; no scheduled fluid service)", capacity: "Consult Tesla service manual (drive unit oil)" }, transferCase: null, differentials: { front: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Front drive unit on Dual Motor / Plaid only. RWD: none." }, rear: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Rear drive unit on all Model S variants. Plaid: dual rear motors." } }, brakeFluid: "DOT 3 (Tesla-specified; DOT 4 acceptable — verify against manual)", tires: { frontPSI: 45, rearPSI: 45, oemSizes: ["265/45R19 (19\" Tempest)", "265/35R21 (21\" — Plaid)"], lugNutTorque: 129 }, bulbs: { lowBeam: "LED (all — not user-serviceable; replace complete assembly)", highBeam: "LED (all — not user-serviceable)", frontTurn: "LED (all — not user-serviceable)", rearTurn: "LED (all — not user-serviceable)", tailBrake: "LED (all — not user-serviceable)", interior: "LED (all — not user-serviceable)", license: "LED (all — not user-serviceable)" }, obd2Location: "Under driver side dashboard behind trim — Tesla uses a proprietary diagnostic connector (OBD-II pins); diagnostics via Service Mode." }
    },
    "model x": {
      "2016-2020": { engine: { oilViscosity: "N/A (EV — no engine oil)", oilCapacity: "N/A (EV — no engine oil)", oilFilterPN: "N/A (EV — no oil filter)", coolantType: "Tesla-approved coolant (G-48 spec ethylene glycol — verify exact type per model in service mode)", coolantCapacity: "Consult owner's manual / service mode (battery + drive unit cooling loops)" }, transmission: { fluidType: "Single-speed gear reduction — Tesla drive unit oil (sealed; no scheduled fluid service)", capacity: "Consult Tesla service manual (drive unit oil)" }, transferCase: null, differentials: { front: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Front drive unit on Dual Motor / P100D only." }, rear: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Rear drive unit on all Model X variants." } }, brakeFluid: "DOT 3 (Tesla-specified; DOT 4 acceptable — verify against manual)", tires: { frontPSI: 45, rearPSI: 45, oemSizes: ["255/45R20 (20\" — 2016-2020)", "265/35R22 (22\" — performance)"], lugNutTorque: 129 }, bulbs: { lowBeam: "LED (all — not user-serviceable; replace complete assembly)", highBeam: "LED (all — not user-serviceable)", frontTurn: "LED (all — not user-serviceable)", rearTurn: "LED (all — not user-serviceable)", tailBrake: "LED (all — not user-serviceable)", interior: "LED (all — not user-serviceable)", license: "LED (all — not user-serviceable)" }, obd2Location: "Under driver side dashboard behind trim — Tesla uses a proprietary diagnostic connector (OBD-II pins); diagnostics via Service Mode." },
      "2021-2024": { engine: { oilViscosity: "N/A (EV — no engine oil)", oilCapacity: "N/A (EV — no engine oil)", oilFilterPN: "N/A (EV — no oil filter)", coolantType: "Tesla-approved coolant (G-48 spec ethylene glycol — verify exact type per model in service mode)", coolantCapacity: "Consult owner's manual / service mode (battery + drive unit cooling loops)" }, transmission: { fluidType: "Single-speed gear reduction — Tesla drive unit oil (sealed; no scheduled fluid service)", capacity: "Consult Tesla service manual (drive unit oil)" }, transferCase: null, differentials: { front: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Front drive unit on Dual Motor / Plaid only." }, rear: { fluidType: "Sealed drive unit — no serviceable gear oil", capacity: "Consult Tesla service manual", note: "Rear drive unit on all Model X variants. Plaid: dual rear motors." } }, brakeFluid: "DOT 3 (Tesla-specified; DOT 4 acceptable — verify against manual)", tires: { frontPSI: 45, rearPSI: 45, oemSizes: ["265/45R20 (20\" — 2021+)", "265/35R22 (22\" — Plaid)"], lugNutTorque: 129 }, bulbs: { lowBeam: "LED (all — not user-serviceable; replace complete assembly)", highBeam: "LED (all — not user-serviceable)", frontTurn: "LED (all — not user-serviceable)", rearTurn: "LED (all — not user-serviceable)", tailBrake: "LED (all — not user-serviceable)", interior: "LED (all — not user-serviceable)", license: "LED (all — not user-serviceable)" }, obd2Location: "Under driver side dashboard behind trim — Tesla uses a proprietary diagnostic connector (OBD-II pins); diagnostics via Service Mode." }
    },
  },

  "mitsubishi": {
    "outlander": {
      "2007-2013": { engine: { oilViscosity: "5W-30 (2.0L 4B11 / 2.4L 4B12 / 3.0L V6 6B31)", oilCapacity: "4.2 qt (2.0L/2.4L w/filter) / 4.5 qt (3.0L V6 w/filter)", oilFilterPN: "Mitsubishi MD360935 (4B / 6B engines)", coolantType: "Mitsubishi Long Life Coolant (green)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mitsubishi DiaQueen CVTF-J4 (CVT — 2.4L 2010+, 2.0L) / Mitsubishi DiaQueen ATF SP-III (6-speed auto — V6) / 75W-90 GL-4 MT gear oil (manual)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mitsubishi S-AWC center coupling fluid (DiaQueen)", capacity: "Consult owner's manual", note: "S-AWC AWD models only. 2WD: no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2014-2021": { engine: { oilViscosity: "0W-20 (2.4L 4J12) / 5W-30 (3.0L V6 6B31) / 0W-20 (PHEV 2.0L 4B11)", oilCapacity: "4.2 qt (2.4L w/filter) / 4.5 qt (3.0L V6 w/filter) / 4.2 qt (PHEV w/filter)", oilFilterPN: "Mitsubishi MD360935 (4J / 6B / PHEV)", coolantType: "Mitsubishi Super Long Life Coolant (blue) — PHEV adds high-voltage cooling circuit", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mitsubishi DiaQueen CVTF-J4 (CVT — 2.4L) / Mitsubishi DiaQueen ATF (6-speed auto — V6 GT) / PHEV: eCVT transaxle + rear e-motor", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mitsubishi S-AWC center coupling fluid (DiaQueen)", capacity: "Consult owner's manual", note: "S-AWC (2.4L SEL/GT): center coupling. PHEV: e-AWD rear motor — no mechanical transfer case. 2WD: none." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only. PHEV: rear e-motor — no gear oil.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2022-2024": { engine: { oilViscosity: "0W-16 (2.5L PR25DD) / 0W-20 (PHEV 2.4L 4B12)", oilCapacity: "4.9 qt (2.5L w/filter) / 4.2 qt (PHEV w/filter)", oilFilterPN: "Consult owner's manual (PR25DD) / Mitsubishi MD360935 (4B12)", coolantType: "Mitsubishi Super Long Life Coolant (blue) — PHEV adds high-voltage cooling circuit", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mitsubishi DiaQueen CVTF-J4 (CVT — 2.5L) / PHEV: eCVT transaxle + rear e-motor", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mitsubishi S-AWC center coupling fluid (DiaQueen)", capacity: "Consult owner's manual", note: "S-AWC (2.5L): center coupling + rear clutch. PHEV: e-AWD rear motor — no mechanical transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'S-AWC models only. PHEV: rear e-motor — no gear oil.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual (LED on higher trims)", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." }
    },
    "outlander sport": {
      "2011-2013": { engine: { oilViscosity: "5W-30 (2.0L 4B11 / 2.4L 4B12)", oilCapacity: "4.2 qt (w/filter)", oilFilterPN: "Mitsubishi MD360935 (4B engines)", coolantType: "Mitsubishi Long Life Coolant (green)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mitsubishi DiaQueen CVTF-J4 (CVT) / 75W-90 GL-4 MT gear oil (5-speed manual)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mitsubishi S-AWC center coupling fluid (DiaQueen)", capacity: "Consult owner's manual", note: "AWD models only. 2WD: no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2014-2024": { engine: { oilViscosity: "0W-20 (2.0L 4B11 — verify against manual; 5W-30 acceptable)", oilCapacity: "4.2 qt (w/filter)", oilFilterPN: "Mitsubishi MD360935 (4B11)", coolantType: "Mitsubishi Super Long Life Coolant (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Mitsubishi DiaQueen CVTF-J4 (CVT) / 75W-90 GL-4 MT gear oil (5-speed manual — 2011-2017)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Mitsubishi S-AWC center coupling fluid (DiaQueen)", capacity: "Consult owner's manual", note: "AWD models only. 2WD: no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." }
    },
  },
  "lincoln": {
    "mkz": {
      "2007-2012": { engine: { oilViscosity: "5W-20 (3.5L V6) / 5W-20 (2.5L Atkinson hybrid)", oilCapacity: "6.0 qt (3.5L w/filter) / 4.5 qt (2.5L hybrid w/filter)", oilFilterPN: "Motorcraft FL-500S (3.5L) / Motorcraft FL-910S (2.5L hybrid)", coolantType: "Motorcraft Orange (OAT — 2007-2011) / Motorcraft Yellow (2012)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Motorcraft MERCON LV (6-speed auto — Aisin F21 2007-2009 / 6F35 2010-2012) / eCVT fluid (hybrid)", capacity: "Consult owner's manual" }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the brake pedal area." },
      "2013-2016": { engine: { oilViscosity: "5W-30 (2.0T EcoBoost) / 5W-20 (3.7L V6) / 5W-20 (2.0L hybrid)", oilCapacity: "5.5 qt (2.0T w/filter) / 6.0 qt (3.7L w/filter) / 4.5 qt (hybrid w/filter)", oilFilterPN: "Motorcraft FL-500S (2.0T, 3.7L) / Motorcraft FL-910S (hybrid)", coolantType: "Motorcraft Yellow (2013+)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Motorcraft MERCON LV (6-speed 6F35 — FWD/AWD) / eCVT fluid (hybrid)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Motorcraft SAE 75W-140 (PTU)", capacity: "0.5 qt", note: "AWD models only. FWD: no transfer case." }, differentials: { front: null, rear: { fluidType: "Motorcraft SAE 75W-140 Synthetic", capacity: "Consult owner's manual", note: "AWD models only." } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the brake pedal area." },
      "2017-2020": { engine: { oilViscosity: "5W-30 (2.0T / 3.0T EcoBoost) / 5W-20 (2.0L hybrid)", oilCapacity: "5.5 qt (2.0T w/filter) / 6.0 qt (3.0T w/filter) / 4.5 qt (hybrid w/filter)", oilFilterPN: "Motorcraft FL-500S (2.0T, 3.0T) / Motorcraft FL-910S (hybrid)", coolantType: "Motorcraft Yellow", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Motorcraft MERCON LV (6F35 — 2.0T FWD) / Motorcraft MERCON LV (6F55 — 3.0T AWD) / eCVT fluid (hybrid)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Motorcraft SAE 75W-140 (PTU)", capacity: "0.5 qt", note: "AWD models only. FWD: no transfer case." }, differentials: { front: null, rear: { fluidType: "Motorcraft SAE 75W-140 Synthetic", capacity: "Consult owner's manual", note: "AWD models only." } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the brake pedal area." }
    },
    "navigator": {
      "2007-2014": { engine: { oilViscosity: "5W-20 (5.4L 3V V8)", oilCapacity: "6.0 qt (w/filter)", oilFilterPN: "Motorcraft FL-820-S (5.4L)", coolantType: "Motorcraft Orange (OAT)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Motorcraft MERCON LV (6-speed 6R75/6R80)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Motorcraft MERCON LV", capacity: "Consult owner's manual", note: "4WD models: 2-speed transfer case (ControlTrac). 2WD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: '4WD models only.' }, rear: { fluidType: 'SAE 75W-140 Synthetic (limited-slip additive)', capacity: "Consult owner's manual", note: 'All models. Limited-slip optional.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 150 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the brake pedal area." },
      "2015-2017": { engine: { oilViscosity: "5W-30 (3.5L EcoBoost)", oilCapacity: "6.0 qt (w/filter)", oilFilterPN: "Motorcraft FL-500S (3.5L EcoBoost)", coolantType: "Motorcraft Yellow", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Motorcraft MERCON LV (6-speed 6R80)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Motorcraft MERCON LV", capacity: "Consult owner's manual", note: "4WD models: 2-speed transfer case. 2WD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: '4WD models only.' }, rear: { fluidType: 'SAE 75W-140 Synthetic (limited-slip additive)', capacity: "Consult owner's manual", note: 'All models. Limited-slip optional.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 150 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the brake pedal area." },
      "2018-2024": { engine: { oilViscosity: "5W-30 (3.5L EcoBoost — 450 hp)", oilCapacity: "6.0 qt (w/filter)", oilFilterPN: "Motorcraft FL-500S (3.5L EcoBoost)", coolantType: "Motorcraft Yellow", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Motorcraft MERCON ULV (10-speed 10R80)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Motorcraft MERCON LV", capacity: "Consult owner's manual", note: "4WD models: 2-speed transfer case. 2WD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: '4WD models only.' }, rear: { fluidType: 'SAE 75W-140 Synthetic (limited-slip additive)', capacity: "Consult owner's manual", note: 'All models. Limited-slip optional.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 150 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the brake pedal area." }
    },
  },
  "infiniti": {
    "g35": {
      "2005-2007": { engine: { oilViscosity: "5W-30 (3.5L VQ35DE — 2005-2006 / VQ35HR — 2007)", oilCapacity: "5.1 qt (VQ35DE w/filter) / 5.4 qt (VQ35HR w/filter)", oilFilterPN: "Nissan 15208-65F0E (VQ engines)", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Nissan Matic S (5-speed auto — RE5R05A) / 75W-90 GL-4 MT gear oil (6-speed manual)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Nissan Matic J (ATTESA transfer case)", capacity: "Consult owner's manual", note: "AWD models (G35x) only. RWD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (VLSD optional)', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." }
    },
    "g37": {
      "2008-2013": { engine: { oilViscosity: "5W-30 (3.7L VQ37VHR)", oilCapacity: "5.3 qt (w/filter)", oilFilterPN: "Nissan 15208-65F0E (VQ37VHR)", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Nissan Matic S (7-speed auto — JR710E) / 75W-90 GL-4 MT gear oil (6-speed manual)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Nissan Matic J (ATTESA transfer case)", capacity: "Consult owner's manual", note: "AWD models (G37x) only. RWD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5 (VLSD optional)', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." }
    },
    "q50": {
      "2014-2015": { engine: { oilViscosity: "5W-30 (3.7L VQ37VHR / 3.5L hybrid)", oilCapacity: "5.3 qt (3.7L w/filter) / 4.8 qt (3.5L hybrid w/filter)", oilFilterPN: "Nissan 15208-65F0E (VQ engines)", coolantType: "Nissan Long Life Coolant (blue) — hybrid adds high-voltage cooling circuit", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Nissan Matic S (7-speed auto)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Nissan Matic J (Intelligent AWD transfer case)", capacity: "Consult owner's manual", note: "AWD models only. RWD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." },
      "2016-2024": { engine: { oilViscosity: "5W-30 (2.0T M274 — Infiniti spec; MB 229.5) / 5W-30 (3.0T VR30DDTT — verify against manual) / 5W-30 (3.5L hybrid — 2016-2017)", oilCapacity: "5.5 qt (2.0T w/filter) / 5.8 qt (3.0T w/filter) / 4.8 qt (hybrid w/filter)", oilFilterPN: "Nissan 15208-65F0E (VR30) / Consult owner's manual (2.0T M274)", coolantType: "Nissan Long Life Coolant (blue)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "Nissan Matic S (7-speed auto)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "Nissan Matic J (Intelligent AWD transfer case)", capacity: "Consult owner's manual", note: "AWD models only. RWD: no transfer case." }, differentials: { front: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' }, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 33, rearPSI: 33, oemSizes: ["Consult owner's manual"], lugNutTorque: 80 }, bulbs: { lowBeam: "Consult owner's manual (LED standard)", highBeam: "Consult owner's manual (LED standard)", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel." }
    },
  },
  "buick": {
    "enclave": {
      "2008-2009": { engine: { oilViscosity: "5W-30 (3.6L LLT V6)", oilCapacity: "6.0 qt (w/filter)", oilFilterPN: "ACDelco PF63E (3.6L)", coolantType: "Dex-Cool (orange)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "DEXRON VI (6-speed 6T75)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "DEXRON VI (GM AWD transfer case)", capacity: "Consult owner's manual", note: "AWD models only. FWD: no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2010-2017": { engine: { oilViscosity: "5W-30 (3.6L LFX V6)", oilCapacity: "6.0 qt (w/filter)", oilFilterPN: "ACDelco PF63E (3.6L)", coolantType: "Dex-Cool (orange)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "DEXRON VI (6-speed 6T75)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "DEXRON VI (GM AWD transfer case)", capacity: "Consult owner's manual", note: "AWD models only. FWD: no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." },
      "2018-2024": { engine: { oilViscosity: "0W-20 (3.6L LGX V6)", oilCapacity: "6.0 qt (w/filter)", oilFilterPN: "ACDelco PF63E (3.6L)", coolantType: "Dex-Cool (orange)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "DEXRON VI (9-speed 9T65)", capacity: "Consult owner's manual" }, transferCase: { fluidType: "DEXRON VI (GM AWD transfer case)", capacity: "Consult owner's manual", note: "AWD models only. FWD: no transfer case." }, differentials: { front: null, rear: { fluidType: 'SAE 75W-90 GL-5', capacity: "Consult owner's manual", note: 'AWD models only.' } }, brakeFluid: 'DOT 3', tires: { frontPSI: 35, rearPSI: 35, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual (LED on higher trims)", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the hood release." }
    },
  },
  "pontiac": {
    "grand prix": {
      "2004-2008": { engine: { oilViscosity: "5W-30 (3.8L V6 — base/GT / 3.8L supercharged — GTP / 5.3L V8 — GXP)", oilCapacity: "4.5 qt (3.8L w/filter) / 5.0 qt (5.3L w/filter)", oilFilterPN: "ACDelco PF61 (3.8L) / ACDelco PF48 (5.3L)", coolantType: "Dex-Cool (orange)", coolantCapacity: "Consult owner's manual" }, transmission: { fluidType: "DEXRON VI (4-speed 4T65-E / 4T65-E HD — GTP / 4T80-E — GXP)", capacity: "Consult owner's manual" }, transferCase: null, differentials: { front: null, rear: null }, brakeFluid: 'DOT 3', tires: { frontPSI: 30, rearPSI: 30, oemSizes: ["Consult owner's manual"], lugNutTorque: 100 }, bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: "Consult owner's manual", license: "Consult owner's manual" }, obd2Location: "Under driver side dashboard, left of steering column near the fuse panel (OBD-II standard from 2004)." }
    },
  },
};

// ── Wave 3 merge (Subaru, Jeep, RAM, Volkswagen, Mazda, BMW, Mercedes) ──────────
referenceSpecs.subaru = referenceSpecs.subaru || {};
for (const [model, years] of Object.entries(wave3Specs.subaru)) referenceSpecs.subaru = { ...referenceSpecs.subaru, [model]: years };
referenceSpecs.jeep = referenceSpecs.jeep || {};
for (const [model, years] of Object.entries(wave3Specs.jeep)) referenceSpecs.jeep = { ...referenceSpecs.jeep, [model]: years };
referenceSpecs.ram = referenceSpecs.ram || {};
for (const [model, years] of Object.entries(wave3Specs.ram)) referenceSpecs.ram = { ...referenceSpecs.ram, [model]: years };
referenceSpecs.volkswagen = referenceSpecs.volkswagen || {};
for (const [model, years] of Object.entries(wave3Specs.volkswagen)) referenceSpecs.volkswagen = { ...referenceSpecs.volkswagen, [model]: years };
// Mazda already exists from Wave 1 — merge per-model so existing year ranges are preserved
// (e.g. mazda '3' 2019-2024 stays intact while 2005-2018 ranges are added).
referenceSpecs.mazda = referenceSpecs.mazda || {};
for (const [model, years] of Object.entries(wave3Specs.mazda)) referenceSpecs.mazda[model] = { ...referenceSpecs.mazda[model], ...years };
referenceSpecs.bmw = referenceSpecs.bmw || {};
for (const [model, years] of Object.entries(wave3Specs.bmw)) referenceSpecs.bmw = { ...referenceSpecs.bmw, [model]: years };
referenceSpecs.mercedes = referenceSpecs.mercedes || {};
for (const [model, years] of Object.entries(wave3Specs.mercedes)) referenceSpecs.mercedes = { ...referenceSpecs.mercedes, [model]: years };
// Mercedes: NHTSA VPIC often returns model names with spaces ("C 300", "E 350", "GLE 350") —
// alias the spaced forms to the same data as the unspaced keys.
for (const spaced of ['c 300', 'c 43', 'c 63', 'e 350', 'e 300', 'e 450', 'e 63', 'gle 350', 'gle 450', 'gle 53', 'gle 63', 'glc 300', 'glc 43', 'glc 63', 'ml 350']) {
  const unspaced = spaced.replace(/\s/g, '');
  if (referenceSpecs.mercedes[unspaced]) referenceSpecs.mercedes[spaced] = referenceSpecs.mercedes[unspaced];
}
// ── Wave 4 merge (Audi, Volvo, Lexus, Acura, Dodge, Chrysler, Tesla, Mitsubishi, Lincoln, Infiniti, Buick, Pontiac) ──────────
// All 12 makes are new to reference-specs.js — per-model spread merge is safe.
for (const make of Object.keys(wave4Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(wave4Specs[make])) {
    referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
  }
}
// Audi S/RS performance trims are entered as their own model name by NHTSA VPIC ("S4", "SQ5") —
// alias them to the base-model data (all year ranges).
for (const [perfModel, baseModel] of [['s4', 'a4'], ['s6', 'a6'], ['sq5', 'q5'], ['sq7', 'q7']]) {
  if (referenceSpecs.audi?.[baseModel]) referenceSpecs.audi[perfModel] = referenceSpecs.audi[baseModel];
}

export default referenceSpecs;


