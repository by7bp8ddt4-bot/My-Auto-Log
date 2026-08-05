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

const SPARK_PLUG_DEFAULT = { type: "Consult owner's manual", gap: "Consult owner's manual", oemPN: "Consult owner's manual" };

export const referenceSpecs = {
  toyota: {
    camry: {
      '2018-2026': {
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
      '2019-2026': {
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
      '2016-2026': {
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
      '2023-2026': {
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
      '2023-2026': {
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
      '2010-2026': {
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
      '2025-2026': {
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
      '2022-2026': {
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
      '2023-2026': {
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
      '2021-2026': {
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
      '2021-2026': {
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
      '2017-2026': {
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
      '2009-2026': {
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
      '2020-2026': {
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
      '2020-2026': {
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
      '2024-2026': {
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
      '2019-2026': {
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
      '2022-2026': {
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
      '2023-2026': {
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
      '2023-2026': {
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
      '2023-2026': {
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
      '2018-2026': {
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
      '2019-2026': {
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
      '2019-2026': {
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
      '2015-2026': {
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
      '2014-2026': {
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
      '2015-2026': {
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
// alias the spaced forms to the same data as the unspaced keys, then delete the unspaced
// duplicates so the spaced (canonical) forms are the sole keys.
for (const spaced of ['c 300', 'c 43', 'c 63', 'e 350', 'e 300', 'e 450', 'e 63', 'gle 350', 'gle 450', 'gle 53', 'gle 63', 'glc 300', 'glc 43', 'glc 63', 'ml 350']) {
  const unspaced = spaced.replace(/\s/g, '');
  if (referenceSpecs.mercedes[unspaced]) {
    referenceSpecs.mercedes[spaced] = { ...referenceSpecs.mercedes[unspaced] };
    delete referenceSpecs.mercedes[unspaced];
  }
}
// ── Wave 5 motorcycle reference data (2005-2025) ─────────────────────────────
const motorcycleSpec = (engineDescription, oilViscosity, diagnosticLocation, shaftDrive = false, sparkPlugs = SPARK_PLUG_DEFAULT) => ({
  sparkPlugs: { ...sparkPlugs },
  engine: { oilViscosity, oilCapacity: "Consult owner's manual", oilFilterPN: "Consult owner's manual", coolantType: "Consult owner's manual", coolantCapacity: "Consult owner's manual" },
  transmission: { fluidType: `${oilViscosity} — shared engine/transmission oil; wet-clutch compatible (JASO MA/MA2)`, capacity: "Consult owner's manual", note: 'Motorcycle gearbox shares engine oil unless noted; verify exact model manual.' },
  transferCase: null, differentials: { front: null, rear: shaftDrive ? { fluidType: 'Hypoid final-drive gear oil', capacity: "Consult owner's manual", note: 'Shaft-drive final drive; not a differential service on chain/belt models.' } : null },
  brakeFluid: 'DOT 4 (DOT 5.1 where specified; never use silicone DOT 5)', tires: { frontPSI: 36, rearPSI: 42, oemSizes: ['120/70ZR17 front / 180/55ZR17 rear (common sport)', '100/90-19 front / 150/80B16 rear (common cruiser)'], lugNutTorque: 80 },
  bulbs: { lowBeam: "Consult owner's manual", highBeam: "Consult owner's manual", frontTurn: "Consult owner's manual", rearTurn: "Consult owner's manual", tailBrake: "Consult owner's manual", interior: 'N/A', license: "Consult owner's manual" },
  obd2Location: diagnosticLocation, note: engineDescription + '. Motorcycles generally do not use a standard OBD-II port; use the manufacturer diagnostic connector.'
});
const wave5Specs = {
  'harley-davidson': {
    'sportster': {
      '2005-2006': motorcycleSpec('883/1200 Evolution air-cooled', '20W-50 motorcycle oil, JASO MA/MA2', 'Sportster diagnostic connector under seat/left side cover', false),
      '2007-2022': motorcycleSpec('883/1200 Evolution air-cooled', '20W-50 motorcycle oil, JASO MA/MA2', '4-pin Harley diagnostic connector under seat or left side cover', false),
    },
    'softail': {
      '2005-2016': motorcycleSpec('Twin Cam 88/96/103 air-cooled V-twin', '20W-50 motorcycle oil, JASO MA/MA2', '4-pin Harley diagnostic connector under seat', false),
      '2017-2026': motorcycleSpec('Milwaukee-Eight 107/114/117 air-cooled/oil-cooled V-twin', '20W-50 motorcycle oil, JASO MA/MA2', 'Harley 4-pin diagnostic connector under seat/side cover', false),
    },
    'touring': {
      '2005-2016': motorcycleSpec('Twin Cam 88/96/103 V-twin', '20W-50 motorcycle oil, JASO MA/MA2', 'Harley 4-pin diagnostic connector under seat or fairing', false),
      '2017-2026': motorcycleSpec('Milwaukee-Eight 107/114/117 V-twin', '20W-50 motorcycle oil, JASO MA/MA2', 'Harley 4-pin diagnostic connector under seat or fairing', false),
    },
  },
  'yamaha': {
    'yzf-r6': {
      '2005-2005': motorcycleSpec('600cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Yamaha 4-pin diagnostic coupler under rider seat', false),
      '2006-2020': motorcycleSpec('600cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Yamaha 4-pin diagnostic coupler under rider seat', false),
    },
    'yzf-r1': {
      '2005-2014': motorcycleSpec('998cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Yamaha diagnostic coupler under rider seat', false),
      '2015-2026': motorcycleSpec('998cc crossplane inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Yamaha diagnostic coupler under rider seat', false),
    },
    'mt-07': {
      '2015-2017': motorcycleSpec('689cc liquid-cooled parallel twin (FZ-07)', '10W-40 motorcycle oil, JASO MA/MA2', 'Yamaha diagnostic coupler under rider seat', false),
      '2018-2026': motorcycleSpec('689cc liquid-cooled parallel twin', '10W-40 motorcycle oil, JASO MA/MA2', 'Yamaha diagnostic coupler under rider seat', false),
    },
    'mt-09': {
      '2014-2020': motorcycleSpec('847cc liquid-cooled inline triple (FZ-09)', '10W-40 motorcycle oil, JASO MA/MA2', 'Yamaha diagnostic coupler under rider seat', false),
      '2021-2026': motorcycleSpec('890cc liquid-cooled inline triple', '10W-40 motorcycle oil, JASO MA/MA2', 'Yamaha diagnostic coupler under rider seat', false),
    },
  },
  'honda': {
    'cbr600rr': {
      '2005-2006': motorcycleSpec('599cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Honda 4-pin DLC under seat', false),
      '2007-2026': motorcycleSpec('599cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Honda 4-pin DLC under seat', false),
    },
    'cbr1000rr': {
      '2005-2016': motorcycleSpec('999cc liquid-cooled inline-4 Fireblade', '10W-40 motorcycle oil, JASO MA/MA2', 'Honda 4-pin DLC under seat', false),
      '2017-2026': motorcycleSpec('999cc liquid-cooled inline-4 Fireblade', '10W-40 motorcycle oil, JASO MA/MA2', 'Honda 4-pin DLC under seat', false),
    },
    'gold wing': {
      '2005-2017': motorcycleSpec('1832cc liquid-cooled flat-6, shaft drive', '10W-30 motorcycle oil, JASO MA/MA2', 'Honda DLC under left side cover', true),
      '2018-2026': motorcycleSpec('1833cc liquid-cooled flat-6, shaft drive', '10W-30 motorcycle oil, JASO MA/MA2', 'Honda DLC under left side cover', true),
    },
  },
  'kawasaki': {
    'ninja 650': {
      '2006-2016': motorcycleSpec('649cc liquid-cooled parallel twin (ER-6f)', '10W-40 motorcycle oil, JASO MA/MA2', 'Kawasaki 4-pin diagnostic connector under seat', false),
      '2017-2026': motorcycleSpec('649cc liquid-cooled parallel twin', '10W-40 motorcycle oil, JASO MA/MA2', 'Kawasaki 4-pin diagnostic connector under seat', false),
    },
    'ninja zx-6r': {
      '2005-2008': motorcycleSpec('636cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Kawasaki diagnostic connector under seat', false),
      '2009-2012': motorcycleSpec('599cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Kawasaki diagnostic connector under seat', false),
      '2013-2026': motorcycleSpec('636cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Kawasaki diagnostic connector under seat', false),
    },
    'ninja zx-10r': {
      '2005-2010': motorcycleSpec('998cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Kawasaki diagnostic connector under seat', false),
      '2011-2026': motorcycleSpec('998cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Kawasaki diagnostic connector under seat', false),
    },
  },
  'suzuki': {
    'gsx-r600': {
      '2005-2010': motorcycleSpec('599cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Suzuki SDS diagnostic connector under seat', false),
      '2011-2026': motorcycleSpec('599cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Suzuki SDS diagnostic connector under seat', false),
    },
    'gsx-r750': {
      '2005-2010': motorcycleSpec('750cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Suzuki SDS diagnostic connector under seat', false),
      '2011-2026': motorcycleSpec('750cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Suzuki SDS diagnostic connector under seat', false),
    },
    'hayabusa': {
      '2005-2007': motorcycleSpec('1299cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Suzuki SDS diagnostic connector under seat', false),
      '2008-2020': motorcycleSpec('1340cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Suzuki SDS diagnostic connector under seat', false),
      '2021-2026': motorcycleSpec('1340cc liquid-cooled inline-4', '10W-40 motorcycle oil, JASO MA/MA2', 'Suzuki SDS diagnostic connector under seat', false),
    },
  },
  'bmw motorrad': {
    'r1250gs': {
      '2005-2012': motorcycleSpec('1170cc air/oil-cooled boxer, shaft drive (R1200GS)', '15W-50 motorcycle oil, JASO MA/MA2', 'BMW Motorrad 10-pin diagnostic connector under seat', true),
      '2013-2018': motorcycleSpec('1170cc liquid-cooled boxer, shaft drive (R1200GS)', '5W-40 motorcycle oil, JASO MA/MA2', 'BMW Motorrad 10-pin diagnostic connector under seat', true),
      '2019-2026': motorcycleSpec('1254cc liquid-cooled boxer, shaft drive', '5W-40 motorcycle oil, JASO MA/MA2', 'BMW Motorrad 10-pin diagnostic connector under seat', true),
    },
    's1000rr': {
      '2010-2014': motorcycleSpec('999cc liquid-cooled inline-4', '5W-40 motorcycle oil, JASO MA/MA2', 'BMW Motorrad 10-pin diagnostic connector under passenger seat', false),
      '2015-2018': motorcycleSpec('999cc liquid-cooled inline-4', '5W-40 motorcycle oil, JASO MA/MA2', 'BMW Motorrad 10-pin diagnostic connector under passenger seat', false),
      '2019-2026': motorcycleSpec('999cc liquid-cooled inline-4', '5W-40 motorcycle oil, JASO MA/MA2', 'BMW Motorrad 10-pin diagnostic connector under passenger seat', false),
    },
  },
  'indian': {
    'scout': {
      '2015-2020': motorcycleSpec('1133cc liquid-cooled V-twin', '15W-60 motorcycle oil, JASO MA/MA2', 'Indian 4-pin diagnostic connector under seat', false),
      '2021-2026': motorcycleSpec('1250cc liquid-cooled V-twin', '15W-60 motorcycle oil, JASO MA/MA2', 'Indian 4-pin diagnostic connector under seat', false),
    },
    'chieftain': {
      '2014-2018': motorcycleSpec('111ci (1811cc) air-cooled Thunder Stroke V-twin', '20W-40 motorcycle oil, JASO MA/MA2', 'Indian 4-pin diagnostic connector under seat', false),
      '2019-2026': motorcycleSpec('116ci (1890cc) air-cooled Thunder Stroke V-twin', '20W-40 motorcycle oil, JASO MA/MA2', 'Indian 4-pin diagnostic connector under seat', false),
    },
  },
};
// Common VPIC aliases for motorcycle model names.
wave5Specs.yamaha['fz-07'] = wave5Specs.yamaha['mt-07']; wave5Specs.yamaha['fz-09'] = wave5Specs.yamaha['mt-09'];
wave5Specs.kawasaki['er-6f'] = wave5Specs.kawasaki['ninja 650'];
wave5Specs.bmw = wave5Specs['bmw motorrad'];
for (const [make, models] of Object.entries(wave5Specs)) { referenceSpecs[make] = referenceSpecs[make] || {}; for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years }; }

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


// ── Wave 6 Marine & Powersports reference data (2005-2025) ───────────────────
// Marine outboards, personal watercraft, marine diesels, and Polaris powersports.
// Units: outboards/PWC/marine diesels run on engine hours ("hrs" vehicle unit);
// Polaris runs on miles ("mi"). Non-automotive vehicles have no OBD-II port —
// obd2Location describes the manufacturer diagnostic connector instead.
const marineOutboardSpec = (engineDescription, oilViscosity, gearcaseLube, diagnosticLocation) => ({
  engine: {
    oilViscosity,
    oilCapacity: "Consult owner's manual (FC-W certified 4-stroke outboard oil; capacity varies by model/generation)",
    oilFilterPN: "Consult owner's manual",
    coolantType: 'N/A — raw-water cooled (no coolant loop)',
    coolantCapacity: 'N/A — raw-water cooled'
  },
  transmission: {
    fluidType: 'N/A — outboards have no transmission; shift mechanism is inside the lower unit',
    capacity: 'N/A',
    note: 'Engine oil spec is engine-specific (see Engine). No transmission fluid; the lower unit gearcase uses marine-grade gear oil (see Differentials).'
  },
  transferCase: null,
  differentials: {
    front: null,
    rear: {
      fluidType: gearcaseLube,
      capacity: "Consult owner's manual (gearcase capacity varies by model)",
      note: 'Lower unit gearcase (forward/neutral/reverse gears) — drain and refill through the gearcase screws; check level with the oil level screw. Marine-grade gear oil only.'
    }
  },
  brakeFluid: 'N/A — no hydraulic brakes (steering/hydraulic assists are boat rigging, not engine service)',
  tires: {
    frontPSI: 'N/A',
    rearPSI: 'N/A',
    oemSizes: ['N/A — no road wheels (trailer wheels are trailer-side, not engine service)'],
    lugNutTorque: 'N/A'
  },
  bulbs: {
    lowBeam: 'N/A', highBeam: 'N/A', frontTurn: 'N/A', rearTurn: 'N/A',
    tailBrake: 'N/A', interior: 'N/A', license: 'N/A'
  },
  obd2Location: diagnosticLocation,
  note: engineDescription + '. Hour-based service intervals (e.g., 100 hr). No standard OBD-II port — manufacturer diagnostic software only.'
});

const pwcSpec = (engineDescription, oilViscosity, coolantType, brakeFluid, diagnosticLocation) => ({
  engine: {
    oilViscosity,
    oilCapacity: "Consult owner's manual",
    oilFilterPN: "Consult owner's manual",
    coolantType,
    coolantCapacity: "Consult owner's manual"
  },
  transmission: {
    fluidType: 'N/A — direct drive to jet pump; no transmission',
    capacity: 'N/A',
    note: 'PWC have no gearbox — the engine drives the jet pump directly.'
  },
  transferCase: null,
  differentials: {
    front: null,
    rear: {
      fluidType: 'Jet pump oil (OEM-specified — BRP XPS / Kawasaki jet pump lubricant where applicable)',
      capacity: "Consult owner's manual",
      note: "Final drive is the jet pump impeller assembly. Some models specify jet pump oil; others use water-lubricated bearings with greased splines — check the owner's manual for the exact service."
    }
  },
  brakeFluid,
  tires: {
    frontPSI: 'N/A', rearPSI: 'N/A',
    oemSizes: ['N/A — no road wheels'], lugNutTorque: 'N/A'
  },
  bulbs: {
    lowBeam: 'N/A', highBeam: 'N/A', frontTurn: 'N/A', rearTurn: 'N/A',
    tailBrake: 'N/A', interior: 'N/A', license: 'N/A'
  },
  obd2Location: diagnosticLocation,
  note: engineDescription + '. Hour-based service intervals (e.g., 50/100 hr). No OBD-II — manufacturer diagnostic software only.'
});

const yamahaPwcSpec = (engineDescription, oilViscosity) => ({
  ...pwcSpec(engineDescription, oilViscosity,
    'Yamaha closed-loop cooling system — ethylene-glycol coolant; consult owner\'s manual',
    'N/A — no service brakes on PWC',
    'Yamaha Diagnostic System (YDS) connector — dealer diagnostic tool; no OBD-II port.'),
  differentials: {
    front: null,
    rear: {
      fluidType: 'Yamaha jet pump oil — EP 75W-90 marine gear oil',
      capacity: "Consult owner's manual",
      note: 'Jet pump final drive; use Yamaha-specified EP 75W-90 marine gear oil and verify service procedure for the model year.'
    }
  }
});
const marineDieselSpec = (engineDescription, oilViscosity, oilCapacity, diagnosticLocation) => ({
  engine: {
    oilViscosity,
    oilCapacity,
    oilFilterPN: "Consult owner's manual",
    coolantType: '50/50 ethylene-glycol coolant (OEM spec — e.g., CAT DEAC/ELC, Cummins Fleetguard ES Compleat, Yanmar original coolant)',
    coolantCapacity: "Consult owner's manual (varies with heat-exchanger/expansion-tank configuration)"
  },
  transmission: {
    fluidType: 'Marine gearbox oil — per installed transmission (ZF, Twin Disc, Yanmar KMH/YD series); commonly 15W-40 engine oil or ATF per gearbox spec',
    capacity: "Consult owner's manual (gearbox-specific)",
    note: 'The marine transmission is a separate gearbox (not part of the engine) — service fluid per the gearbox manufacturer, not the engine manual.'
  },
  transferCase: null,
  differentials: { front: null, rear: null },
  brakeFluid: 'N/A — no hydraulic brakes (marine)',
  tires: {
    frontPSI: 'N/A', rearPSI: 'N/A',
    oemSizes: ['N/A — no road wheels'], lugNutTorque: 'N/A'
  },
  bulbs: {
    lowBeam: 'N/A', highBeam: 'N/A', frontTurn: 'N/A', rearTurn: 'N/A',
    tailBrake: 'N/A', interior: 'N/A', license: 'N/A'
  },
  obd2Location: diagnosticLocation,
  note: engineDescription + '. Hour-based service intervals (e.g., 250/500 hr). No OBD-II — manufacturer diagnostic software (CAT ET, Cummins Insite, Yanmar) over the marine CAN data link.'
});

const polarisSpec = (engineDescription, oilViscosity, oilCapacity, frontPSI, rearPSI, oemSizes, lugNutTorque) => ({
  engine: {
    oilViscosity,
    oilCapacity,
    oilFilterPN: "Consult owner's manual (OEM Polaris oil filter)",
    coolantType: 'Polaris 50/50 premixed antifreeze (OEM coolant; standard ethylene-glycol 50/50 acceptable)',
    coolantCapacity: "Consult owner's manual"
  },
  transmission: {
    fluidType: 'Polaris PVT is belt-driven (no transmission fluid); oil-filled gearbox/gearcase uses Polaris Demand Drive Plus',
    capacity: "Consult owner's manual",
    note: 'PVT (Polaris Variable Transmission) belt primary drive — inspect/replace the belt per the manual; no ATF-style transmission fluid on most models.'
  },
  transferCase: null,
  differentials: {
    front: {
      fluidType: 'Polaris Demand Drive Plus (synthetic 75W-90 gear lube) — front gearcase (on-demand AWD)',
      capacity: "Consult owner's manual",
      note: 'Equivalents: synthetic 75W-90 GL-5 gear oil.'
    },
    rear: {
      fluidType: 'Polaris Demand Drive Plus (synthetic 75W-90 gear lube) — rear gearcase; Demand Drive HD (75W-140) for heavy-duty use',
      capacity: "Consult owner's manual",
      note: 'Equivalents: 75W-90 synthetic GL-5; Polaris Demand Drive (non-synthetic 80W-90) on some models.'
    }
  },
  brakeFluid: 'DOT 4',
  tires: { frontPSI, rearPSI, oemSizes, lugNutTorque },
  bulbs: {
    lowBeam: 'LED (most current models) / halogen per trim — Consult owner\'s manual',
    highBeam: 'LED / halogen per trim — Consult owner\'s manual',
    frontTurn: 'LED / halogen per trim — Consult owner\'s manual',
    rearTurn: 'LED / halogen per trim — Consult owner\'s manual',
    tailBrake: 'LED (most current models) — Consult owner\'s manual',
    interior: 'N/A', license: 'N/A'
  },
  obd2Location: 'No standard OBD-II. Polaris Digital Wrench diagnostic connector under the dash/seat area (dealer tool).',
  note: engineDescription + '. Mileage-based service intervals (e.g., 100 mi break-in, then 500-1000 mi).'
});

const wave6Specs = {
  'yamaha': {
    'vx': {
      '2005-2018': yamahaPwcSpec('Yamaha WaveRunner VX Cruiser / VX Deluxe / VX Limited — TR-1 1.0L 3-cylinder 4-stroke', 'Yamalube 4W 10W-40'),
      '2019-2026': yamahaPwcSpec('Yamaha WaveRunner VX Cruiser / VX Deluxe / VX Limited — TR-1 HO 1.0L 3-cylinder 4-stroke', 'Yamalube 4W 10W-40')
    },
    'vx-c': {
      '2019-2026': yamahaPwcSpec('Yamaha WaveRunner VX-C — TR-1 1.0L 3-cylinder 4-stroke; regular unleaded (87 octane)', 'Yamalube 4W 10W-40')
    },
    'vx limited ho': {
      '2019-2026': yamahaPwcSpec('Yamaha WaveRunner VX Limited HO — 1.8L HO 4-stroke; premium recommended (91 octane)', 'Yamalube 4W 10W-40')
    },
    'fx ho': {
      '2005-2019': yamahaPwcSpec('Yamaha WaveRunner FX HO / FX Cruiser HO — MR-1 1.0L 4-cylinder 4-stroke', 'Yamalube 4W 10W-40'),
      '2020-2026': yamahaPwcSpec('Yamaha WaveRunner FX HO / FX Cruiser HO — 1.8L HO 4-stroke', 'Yamalube 4W 10W-40')
    },
    'fx svho': {
      '2014-2026': yamahaPwcSpec('Yamaha WaveRunner FX SVHO — 1.8L supercharged 4-stroke', 'Yamalube 4W 10W-40')
    },
    'gp1800': {
      '2017-2026': yamahaPwcSpec('Yamaha WaveRunner GP1800R — 1.8L supercharged (SVHO / GP HO variants)', 'Yamalube 4W 10W-40')
    },
    'gp1300r': {
      '2005-2008': yamahaPwcSpec('Yamaha WaveRunner GP1300R — 1.3L 2-stroke', 'Yamalube 2W 2-stroke oil')
    },
    'ex': {
      '2017-2026': yamahaPwcSpec('Yamaha WaveRunner EX / EX Sport / EX Deluxe — TR-1 1.0L 3-cylinder 4-stroke', 'Yamalube 4W 10W-40')
    },
    'f25': {
      '2006-2026': marineOutboardSpec('Yamaha F25 — 25 hp 3-cylinder 4-stroke (early carbureted, later EFI)',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.')
    },
    'f70': {
      '2009-2026': marineOutboardSpec('Yamaha F70 — 70 hp 4-stroke (F70/F60 shared platform)',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.')
    },
    'f115': {
      '2005-2019': marineOutboardSpec('Yamaha F115 — 115 hp 4-cylinder 4-stroke (1.8L)',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.'),
      '2020-2026': marineOutboardSpec('Yamaha F115 — 115 hp 4-stroke, redesigned generation (2020+)',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.')
    },
    'f150': {
      '2005-2019': marineOutboardSpec('Yamaha F150 — 150 hp V6 4-stroke',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.'),
      '2020-2026': marineOutboardSpec('Yamaha F150 — 150 hp 4-stroke, redesigned generation (2020+)',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.')
    },
    'f200': {
      '2005-2019': marineOutboardSpec('Yamaha F200 — 200 hp V6 4-stroke',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.'),
      '2020-2026': marineOutboardSpec('Yamaha F200 — 200 hp 4-stroke, redesigned generation (2020+)',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.')
    },
    'f250': {
      '2005-2015': marineOutboardSpec('Yamaha F250 — 250 hp V6 4-stroke (earlier generation)',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.'),
      '2016-2026': marineOutboardSpec('Yamaha F250 — 250 hp V6 4-stroke (4.2L, redesigned 2016)',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.')
    },
    'f300': {
      '2016-2026': marineOutboardSpec('Yamaha F300 — 300 hp V6 4-stroke (4.2L, launched 2016)',
        'Yamalube 4M or NMMA FC-W certified 4-stroke outboard oil, SAE 10W-30 (20W-40 per manual in warm climates)',
        'Yamalube Marine Gearcase Lube / OEM gearcase lube (SAE 80W-90 class)',
        'Yamaha diagnostic connector under the cowl — dealer YDIS/CLOM software; no OBD-II port.')
    }
  },
  'mercury': {
    '40 fourstroke': {
      '2005-2018': marineOutboardSpec('Mercury 40 FourStroke — 40 hp 3-cylinder 4-stroke',
        'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
        'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
        'Mercury SmartCraft / diagnostic connector under the cowl — dealer software; no OBD-II port.'),
      '2019-2026': marineOutboardSpec('Mercury 40 FourStroke — 40 hp 4-stroke, redesigned 40-60 hp family (2019+)',
        'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
        'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
        'Mercury SmartCraft / diagnostic connector under the cowl — dealer software; no OBD-II port.')
    },
    '75 fourstroke': {
      '2005-2018': marineOutboardSpec('Mercury 75 FourStroke — 75 hp 4-stroke',
        'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
        'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
        'Mercury SmartCraft / diagnostic connector under the cowl — dealer software; no OBD-II port.'),
      '2019-2026': marineOutboardSpec('Mercury 75 FourStroke — 75 hp 4-stroke, redesigned 75-115 hp family (2019+)',
        'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
        'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
        'Mercury SmartCraft / diagnostic connector under the cowl — dealer software; no OBD-II port.')
    },
    '90 fourstroke': {
      '2005-2018': marineOutboardSpec('Mercury 90 FourStroke — 90 hp 4-stroke',
        'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
        'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
        'Mercury SmartCraft / diagnostic connector under the cowl — dealer software; no OBD-II port.'),
      '2019-2026': marineOutboardSpec('Mercury 90 FourStroke — 90 hp 4-stroke, redesigned 75-115 hp family (2019+)',
        'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
        'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
        'Mercury SmartCraft / diagnostic connector under the cowl — dealer software; no OBD-II port.')
    },
    '115 pro xs': {
      '2015-2026': marineOutboardSpec('Mercury 115 Pro XS — 115 hp high-output 4-stroke (redesigned family from ~2019)',
        'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
        'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
        'Mercury SmartCraft / diagnostic connector under the cowl — dealer software; no OBD-II port.')
    },
    '150 fourstroke': {
      '2018-2026': marineOutboardSpec('Mercury 150 FourStroke — 150 hp 4-stroke V6 (current-generation 3.0L V6 family, 2018+)',
        'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
        'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
        'Mercury SmartCraft / diagnostic connector under the cowl — dealer software; no OBD-II port.')
    },
    '250 verado': {
      '2005-2010': marineOutboardSpec('Mercury 250 Verado — 250 hp supercharged 2.6L inline-6',
        'Mercury 4-Stroke Outboard Oil SAE 10W-30 (FC-W) — Verado spec, tighter change intervals for supercharged duty',
        'Mercury High Performance Gear Lube (SAE 80W-90; synthetic 75W-90 for heavy duty)',
        'Mercury SmartCraft CAN diagnostic connector under the cowl — dealer software; no OBD-II port.'),
      '2011-2026': marineOutboardSpec('Mercury 250 Verado — 250 hp supercharged 3.4L V6 (redesigned 2011+)',
        'Mercury 4-Stroke Outboard Oil SAE 10W-30 (FC-W) — Verado spec, tighter change intervals for supercharged duty',
        'Mercury High Performance Gear Lube (SAE 80W-90; synthetic 75W-90 for heavy duty)',
        'Mercury SmartCraft CAN diagnostic connector under the cowl — dealer software; no OBD-II port.')
    },
    '300 verado': {
      '2015-2026': marineOutboardSpec('Mercury 300 Verado — 300 hp 4.6L V8 (launched 2015)',
        'Mercury 4-Stroke Outboard Oil SAE 10W-30 (FC-W) — Verado spec, tighter change intervals for supercharged duty',
        'Mercury High Performance Gear Lube (SAE 80W-90; synthetic 75W-90 for heavy duty)',
        'Mercury SmartCraft CAN diagnostic connector under the cowl — dealer software; no OBD-II port.')
    },
    '350 verado': {
      '2015-2026': marineOutboardSpec('Mercury 350 Verado — 350 hp supercharged 4.6L V8 (launched 2015)',
        'Mercury 4-Stroke Outboard Oil SAE 10W-30 (FC-W) — Verado spec, tighter change intervals for supercharged duty',
        'Mercury High Performance Gear Lube (SAE 80W-90; synthetic 75W-90 for heavy duty)',
        'Mercury SmartCraft CAN diagnostic connector under the cowl — dealer software; no OBD-II port.')
    }
  },
  'sea-doo': {
    'spark': {
      '2014-2026': pwcSpec('Sea-Doo Spark — Rotax 900 ACE 3-cylinder (60/90 hp), launched 2014',
        'BRP XPS 4-stroke synthetic 5W-40 (Rotax ACE spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'N/A — Spark has no hydraulic brake',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.')
    },
    'gti': {
      '2005-2011': pwcSpec('Sea-Doo GTI — Rotax 4-TEC 155 (1503cc), GTI SE 2010-2011',
        'BRP XPS 4-stroke synthetic 5W-40 (4-TEC spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) on iBR-equipped models; N/A otherwise',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.'),
      '2016-2026': pwcSpec('Sea-Doo GTI — Rotax 1630 ACE 3-cylinder (130/155/170 hp), relaunched 2016',
        'BRP XPS 4-stroke synthetic 5W-40 (1630 ACE spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) on iBR-equipped models; N/A otherwise',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.')
    },
    'gtx': {
      '2005-2013': pwcSpec('Sea-Doo GTX — Rotax 4-TEC (155/215/255 hp)',
        'BRP XPS 4-stroke synthetic 5W-40 (4-TEC spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) — iBR hydraulic brake',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.'),
      '2014-2019': pwcSpec('Sea-Doo GTX — 4-TEC 215/260, then 1630 ACE 300 from 2017',
        'BRP XPS 4-stroke synthetic 5W-40 (4-TEC, then 1630 ACE spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) — iBR hydraulic brake',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.'),
      '2020-2026': pwcSpec('Sea-Doo GTX — redesigned hull, Rotax 1630 ACE (170/230/300 hp)',
        'BRP XPS 4-stroke synthetic 5W-40 (1630 ACE spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) — iBR hydraulic brake',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.')
    },
    'rxp': {
      '2005-2008': pwcSpec('Sea-Doo RXP — Rotax 4-TEC 215/255 supercharged',
        'BRP XPS 4-stroke synthetic 5W-40 (4-TEC spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) — iBR hydraulic brake',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.'),
      '2009-2019': pwcSpec('Sea-Doo RXP-X — 4-TEC 255 supercharged, then 1630 ACE 300',
        'BRP XPS 4-stroke synthetic 5W-40 (4-TEC, then 1630 ACE spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) — iBR hydraulic brake',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.'),
      '2020-2026': pwcSpec('Sea-Doo RXP-X — redesigned, Rotax 1630 ACE (300/325 hp)',
        'BRP XPS 4-stroke synthetic 5W-40 (1630 ACE spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) — iBR hydraulic brake',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.')
    },
    'rxt': {
      '2005-2009': pwcSpec('Sea-Doo RXT — Rotax 4-TEC 215 supercharged',
        'BRP XPS 4-stroke synthetic 5W-40 (4-TEC spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) — iBR hydraulic brake',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.'),
      '2010-2019': pwcSpec('Sea-Doo RXT-X — 4-TEC 260, then 1630 ACE 300',
        'BRP XPS 4-stroke synthetic 5W-40 (4-TEC, then 1630 ACE spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) — iBR hydraulic brake',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.'),
      '2020-2026': pwcSpec('Sea-Doo RXT-X — redesigned, Rotax 1630 ACE 300',
        'BRP XPS 4-stroke synthetic 5W-40 (1630 ACE spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) — iBR hydraulic brake',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.')
    },
    'fish pro': {
      '2021-2026': pwcSpec('Sea-Doo Fish Pro — Rotax 1630 ACE (130/170 hp), launched 2021',
        'BRP XPS 4-stroke synthetic 5W-40 (1630 ACE spec)',
        'BRP XPS premixed coolant (closed-loop, 50/50 ethylene glycol)',
        'DOT 4 (BRP XPS DOT 4) — iBR hydraulic brake (170 hp)',
        'BRP B.U.D.S. diagnostic via the DESS post / MPEM connector under the seat; no OBD-II.')
    }
  },
  'kawasaki': {
    'stx': {
      '2005-2008': pwcSpec('Kawasaki Jet Ski STX-12F / STX-160 — 1.2L 4-cylinder',
        'Kawasaki Performance 4-cycle oil, SAE 10W-40 (API SL/SM/SN)',
        'Kawasaki Super Long Life Coolant (closed-loop, premixed)',
        'N/A — no hydraulic brake (jet pump reverse)',
        'Kawasaki Diagnostic System (KDS) connector under the seat; no OBD-II.'),
      '2010-2026': pwcSpec('Kawasaki Jet Ski STX-15F — 1498cc 4-cylinder (160 hp)',
        'Kawasaki Performance 4-cycle oil, SAE 10W-40 (API SL/SM/SN)',
        'Kawasaki Super Long Life Coolant (closed-loop, premixed)',
        'N/A — no hydraulic brake (jet pump reverse)',
        'Kawasaki Diagnostic System (KDS) connector under the seat; no OBD-II.')
    },
    'ultra 310': {
      '2014-2026': pwcSpec('Kawasaki Jet Ski Ultra 310X/310LX — 1498cc supercharged 4-cylinder (310 hp)',
        'Kawasaki Performance 4-cycle oil, SAE 10W-40 (API SL/SM/SN)',
        'Kawasaki Super Long Life Coolant (closed-loop, premixed)',
        'N/A — no hydraulic brake (jet pump reverse)',
        'Kawasaki Diagnostic System (KDS) connector under the seat; no OBD-II.')
    }
  },
  'caterpillar': {
    'c7': {
      '2005-2012': { ...marineDieselSpec('CAT C7 — 7.2L inline-6 marine diesel (350-450 hp ratings)',
        '15W-40 (CAT ECF-1-a / API CJ-4 — CAT DEO or equivalent)',
        "Consult owner's manual (oil pan option dependent; ~30 qt typical)",
        'CAT Electronic Technician (ET) via the ECM data link connector near the engine/helm; no OBD-II.'), serviceUnit: 'hrs' }
    },
    'c12': {
      '2005-2008': marineDieselSpec('CAT C12 — 12L inline-6 marine diesel (up to 825 hp ratings)',
        '15W-40 (CAT ECF-1-a / API CJ-4 — CAT DEO or equivalent)',
        "Consult owner's manual (oil pan option dependent; ~40 qt typical)",
        'CAT Electronic Technician (ET) via the ECM data link connector near the engine/helm; no OBD-II.')
    },
    'c18': {
      '2005-2026': marineDieselSpec('CAT C18 — 18.1L inline-6 ACERT marine diesel (up to 1000 hp ratings)',
        '15W-40 (CAT ECF-1-a / API CJ-4 — CAT DEO or equivalent)',
        "Consult owner's manual (oil pan option dependent; ~52 qt typical)",
        'CAT Electronic Technician (ET) via the ECM data link connector near the engine/helm; no OBD-II.')
    },
    'c32': {
      '2005-2026': marineDieselSpec('CAT C32 — 32.1L V12 marine diesel (1000-2000 hp ratings)',
        '15W-40 (CAT ECF-1-a / API CJ-4 — CAT DEO or equivalent)',
        "Consult owner's manual (oil pan option dependent; ~130 qt typical)",
        'CAT Electronic Technician (ET) via the ECM data link connector near the engine/helm; no OBD-II.')
    }
  },
  'cummins': {
    'qsb 6.7': {
      '2007-2026': marineDieselSpec('Cummins QSB6.7 — 6.7L inline-6 common-rail marine diesel (230-550 hp ratings)',
        '15W-40 (Cummins CES 20081 / API CJ-4 — Fleetguard ES or equivalent)',
        'approx 14 qt (verify oil pan option in manual)',
        'Cummins Insite via the CAN data link connector on the OEM harness near the engine; no OBD-II.')
    },
    'qsc 8.3': {
      '2007-2018': marineDieselSpec('Cummins QSC8.3 — 8.3L inline-6 marine diesel (up to 550 hp ratings)',
        '15W-40 (Cummins CES 20081 / API CJ-4 — Fleetguard ES or equivalent)',
        'approx 16 qt (verify oil pan option in manual)',
        'Cummins Insite via the CAN data link connector on the OEM harness near the engine; no OBD-II.')
    },
    'qsm11': {
      '2005-2015': marineDieselSpec('Cummins QSM11 — 11L inline-6 marine diesel (up to 715 hp ratings)',
        '15W-40 (Cummins CES 20081 / API CJ-4 — Fleetguard ES or equivalent)',
        'approx 30 qt (verify oil pan option in manual)',
        'Cummins Insite via the CAN data link connector on the OEM harness near the engine; no OBD-II.')
    },
    'kta19': {
      '2005-2026': marineDieselSpec('Cummins KTA19 — 19L inline-6 marine diesel (600-800 hp ratings)',
        '15W-40 (Cummins CES 20081 / API CI-4/CJ-4 — Fleetguard ES or equivalent)',
        'approx 64 qt (verify oil pan option in manual)',
        'Cummins Insite via the CAN data link connector on the OEM harness near the engine; no OBD-II.')
    }
  },
  'yanmar': {
    '4jh': {
      '2005-2011': marineDieselSpec('Yanmar 4JH3E — 4-cylinder marine diesel (2.2L, ~40-54 hp)',
        '15W-40 (API CF-4/CG-4/CH-4 — Yanmar Marine Engine Oil or equivalent)',
        "Consult owner's manual",
        'Yanmar — no OBD-II; check engine/ECS panel alarms; dealer diagnostics via CAN where fitted.'),
      '2012-2026': marineDieselSpec('Yanmar 4JH40/45/57 — 4-cylinder marine diesel (2.2L, 39-57 hp)',
        '15W-40 (API CF-4/CG-4/CH-4/CJ-4 — Yanmar Marine Engine Oil or equivalent)',
        "Consult owner's manual",
        'Yanmar — no OBD-II; check engine/ECS panel alarms; dealer diagnostics via CAN where fitted.')
    },
    '6ly': {
      '2005-2026': marineDieselSpec('Yanmar 6LY/6LY2/6LY3 — 6-cylinder marine diesel (8.1L, up to 440 hp ratings)',
        '15W-40 (API CF-4/CG-4/CH-4/CJ-4 — Yanmar Marine Engine Oil or equivalent)',
        "Consult owner's manual",
        'Yanmar — no OBD-II; check engine/ECS panel alarms; dealer diagnostics via CAN where fitted.')
    },
    '6cx': {
      '2005-2026': marineDieselSpec('Yanmar 6CX-GT/GTE — 6-cylinder marine diesel (480-600 hp ratings)',
        '15W-40 (API CF-4/CG-4/CH-4/CJ-4 — Yanmar Marine Engine Oil or equivalent)',
        "Consult owner's manual",
        'Yanmar — no OBD-II; check engine/ECS panel alarms; dealer diagnostics via CAN where fitted.')
    },
    '8lv': {
      '2014-2026': marineDieselSpec('Yanmar 8LV — 8.9L V8 common-rail marine diesel (250-440 hp ratings)',
        '15W-40 (API CJ-4 — Yanmar original or equivalent)',
        "Consult owner's manual",
        'Yanmar — no OBD-II; check engine/ECS panel alarms; dealer diagnostics via CAN where fitted.')
    }
  },
  'polaris': {
    'sportsman 570': {
      '2014-2026': polarisSpec('Polaris Sportsman 570 — 567cc single-cylinder ProStar (44 hp)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        'approx 2 qt (verify in manual)',
        7, 7, ['26x8-12 front / 26x10-12 rear (common)'], 55)
    },
    'sportsman 850': {
      '2016-2026': polarisSpec('Polaris Sportsman 850 — 850cc twin-cylinder ProStar (78 hp)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        'approx 2 qt (verify in manual)',
        7, 7, ["Consult owner's manual (27x9-12 front / 27x11-12 rear typical)"], 55)
    },
    'rzr 1000': {
      '2014-2026': polarisSpec('Polaris RZR XP 1000 — 999cc twin-cylinder ProStar (100 hp)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        "Consult owner's manual",
        15, 15, ['29x9-14 front / 29x11-14 rear (XP 1000)'], 80)
    },
    'rzr turbo r': {
      '2022-2026': polarisSpec('Polaris RZR Turbo R — 225 hp turbocharged ProStar engine (launched 2022)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        "Consult owner's manual",
        15, 15, ['32x10-15 front / 32x12-15 rear (Turbo R)'], 80)
    },
    'general 1000': {
      '2016-2026': polarisSpec('Polaris General 1000 — 999cc twin-cylinder ProStar (100 hp), launched 2016',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        "Consult owner's manual",
        15, 15, ['30x9-14 front / 30x11-14 rear (typical)'], 80)
    },
    'ranger 1000': {
      '2014-2026': polarisSpec('Polaris Ranger XP 1000 — 999cc twin-cylinder ProStar (100 hp)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        "Consult owner's manual",
        15, 15, ['27x9-12 front / 27x11-12 rear (typical)'], 80)
    }
  }
};
// Wave 7 — agricultural equipment and industrial forklifts.
const agSpec = (engineDescription, oilViscosity, hydraulicFluid, fourWheelDrive = true) => ({
  engine: {
    oilViscosity,
    oilCapacity: "Consult owner's manual",
    oilFilterPN: "Consult owner's manual (OEM filter)",
    coolantType: 'Long-life ethylene-glycol diesel coolant (Kubota/Yanmar/John Deere OEM specification; verify SCA requirements)',
    coolantCapacity: "Consult owner's manual"
  },
  transmission: {
    fluidType: hydraulicFluid,
    capacity: "Consult owner's manual",
    note: 'Shared tractor hydraulic/transmission reservoir; use the manufacturer-specified UTF/J20C/J20D or equivalent only.'
  },
  transferCase: null,
  differentials: {
    front: fourWheelDrive ? { fluidType: 'Manufacturer-specified front axle gear oil', capacity: "Consult owner's manual", note: '4WD/front axle models only; 2WD models: N/A.' } : null,
    rear: fourWheelDrive ? { fluidType: 'Manufacturer-specified rear axle gear oil', capacity: "Consult owner's manual", note: '4WD/drive-axle models only; verify axle configuration.' } : null
  },
  brakeFluid: 'N/A — wet hydraulic tractor brakes; no automotive brake-fluid reservoir',
  tires: { frontPSI: 'Consult owner\'s manual', rearPSI: 'Consult owner\'s manual', oemSizes: ['Consult owner\'s manual'], lugNutTorque: "Consult owner's manual" },
  bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'N/A', license: 'N/A' },
  obd2Location: 'No OBD-II. Manufacturer diagnostic connector/service port near the instrument panel or ECU; consult dealer manual.',
  serviceUnit: 'hrs',
  note: engineDescription + '. Hour-based maintenance intervals; verify exact interval and fluid capacity in the model-year operator manual.'
});
const forkliftSpec = (engineDescription, fuel, hydraulicFluid = 'Hyster-approved hydraulic fluid') => ({
  engine: {
    oilViscosity: fuel === 'electric' ? 'N/A — electric traction motor' : '15W-40 diesel engine oil (or OEM viscosity by ambient temperature)',
    oilCapacity: fuel === 'electric' ? 'N/A' : "Consult owner's manual",
    oilFilterPN: fuel === 'electric' ? 'N/A' : "Consult owner's manual",
    coolantType: fuel === 'electric' ? 'N/A — air-cooled electric drive components' : 'Heavy-duty ethylene-glycol diesel coolant; verify OEM specification',
    coolantCapacity: fuel === 'electric' ? 'N/A' : "Consult owner's manual",
    battery: fuel === 'electric' ? { type: 'Industrial lead-acid traction battery', voltage: "Consult owner's manual (24/36/48 V configuration varies)", capacity: "Consult owner's manual (Ah rating varies by truck/battery compartment)" } : { type: '12 V industrial starting battery', voltage: '12 V', capacity: "Consult owner's manual" }
  },
  transmission: { fluidType: fuel === 'electric' ? 'N/A — electric traction drive' : 'Powershift transmission fluid / axle oil per Hyster specification', capacity: fuel === 'electric' ? 'N/A' : "Consult owner's manual", note: 'Industrial drivetrain; not a conventional automotive transmission service.' },
  transferCase: null,
  differentials: { front: null, rear: { fluidType: 'Drive axle gear oil per Hyster specification', capacity: "Consult owner's manual" } },
  brakeFluid: 'N/A — wet-disc/service brake system; no automotive DOT-fluid reservoir',
  tires: { frontPSI: "Consult owner's manual", rearPSI: "Consult owner's manual", oemSizes: ['Consult owner\'s manual'], lugNutTorque: "Consult owner's manual" },
  bulbs: { lowBeam: 'N/A — work lights; consult manual', highBeam: 'N/A', frontTurn: 'N/A', rearTurn: 'N/A', tailBrake: 'N/A', interior: 'N/A', license: 'N/A' },
  obd2Location: 'No OBD-II. Hyster truck diagnostic connector near the instrument panel/service access area; use Hyster service tool.',
  hydraulicSystem: { fluidType: hydraulicFluid, capacity: "Consult owner's manual" },
  serviceUnit: 'hrs',
  note: engineDescription + '. Hour-based maintenance; lift hydraulics use dedicated hydraulic fluid. Consult the truck serial-number manual for capacities.'
});
const wave7Specs = {
  kubota: {},
  'yanmar tractor': {},
  'john deere': {},
  hyster: {},
  'hyster electric': {}
};
for (const model of ['l3301', 'l3901', 'l4701']) {
  wave7Specs.kubota[model] = { '2005-2013': agSpec('Kubota L Series — diesel compact utility tractor', '15W-40 diesel oil', 'Kubota Super UDT2 or equivalent UTF'), '2014-2026': agSpec('Kubota L Series — diesel compact utility tractor', '15W-40 diesel oil', 'Kubota Super UDT2 or equivalent UTF') };
}
for (const model of ['m5', 'm6', 'm7']) {
  wave7Specs.kubota[model] = { '2005-2013': agSpec('Kubota M Series — diesel utility/agricultural tractor', '15W-40 diesel oil', 'Kubota Super UDT2 or equivalent UTF'), '2014-2026': agSpec('Kubota M Series — diesel utility/agricultural tractor', '15W-40 diesel oil', 'Kubota Super UDT2 or equivalent UTF') };
}
for (const model of ['bx1880', 'bx2380', 'bx2680']) {
  wave7Specs.kubota[model] = { '2005-2013': agSpec('Kubota BX Series — diesel sub-compact tractor', '15W-40 diesel oil', 'Kubota Super UDT2 or equivalent UTF'), '2014-2026': agSpec('Kubota BX Series — diesel sub-compact tractor', '15W-40 diesel oil', 'Kubota Super UDT2 or equivalent UTF') };
}
for (const model of ['yt235', 'yt347', 'yt359']) {
  wave7Specs['yanmar tractor'][model] = { '2005-2015': agSpec('Yanmar YT Series — diesel compact tractor', '15W-40 diesel oil', 'Yanmar UDT or equivalent UTF'), '2016-2026': agSpec('Yanmar YT Series — diesel compact tractor', '15W-40 diesel oil', 'Yanmar UDT or equivalent UTF') };
}
for (const model of ['sa223', 'sa325', 'sa425']) {
  wave7Specs['yanmar tractor'][model] = { '2005-2015': agSpec('Yanmar SA Series — diesel compact tractor', '15W-40 diesel oil', 'Yanmar UDT or equivalent UTF'), '2016-2026': agSpec('Yanmar SA Series — diesel compact tractor', '15W-40 diesel oil', 'Yanmar UDT or equivalent UTF') };
}
for (const model of ['3032e', '3038e']) wave7Specs['john deere'][model] = { '2005-2012': agSpec('John Deere 3 Series — diesel compact utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard'), '2013-2026': agSpec('John Deere 3 Series — diesel compact utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') };
for (const model of ['4044m', '4066m']) wave7Specs['john deere'][model] = { '2015-2020': agSpec('John Deere 4M Series — diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard'), '2021-2026': agSpec('John Deere 4M Series — diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') };
for (const model of ['5075e', '5100e']) wave7Specs['john deere'][model] = { '2005-2016': agSpec('John Deere 5E Series — diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard'), '2017-2026': agSpec('John Deere 5E Series — diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') };
for (const model of ['6110m', '6140m']) wave7Specs['john deere'][model] = { '2012-2019': agSpec('John Deere 6M Series — diesel row-crop/utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard'), '2020-2026': agSpec('John Deere 6M Series — diesel row-crop/utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') };
for (const model of ['h40-60ft', 'h70-110ft', 's40-70ft', 'h50ct']) wave7Specs.hyster[model] = { '2005-2014': forkliftSpec('Hyster internal-combustion counterbalanced forklift — diesel/LP configuration varies by model', 'diesel/LP'), '2015-2026': forkliftSpec('Hyster internal-combustion counterbalanced forklift — diesel/LP configuration varies by model', 'diesel/LP') };
for (const model of ['j30-40xnt', 'e30-50xn']) wave7Specs['hyster electric'][model] = { '2005-2014': forkliftSpec('Hyster electric forklift — lead-acid traction battery; voltage/capacity varies by truck configuration', 'electric'), '2015-2026': forkliftSpec('Hyster electric forklift — lead-acid traction battery; voltage/capacity varies by truck configuration', 'electric') };
for (const [make, models] of Object.entries(wave7Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}

// Common model-name aliases (user-typed / VPIC-style variants).
wave6Specs.yamaha['f 115'] = wave6Specs.yamaha.f115; wave6Specs.yamaha['f 150'] = wave6Specs.yamaha.f150;
wave6Specs.yamaha['f 200'] = wave6Specs.yamaha.f200; wave6Specs.yamaha['f 250'] = wave6Specs.yamaha.f250;
wave6Specs.mercury['40 four stroke'] = wave6Specs.mercury['40 fourstroke'];
wave6Specs.mercury['75 four stroke'] = wave6Specs.mercury['75 fourstroke'];
wave6Specs.mercury['90 four stroke'] = wave6Specs.mercury['90 fourstroke'];
wave6Specs.mercury['150 four stroke'] = wave6Specs.mercury['150 fourstroke'];
wave6Specs.kawasaki['stx-15f'] = wave6Specs.kawasaki.stx; wave6Specs.kawasaki['stx-12f'] = wave6Specs.kawasaki.stx;
wave6Specs.kawasaki['ultra 310x'] = wave6Specs.kawasaki['ultra 310']; wave6Specs.kawasaki['ultra 310lx'] = wave6Specs.kawasaki['ultra 310'];
wave6Specs.cat = wave6Specs.caterpillar;
wave6Specs.caterpillar['c-7'] = wave6Specs.caterpillar.c7; wave6Specs.caterpillar['c-12'] = wave6Specs.caterpillar.c12;
wave6Specs.caterpillar['c-18'] = wave6Specs.caterpillar.c18; wave6Specs.caterpillar['c-32'] = wave6Specs.caterpillar.c32;
wave6Specs.cummins['qsb6.7'] = wave6Specs.cummins['qsb 6.7'];
wave6Specs.cummins['qsc8.3'] = wave6Specs.cummins['qsc 8.3'];
wave6Specs.yanmar['4jh40'] = wave6Specs.yanmar['4jh']; wave6Specs.yanmar['4jh45'] = wave6Specs.yanmar['4jh'];
wave6Specs.yanmar['4jh57'] = wave6Specs.yanmar['4jh']; wave6Specs.yanmar['4jh3e'] = wave6Specs.yanmar['4jh'];
wave6Specs.yanmar['6ly2'] = wave6Specs.yanmar['6ly']; wave6Specs.yanmar['6ly3'] = wave6Specs.yanmar['6ly'];
wave6Specs.yanmar['6cx-gt'] = wave6Specs.yanmar['6cx'];
wave6Specs.yanmar['8lv250'] = wave6Specs.yanmar['8lv']; wave6Specs.yanmar['8lv320'] = wave6Specs.yanmar['8lv'];
wave6Specs.yanmar['8lv370'] = wave6Specs.yanmar['8lv']; wave6Specs.yanmar['8lv440'] = wave6Specs.yanmar['8lv'];
wave6Specs.polaris['rzr xp 1000'] = wave6Specs.polaris['rzr 1000'];
wave6Specs.polaris['ranger xp 1000'] = wave6Specs.polaris['ranger 1000'];
wave6Specs.polaris['sportsman 570 touring'] = wave6Specs.polaris['sportsman 570'];
wave6Specs.polaris['sportsman 850 high lifter'] = wave6Specs.polaris['sportsman 850'];
for (const [make, models] of Object.entries(wave6Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) {
    referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
  }
}


// Wave 8: heavy trucks and recreational vehicles. OEM manuals vary by engine,
// axle ratio, coach builder and chassis GVWR; values shown as ranges are
// representative service references and intentionally defer uncertain values.
const consult = "Consult owner's manual";
const semiSpec = (engine, oil, transmission, years, sparkPlugs = SPARK_PLUG_DEFAULT) => ({
  sparkPlugs: { ...sparkPlugs },
  engine: { oilViscosity: oil, oilCapacity: 'Consult owner\'s manual (engine/filter configuration)', oilFilterPN: consult, coolantType: 'Fleetguard Compleat OAT / OEM-approved heavy-duty ELC', coolantCapacity: consult, fuelType: 'Diesel' },
  transmission: { fluidType: transmission, capacity: consult }, transferCase: null,
  differentials: { front: null, rear: { fluidType: 'SAE 75W-90 or 80W-90 API GL-5 drive-axle gear oil', capacity: consult } },
  brakeFluid: 'N/A — full air brake system; no traditional brake-fluid reservoir',
  tires: { frontPSI: consult, rearPSI: consult, oemSizes: [consult], lugNutTorque: consult },
  bulbs: { lowBeam: consult, highBeam: consult, frontTurn: consult, rearTurn: consult, tailBrake: consult, interior: consult, license: consult },
  obd2Location: 'No OBD-II. OEM diagnostic connector (9-pin/16-pin J1939) typically beneath instrument panel or near driver seat; use OEM service tool.',
  note: `${engine}; model/chassis configuration and axle ratio determine capacities. Service by VIN/build sheet.`, serviceUnit: 'mi', modelYears: years
});
const rvSpec = (engine, oil, transmission, generator, years, sparkPlugs = SPARK_PLUG_DEFAULT) => ({
  sparkPlugs: { ...sparkPlugs },
  engine: { oilViscosity: oil, oilCapacity: consult, oilFilterPN: consult, coolantType: engine.includes('diesel') ? 'Fleetguard Compleat OAT / OEM-approved diesel ELC' : 'Motorcraft or Dex-Cool coolant per chassis manual', coolantCapacity: consult, fuelType: engine.includes('diesel') ? 'Diesel' : 'Gasoline' },
  transmission: { fluidType: transmission, capacity: consult }, transferCase: consult,
  differentials: { front: null, rear: { fluidType: 'Chassis axle gear oil per Ford/GM/Mercedes manual', capacity: consult } },
  brakeFluid: 'DOT 3 or DOT 4 on hydraulic chassis; diesel coach air-brake variants: N/A — full air system',
  tires: { frontPSI: consult, rearPSI: consult, oemSizes: [consult], lugNutTorque: consult },
  bulbs: { lowBeam: consult, highBeam: consult, frontTurn: consult, rearTurn: consult, tailBrake: consult, interior: consult, license: consult },
  obd2Location: 'Chassis diagnostic connector under driver-side dash on modern Ford/GM/Mercedes platforms; older motorhome chassis may have proprietary connector. Coach systems are not OBD-II.',
  generator: { oilType: generator, capacity: consult },
  note: `${engine}; chassis and coach-builder options change fluids, tire pressures and torque. Verify both chassis and coach manuals.`, serviceUnit: 'mi', modelYears: years
});
const wave8Specs = { freightliner: {}, kenworth: {}, peterbilt: {}, mack: {}, international: {}, 'volvo trucks': {}, 'western star': {}, winnebago: {}, thor: {}, jayco: {}, airstream: {}, newmar: {}, 'forest river': {}, 'grand design': {} };
const semiModels = {
  freightliner: { cascadia: ['Detroit DD13/DD15/DD16', '15W-40 CJ-4/CK-4 diesel oil', 'Eaton Fuller manual / Detroit DT12 AMT'], 'm2 106': ['Detroit DD5/DD8 or Cummins B6.7', '15W-40 CK-4 diesel oil', 'Allison automatic / Eaton Fuller manual'], '114sd': ['Detroit DD13 or Cummins X12', '15W-40 CK-4 diesel oil', 'Allison automatic / Eaton Fuller manual'], columbia: ['Detroit Series 60 / MBE 4000', '15W-40 diesel oil', 'Eaton Fuller manual / Allison automatic'] },
  kenworth: { t680: ['PACCAR MX-13 or Cummins X15', '15W-40 CK-4 diesel oil', 'PACCAR TX-12 AMT / Eaton Fuller manual'], t880: ['PACCAR MX-13 or Cummins X15', '15W-40 CK-4 diesel oil', 'PACCAR TX-12 AMT / Eaton Fuller manual'], w900: ['Cummins ISX/X15 or PACCAR MX-13', '15W-40 diesel oil', 'Eaton Fuller manual'], t370: ['PACCAR PX-7/PX-9 or Cummins B6.7', '15W-40 CK-4 diesel oil', 'Allison automatic / Eaton Fuller manual'] },
  peterbilt: { '579': ['PACCAR MX-13 or Cummins X15', '15W-40 CK-4 diesel oil', 'PACCAR TX-12 AMT / Eaton Fuller manual'], '389': ['PACCAR MX-13 or Cummins X15', '15W-40 diesel oil', 'Eaton Fuller manual'], '567': ['PACCAR MX-13 or Cummins X15', '15W-40 CK-4 diesel oil', 'PACCAR TX-12 AMT / Eaton Fuller manual'], '337': ['PACCAR PX-7/PX-9 or Cummins B6.7', '15W-40 CK-4 diesel oil', 'Allison automatic / Eaton Fuller manual'] },
  mack: { anthem: ['Mack MP8', '15W-40 CK-4 diesel oil', 'Mack mDRIVE AMT / TMD manual'], granite: ['Mack MP7/MP8', '15W-40 CK-4 diesel oil', 'Mack mDRIVE AMT / Allison automatic'], pinnacle: ['Mack MP7/MP8', '15W-40 diesel oil', 'Mack mDRIVE AMT / Eaton Fuller manual'], lr: ['Mack MP7', '15W-40 CK-4 diesel oil', 'Allison automatic / Mack mDRIVE AMT'] },
  international: { 'lt series': ['Cummins X15 or International A26', '15W-40 CK-4 diesel oil', 'Eaton Endurant AMT / Eaton Fuller manual'], 'hx series': ['Cummins X15 or International A26', '15W-40 CK-4 diesel oil', 'Eaton Fuller manual / Allison automatic'], 'mv series': ['Cummins B6.7 or International A26', '15W-40 CK-4 diesel oil', 'Allison automatic'], 'hv series': ['Cummins X15 or International A26', '15W-40 CK-4 diesel oil', 'Allison automatic / Eaton Fuller manual'] },
  'volvo trucks': { 'vnl 760': ['Volvo D13/D16', 'Volvo VDS-4.5 15W-40 diesel oil', 'Volvo I-Shift AMT / Eaton Fuller manual'], 'vnl 860': ['Volvo D13/D16', 'Volvo VDS-4.5 15W-40 diesel oil', 'Volvo I-Shift AMT'], vhd: ['Volvo D11/D13', 'Volvo VDS-4.5 15W-40 diesel oil', 'Volvo I-Shift AMT / Allison automatic'], vah: ['Volvo D11', 'Volvo VDS-4.5 15W-40 diesel oil', 'Volvo I-Shift AMT'] },
  'western star': { '49x': ['Detroit DD13/DD15/DD16', '15W-40 CK-4 diesel oil', 'Detroit DT12 AMT / Eaton Fuller manual'], '47x': ['Detroit DD13/DD15', '15W-40 CK-4 diesel oil', 'Detroit DT12 AMT / Eaton Fuller manual'], '5700xe': ['Detroit DD13/DD15/DD16', '15W-40 diesel oil', 'Detroit DT12 AMT / Eaton Fuller manual'] }
};
for (const [make, models] of Object.entries(semiModels)) for (const [model, [engine, oil, trans]] of Object.entries(models)) {
  wave8Specs[make][model] = { '2005-2014': semiSpec(engine, oil, trans, '2005-2014'), '2015-2026': semiSpec(engine, oil, trans, '2015-2025') };
}
const rvModels = {
  winnebago: { vista: ['Ford Triton V10 gasoline / Ford 7.3L V8', '5W-20/5W-30 Ford synthetic blend', 'Ford 6-speed automatic', 'Onan gasoline generator oil'], 'minnie winnie': ['Ford Triton V10 or Chevrolet 6.0L/8.1L Vortec gasoline', '5W-20/5W-30 chassis oil', 'Ford/GM automatic', 'Onan gasoline generator oil'], 'view/navion': ['Mercedes OM642 diesel / Mercedes 3.0L diesel', '5W-30 MB diesel oil', 'Mercedes 5-speed/7-speed automatic', 'Onan diesel generator oil'], travato: ['Chrysler Pentastar V6 gasoline / Ram ProMaster chassis', '5W-20 synthetic blend', 'Chrysler automatic', 'Onan gasoline generator oil'], revel: ['Mercedes OM642 3.0L diesel', '5W-30 MB diesel oil', 'Mercedes 9-speed automatic', 'Onan diesel generator oil'] },
  thor: { 'freedom elite': ['Ford Triton V10 / Ford 7.3L V8 gasoline', '5W-20/5W-30 chassis oil', 'Ford automatic', 'Onan gasoline generator oil'], chateau: ['Ford Triton V10 or GM 6.0L Vortec gasoline', '5W-20/5W-30 chassis oil', 'Ford/GM automatic', 'Onan gasoline generator oil'], ace: ['Ford Triton V10 / Ford 7.3L V8 gasoline', '5W-20/5W-30 chassis oil', 'Ford automatic', 'Onan gasoline generator oil'], palazzo: ['Cummins ISB diesel', '15W-40 CK-4 diesel oil', 'Allison automatic', 'Onan diesel generator oil'], tuscany: ['Cummins ISB diesel', '15W-40 CK-4 diesel oil', 'Allison automatic', 'Onan diesel generator oil'] },
  jayco: { redhawk: ['Ford Triton V10 / Ford 7.3L V8 gasoline', '5W-20/5W-30 chassis oil', 'Ford automatic', 'Onan gasoline generator oil'], greyhawk: ['Ford Triton V10 / Ford 7.3L V8 gasoline', '5W-20/5W-30 chassis oil', 'Ford automatic', 'Onan gasoline generator oil'], seneca: ['Cummins ISB diesel', '15W-40 CK-4 diesel oil', 'Allison automatic', 'Onan diesel generator oil'], eagle: ['Ford or GM gasoline chassis (model-year dependent)', '5W-20/5W-30 chassis oil', 'Ford/GM automatic', 'Onan gasoline generator oil'] },
  airstream: { classic: ['Ford Triton V10 / Ford 7.3L V8 gasoline chassis', '5W-20/5W-30 chassis oil', 'Ford automatic', 'Onan gasoline generator oil'], 'flying cloud': ['Tow vehicle-dependent; no engine/transmission in travel trailer', 'N/A — no chassis engine', 'N/A — travel trailer', 'N/A or consult generator manual'], globetrotter: ['Tow vehicle-dependent; no engine/transmission in travel trailer', 'N/A — no chassis engine', 'N/A — travel trailer', 'N/A or consult generator manual'], interstate: ['Mercedes OM642 3.0L diesel', '5W-30 MB diesel oil', 'Mercedes automatic', 'Onan diesel generator oil'] },
  newmar: { 'bay star': ['Ford Triton V10 / Ford 7.3L V8 gasoline', '5W-20/5W-30 chassis oil', 'Ford automatic', 'Onan gasoline generator oil'], ventana: ['Cummins ISB diesel', '15W-40 CK-4 diesel oil', 'Allison automatic', 'Onan diesel generator oil'], 'dutch star': ['Cummins ISB/ISL diesel', '15W-40 CK-4 diesel oil', 'Allison automatic', 'Onan diesel generator oil'], 'king aire': ['Cummins ISM/ISX diesel', '15W-40 CK-4 diesel oil', 'Allison automatic', 'Onan diesel generator oil'] },
  'forest river': { sunseeker: ['Ford Triton V10 / Ford 7.3L V8 gasoline', '5W-20/5W-30 chassis oil', 'Ford automatic', 'Onan gasoline generator oil'], forester: ['Ford Triton V10 / Ford 7.3L V8 gasoline', '5W-20/5W-30 chassis oil', 'Ford automatic', 'Onan gasoline generator oil'], georgetown: ['Ford Triton V10 / Ford 7.3L V8 gasoline', '5W-20/5W-30 chassis oil', 'Ford automatic', 'Onan gasoline generator oil'], fr3: ['Ford Triton V10 / Ford 7.3L V8 gasoline', '5W-20/5W-30 chassis oil', 'Ford automatic', 'Onan gasoline generator oil'], rockwood: ['Tow vehicle-dependent; no engine/transmission in travel trailer', 'N/A — no chassis engine', 'N/A — travel trailer', 'N/A or consult generator manual'] },
  'grand design': { reflection: ['Tow vehicle-dependent; no engine/transmission in fifth wheel', 'N/A — no chassis engine', 'N/A — fifth wheel', 'N/A or consult generator manual'], solitude: ['Tow vehicle-dependent; no engine/transmission in fifth wheel', 'N/A — no chassis engine', 'N/A — fifth wheel', 'N/A or consult generator manual'], momentum: ['Tow vehicle-dependent; no engine/transmission in fifth wheel', 'N/A — no chassis engine', 'N/A — fifth wheel', 'N/A or consult generator manual'], imagine: ['Tow vehicle-dependent; no engine/transmission in travel trailer', 'N/A — no chassis engine', 'N/A — travel trailer', 'N/A or consult generator manual'], transcend: ['Tow vehicle-dependent; no engine/transmission in travel trailer', 'N/A — no chassis engine', 'N/A — travel trailer', 'N/A or consult generator manual'] }
};
for (const [make, models] of Object.entries(rvModels)) for (const [model, [engine, oil, trans, gen]] of Object.entries(models)) {
  wave8Specs[make][model] = { '2005-2014': rvSpec(engine, oil, trans, gen, '2005-2014'), '2015-2026': rvSpec(engine, oil, trans, gen, '2015-2025') };
}
// Correct OEM naming typo while retaining normalized lookup keys.
for (const [make, models] of Object.entries(wave8Specs)) { referenceSpecs[make] = referenceSpecs[make] || {}; for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years }; }

// ═══════════════════════════════════════════════════════════════════════════
// Wave 9: Classic & defunct automotive makes — AMC, MG, Plymouth, Oldsmobile
// Model lists extracted from MAINTENANCE_SCHEDULES (src/data/maintenance-schedules.js).
// All models are pre-1996 (except 1996+ Plymouth/Oldsmobile models, which are
// OBD-II). Era-typical values; unverifiable values marked "Consult owner's manual".
// ═══════════════════════════════════════════════════════════════════════════
const classicCarSpec = (o) => ({
  sparkPlugs: { ...(o.sparkPlugs || SPARK_PLUG_DEFAULT) },
  engine: {
    oilViscosity: o.oil,
    oilCapacity: o.oilCap || consult,
    oilFilterPN: o.filterPN || consult,
    coolantType: o.coolant || 'Green IAT coolant (ethylene glycol)',
    coolantCapacity: o.coolantCap || consult
  },
  transmission: { fluidType: o.trans, capacity: o.transCap || consult, ...(o.transNote ? { note: o.transNote } : {}) },
  transferCase: o.tcase ?? null,
  differentials: { front: o.diffF ?? null, rear: o.diffR ?? null },
  brakeFluid: o.brake || 'DOT 3',
  tires: { frontPSI: o.psiF ?? 30, rearPSI: o.psiR ?? 30, oemSizes: o.sizes || [consult], lugNutTorque: o.lug ?? consult },
  bulbs: o.bulbs || {},
  obd2Location: o.obd2 || consult,
  ...(o.note ? { note: o.note } : {})
});

// ── AMC (1950-1988) ────────────────────────────────────────────────────────
const AMC_OBD2 = 'OBD-II not available (pre-1996). AMC diagnostic port: under hood near fender relay, 2-wire connector.';
const amcBulbs = {
  lowBeam: '7" round sealed beam (H5006/H6024) — H4656 rectangular on 1975+ models',
  highBeam: '7" round sealed beam (H5001) / H4651 rectangular (1975+)',
  frontTurn: '1157 (double filament) / 1156',
  rearTurn: '1156',
  tailBrake: '1157',
  interior: 'BA9s (181 dome/map)',
  license: '67 (bayonet) early — 168/194 (wedge) on later models'
};
const amcSpec = (o) => classicCarSpec({ coolant: 'Green IAT coolant (ethylene glycol)', brake: 'DOT 3', bulbs: amcBulbs, obd2: AMC_OBD2, psiF: 28, psiR: 28, ...o });

// ── MG (1952-2000) ─────────────────────────────────────────────────────────
const mgBulbs = {
  lowBeam: '7" round sealed beam (H5006) — H4 halogen on 1974+ North American MGB and Metro/Maestro/RV8; H1 projector on MGF',
  highBeam: '7" round sealed beam (H5001) / H4 (later models)',
  frontTurn: '1157 (double filament) — BA15s (382) on very early cars',
  rearTurn: '1156 / BA15s',
  tailBrake: '1157 (LED conversions common on classics)',
  interior: 'BA9s (181/987)',
  license: 'BA9s (987) early — 168/194 (wedge) on later models'
};
const MG_PRE96_OBD2 = 'OBD-II not available (pre-1996). SU carburetor tuning via manual adjustment; points ignition on classics — set gap per manual.';
const mgSpec = (o) => classicCarSpec({ coolant: 'Green IAT coolant (ethylene glycol)', brake: 'DOT 4 (Girling)', bulbs: mgBulbs, obd2: MG_PRE96_OBD2, psiF: 26, psiR: 26, ...o });

// ── Plymouth (1960-2001) ───────────────────────────────────────────────────
const PLY_PRE96_OBD2 = 'OBD-II not available (pre-1996). Chrysler diagnostic connector (older: 6-pin under dash; 1990s: 12-pin CCD under hood near battery) — use DRB/scan tool.';
const PLY_OBD2_1996 = 'OBD-II port under driver side dashboard (16-pin), left of steering column.';
const plymouthBulbs = {
  lowBeam: '7" round sealed beam (H5006/H6024) — H4656 rectangular (1975+)',
  highBeam: '7" round sealed beam (H5001) / H4651 rectangular (1975+)',
  frontTurn: '1157 (double filament) / 1156',
  rearTurn: '1156',
  tailBrake: '1157',
  interior: 'BA9s (181/1895)',
  license: '67 — 168/194 (wedge) on 1990s models'
};
const plymouthSpec = (o) => classicCarSpec({ coolant: 'Green IAT coolant (ethylene glycol) — Mopar OAT (purple) on 1996+ models', brake: 'DOT 3', bulbs: plymouthBulbs, obd2: PLY_PRE96_OBD2, psiF: 30, psiR: 30, ...o });

// ── Oldsmobile (1960-2004) ─────────────────────────────────────────────────
const OLDS_PRE96_OBD2 = 'OBD-II not available (pre-1996). GM ALDL diagnostic connector — 5-pin (1980s) or 12-pin (1990s) under driver side dash; use GM scan tool.';
const OLDS_OBD2_1996 = 'OBD-II port under driver side dashboard (16-pin), left of steering column.';
const OLDS_SPAN_OBD2 = 'Pre-1996: GM ALDL 12-pin connector under driver side dash (no OBD-II). 1996+: OBD-II port under driver side dashboard (16-pin).';
const oldsBulbs = {
  lowBeam: '9006 (halogen composite, 1985+) / 7" sealed beam H4656 (earlier)',
  highBeam: '9005 (1985+) / H4651 (earlier)',
  frontTurn: '1157 (3157 on 1990s models)',
  rearTurn: '1156 / 3156 (1990s)',
  tailBrake: '1157 / 3157 (1990s)',
  interior: '194/168 wedge (DE3022) — BA9s (181) on earlier models',
  license: '168/194'
};
const oldsSpec = (o) => classicCarSpec({ coolant: 'Green IAT coolant (ethylene glycol) — Dex-Cool (orange) on 1995+ models', brake: 'DOT 3', bulbs: oldsBulbs, obd2: OLDS_PRE96_OBD2, psiF: 30, psiR: 30, ...o });

// ═══════════════════════════════════════════════════════════════════════════
// wave9Specs — merged at module bottom with ...wave9Specs
// ═══════════════════════════════════════════════════════════════════════════
const wave9Specs = {
  amc: {
    eagle: {
      '1979-1988': amcSpec({
        engine: 'AMC 258ci (4.2L) I6 — 2-bbl carburetor; 304ci V8 optional 1979-1981',
        oil: 'SAE 10W-30 (high-zinc for flat-tappet cam)', oilCap: '5.0 qt (I6 w/filter) / 5.0 qt (V8 w/filter)',
        trans: 'TorqueFlite 998 3-speed auto (Dexron III) / T-4 4-speed manual (GL-4 80W-90)',
        tcase: { fluidType: 'Dexron III ATF (NP119/NP129 full-time 4WD)', capacity: consult, note: 'Full-time 4WD standard on all Eagles.' },
        diffF: { fluidType: 'SAE 80W-90 GL-5 (Dana 30 IFS)', capacity: consult },
        diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 15/35)', capacity: consult },
        sizes: ['P195/75R15 or P205/70R15 (common radial replacement)'],
        lug: 90,
        note: 'Eagle (1979-1988) — the original American crossover. Vacuum-operated 4WD; check vacuum lines and CV joints.'
      })
    },
    hornet: {
      '1970-1977': amcSpec({
        engine: 'AMC 232ci (3.8L) / 258ci (4.2L) I6; 304ci V8 (1971-1974)',
        oil: 'SAE 10W-30 (high-zinc)', oilCap: '5.0 qt (I6 w/filter) / 5.0 qt (V8 w/filter)',
        trans: 'TorqueFlite 904 3-speed auto (Dexron III) / TorqueFlite 727 (V8) / Borg-Warner T-10 4-speed manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 15 — I6 / Model 20 — V8)', capacity: consult },
        sizes: ['D78-14 or E78-14 (era bias-belted)'],
        lug: 85,
        note: 'Hornet X-body (1970-1977) — also the basis for the Gremlin, Concord, Spirit and Eagle.'
      })
    },
    pacer: {
      '1975-1980': amcSpec({
        engine: 'AMC 232ci / 258ci I6 (no V8 option)',
        oil: 'SAE 10W-30 (high-zinc)', oilCap: '5.0 qt (w/filter)',
        trans: 'TorqueFlite 998 3-speed auto (Dexron III) / T-150 3-speed manual (GL-4)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 15)', capacity: consult },
        sizes: ['ER78-14 (era bias-belted)'],
        lug: 85,
        note: 'Pacer (1975-1980) — wide-body "flying fishbowl"; famous heavy passenger door hinge check.'
      })
    },
    javelin: {
      '1968-1974': amcSpec({
        engine: '290/304/343/360/390/401ci V8; 232/258ci I6 (base)',
        oil: 'SAE 10W-40 or 20W-50 (high-zinc for flat-tappet cams)', oilCap: '5.0 qt (w/filter)',
        trans: 'TorqueFlite 727 3-speed auto (Dexron III) / Borg-Warner T-10 4-speed manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 20; Twin-Grip limited-slip — add friction modifier)', capacity: consult },
        sizes: ['E70-14 / F70-14 (era bias-belted)'],
        lug: 85,
        note: 'Javelin pony car — 390/401 solid-lifter engines require hot valve adjustment (0.012" intake / 0.018" exhaust).'
      })
    },
    matador: {
      '1971-1978': amcSpec({
        engine: '258ci I6 / 304ci / 360ci V8 (401ci on Ambassador)',
        oil: 'SAE 10W-30 (20W-50 for 401)', oilCap: '5.0 qt (w/filter)',
        trans: 'TorqueFlite 727 3-speed auto (Dexron III) / Borg-Warner M11/M12 3-speed manual (GL-4)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 20)', capacity: consult },
        sizes: ['F78-14 / G78-15 (era bias-belted)'],
        lug: 85,
        note: 'Matador (1971-1978) — AMC intermediate; Ambassador (1958-1974) shared the full-size platform.'
      })
    },
    rambler: {
      '1950-1969': amcSpec({
        engine: '195.6ci I6 (flathead through 1956, OHV 1956+); 199ci/232ci I6 on later models',
        oil: 'SAE 10W-30 (high-zinc)', oilCap: '5.0 qt (w/filter)',
        trans: 'TorqueFlite 904 3-speed auto (Dexron III) / Borg-Warner M11/M12 3-speed manual (GL-4)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 15/27)', capacity: consult },
        sizes: ['6.50-13 / 7.00-13 (era bias-ply)'],
        lug: 85,
        note: 'Rambler marque (1950-1969) — economy pioneer; later Rambler American shared 1964+ Classic/Rebel drivelines.'
      })
    },
    'cj-7': {
      '1976-1986': amcSpec({
        engine: '258ci I6 (standard); 304ci V8 optional (1980-1981); earlier CJ-5: 134ci Hurricane I4, 225ci Dauntless V6, 232ci I6',
        oil: 'SAE 10W-30 (high-zinc)', oilCap: '5.0 qt (w/filter)',
        trans: 'T-150/T-176 4-speed manual (GL-4 80W-90) / TorqueFlite 999 3-speed auto (Dexron III, 1980+)',
        tcase: { fluidType: 'Dana 300 — GL-5 80W-90 or ATF (check year; Dana 20 on earlier models)', capacity: consult },
        diffF: { fluidType: 'SAE 80W-90 GL-5 (Dana 30)', capacity: consult },
        diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 20 / Dana 44)', capacity: consult },
        sizes: ['L78-15 (era) — 31x10.50R15 common off-road replacement'],
        psiF: 26, psiR: 26, lug: 75,
        note: 'AMC-era Jeep CJ — legendary off-roader; Dana 300 transfer case and AMC Model 20 rear are the strong points.'
      })
    },
    wagoneer: {
      '1963-1990': amcSpec({
        engine: '258ci I6 / 360ci V8 (401ci V8 optional through 1974)',
        oil: 'SAE 10W-30 (high-zinc)', oilCap: '5.0 qt (w/filter)',
        trans: 'TorqueFlite 727/999 3-speed auto (Dexron III) / TH400 (some 1970s models)',
        tcase: { fluidType: 'NP208/NP228/NP229 (Selec-Trac) — ATF for chain-driven cases', capacity: consult, note: 'Full-time 4WD available from 1973.' },
        diffF: { fluidType: 'SAE 80W-90 GL-5 (Dana 44)', capacity: consult },
        diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 20 / Dana 44)', capacity: consult },
        sizes: ['H78-15 (era) — LT235/75R15 common replacement'],
        psiF: 30, psiR: 30, lug: 100,
        note: 'SJ Wagoneer (1963-1990) — the original luxury 4x4 SUV.'
      })
    },
    'grand wagoneer': {
      '1984-1991': amcSpec({
        engine: '360ci V8 (standard); 258ci I6 (1984-1985 only)',
        oil: 'SAE 10W-30 (high-zinc)', oilCap: '5.0 qt (w/filter)',
        trans: 'TorqueFlite 727/999 3-speed auto (Dexron III)',
        tcase: { fluidType: 'NP228/NP229 (Selec-Trac) — ATF for chain-driven cases', capacity: consult, note: 'Full-time 4WD (Quadra-Trac / Selec-Trac).' },
        diffF: { fluidType: 'SAE 80W-90 GL-5 (Dana 44)', capacity: consult },
        diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 20 / Dana 44)', capacity: consult },
        sizes: ['LT235/75R15 (common)'],
        psiF: 30, psiR: 30, lug: 100,
        note: 'Grand Wagoneer (1984-1991) — wood-paneled full-size luxury SUV.'
      })
    },
    'cherokee xj': {
      '1984-2001': amcSpec({
        engine: '2.5L AMC I4 / 4.0L AMC I6 (Renix 1987-1990, H.O. 1991+)',
        oil: 'SAE 10W-30 (5W-30 acceptable in cold climates)', oilCap: '4.5 qt (2.5L w/filter) / 6.0 qt (4.0L w/filter)',
        trans: 'TorqueFlite 904/999 3-speed auto (Dexron III) / AX-5 5-speed manual (GL-4) / AX-15 5-speed (1990+)',
        tcase: { fluidType: 'NP207 (1984-1986) / NP231 (1988+) / NP242 Selec-Trac — Dexron III ATF', capacity: consult, note: 'Command-Trac (part-time) standard; Selec-Trac (full-time) optional.' },
        diffF: { fluidType: 'SAE 80W-90 GL-5 (Dana 30)', capacity: consult },
        diffR: { fluidType: 'SAE 80W-90 GL-5 (Dana 35 — Dana 44 optional)', capacity: consult },
        sizes: ['P205/75R15 / P215/75R15 (common)'],
        psiF: 30, psiR: 30, lug: 90,
        note: 'XJ Cherokee (1984-2001) — AMC-engineered unibody SUV; the 4.0 I6 is legendary for longevity.'
      })
    }
  },
  mg: {
    'mg td': {
      '1950-1953': mgSpec({
        engine: 'XPAG 1250cc I4 (54 hp) — twin SU carburetors, points ignition',
        oil: 'SAE 20W-50 (high-zinc)', oilCap: '3.5 qt (approx 6 imp pints)',
        trans: '4-speed manual — GL-4 80W-90 (or 30/40 engine oil class per early manuals)',
        diffR: { fluidType: 'SAE 90 GL-5 (hypoid — early: 30/40 engine oil class)', capacity: consult },
        sizes: ['5.50-15 (48-spoke wire wheels)'],
        psiF: 26, psiR: 26, lug: consult,
        note: 'MG TD — classic 1950s roadster; wire wheel knock-off hubs (no lug nuts). Brakes: 4-wheel drums (Girling).'
      })
    },
    'mg tf': {
      '1953-1955': mgSpec({
        engine: 'XPEG 1466cc I4 (TF1500) — twin SU carburetors, points ignition',
        oil: 'SAE 20W-50 (high-zinc)', oilCap: '3.5 qt (approx 6 imp pints)',
        trans: '4-speed manual — GL-4 80W-90 (or 30/40 engine oil class per early manuals)',
        diffR: { fluidType: 'SAE 90 GL-5 (hypoid)', capacity: consult },
        sizes: ['5.50-15 (48-spoke wire wheels)'],
        psiF: 26, psiR: 26, lug: consult,
        note: 'MG TF — final XPAG-era car; TF1500 upgraded to 1466cc. 4-wheel drum brakes.'
      })
    },
    'mg a': {
      '1955-1962': mgSpec({
        engine: 'BMC B-series 1489cc (1500) / 1588cc (1600) / 1622cc (MkII) I4 — twin SU carburetors',
        oil: 'SAE 20W-50 (high-zinc)', oilCap: '4.0 qt (approx 6.5 imp pints)',
        trans: '4-speed manual — GL-4 80W-90',
        diffR: { fluidType: 'SAE 90 GL-5', capacity: consult },
        sizes: ['5.60-15 (steel disc wheels; wire wheels optional)'],
        psiF: 26, psiR: 26, lug: 50,
        note: 'MGA — front disc brakes from 1956; 4-lug 5" bolt circle.'
      })
    },
    'mga twin cam': {
      '1958-1960': mgSpec({
        engine: 'MGA Twin Cam 1588cc DOHC I4 (108 hp) — twin SU carburetors',
        oil: 'SAE 20W-50 (high-zinc)', oilCap: '4.0 qt (approx 6.5 imp pints)',
        trans: '4-speed manual — GL-4 80W-90',
        diffR: { fluidType: 'SAE 90 GL-5', capacity: consult },
        sizes: ['5.60-15'],
        psiF: 26, psiR: 26, lug: 50,
        note: 'MGA Twin Cam — exotic DOHC head; alloy brakes. Only 2,111 built.'
      })
    },
    'mg midget': {
      '1961-1979': mgSpec({
        engine: 'BMC A-series 948cc (1961-1964) / 1098cc (1964-1974) / 1275cc (1974-1979) I4 — single SU carburetor',
        oil: 'SAE 20W-50 (high-zinc)', oilCap: '4.0 qt (w/filter, approx)',
        trans: '4-speed manual — GL-4 80W-90',
        diffR: { fluidType: 'SAE 90 GL-5', capacity: consult },
        sizes: ['145R12 (early) — 155SR13 (1972+)'],
        psiF: 24, psiR: 24, lug: 50,
        note: 'Midget (badged Austin-Healey Sprite twin) — tiny A-series; 1974+ got rubber bumpers and raised ride.'
      })
    },
    'mg b': {
      '1962-1980': mgSpec({
        engine: 'BMC B-series 1798cc I4 (95 hp) — twin SU HIF4 carburetors, points ignition',
        oil: 'SAE 20W-50 (high-zinc)', oilCap: '5.1 qt (w/filter)',
        trans: '4-speed manual — GL-4 80W-90 (overdrive unit: engine oil / GL-4 20W-50)',
        diffR: { fluidType: 'SAE 90 GL-5 (banjo axle — early: 30/40 engine oil class)', capacity: consult },
        sizes: ['155SR14 (early) — 165SR14 (1976+)'],
        psiF: 26, psiR: 26, lug: 55,
        note: 'MGB — best-selling British sports car (over 500k built). Front disc / rear drum brakes (Girling).'
      })
    },
    'mg b gt v8': {
      '1973-1976': mgSpec({
        engine: 'Rover 3.5L (3528cc) V8 (137 hp) — twin SU HIF6 carburetors',
        oil: 'SAE 20W-50 (high-zinc)', oilCap: '4.8 qt (w/filter)',
        trans: '4-speed manual (Rover LT77 or MGB 4-syncro) — GL-4 80W-90',
        diffR: { fluidType: 'SAE 90 GL-5 (MGB Salisbury axle — stronger 3.5L diff)', capacity: consult },
        sizes: ['165HR14 (radial)'],
        psiF: 28, psiR: 28, lug: 55,
        note: 'MGB GT V8 — factory Rover V8 conversion; only 2,591 built.'
      })
    },
    'mg c': {
      '1967-1969': mgSpec({
        engine: 'BMC C-series 2912cc I6 (145 hp) — three SU carburetors, points ignition',
        oil: 'SAE 20W-50 (high-zinc)', oilCap: '6.0 qt (approx)',
        trans: '4-speed manual — GL-4 80W-90',
        diffR: { fluidType: 'SAE 90 GL-5 (Salisbury 4HA axle)', capacity: consult },
        sizes: ['165HR15 (radial)'],
        psiF: 28, psiR: 28, lug: 55,
        note: 'MGC — 6-cylinder MGB; heavier nose, fewer than 9,000 built.'
      })
    },
    'mg metro': {
      '1980-1990': mgSpec({
        engine: 'BMC A-series 1275cc I4 (MG Metro 72 hp; MG Metro Turbo 93 hp) — single SU carburetor',
        oil: 'SAE 20W-50 (10W-40 acceptable)', oilCap: '4.0 qt (approx)',
        trans: '4-speed manual — GL-4 80W-90',
        diffR: { fluidType: 'SAE 90 GL-5 (transverse transaxle final drive)', capacity: consult },
        sizes: ['145/80R13'],
        psiF: 28, psiR: 28, lug: 65,
        note: 'MG Metro — hot hatch on the Austin Metro platform; Turbo version has intercooled A-series.'
      })
    },
    'mg maestro': {
      '1983-1991': mgSpec({
        engine: '1.6L S-series I4 (MG Maestro 1.6) / 2.0L O-series I4 (2.0 EFI / 2.0i)',
        oil: 'SAE 10W-40 (5W-30 acceptable in cold climates)', oilCap: '4.5 qt (approx)',
        trans: '5-speed manual — GL-4 80W-90',
        diffR: { fluidType: 'SAE 90 GL-5 (transverse transaxle final drive)', capacity: consult },
        sizes: ['175/70R13 (1.6) — 185/60R14 (2.0i)'],
        psiF: 28, psiR: 28, lug: 65,
        note: 'MG Maestro — 1980s Austin Maestro with MG trim; 2.0i was the first MG with fuel injection.'
      })
    },
    'mg rv8': {
      '1992-1995': mgSpec({
        engine: 'Rover 3.9L V8 (190 hp) — hot-wire fuel injection, Lucas ignition',
        oil: 'SAE 10W-40 (20W-50 for hard use)', oilCap: '5.0 qt (w/filter)',
        trans: '5-speed manual (Rover R380) — MTF94 or GL-4 80W-90',
        diffR: { fluidType: 'SAE 90 GL-5 (Salisbury axle)', capacity: consult },
        sizes: ['205/65VR15'],
        psiF: 28, psiR: 28, lug: 65,
        note: 'MG RV8 — modernized MGB roadster with Rover 3.9 V8; only 2,000 built.'
      })
    },
    'mg f': {
      '1995-2002': mgSpec({
        engine: 'Rover K-series 1.8L I4 (118 hp; VVC 143 hp) — MEMS engine management',
        oil: 'SAE 10W-40 (Rover spec — K-series needs correct oil level discipline)', oilCap: '4.8 qt (w/filter)',
        trans: '5-speed manual (Rover PG1) — MTF94 or GL-4 75W-90',
        diffR: { fluidType: 'SAE 90 GL-5 (transaxle final drive)', capacity: consult },
        sizes: ['185/55R15 front / 205/50R15 rear'],
        psiF: 26, psiR: 28, lug: 65,
        obd2: 'Rover MEMS engine-management diagnostic connector (5-pin) near ECU behind passenger kick panel — no standard OBD-II port.',
        note: 'MGF — mid-engine roadster; K-series head-gasket failure is a known weakness — monitor coolant level.'
      })
    }
  },
  plymouth: {
    'road runner': {
      '1968-1980': plymouthSpec({
        engine: '383ci (6.3L) / 440ci (7.2L) RB big-block; 426 Hemi (1968-1970); 318/340/360 LA small-block (1971+)',
        oil: 'SAE 10W-40 (10W-30 for small-blocks; 20W-50 for 440/Hemi — high-zinc for flat-tappet cams)', oilCap: '5.0 qt (small-block w/filter) / 6.0 qt (big-block w/filter)',
        trans: 'TorqueFlite 727 3-speed auto (Dexron III/Mercon — Type F pre-1968) / A-833 4-speed manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (8.75" axle / Dana 60 — Sure-Grip limited-slip: add friction modifier)', capacity: consult },
        sizes: ['E70-14 / F70-14 (era bias-belted)', 'P215/70R14 or P235/60R15 (common radial replacement)'],
        psiF: 30, psiR: 30, lug: 85,
        note: 'Road Runner (1968-1980) — the budget muscle car with the beep-beep horn; Hemi option is a legend.'
      })
    },
    barracuda: {
      '1964-1974': plymouthSpec({
        engine: '225 Slant-6 / 273, 318, 340 V8 (1964-1969); 318/340/383/440 V8, 426 Hemi (1970-1974 E-body)',
        oil: 'SAE 10W-40 (high-zinc; 20W-50 for 440/Hemi)', oilCap: '5.0 qt (small-block w/filter) / 6.0 qt (big-block w/filter)',
        trans: 'TorqueFlite 727 3-speed auto (Dexron III/Mercon) / A-833 4-speed manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (7.25" / 8.75" / Dana 60 axle — Sure-Grip optional)', capacity: consult },
        sizes: ['E70-14 / F70-14 (era) — P215/70R14 (common replacement)'],
        psiF: 30, psiR: 30, lug: 85,
        note: 'Barracuda (1964-1974) — Plymouth pony car; 1970-1974 E-body is the collectible generation.'
      })
    },
    superbird: {
      '1970-1970': plymouthSpec({
        engine: '440ci (7.2L) Super Commando V8 (375 hp) / 426 Hemi (425 hp)',
        oil: 'SAE 20W-50 (high-zinc for flat-tappet cams)', oilCap: '6.0 qt (w/filter)',
        trans: 'TorqueFlite 727 3-speed auto (Dexron III/Mercon) / A-833 4-speed manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (8.75" / Dana 60 — Sure-Grip optional)', capacity: consult },
        sizes: ['F70-14 (era) — P235/60R15 (common replacement)'],
        psiF: 30, psiR: 30, lug: 85,
        note: 'Superbird (1970 only) — 1,920 built with the famous nose cone and tall rear wing for NASCAR homologation.'
      })
    },
    gtx: {
      '1967-1971': plymouthSpec({
        engine: '383ci V8 (1967-1969: 383/440); 440ci Six-Pack (1970-1971); 426 Hemi (1970-1971)',
        oil: 'SAE 10W-40 (20W-50 for 440/Hemi — high-zinc)', oilCap: '5.0 qt (383 w/filter) / 6.0 qt (440/Hemi w/filter)',
        trans: 'TorqueFlite 727 3-speed auto (Dexron III/Mercon) / A-833 4-speed manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (8.75" axle — Sure-Grip optional)', capacity: consult },
        sizes: ['E70-14 / F70-14 (era)'],
        psiF: 30, psiR: 30, lug: 85,
        note: 'GTX (1967-1971) — "Gentleman\'s Muscle Car"; 440 Six-Pack with triple 2-bbl carbs from 1970.'
      })
    },
    duster: {
      '1970-1976': plymouthSpec({
        engine: '198ci / 225ci Slant-6; 318ci / 340ci LA V8 (Duster 340)',
        oil: 'SAE 10W-30 (10W-40 for V8s)', oilCap: '4.0 qt (Slant-6 w/filter) / 5.0 qt (V8 w/filter)',
        trans: 'TorqueFlite 904 3-speed auto (Dexron III/Mercon) / A-833 4-speed manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (7.25" / 8.75" axle)', capacity: consult },
        sizes: ['E70-14 (era) — P215/70R14 (common replacement)'],
        psiF: 30, psiR: 30, lug: 85,
        note: 'Duster (1970-1976) — A-body "mini muscle" on the Valiant platform; Duster 340 was the budget hot rod.'
      })
    },
    valiant: {
      '1960-1976': plymouthSpec({
        engine: '170ci / 198ci / 225ci Slant-6 (the legendary "leaning tower of power"); 273ci / 318ci V8 (1964+)',
        oil: 'SAE 10W-30', oilCap: '4.0 qt (Slant-6 w/filter) / 5.0 qt (V8 w/filter)',
        trans: 'TorqueFlite 904 3-speed auto (Dexron III/Mercon) / A-833 4-speed manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (7.25" axle)', capacity: consult },
        sizes: ['6.50-13 (early) — D78-14 / E78-14 (later)'],
        psiF: 30, psiR: 30, lug: 85,
        note: 'Valiant (1960-1976) — the Slant-6 is famously indestructible; early push-button TorqueFlite (1960-1964).'
      })
    },
    satellite: {
      '1965-1974': plymouthSpec({
        engine: '225 Slant-6 / 273, 318, 383ci V8 (1965-1970); 318/360/400/440 V8 (1971-1974)',
        oil: 'SAE 10W-30 (10W-40 for big-blocks)', oilCap: '5.0 qt (small-block w/filter) / 6.0 qt (big-block w/filter)',
        trans: 'TorqueFlite 727 3-speed auto (Dexron III/Mercon) / A-833 4-speed manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (8.75" axle)', capacity: consult },
        sizes: ['F78-14 (era)'],
        psiF: 30, psiR: 30, lug: 85,
        note: 'Satellite (1965-1974) — B-body intermediate; basis for the Road Runner and GTX.'
      })
    },
    fury: {
      '1956-1978': plymouthSpec({
        engine: '277/301/318 Poly V8 (1956-1958); 318/361/383/440 V8 (1959-1978); 225 Slant-6 on base models',
        oil: 'SAE 10W-30 (10W-40 for big-blocks)', oilCap: '5.0 qt (small-block w/filter) / 6.0 qt (big-block w/filter)',
        trans: 'TorqueFlite 727 3-speed auto (Dexron III/Mercon — Type F pre-1968) / A-833 manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (8.75" axle)', capacity: consult },
        sizes: ['7.50-14 / 8.50-14 (era bias-ply)'],
        psiF: 30, psiR: 30, lug: 95,
        note: 'Fury (1956-1978) — full-size Plymouth; the 1958 Fury of Stephen King fame.'
      })
    },
    belvedere: {
      '1954-1970': plymouthSpec({
        engine: '230ci flathead I6 (1954-1959); 318/361/383 V8 (1960s); 225 Slant-6 on base models',
        oil: 'SAE 10W-30 (10W-40 for V8s)', oilCap: '5.0 qt (w/filter)',
        trans: 'TorqueFlite 727 3-speed auto (Dexron III/Mercon — Type F pre-1968) / 3-speed manual (GL-4 80W-90)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (8.75" axle)', capacity: consult },
        sizes: ['6.70-15 (early) — F78-14 (later)'],
        psiF: 30, psiR: 30, lug: 95,
        note: 'Belvedere (1954-1970) — the mid-size B-body line that spawned the GTX.'
      })
    },
    voyager: {
      '1984-2000': plymouthSpec({
        engine: '2.5L I4 / 3.0L Mitsubishi V6 / 3.3L V6 / 3.8L V6 (1996+)',
        oil: 'SAE 5W-30', oilCap: '4.5 qt (2.5L/3.0L/3.3L w/filter) / 5.0 qt (3.8L w/filter)',
        trans: 'TorqueFlite A-413 3-speed auto (Dexron II — 1984-1988) / A604/41TE 4-speed auto (ATF+3 — 1989-1996) / ATF+4 (1997+)',
        tcase: { fluidType: 'Mopar ATF+4 (AWD transfer case)', capacity: consult, note: 'AWD models (1991-2000) only. FWD: no transfer case.' },
        diffF: { fluidType: 'SAE 75W-90 GL-5', capacity: consult, note: 'AWD models only.' },
        diffR: { fluidType: 'SAE 75W-90 GL-5', capacity: consult, note: 'All models.' },
        sizes: ['P195/75R14 (1984-1990)', 'P205/70R15 (1991-2000)'],
        psiF: 32, psiR: 32, lug: 95,
        note: 'Voyager (1984-2000) — the original minivan; Grand Voyager (1987-2000) is the long-wheelbase version.'
      })
    },
    horizon: {
      '1978-1990': plymouthSpec({
        engine: '1.6L (Simca) I4 / 1.7L VW I4 / 2.2L Chrysler I4',
        oil: 'SAE 10W-30 (5W-30 acceptable)', oilCap: '4.0 qt (w/filter)',
        trans: 'A404 (TorqueFlite 3-speed auto, Dexron II) / A460 4-speed manual (GL-4 80W-90)',
        sizes: ['P155/80R13 / P175/70R13'],
        psiF: 30, psiR: 30, lug: 80,
        note: 'Horizon (1978-1990) — Dodge Omni twin; European-derived L-body hatchback.'
      })
    },
    reliant: {
      '1981-1989': plymouthSpec({
        engine: '2.2L I4 (carbureted early, TBI later) / 2.5L I4 (1986+)',
        oil: 'SAE 5W-30 (10W-30 acceptable)', oilCap: '4.5 qt (w/filter)',
        trans: 'A413 3-speed auto (Dexron II / ATF+3) / A525 5-speed manual (GL-4 80W-90)',
        sizes: ['P175/80R13 / P185/75R14'],
        psiF: 30, psiR: 30, lug: 80,
        note: 'Reliant (1981-1989) — K-car; one of the cars that saved Chrysler in the 1980s.'
      })
    },
    breeze: {
      '1996-2000': plymouthSpec({
        engine: '2.0L DOHC I4 / 2.4L I4 / 2.5L V6',
        oil: 'SAE 5W-30', oilCap: '4.5 qt (I4 w/filter) / 4.5 qt (V6 w/filter)',
        trans: '31TH 3-speed auto / A413 4-speed auto (ATF+4) / NV-T350 5-speed manual (GL-4)',
        sizes: ['P185/70R14 (base)', 'P195/70R14 (LX)'],
        psiF: 32, psiR: 32, lug: 100,
        obd2: PLY_OBD2_1996,
        note: 'Breeze (1996-2000) — JA-body sedan; Dodge Stratus / Chrysler Cirrus platform mate.'
      })
    },
    neon: {
      '1995-2001': plymouthSpec({
        engine: '2.0L SOHC I4 (132 hp) / 2.0L DOHC I4 (150 hp)',
        oil: 'SAE 5W-30', oilCap: '4.5 qt (w/filter)',
        trans: '31TH 3-speed auto (ATF+4) / NV-T350 5-speed manual (GL-4)',
        sizes: ['P185/65R14 (base)', 'P185/60R15 (Sport)'],
        psiF: 32, psiR: 32, lug: 100,
        obd2: '1995: Chrysler OBD-I 6-pin connector under dash. 1996-2001: OBD-II port under driver side dashboard (16-pin).',
        note: 'Neon (1995-2001) — first-gen Neon; ACR and R/T versions were track-capable.'
      })
    },
    prowler: {
      '1997-2001': plymouthSpec({
        engine: '3.5L SOHC 24-valve V6 (250 hp)',
        oil: 'SAE 5W-30', oilCap: '5.0 qt (w/filter)',
        trans: '42RLE 4-speed auto (ATF+4)',
        sizes: ['225/45R17 front / 295/40R20 rear'],
        psiF: 30, psiR: 32, lug: 100,
        obd2: PLY_OBD2_1996,
        note: 'Prowler (1997-2001) — retro hot rod; aluminum body, 4-speed auto only.'
      })
    }
  },
  oldsmobile: {
    '88': {
      '1960-1999': oldsSpec({
        engine: 'Rocket V8: 330/350/403ci (1960s-70s); 307ci V8 (1980s); 231ci V6 (1986+)',
        oil: 'SAE 10W-30 (5W-30 for 1980s+ engines)', oilCap: '5.0 qt (w/filter)',
        trans: 'TH350/TH400 3-speed auto (Dexron II/III) — TH200-4R 4-speed auto (1981+)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (8.5" / 8.875" axle)', capacity: consult },
        sizes: ['7.50-14 (era) — P205/75R14 / P215/75R15 (later)'],
        psiF: 30, psiR: 30, lug: 100,
        obd2: OLDS_SPAN_OBD2,
        note: 'Dynamic 88 / Delta 88 (1965-1985) / 88 (1986-1999) — Oldsmobile full-size; front-drive from 1986.'
      })
    },
    '98': {
      '1960-1996': oldsSpec({
        engine: 'Rocket V8: 330/394/425ci (1960s); 455ci V8 (1968-1976); 307ci V8 / 3800 V6 (1980s-90s)',
        oil: 'SAE 10W-30 (5W-30 for 1980s+ engines)', oilCap: '5.0 qt (w/filter)',
        trans: 'TH400 3-speed auto (Dexron II/III) — TH440-T4 / 4T60 (front-drive, 1985+)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (RWD: 8.5" / 8.875" axle)', capacity: consult, note: 'Front-drive 98s (1985+): final drive in transaxle — no rear differential.' },
        sizes: ['8.00-14 / 8.50-14 (era) — P215/75R15 (later)'],
        psiF: 30, psiR: 30, lug: 100,
        obd2: OLDS_SPAN_OBD2,
        note: 'Ninety-Eight — Oldsmobile flagship since 1941; front-wheel drive from 1985.'
      })
    },
    '442': {
      '1964-1991': oldsSpec({
        engine: '330/400ci V8 (1964-1968); 455ci V8 (1968-1976); 403ci V8 / 260 diesel (1977-1980); 3.4L DOHC V6 (1990-1991 Cutlass Supreme 442)',
        oil: 'SAE 10W-30 (20W-50 for 455 — high-zinc)', oilCap: '5.0 qt (w/filter)',
        trans: 'TH350/TH400 3-speed auto (Dexron II/III) / M21/M22 4-speed manual (GL-4 80W-90) — 4T60-E (1990-1991 FWD)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (8.5" / 8.875" axle — Anti-Spin limited-slip: add friction modifier)', capacity: consult },
        sizes: ['F70-14 / G70-14 (era)'],
        psiF: 30, psiR: 30, lug: 100,
        obd2: OLDS_PRE96_OBD2,
        note: '442 (1964-1980 RWD muscle; 1990-1991 FWD revival) — "4-4-2": four-barrel, four-speed, dual exhaust.'
      })
    },
    cutlass: {
      '1961-1999': oldsSpec({
        engine: 'Rocket V8: 330/350/400/403/455ci (1960s-70s); 231ci V6 / 307ci V8 (1970s-80s RWD); 2.5L Tech IV I4 / 3.3L V6 (1980s-90s FWD)',
        oil: 'SAE 10W-30 (5W-30 for 1980s+ engines)', oilCap: '5.0 qt (w/filter)',
        trans: 'TH350/TH400 (RWD, Dexron II/III) — 3T40/4T60 (FWD, 1982+)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (RWD: 8.5" axle)', capacity: consult, note: 'Front-drive Cutlasses (1982+): final drive in transaxle.' },
        sizes: ['7.50-14 (era) — P195/75R14 / P205/70R14 (later)'],
        psiF: 30, psiR: 30, lug: 100,
        obd2: OLDS_SPAN_OBD2,
        note: 'Cutlass (1961-1999) — Oldsmobile best-seller; RWD muscle through 1987, front-drive after.'
      })
    },
    'cutlass supreme': {
      '1970-1997': oldsSpec({
        engine: '350/455ci V8 (1970-1977); 231/260/307 V8 & 350 diesel (1978-1987 RWD); 2.3L Quad 4 / 3.1L V6 / 3.4L DOHC V6 (1988-1997 FWD W-body)',
        oil: 'SAE 10W-30 (5W-30 for 1980s+ engines)', oilCap: '5.0 qt (V8 w/filter) / 4.5 qt (V6/Quad 4 w/filter)',
        trans: 'TH350/TH400 (RWD, Dexron II/III) — 4T60/4T60-E (FWD 1988+, Dexron III)',
        diffR: { fluidType: 'SAE 80W-90 GL-5 (RWD models)', capacity: consult, note: 'Front-drive Supreme (1988+): final drive in transaxle.' },
        sizes: ['F78-14 (era) — P195/75R14 / P205/70R15 (later)'],
        psiF: 30, psiR: 30, lug: 100,
        obd2: OLDS_SPAN_OBD2,
        note: 'Cutlass Supreme (1970-1997) — RWD muscle/colonnade coupe through 1987; W-body FWD coupe/sedan after.'
      })
    },
    'cutlass ciera': {
      '1982-1996': oldsSpec({
        engine: '2.5L Tech IV I4 / 2.8L & 3.3L V6 / 3.8L V6 (later years)',
        oil: 'SAE 5W-30 (10W-30 acceptable)', oilCap: '4.5 qt (w/filter)',
        trans: '3T40 3-speed auto (Dexron II/III) / 4T60 4-speed auto (Dexron III)',
        sizes: ['P185/75R14 / P195/75R14'],
        psiF: 30, psiR: 30, lug: 100,
        obd2: OLDS_SPAN_OBD2,
        note: 'Cutlass Ciera (1982-1996) — A-body front-drive; one of GM\'s most common 1980s-90s family cars.'
      })
    },
    toronado: {
      '1966-1992': oldsSpec({
        engine: '425ci V8 (1966-1970); 455ci V8 (1971-1978); 307ci V8 / 3800 V6 (1986-1992)',
        oil: 'SAE 10W-30 (5W-30 for later engines)', oilCap: '5.0 qt (w/filter)',
        trans: 'TH425 Turbo-Hydramatic transaxle (Dexron II/III) — TH440-T4 (1986+)',
        diffR: null,
        sizes: ['8.45-15 (era) — P215/75R15 (later)'],
        psiF: 30, psiR: 30, lug: 100,
        obd2: OLDS_PRE96_OBD2,
        note: 'Toronado (1966-1992) — the first American front-wheel-drive production car (1966).'
      })
    },
    silhouette: {
      '1990-2004': oldsSpec({
        engine: '3.1L V6 (1990-1995) / 3.4L V6 (1996-2004)',
        oil: 'SAE 5W-30', oilCap: '4.5 qt (w/filter)',
        trans: '3T40 3-speed auto (1990-1991, Dexron III) / 4T60-E 4-speed auto (1992+, Dexron III/VI)',
        sizes: ['P205/70R15 / P215/70R15'],
        psiF: 32, psiR: 32, lug: 100,
        obd2: OLDS_SPAN_OBD2,
        note: 'Silhouette (1990-2004) — GM U-body minivan; 1997+ got the dustbuster-style front end.'
      })
    },
    intrigue: {
      '1998-2002': oldsSpec({
        engine: '3.5L LX5 Shortstar DOHC V6 (215 hp)',
        oil: 'SAE 5W-30', oilCap: '4.5 qt (w/filter)',
        trans: '4T65-E 4-speed auto (Dexron III/VI)',
        sizes: ['P215/70R15 / P225/60R16'],
        psiF: 32, psiR: 32, lug: 100,
        obd2: OLDS_OBD2_1996,
        note: 'Intrigue (1998-2002) — W-body sedan; the all-aluminum Shortstar V6 was a highlight.'
      })
    },
    alero: {
      '1999-2004': oldsSpec({
        engine: '2.2L Ecotec I4 (1999-2002) / 2.4L Twin Cam I4 / 3.4L LA1 V6',
        oil: 'SAE 5W-30', oilCap: '4.5 qt (w/filter)',
        trans: '4T45-E 4-speed auto (I4, Dexron III/VI) / 4T65-E 4-speed auto (V6, Dexron III/VI)',
        sizes: ['P195/70R14 / P205/65R15 / P225/50R16 (GLS)'],
        psiF: 32, psiR: 32, lug: 100,
        obd2: OLDS_OBD2_1996,
        note: 'Alero (1999-2004) — the final Oldsmobile; N-body coupe/sedan.'
      })
    },
    aurora: {
      '1995-2003': oldsSpec({
        engine: '4.0L Northstar V8 (1995-1999, 250 hp); 3.5L Shortstar V6 / 4.0L Northstar (2001-2003)',
        oil: 'SAE 5W-30 (GM 4718M spec)', oilCap: '7.0 qt (4.0L w/filter)',
        trans: '4T80-E 4-speed auto (Dexron III/VI)',
        sizes: ['P235/60R16 (4.0L) / P225/60R16 (3.5L)'],
        psiF: 32, psiR: 32, lug: 100,
        obd2: OLDS_SPAN_OBD2,
        note: 'Aurora (1995-2003) — Oldsmobile flagship; 1995 is OBD 1.5 (ALDL), 1996+ is OBD-II. Northstar needs regular coolant condition checks.'
      })
    },
    bravada: {
      '1991-2004': oldsSpec({
        engine: '4.3L Vortec V6 (1991-2001) / 4.2L Vortec I6 (2002-2004)',
        oil: 'SAE 5W-30', oilCap: '4.5 qt (4.3L w/filter) / 6.0 qt (4.2L w/filter)',
        trans: '4L60-E 4-speed auto (Dexron III)',
        tcase: { fluidType: 'Dexron III ATF (SmartTrak AWD transfer case)', capacity: consult, note: 'All-time AWD (1991-2001); AWD optional 2002-2004.' },
        diffF: { fluidType: 'SAE 75W-90 GL-5 (front axle — AWD models)', capacity: consult },
        diffR: { fluidType: 'SAE 75W-90 GL-5 (rear axle)', capacity: consult },
        sizes: ['P235/70R15 / P235/70R16'],
        psiF: 32, psiR: 32, lug: 100,
        obd2: OLDS_SPAN_OBD2,
        note: 'Bravada (1991-2004) — luxury S-10-based SUV; the only Oldsmobile SUV.'
      })
    }
  }
};

// ── Wave 9 alias references (mirror MAINTENANCE_SCHEDULES grouping) ─────────
// AMC: platform groups
wave9Specs.amc['eagle sx/4'] = wave9Specs.amc.eagle;      // 1981-1983 within eagle range
wave9Specs.amc['eagle wagon'] = wave9Specs.amc.eagle;     // 1980-1988 within eagle range
wave9Specs.amc.concord = wave9Specs.amc.hornet;           // X-body, 2WD
wave9Specs.amc.spirit = wave9Specs.amc.hornet;            // X-body, 2WD
wave9Specs.amc.gremlin = wave9Specs.amc.hornet;           // X-body
wave9Specs.amc.amx = wave9Specs.amc.javelin;              // 1968-1970 within javelin range
wave9Specs.amc.ambassador = wave9Specs.amc.matador;       // 1958-1974 within matador range
// Rambler-era family (own year keys, same driveline data)
const ramblerFamily = {
  classic: { '1961-1966': wave9Specs.amc.rambler['1950-1969'] },
  rebel: { '1967-1970': wave9Specs.amc.rambler['1950-1969'] },
  marlin: { '1965-1967': wave9Specs.amc.rambler['1950-1969'] },
  machine: { '1969-1970': amcSpec({
    engine: '390ci V8 (340 hp) — Rebel Machine; high-zinc oil required',
    oil: 'SAE 20W-50 (high-zinc for flat-tappet cam)', oilCap: '5.0 qt (w/filter)',
    trans: 'TorqueFlite 727 3-speed auto (Dexron III) / Borg-Warner T-10 4-speed manual (GL-4 80W-90)',
    diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 20, Twin-Grip limited-slip)', capacity: consult },
    sizes: ['E70-14 (era)'],
    lug: 85,
    note: 'Rebel Machine (1969-1970) — AMC 390ci muscle; red-white-blue hood treatment.'
  }) },
  'sc/rambler': { '1969-1969': amcSpec({
    engine: '390ci V8 (315 hp) — SC/Rambler Hurst; high-zinc oil required',
    oil: 'SAE 20W-50 (high-zinc for flat-tappet cam)', oilCap: '5.0 qt (w/filter)',
    trans: 'Borg-Warner T-10 4-speed manual (GL-4 80W-90)',
    diffR: { fluidType: 'SAE 80W-90 GL-5 (AMC Model 20, Twin-Grip limited-slip)', capacity: consult },
    sizes: ['E70-14 (era)'],
    lug: 85,
    note: 'SC/Rambler (1969 only) — 1,512 built; "A" in the tail stripe stands for Air (scoops).'
  }) }
};
Object.assign(wave9Specs.amc, ramblerFamily);
wave9Specs.amc['cj-5'] = wave9Specs.amc['cj-7'];          // 1954-1983 within cj-7 range
wave9Specs.amc['cj-8 scrambler'] = wave9Specs.amc['cj-7']; // 1981-1985 within cj-7 range
// MG
wave9Specs.mg['mg b gt'] = wave9Specs.mg['mg b'];         // 1965-1980 within mg b range
wave9Specs.mg['mg montego'] = wave9Specs.mg['mg maestro']; // 1984-1991 within maestro range
// Plymouth
wave9Specs.plymouth.cuda = wave9Specs.plymouth.barracuda; // 1970-1974 within barracuda range
wave9Specs.plymouth['grand voyager'] = wave9Specs.plymouth.voyager; // 1987-2000 within voyager range
// Oldsmobile
wave9Specs.oldsmobile['delta 88'] = wave9Specs.oldsmobile['88']; // 1965-1985 within 88 range

// ── Wave 9 merge ────────────────────────────────────────────────────────────
for (const [make, models] of Object.entries(wave9Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}


// ── Wave 10: thin-auto coverage and high-value current aliases ─────────────
const wave10Spec = ({ engine, oil = consult, sparkPlugs = SPARK_PLUG_DEFAULT, oilCapacity = consult, transmission, tires = ['Consult owner\'s manual'], psi = consult, note, brake = 'DOT 3', obd = 'Under driver side dashboard, near the steering column.' }) => ({
  sparkPlugs: { ...sparkPlugs },
  engine: { oilViscosity: oil, oilCapacity, oilFilterPN: consult, coolantType: engine.includes('EV') ? 'EV thermal management coolant — consult owner\'s manual' : 'Manufacturer-specified long-life coolant', coolantCapacity: consult, description: engine },
  transmission: { fluidType: transmission, capacity: consult },
  transferCase: null,
  differentials: { front: null, rear: null },
  brakeFluid: brake,
  tires: { frontPSI: psi, rearPSI: psi, oemSizes: tires, lugNutTorque: consult },
  bulbs: { lowBeam: 'LED or halogen depending on trim — consult owner\'s manual', highBeam: 'LED or halogen depending on trim — consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'LED or vehicle-specific bulb — consult owner\'s manual', license: 'Consult owner\'s manual' },
  obd2Location: obd,
  ...(note ? { note } : {})
});
const wave10EV = (engine, transmission, note) => wave10Spec({ engine: `${engine} EV — no engine oil or oil filter service`, oil: 'N/A — full battery electric vehicle; no engine oil change', oilCapacity: 'N/A — no internal-combustion engine', transmission, note, brake: 'DOT 4' });
const wave10Specs = {
  chrysler: { pacifica: { '2017-2026': wave10Spec({ engine: '3.6L Pentastar V6 gasoline / 3.6L Pentastar V6 plug-in hybrid', oil: '0W-20 full synthetic', oilCapacity: '5.0 qt with filter (gasoline); PHEV consult owner\'s manual', transmission: 'Mopar ZF 9-speed automatic; PHEV electronically variable transmission', tires: ['235/65R17', '235/60R18', '245/50R20'], psi: 36, note: 'FWD or AWD gasoline models; PHEV is front-wheel drive.' }) } },
  pontiac: {
    solstice: { '2006-2010': wave10Spec({ engine: '2.4L Ecotec I4; 2.0L turbocharged Ecotec I4 (GXP)', oil: '5W-30', oilCapacity: '5.0 qt with filter', transmission: '5-speed manual or 5-speed automatic', tires: ['225/50R18', '245/45R18 (GXP)'], psi: 30, note: 'Rear-wheel drive.' }) },
    g8: { '2008-2009': wave10Spec({ engine: '3.6L V6; 6.0L LS2 V8 (GXP)', oil: '5W-30', oilCapacity: '6.0 qt with filter (V6); 6.0 qt with filter (V8)', transmission: '5L40E 5-speed automatic (V6) / 6L80 6-speed automatic or 6-speed manual (V8)', tires: ['245/45R18', '245/40R19 (GXP)'], psi: 35, note: 'Rear-wheel drive; Holden Commodore platform.' }) },
    vibe: { '2003-2010': wave10Spec({ engine: '1.8L or 2.4L Toyota I4', oil: '5W-30 (1.8L); 5W-20 (2.4L)', oilCapacity: '4.2 qt with filter (1.8L); 4.5 qt with filter (2.4L)', transmission: '5-speed manual or 4-speed automatic', tires: ['205/55R16', '215/50R17'], psi: 32, note: 'Front-wheel drive or all-wheel drive; Toyota Matrix twin.' }) },
    firebird: { '1993-2002': wave10Spec({ engine: '3.8L V6; 5.7L LT1 or LS1 V8', oil: '5W-30', oilCapacity: '4.5 qt with filter (V6); 5.5 qt with filter (V8)', transmission: '4L60E 4-speed automatic or T-56 6-speed manual', tires: ['215/60R16', '245/50R16', '275/40ZR17 (Trans Am)'], psi: 30, brake: 'DOT 3', note: 'Rear-wheel drive; OBD-II on 1996-2002 models.' }) }
  },
  mitsubishi: { lancer: { '2008-2017': wave10Spec({ engine: '2.0L or 2.4L I4 (Lancer Evolution is separate)', oil: '5W-20 or 5W-30', oilCapacity: '4.5 qt with filter', transmission: 'CVT or 5-speed manual', tires: ['205/60R16', '215/45R18'], psi: 32, note: 'Front-wheel drive or AWD depending on trim; Evolution specifications differ.' }) } },
  dodge: { 'grand caravan': { '2008-2020': wave10Spec({ engine: '3.6L Pentastar V6 (2011-2020); 3.3L/3.8L V6 (2008-2010)', oil: '5W-20 (3.6L)', oilCapacity: '5.9 qt with filter (3.6L)', transmission: '62TE 6-speed automatic', tires: ['225/65R17', '235/60R16'], psi: 36, note: 'Front-wheel drive.' }) } },
  jeep: { 'grand wagoneer': { '2022-2026': wave10Spec({ engine: '6.4L HEMI V8; 3.0L Hurricane twin-turbo I6', oil: '0W-40 full synthetic (6.4L); 0W-30 (3.0L Hurricane)', oilCapacity: '7.0 qt with filter (6.4L); consult owner\'s manual (3.0L)', transmission: 'ZF 8HP75 8-speed automatic', tires: ['265/65R18', '275/55R20', '285/45R22'], psi: 36, note: 'Four-wheel drive.' }) } },
  hyundai: { 'ioniq 5': { '2022-2026': wave10EV('Hyundai Ioniq 5 58/77.4 kWh battery, RWD or AWD', 'Single-speed electric gear reduction unit; Hyundai EV reduction gear oil', 'No engine oil, transmission fluid, spark plugs, or exhaust service. Reduction-unit fluid is vehicle-specific.') }, 'santa cruz': { '2022-2026': wave10Spec({ engine: '2.5L I4; 2.5L turbocharged I4', oil: '0W-20 (2.5L); 0W-30 (turbo)', oilCapacity: '5.1 qt with filter (2.5L); consult owner\'s manual (turbo)', transmission: '8-speed automatic or 8-speed wet dual-clutch automatic', tires: ['245/60R18', '245/50R20'], psi: 35, note: 'FWD or HTRAC AWD.' }) } },
  nissan: { armada: { '2017-2026': wave10Spec({ engine: '5.6L Endurance V8', oil: '0W-20 full synthetic', oilCapacity: '6.9 qt with filter', transmission: '7-speed automatic', tires: ['275/60R20', '275/50R22'], psi: 35, note: 'RWD or 4WD.' }) }, leaf: { '2011-2026': wave10EV('Nissan LEAF 24/30/40/62 kWh battery, front-wheel drive', 'Single-speed electric gear reduction unit; Nissan Genuine Matic S or specified reduction gear fluid', 'No engine oil or conventional transmission service; reduction gear fluid and battery cooling/brake systems follow the owner\'s manual.') } },
  mazda: { mazda3: { '2014-2026': wave10Spec({ engine: '2.0L or 2.5L SKYACTIV-G I4; 2.5L turbocharged SKYACTIV-G', oil: '0W-20 (2.0L/2.5L); 5W-30 (2.5L turbo where specified)', oilCapacity: '4.5 qt with filter (2.0L); 5.0 qt with filter (2.5L)', transmission: '6-speed SKYACTIV-Drive automatic or 6-speed manual', tires: ['205/60R16', '215/45R18', '215/50R18'], psi: 36, note: 'FWD or AWD depending on year/trim.' }) } },
  volkswagen: { 'id.4': { '2021-2026': wave10EV('Volkswagen ID.4 battery electric motor, RWD or AWD', 'Single-speed electric drive gearbox; VW-approved gear oil', 'No engine oil, oil filter, spark plug, or conventional transmission service.') } },
  gmc: { sierra: { '2019-2026': wave10Spec({ engine: '2.7L turbo I4; 5.3L/6.2L V8; 3.0L Duramax turbo-diesel I6', oil: '0W-20 (gasoline); dexosD 0W-20 or 5W-30 diesel — verify engine', oilCapacity: 'Consult owner\'s manual by engine', transmission: '8-speed or 10-speed automatic', tires: ['255/70R17', '275/60R20', '275/50R22'], psi: 35, note: '2WD or 4WD; engine-specific fluids and capacities vary.' }) } , yukon: { '2015-2026': wave10Spec({ engine: '5.3L/6.2L V8; 3.0L Duramax turbo-diesel I6 (2021+)', oil: '0W-20 gasoline; diesel specification varies by model year', oilCapacity: 'Consult owner\'s manual by engine', transmission: '6-speed automatic (earlier) or 10-speed automatic', tires: ['265/65R18', '275/55R20', '275/50R22'], psi: 35, note: '2WD or 4WD; engine-specific fluids and capacities vary.' }) } },
  lexus: { nx: { '2015-2026': wave10Spec({ engine: 'NX 250/350 2.5L I4; NX 350 2.4L turbo; NX 350h hybrid; NX 450h+ plug-in hybrid', oil: '0W-16 or 0W-20 depending on engine', oilCapacity: 'Consult owner\'s manual by engine', transmission: '8-speed automatic (gas); eCVT (hybrid and plug-in hybrid)', tires: ['225/65R17', '235/60R18', '235/50R20'], psi: 35, note: 'FWD/AWD availability varies by powertrain and year.' }) } },
  acura: { integra: { '2023-2026': wave10Spec({ engine: '1.5L turbocharged I4; 2.0L turbocharged I4 (Type S)', oil: '0W-20', oilCapacity: '4.8 qt with filter (1.5L); consult owner\'s manual (Type S)', transmission: 'CVT or 6-speed manual (Type S)', tires: ['235/40R18', '265/30ZR19 (Type S)'], psi: 35, note: 'Front-wheel drive.' }) } },
  kia: { k5: { '2021-2026': wave10Spec({ engine: '1.6L turbocharged I4; 2.5L turbocharged I4 (GT)', oil: '0W-20', oilCapacity: '5.5 qt with filter (1.6L); 6.0 qt with filter (2.5L)', transmission: '8-speed automatic or 8-speed wet dual-clutch automatic (GT)', tires: ['235/45R18', '245/40R19'], psi: 35, note: 'FWD or AWD depending on trim.' }) } }
};
for (const [make, models] of Object.entries(wave10Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}

// ═══════════════════════════════════════════════════════════════════════════
// Wave 11: final real-model automotive coverage — Chevrolet Camaro, Ford
// Bronco/Ranger/Maverick, Toyota GR86/bZ4X (first Toyota EV), International LT
// (Class 8 semi). Model keys match MAINTENANCE_SCHEDULES model lists. Values
// from OEM owner's manuals / service data; unverifiable values marked consult.
// ═══════════════════════════════════════════════════════════════════════════
const wave11Spec = ({ engine, oil = consult, sparkPlugs = SPARK_PLUG_DEFAULT, oilCapacity = consult, coolant, transmission, transNote, tcase = null, diffF = null, diffR = null, tires = ['Consult owner\'s manual'], psi = consult, brake = 'DOT 3', obd = 'Under driver side dashboard, near the steering column.', note }) => ({
  sparkPlugs: { ...sparkPlugs },
  engine: {
    oilViscosity: oil,
    oilCapacity,
    oilFilterPN: consult,
    coolantType: coolant || (engine.includes('EV') ? 'EV thermal management coolant — consult owner\'s manual' : 'Manufacturer-specified long-life coolant'),
    coolantCapacity: consult,
    description: engine
  },
  transmission: { fluidType: transmission, capacity: consult, ...(transNote ? { note: transNote } : {}) },
  transferCase: tcase,
  differentials: { front: diffF, rear: diffR },
  brakeFluid: brake,
  tires: { frontPSI: psi, rearPSI: psi, oemSizes: tires, lugNutTorque: consult },
  bulbs: { lowBeam: 'LED or halogen depending on trim — consult owner\'s manual', highBeam: 'LED or halogen depending on trim — consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'LED or vehicle-specific bulb — consult owner\'s manual', license: 'Consult owner\'s manual' },
  obd2Location: obd,
  ...(note ? { note } : {})
});
const wave11Specs = {
  chevrolet: {
    camaro: {
      '2016-2026': wave11Spec({
        engine: '2.0L turbo I4 (2016-2023); 3.6L V6; 6.2L LT1 V8 (SS); 6.2L LT4 supercharged V8 (ZL1)',
        oil: '5W-30 dexos1 full synthetic (2.0T, 3.6L); 0W-40 dexos2 full synthetic (LT1/LT4)',
        oilCapacity: '5.0 qt w/filter (2.0T); 5.5 qt w/filter (3.6L); 10.0 qt w/filter (LT1/LT4) — approx',
        coolant: 'Dex-Cool (OAT, orange)',
        transmission: '6-speed manual (Tremec TR-3160 on 2.0T/3.6, TR-6060 on SS/ZL1); 8-speed automatic (8L45 on 2.0T/3.6, 8L90 on SS); 10-speed automatic (10L80 SS, 10L90 ZL1, 2019+)',
        transNote: 'DEXRON HP (8-speed); DEXRON ULV (10-speed); Tremec/GM manual transmission fluid (manual)',
        diffR: { fluidType: '75W-90 GL-5 (SS/ZL1 limited-slip w/ friction modifier); 75W-85 GL-5 (2.0T/3.6)', capacity: '1.7 qt approx' },
        tires: ['245/45R18 (base)', '245/40R20 F / 275/35R20 R (SS)', '285/30ZR20 F / 305/30ZR20 R (ZL1)'],
        psi: 36,
        brake: 'DOT 4 (SS/ZL1); DOT 3 acceptable on base trims — verify',
        note: 'Rear-wheel drive. 1LE package uses wider/stickier tires — see door sticker. ZL1 has extra front brake cooling ducts to inspect.'
      })
    }
  },
  ford: {
    bronco: {
      '2021-2026': wave11Spec({
        engine: '2.3L EcoBoost I4; 2.7L EcoBoost V6; 3.0L EcoBoost V6 (Raptor)',
        oil: '5W-30 full synthetic',
        oilCapacity: '6.0 qt w/filter (2.3L); 6.0 qt w/filter (2.7L); 6.0 qt w/filter (3.0L) — approx',
        coolant: 'Motorcraft Orange (OAT, prediluted)',
        transmission: '7-speed manual (Getrag MTI-550, 2.3L only) or 10-speed automatic (10R60)',
        transNote: 'MERCON ULV (10R60); manual transmission fluid per Ford spec',
        tcase: { fluidType: 'Motorcraft MERCON LV (2-speed part-time); full-time 4A unit: MERCON ULV — verify', capacity: consult },
        diffF: { fluidType: '75W-85 GL-5 (front axle; electronic locker on higher trims)', capacity: consult },
        diffR: { fluidType: '75W-85 GL-5 (rear axle; electronic locker)', capacity: consult },
        tires: ['255/70R16', '255/75R17', '285/70R17', '315/70R17 (Sasquatch)', '37x12.50R17LT (Raptor)'],
        psi: 35,
        brake: 'DOT 4 Low Viscosity',
        note: 'Four-wheel drive (part-time or full-time). Sasquatch and Raptor run larger tires with different pressures — use the door sticker. Heavy off-road use shortens axle/transfer case service intervals.'
      })
    },
    ranger: {
      '2019-2026': wave11Spec({
        engine: '2.3L EcoBoost I4; 2.7L or 3.0L EcoBoost V6 (Raptor, 2024+)',
        oil: '5W-30 full synthetic',
        oilCapacity: '6.0 qt w/filter (2.3L); Raptor engines consult owner\'s manual',
        coolant: 'Motorcraft Orange (OAT, prediluted)',
        transmission: '10-speed automatic (10R80; 10R60 on Raptor)',
        transNote: 'MERCON ULV',
        tcase: { fluidType: 'Motorcraft MERCON LV (part-time 4WD transfer case)', capacity: consult },
        diffF: { fluidType: '75W-85 GL-5 (front independent axle)', capacity: consult },
        diffR: { fluidType: '75W-85 GL-5 (8.8-inch rear axle; electronic locking on some trims)', capacity: consult },
        tires: ['255/70R16', '265/70R17', '265/60R18', '285/70R17 (Raptor)'],
        psi: 35,
        brake: 'DOT 4 Low Viscosity',
        note: 'RWD or 4WD. 2019-2023 are 2.3L only; 2024+ adds Raptor with the 2.7L/3.0L EcoBoost V6.'
      })
    },
    maverick: {
      '2022-2026': wave11Spec({
        engine: '2.5L hybrid I4 (eCVT) / 2.0L EcoBoost I4 (8-speed automatic)',
        oil: '0W-20 full synthetic (2.5L hybrid); 5W-30 full synthetic (2.0L EcoBoost)',
        oilCapacity: '5.0 qt w/filter (hybrid); 5.5 qt w/filter (EcoBoost) — approx',
        coolant: 'Motorcraft Orange (OAT, prediluted)',
        transmission: 'eCVT (hybrid, FWD); 8F35 8-speed automatic (EcoBoost)',
        transNote: 'MERCON ULV (both)',
        tcase: { fluidType: 'Motorcraft MERCON ULV (power transfer unit on AWD EcoBoost models only)', capacity: consult },
        diffR: { fluidType: '75W-85 GL-5 (rear drive unit, AWD EcoBoost)', capacity: consult },
        tires: ['225/65R17', '225/60R18', '245/45R19 (Tremor)'],
        psi: 35,
        brake: 'DOT 4 Low Viscosity',
        note: 'Compact unibody pickup. Hybrid is front-wheel drive; EcoBoost offers AWD with a power transfer unit (PTU) and rear drive unit.'
      })
    }
  },
  toyota: {
    gr86: {
      '2022-2026': wave11Spec({
        engine: '2.4L FA24D boxer I4 (Subaru-built)',
        oil: '0W-20 full synthetic (5W-30 for track use)',
        oilCapacity: '5.4 qt w/filter',
        coolant: 'Toyota Super Long Life Coolant (pink)',
        transmission: '6-speed manual or 6-speed automatic',
        transNote: '6AT: Toyota Genuine ATF WS; 6MT: 75W-90 GL-4 manual transmission fluid',
        diffR: { fluidType: 'Toyota Differential Gear Oil LT 75W-85 GL-5', capacity: '1.2 qt approx' },
        tires: ['215/40R18', '235/40R18'],
        psi: 35,
        brake: 'DOT 3 or DOT 4',
        note: 'Rear-wheel drive sports coupe; Subaru BRZ twin. Frequent high-RPM/track driving warrants shorter oil and fluid intervals.'
      })
    },
    bz4x: {
      '2023-2026': wave11Spec({
        engine: 'EV — single front motor (FWD) or dual front+rear motors (AWD); 71.4 kWh lithium-ion battery',
        oil: 'N/A — full battery electric; no engine oil change',
        oilCapacity: 'N/A — no internal-combustion engine',
        coolant: 'Toyota Super Long Life Coolant (pink) — EV thermal management and cabin heat',
        transmission: 'Single-speed gear reduction unit (front; AWD adds rear reduction unit)',
        transNote: 'Toyota Genuine reduction gear fluid — drain and refill per maintenance schedule (60,000 mi / 48 mo)',
        tires: ['235/60R18', '235/50R20'],
        psi: 36,
        brake: 'DOT 3',
        note: 'First Toyota EV in the reference library. No engine oil, transmission fluid, spark plugs, or exhaust service. Coolant serves battery thermal management and cabin heat. Brake fluid test every 2 years (regenerative braking).'
      })
    }
  },
  international: {
    lt: {
      '2017-2026': semiSpec('Cummins X15 or International A26 (LT series)', '15W-40 CJ-4/CK-4 diesel oil', 'Eaton Fuller 10/13/18-speed manual or Allison automatic', '2017-2025')
    }
  }
};
for (const [make, models] of Object.entries(wave11Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}

// ── Wave 12: Kawasaki PWC and Cummins marine diesel audit coverage ───────────
const wave12PwcSpec = (engineDescription, oilViscosity, jetPumpNote) => ({
  ...pwcSpec(
    engineDescription,
    oilViscosity,
    'Kawasaki closed-loop cooling system — premixed marine coolant; consult owner\'s manual',
    'N/A — no service brakes on PWC',
    'Kawasaki Diagnostic System (KDS) connector under the seat; no OBD-II.'
  ),
  serviceUnit: 'hrs',
  differentials: {
    front: null,
    rear: {
      fluidType: 'Kawasaki jet pump gear oil / final drive lubricant',
      capacity: "Consult owner's manual",
      note: jetPumpNote
    }
  }
});
const wave12MarineDieselSpec = (engineDescription, oilViscosity, oilCapacity) => ({
  ...marineDieselSpec(
    engineDescription,
    oilViscosity,
    oilCapacity,
    'Cummins Insite via J1939/CAN data link connector near the engine; no OBD-II. Analog gauges may be fitted.'
  ),
  serviceUnit: 'hrs',
  transmission: {
    fluidType: 'ZF or Hurth marine transmission/gear oil — installed marine gear specification applies',
    capacity: "Consult owner's manual (gearbox-specific)",
    note: 'Marine gear is separate from the engine; verify the installed ZF/Hurth model and use its approved fluid.'
  },
  note: `${engineDescription}. Wet exhaust system; hour-based service intervals. No OBD-II — J1939 or analog gauges.`
});
const wave12Specs = {
  kawasaki: {
    'stx 160': {
      '2018-2026': wave12PwcSpec('Kawasaki STX 160 — 1.6L 4-stroke naturally aspirated marine engine (160 hp)', '10W-40 4-stroke marine oil', 'Jet pump final drive; use Kawasaki-specified gear oil and verify level/service interval.')
    },
    'sx-r': {
      '2017-2026': wave12PwcSpec('Kawasaki SX-R — 1.5L 4-stroke stand-up PWC engine', '10W-40 4-stroke marine oil', 'Jet pump final drive; use Kawasaki-specified lubricant and verify service procedure.')
    }
  },
  cummins: {
    qsb: { '2005-2026': wave12MarineDieselSpec('Cummins QSB 6.7 marine diesel', 'SAE 15W-40 CJ-4/CK-4', 'Approximately 19 qt; verify oil pan configuration in owner\'s manual') },
    qsl: { '2005-2026': wave12MarineDieselSpec('Cummins QSL 9 marine diesel', 'SAE 15W-40 CJ-4/CK-4', 'Approximately 28 qt; verify oil pan configuration in owner\'s manual') },
    qsx15: { '2005-2026': wave12MarineDieselSpec('Cummins QSX15 heavy-duty marine diesel', 'SAE 15W-40 CJ-4/CK-4', 'Approximately 44 qt; verify oil pan configuration in owner\'s manual') },
    '6bta': { '1990-2006': wave12MarineDieselSpec('Cummins 6BTA 5.9 legacy mechanical-injection marine diesel', 'SAE 15W-40', 'Approximately 15 qt; verify engine configuration in owner\'s manual') },
    '6cta': { '1990-2006': wave12MarineDieselSpec('Cummins 6CTA 8.3 legacy mechanical-injection marine diesel', 'SAE 15W-40', 'Approximately 22 qt; verify engine configuration in owner\'s manual') }
  }
};
for (const [make, models] of Object.entries(wave12Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}


// Wave 13 — classic Yanmar YM-series tractor reference specs (1975-1990 era).
// YT/SA series were already added in Wave 7; this closes the remaining
// yanmar-ag maintenance-schedule gap (ym2000/ym1500/ym2500/ym3000/ym336/ym342/ym347/ym359).
const agTractorSpec = (engineDescription, oilViscosity, hydraulicFluid, transmissionNote, fourWheelDrive = false) => ({
  engine: {
    oilViscosity,
    oilCapacity: "Consult owner's manual",
    oilFilterPN: "Consult owner's manual (OEM filter)",
    coolantType: 'Ethylene-glycol diesel coolant (Yanmar OEM specification; green IAT on classic YM models — verify SCA requirements)',
    coolantCapacity: "Consult owner's manual"
  },
  transmission: {
    fluidType: hydraulicFluid,
    capacity: "Consult owner's manual",
    note: transmissionNote + '; use the manufacturer-specified UTF (Yanmar TF500A / John Deere Hy-Gard or JD 303 equivalent) only.'
  },
  transferCase: null,
  differentials: {
    front: fourWheelDrive ? { fluidType: 'Manufacturer-specified front axle gear oil', capacity: "Consult owner's manual", note: '4WD/front axle models only; 2WD models: N/A.' } : null,
    rear: { fluidType: 'Manufacturer-specified rear axle gear oil', capacity: "Consult owner's manual", note: 'Drive-axle models only; verify axle configuration.' }
  },
  brakeFluid: 'N/A — wet hydraulic tractor brakes; no automotive brake-fluid reservoir',
  tires: { frontPSI: 'Consult owner\'s manual', rearPSI: 'Consult owner\'s manual', oemSizes: ['Consult owner\'s manual'], lugNutTorque: "Consult owner's manual" },
  bulbs: { lowBeam: 'Consult owner\'s manual', highBeam: 'Consult owner\'s manual', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'N/A', license: 'N/A' },
  obd2Location: 'No OBD-II. Yanmar diesel service/diagnostic port location varies by model era; consult the operator manual.',
  serviceUnit: 'hrs',
  note: engineDescription + '. Hour-based maintenance intervals; verify exact interval and fluid capacity in the model-year operator manual.'
});
const wave13Specs = {
  'yanmar tractor': {
    ym1500: { '1975-1990': agTractorSpec('Yanmar YM1500 — classic 2-cylinder diesel (2T72UA), ~15 hp gear-drive compact tractor', 'SAE 15W-40 diesel engine oil (CJ-4)', 'Yanmar hydraulic fluid or John Deere 303 equivalent', 'Manual gear transmission (8F/2R typical), 2WD') },
    ym2000: { '1975-1990': agTractorSpec('Yanmar YM2000 — classic 2-cylinder diesel (2T75), ~20 hp gear-drive compact tractor', 'SAE 15W-40 diesel engine oil (CJ-4)', 'Yanmar hydraulic fluid or John Deere 303 equivalent', 'Manual gear transmission (8F/2R typical), 2WD') },
    ym2500: { '1975-1990': agTractorSpec('Yanmar YM2500 — classic 3-cylinder diesel (3T75), ~25 hp gear-drive compact tractor', 'SAE 15W-40 diesel engine oil (CJ-4)', 'Yanmar hydraulic fluid or John Deere 303 equivalent', 'Manual gear transmission, 2WD') },
    ym3000: { '1975-1990': agTractorSpec('Yanmar YM3000 — classic 3-cylinder diesel (3T80), ~30 hp gear-drive compact tractor', 'SAE 15W-40 diesel engine oil (CJ-4)', 'Yanmar hydraulic fluid or John Deere 303 equivalent', 'Manual gear transmission, 2WD') },
    ym336: { '1975-1990': agTractorSpec('Yanmar YM336 — 3-cylinder diesel (3T84), ~33 hp compact tractor', 'SAE 15W-40 diesel engine oil (CJ-4); 10W-30 acceptable in cold climates', 'Yanmar TF500A hydraulic/transmission fluid or John Deere Hy-Gard J20C equivalent', 'Hydrostatic (HST) or gear transmission option; shared hydraulic/transmission reservoir', true) },
    ym342: { '1975-1990': agTractorSpec('Yanmar YM342 — 3-cylinder diesel, ~34 hp compact tractor', 'SAE 15W-40 diesel engine oil (CJ-4); 10W-30 acceptable in cold climates', 'Yanmar TF500A hydraulic/transmission fluid or John Deere Hy-Gard J20C equivalent', 'Hydrostatic (HST) or gear transmission option; shared hydraulic/transmission reservoir', true) },
    ym347: { '1975-1990': agTractorSpec('Yanmar YM347 — 3-cylinder diesel, ~35 hp compact tractor (4WD variant)', 'SAE 15W-40 diesel engine oil (CJ-4); 10W-30 acceptable in cold climates', 'Yanmar TF500A hydraulic/transmission fluid or John Deere Hy-Gard J20C equivalent', 'Hydrostatic (HST) or gear transmission option; shared hydraulic/transmission reservoir', true) },
    ym359: { '1975-1990': agTractorSpec('Yanmar YM359 — 3-cylinder diesel, ~36 hp compact tractor (4WD variant)', 'SAE 15W-40 diesel engine oil (CJ-4); 10W-30 acceptable in cold climates', 'Yanmar TF500A hydraulic/transmission fluid or John Deere Hy-Gard J20C equivalent', 'Hydrostatic (HST) or gear transmission option; shared hydraulic/transmission reservoir', true) }
  }
};
for (const [make, models] of Object.entries(wave13Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}

// ── Wave 14: John Deere tractor and Gator utility vehicle audit coverage ────
// Shared factories keep the model entries consistent while preserving the
// drivetrain/fluid distinctions called out by the John Deere operator manuals.
const jdGatorSpec = (engineDescription, fuelType) => ({
  ...agSpec(engineDescription, fuelType === 'diesel' ? '15W-40 diesel oil' : '10W-30 gasoline engine oil', 'John Deere Hy-Gard or Low-Viscosity Hy-Gard'),
  transmission: {
    fluidType: 'John Deere Hy-Gard or Low-Viscosity Hy-Gard',
    capacity: "Consult owner's manual",
    note: 'CVT belt drive/transaxle; use the fluid specified for the installed transaxle and model year.'
  },
  obd2Location: 'No OBD-II. Small-engine diagnostic connector/service port; consult the model-year service manual.',
  note: `${engineDescription} (${fuelType}). CVT belt-drive utility vehicle; hour-based intervals and model-specific capacities apply.`
});
const wave14Specs = {
  'john deere': {
    // R-series row-crop/utility tractors: diesel, Hy-Gard, IVT or PowerShift, 4WD.
    '6r': { '2015-2026': agSpec('John Deere 6R Series — diesel row-crop/utility tractor; IVT or PowerShift', '15W-40 JD Plus-50 II diesel oil', 'John Deere Hy-Gard') },
    '5r': { '2015-2026': agSpec('John Deere 5R Series — diesel compact utility tractor; IVT or PowerShift', '15W-40 JD Plus-50 II diesel oil', 'John Deere Hy-Gard') },
    '7r': { '2015-2026': agSpec('John Deere 7R Series — diesel row-crop tractor; IVT or PowerShift', '15W-40 JD Plus-50 II diesel oil', 'John Deere Hy-Gard') },
    '8r': { '2015-2026': agSpec('John Deere 8R Series — diesel row-crop tractor; IVT or PowerShift', '15W-40 JD Plus-50 II diesel oil', 'John Deere Hy-Gard') },
    '9r': { '2015-2026': agSpec('John Deere 9R Series — diesel articulated/row-crop tractor; IVT or PowerShift', '15W-40 JD Plus-50 II diesel oil', 'John Deere Hy-Gard') },
    // 3/4/5 Series compact and utility tractors.
    '3000': { '2015-2026': agSpec('John Deere 3 Series compact tractor — 3-cylinder Yanmar diesel; HST or gear', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '3039r': { '2015-2026': agSpec('John Deere 3039R — 3-cylinder Yanmar diesel compact tractor; HST', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '3046r': { '2015-2026': agSpec('John Deere 3046R — 3-cylinder Yanmar diesel compact tractor; HST', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '4000': { '2015-2026': agSpec('John Deere 4 Series compact tractor — 4-cylinder diesel; HST or gear', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '4105': { '2015-2026': agSpec('John Deere 4105 — 4-cylinder diesel compact utility tractor; gear drive', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '4120': { '2015-2026': agSpec('John Deere 4120 — 4-cylinder diesel compact utility tractor; HST or gear', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '4052m': { '2015-2026': agSpec('John Deere 4052M — 4-cylinder diesel compact utility tractor; HST', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '5000': { '2015-2026': agSpec('John Deere 5 Series utility tractor — 3- or 4-cylinder diesel', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '5045e': { '2015-2026': agSpec('John Deere 5045E — 3-cylinder diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '5055e': { '2015-2026': agSpec('John Deere 5055E — 3-cylinder diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '5065e': { '2015-2026': agSpec('John Deere 5065E — 3-cylinder diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    // Gator utility vehicles: gasoline/diesel engine oil and CVT transaxle fluid.
    'xuv': { '2015-2026': jdGatorSpec('John Deere Gator XUV utility vehicle', 'gasoline/diesel') },
    'xuv825m': { '2015-2026': jdGatorSpec('John Deere Gator XUV825M — 812cc gasoline utility vehicle', 'gasoline') },
    'xuv865m': { '2015-2026': jdGatorSpec('John Deere Gator XUV865M — diesel utility vehicle', 'diesel') },
    'xuv590e': { '2015-2026': jdGatorSpec('John Deere Gator XUV590E — gasoline utility vehicle', 'gasoline') },
    'xuv560e': { '2015-2026': jdGatorSpec('John Deere Gator XUV560E — gasoline utility vehicle', 'gasoline') },
    'gator-xuv-835': { '2015-2026': jdGatorSpec('John Deere Gator XUV835 — gasoline utility vehicle', 'gasoline') },
    'gator-hpx': { '2015-2026': jdGatorSpec('John Deere Gator HPX — gasoline/diesel utility vehicle', 'gasoline/diesel') },
    'gator-te': { '2015-2026': jdGatorSpec('John Deere Gator TE — electric utility vehicle', 'electric') },
    'gator-tx': { '2015-2026': jdGatorSpec('John Deere Gator TX — gasoline utility vehicle', 'gasoline') }
  }
};
for (const [make, models] of Object.entries(wave14Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}

// ── Wave 15: individual Hyster IC/legacy forklift model coverage ────────────
// These names are explicit maintenance-schedule model keys, not duplicates of
// Wave 7's grouped aliases (h40-60ft, h70-110ft, s40-70ft, h50ct).
const wave15ForkliftSpec = (engineDescription, oilViscosity, transmission, hydraulicFluid, yearRange) => {
  const spec = forkliftSpec(engineDescription, 'diesel/LP', hydraulicFluid);
  return {
    ...spec,
    engine: { ...spec.engine, oilViscosity },
    transmission: { ...spec.transmission, fluidType: transmission },
    note: `${engineDescription}. Oil viscosity varies by fuel, ambient temperature, and engine; verify the serial-number operator manual. No OBD-II — use the engine hour meter, hydraulic pressure gauges, and Hyster service tool.`,
    yearRange
  };
};
const wave15Specs = { hyster: {} };
const hysterModern = ['h50', 'h60', 'h70', 'h80', 'h100', 'h120', 's50', 's60', 's70'];
for (const model of hysterModern) {
  wave15Specs.hyster[model] = {
    '2000-2026': wave15ForkliftSpec(
      `Hyster ${model.toUpperCase()} internal-combustion counterbalanced forklift — LP gas or diesel configuration`,
      'SAE 10W-30 (LP gas) or SAE 15W-40 (diesel)',
      'Dexron III ATF or Hyster HTF powershift fluid',
      'ISO 32 or AW-32 hydraulic fluid',
      '2000-2025'
    )
  };
}
for (const model of ['50', 'h50a', 'h50b', 'h50c']) {
  wave15Specs.hyster[model] = {
    '1970-1999': wave15ForkliftSpec(
      `Hyster ${model.toUpperCase()} legacy internal-combustion forklift — model-year engine and fuel configuration varies`,
      'SAE 30W or SAE 10W-30',
      'Dexron II or Dexron III ATF / Hyster-approved transmission fluid',
      'ISO 32 or AW-32 hydraulic fluid',
      '1970-1999'
    )
  };
}
for (const [make, models] of Object.entries(wave15Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}
// ── Wave 16: final RV reference-spec audit gaps ─────────────────────────────
// These models are present in MAINTENANCE_SCHEDULES but were not covered by
// Wave 8. Values are chassis-level references; verify VIN/build-specific data
// in both the chassis and coach owner's manuals.
const wave16Specs = {
  winnebago: {
    solis: {
      '2020-2026': rvSpec(
        'Mercedes-Benz Sprinter chassis, 2.0L turbo-diesel',
        'MB 229.52 5W-30 full-synthetic diesel oil',
        'Mercedes-Benz 7G-Tronic automatic',
        'Onan gasoline generator oil',
        '2020-2025'
      )
    },
    ekko: {
      '2022-2026': rvSpec(
        'Ford Transit AWD chassis, 3.5L EcoBoost V6 gasoline',
        '5W-30 full-synthetic Ford-spec oil',
        'Ford 10-speed automatic',
        'Onan gasoline generator oil',
        '2022-2025'
      )
    }
  },
  thor: {
    'four winds': {
      '2015-2026': rvSpec(
        'Ford E-350/E-450 chassis, 7.3L Godzilla V8 or 6.8L Triton V10 gasoline',
        '5W-20/5W-30 chassis oil (engine and model year dependent)',
        'Ford TorqShift 6-speed automatic',
        'Onan gasoline generator oil',
        '2015-2025'
      )
    },
    tellaro: {
      '2022-2026': rvSpec(
        'Ram ProMaster chassis, 3.6L Pentastar V6 gasoline',
        '0W-20 full-synthetic oil',
        'Ram 9-speed automatic, front-wheel drive',
        'Onan gasoline generator oil',
        '2022-2025'
      )
    }
  },
  airstream: {
    atlas: {
      '2019-2026': rvSpec(
        'Mercedes-Benz Sprinter chassis, turbo-diesel',
        'MB 229.52 5W-30 full-synthetic diesel oil',
        'Mercedes-Benz 7G-Tronic/9G-Tronic automatic',
        'Onan diesel generator oil',
        '2019-2025'
      )
    },
    bambi: {
      '2015-2026': rvSpec(
        'Trailer — no engine or transmission. See tow vehicle specs.',
        'N/A — no chassis engine',
        'N/A — travel trailer',
        'N/A or consult generator manual',
        '2015-2025'
      )
    }
  }
};
for (const [make, models] of Object.entries(wave16Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) {
    referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Wave 17: final-audit gap closure — last genuinely missing reference-specs
// entries (models present in MAINTENANCE_SCHEDULES with no per-model spec,
// plus earlier-year coverage for Wave 14 John Deere family keys). Values
// follow the same factory conventions as prior waves; unverifiable specifics
// are marked "Consult owner's manual".
// ═══════════════════════════════════════════════════════════════════════════
const wave17Specs = {
  mercury: {
    verado: {
      '2005-2014': {
        ...marineOutboardSpec(
          'Mercury Verado — supercharged 4-stroke outboard (2.6L/3.4L V6 generations, 200-300 hp)',
          'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
          'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
          'Mercury SmartCraft / VesselView diagnostic connector under the cowl — dealer software; no OBD-II port.'),
        serviceUnit: 'hrs'
      },
      '2015-2026': {
        ...marineOutboardSpec(
          'Mercury Verado — supercharged 4-stroke outboard (3.4L V6 / 4.6L V8 generations, 200-400 hp)',
          'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
          'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
          'Mercury SmartCraft / VesselView diagnostic connector under the cowl — dealer software; no OBD-II port.'),
        serviceUnit: 'hrs'
      }
    }
  },
  kubota: {
    lx3310: {
      '2019-2026': agSpec(
        'Kubota LX3310 — L Series compact utility tractor (D1703-M-E4 3-cylinder diesel; HST)',
        '15W-40 diesel oil (Kubota DH-1 spec)',
        'Kubota Super UDT2 or equivalent UTF')
    }
  },
  'volvo trucks': {
    vnl: {
      '2005-2014': {
        ...semiSpec('Volvo VNL — Volvo D13/D16 diesel (I-Shift AMT or manual)', 'Volvo VDS-4.5 15W-40 diesel oil', 'Volvo I-Shift AMT / Eaton Fuller manual', '2005-2014'),
        serviceUnit: 'hrs'
      },
      '2015-2026': {
        ...semiSpec('Volvo VNL — Volvo D13/D16 diesel (I-Shift AMT or manual)', 'Volvo VDS-4.5 15W-40 diesel oil', 'Volvo I-Shift AMT / Eaton Fuller manual', '2015-2025'),
        serviceUnit: 'hrs'
      }
    }
  },
  'western star': {
    '4700': {
      '2005-2014': {
        ...semiSpec('Western Star 4700 — Detroit DD13/DD15 diesel (DT12 AMT or manual)', '15W-40 CK-4 diesel oil', 'Detroit DT12 AMT / Eaton Fuller manual', '2005-2014'),
        serviceUnit: 'hrs'
      },
      '2015-2026': {
        ...semiSpec('Western Star 4700 — Detroit DD13/DD15 diesel (DT12 AMT or manual)', '15W-40 CK-4 diesel oil', 'Detroit DT12 AMT / Eaton Fuller manual', '2015-2025'),
        serviceUnit: 'hrs'
      }
    }
  },
  yamaha: {
    'fx cruiser': {
      '2005-2019': {
        ...yamahaPwcSpec('Yamaha WaveRunner FX Cruiser / FX Cruiser HO — MR-1 1.0L 4-cylinder 4-stroke', 'Yamalube 4W 10W-40'),
        serviceUnit: 'hrs'
      },
      '2020-2026': {
        ...yamahaPwcSpec('Yamaha WaveRunner FX Cruiser / FX Cruiser HO — 1.8L HO 4-stroke', 'Yamalube 4W 10W-40'),
        serviceUnit: 'hrs'
      }
    }
  },
  'hyster electric': {
    e30: {
      '2005-2014': forkliftSpec('Hyster E30 electric forklift — 3,000 lb capacity; lead-acid traction battery; voltage/capacity varies by truck configuration', 'electric'),
      '2015-2026': forkliftSpec('Hyster E30 electric forklift — 3,000 lb capacity; lead-acid traction battery; voltage/capacity varies by truck configuration', 'electric')
    }
  },
  'john deere': {
    // Wave 14 already covered these family keys for 2015-2025 (merged below);
    // add the earlier model years so pre-2015 tractors/Gators resolve too.
    '3000': { '2005-2014': agSpec('John Deere 3 Series compact tractor — 3-cylinder diesel; HST or gear', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '4000': { '2005-2014': agSpec('John Deere 4 Series compact utility tractor — 4-cylinder diesel; HST or gear', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '5000': { '2005-2014': agSpec('John Deere 5 Series utility tractor — 3- or 4-cylinder diesel', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '6r': { '2012-2014': agSpec('John Deere 6R Series — diesel row-crop tractor; IVT or PowerShift', '15W-40 JD Plus-50 II diesel oil', 'John Deere Hy-Gard') },
    xuv: { '2005-2014': jdGatorSpec('John Deere Gator XUV utility vehicle', 'gasoline/diesel') }
  },
  polaris: {
    rzr: {
      '2008-2026': polarisSpec(
        'Polaris RZR — ProStar twin-cylinder 4-stroke side-by-side (570/900/XP 1000 and Turbo variants)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        "Consult owner's manual",
        '10-15 psi (model-dependent)', '10-15 psi (model-dependent)',
        ["Consult owner's manual (27-32 in tires per model)"], 80)
    },
    general: {
      '2016-2026': polarisSpec(
        'Polaris General — ProStar twin-cylinder 4-stroke side-by-side (1000/XP)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        "Consult owner's manual",
        '12-15 psi (model-dependent)', '12-15 psi (model-dependent)',
        ["Consult owner's manual (30 in tires typical)"], 80)
    },
    sportsman: {
      '2005-2026': polarisSpec(
        'Polaris Sportsman — 4-stroke ATV (450/570/850/1000, single- and twin-cylinder)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        "Consult owner's manual",
        7, 7, ["Consult owner's manual (26-27 in tires typical)"], 55)
    },
    ace: {
      '2014-2026': polarisSpec(
        'Polaris ACE — single-seat single-cylinder ProStar ORV (570/900)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        "Consult owner's manual",
        '10-12 psi (model-dependent)', '10-12 psi (model-dependent)',
        ["Consult owner's manual"], 55)
    },
    ranger: {
      '2005-2026': polarisSpec(
        'Polaris Ranger — ProStar twin-cylinder 4-stroke utility side-by-side (570/900/1000)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        "Consult owner's manual",
        '10-15 psi (model-dependent)', '10-15 psi (model-dependent)',
        ["Consult owner's manual (27 in tires typical)"], 80)
    }
  }
};
for (const [make, models] of Object.entries(wave17Specs)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) {
    referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
  }
}


// Wave 19: Full K2XX (2014-2018) Silverado/Sierra 1500 reference specs. The
// '2014-2018' range previously existed only in wave18SparkPlugs, which the
// wave18 merge skipped (no prior data = no skeleton created). Adding the full
// entries here gives the wave18 merge below a target so it lands the ACDelco
// 41-114 spark plugs on both K2XX entries.
const wave19K2XX = {
  chevrolet: {
    silverado: {
      '2014-2018': {
        engine: {
          description: '4.3L EcoTec3 V6 (LV3) / 5.3L EcoTec3 V8 (L83) / 6.2L EcoTec3 V8 (L86, 2015+) — K2XX generation',
          oilViscosity: '0W-20 dexos1 (4.3L/5.3L/6.2L EcoTec3); early 2014-2015 manuals also list 5W-30 dexos1 — verify oil cap label',
          oilCapacity: '6.0 qt (4.3L V6 w/filter) / 8.0 qt (5.3L V8 w/filter) / 8.0 qt (6.2L w/filter)',
          oilFilterPN: 'ACDelco PF63E (4.3L/5.3L/6.2L)',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '13.0 qt (4.3L V6) / 16.5 qt (5.3L V8) / 17.0 qt (6.2L) — total system; verify level at surge tank'
        },
        transmission: {
          fluidType: 'DEXRON-VI (6-speed 6L80) / DEXRON-HP (8-speed 8L90 — 6.2L, 2015+)',
          capacity: '5.0 qt drain-and-refill (6L80) / 5.0 qt (8L90)',
          note: 'K2XX 1500 uses the 6L80 6-speed for 4.3L/5.3L; 2015+ 6.2L uses the 8L90 8-speed. DEXRON-VI for the 6L80 — do NOT use DEXRON-ULV (T1XX 8-speed fluid). GM TSB later updated the 8L90 to DEXRON-ULV; check dipstick color before servicing.'
        },
        transferCase: {
          fluidType: 'AutoTrak II (blue) — 2-speed transfer case',
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
            fluidType: 'SAE 75W-90 GL-5 (standard) / SAE 75W-90 with friction modifier (G80 locking differential)',
            capacity: '2.6 qt (8.6" axle) / 2.8 qt (9.5" axle) / 3.0 qt (9.76" heavy-duty axle)',
            note: 'Add GM friction modifier (P/N 88862624) for G80 limited-slip. Confirm exact capacity on the axle RPO tag.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['255/70R17 (Work Truck)', '265/65R18 (LT, Z71)', '275/55R20 (LTZ, High Country)', '275/45R22 (High Country)'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / D3S HID (projector — 2015+ LTZ, High Country)',
          highBeam: '9005 (halogen)',
          fog: '5202 (fog light)',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157',
          interior: '194 (map) / 578 (dome)',
          license: '194 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, above the parking brake release near the hood release.'
      }
    }
  },
  gmc: {
    sierra: {
      '2014-2018': {
        engine: {
          description: '4.3L EcoTec3 V6 (LV3) / 5.3L EcoTec3 V8 (L83) / 6.2L EcoTec3 V8 (L86, 2015+) — K2XX generation',
          oilViscosity: '0W-20 dexos1 (4.3L/5.3L/6.2L EcoTec3); early 2014-2015 manuals also list 5W-30 dexos1 — verify oil cap label',
          oilCapacity: '6.0 qt (4.3L V6 w/filter) / 8.0 qt (5.3L V8 w/filter) / 8.0 qt (6.2L w/filter)',
          oilFilterPN: 'ACDelco PF63E (4.3L/5.3L/6.2L)',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '13.0 qt (4.3L V6) / 16.5 qt (5.3L V8) / 17.0 qt (6.2L) — total system; verify level at surge tank'
        },
        transmission: {
          fluidType: 'DEXRON-VI (6-speed 6L80) / DEXRON-HP (8-speed 8L90 — 6.2L, 2015+)',
          capacity: '5.0 qt drain-and-refill (6L80) / 5.0 qt (8L90)',
          note: 'K2XX 1500 uses the 6L80 6-speed for 4.3L/5.3L; 2015+ 6.2L uses the 8L90 8-speed. DEXRON-VI for the 6L80 — do NOT use DEXRON-ULV (T1XX 8-speed fluid). GM TSB later updated the 8L90 to DEXRON-ULV; check dipstick color before servicing.'
        },
        transferCase: {
          fluidType: 'AutoTrak II (blue) — 2-speed transfer case',
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
            fluidType: 'SAE 75W-90 GL-5 (standard) / SAE 75W-90 with friction modifier (G80 locking differential)',
            capacity: '2.6 qt (8.6" axle) / 2.8 qt (9.5" axle) / 3.0 qt (9.76" heavy-duty axle)',
            note: 'Add GM friction modifier (P/N 88862624) for G80 limited-slip. Confirm exact capacity on the axle RPO tag.'
          }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35,
          rearPSI: 35,
          oemSizes: ['255/70R17 (Work Truck)', '265/65R18 (LT, Z71)', '275/55R20 (LTZ, High Country)', '275/45R22 (High Country)'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / D3S HID (projector — 2015+ LTZ, High Country)',
          highBeam: '9005 (halogen)',
          fog: '5202 (fog light)',
          frontTurn: '3157A (amber)',
          rearTurn: '3157A (amber)',
          tailBrake: '3157',
          interior: '194 (map) / 578 (dome)',
          license: '194 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column, above the parking brake release near the hood release.'
      }
    }
  }
};
for (const [make, models] of Object.entries(wave19K2XX)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) {
    referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
  }
}

// Wave 18: OEM spark-plug references for high-volume automotive models. Values
// are engine-specific where the same model is sold with multiple powertrains.
// Merge logic: patches only sparkPlugs into EXISTING referenceSpecs entries.
// Makes/models/year-ranges without prior data are skipped — no skeletons created.
const SP = (type, gap, oemPN) => ({ type, gap, oemPN });
const wave18SparkPlugs = {
  chevrolet: {
    silverado: { '2014-2018': { sparkPlugs: SP('ACDelco 41-114 (Iridium \u2014 4.3L V6 / 5.3L V8 / 6.2L V8)', '0.040 in', 'ACDelco 41-114') }, '2019-2026': { sparkPlugs: SP('ACDelco 41-162 (Iridium \u2014 5.3L/6.2L V8) / ACDelco 41-106-IP (Iridium \u2014 2.7L Turbo) / ACDelco 41-114 (Iridium \u2014 4.3L V6)', '0.040"', 'ACDelco 41-162 / 41-106-IP / 41-114') } },
    equinox: { '2018-2026': { sparkPlugs: SP('ACDelco Iridium', '0.040"', 'ACDelco 41-162') } }
  },
  gmc: { sierra: { '2014-2018': { sparkPlugs: SP('ACDelco 41-114 (Iridium \u2014 4.3L V6 / 5.3L V8 / 6.2L V8)', '0.040 in', 'ACDelco 41-114') }, '2019-2026': { sparkPlugs: SP('ACDelco 41-162 (Iridium \u2014 5.3L/6.2L V8) / ACDelco 41-106-IP (Iridium \u2014 2.7L Turbo) / ACDelco 41-114 (Iridium \u2014 4.3L V6)', '0.040"', 'ACDelco 41-162 / 41-106-IP / 41-114') } } },
  ford: {
    'f-150': { '2015-2026': { sparkPlugs: SP('Motorcraft SP-580 (5.0L V8) / Motorcraft SP-594 (2.7L & 3.5L EcoBoost, PowerBoost hybrid) / Motorcraft SP-586 (3.3L V6)', '0.028-0.030"', 'Motorcraft SP-580 / SP-586 / SP-594') } },
    escape: { '2013-2026': { sparkPlugs: SP('Motorcraft Iridium', '0.028-0.030"', 'Motorcraft SP-530') } },
    explorer: { '2011-2026': { sparkPlugs: SP('Motorcraft SP-594 (2.3L EcoBoost) / Motorcraft SP-578 (3.0L EcoBoost)', '0.028-0.030"', 'Motorcraft SP-578 / SP-594') } }
  },
  toyota: {
    camry: { '2012-2026': { sparkPlugs: SP('Denso Iridium Long Life', '0.043"', 'Denso 3474 / Toyota 90919-01253') } },
    rav4: { '2013-2026': { sparkPlugs: SP('Denso Iridium Long Life', '0.043"', 'Denso 3474 / Toyota 90919-01253') } },
    tacoma: { '2016-2026': { sparkPlugs: SP('Denso 3461 (Iridium \u2014 3.5L V6) / NGK BKR5EKB-11 or Denso K16HPR11 (2.7L I4)', '0.043-0.044"', 'Denso 3461 (3.5L) / NGK BKR5EKB-11 (2.7L)') } },
    corolla: { '2009-2026': { sparkPlugs: SP('Denso Iridium', '0.043"', 'Denso 3474') } }
  },
  honda: {
    civic: { '2016-2026': { sparkPlugs: SP('NGK (1.5L Turbo) / Denso (2.0L)', '0.028-0.044"', 'NGK 96964 / Denso 3492') } },
    'cr-v': { '2017-2026': { sparkPlugs: SP('NGK Iridium', '0.028-0.044"', 'NGK 96964 / Denso 3492') } }
  },
  jeep: { wrangler: { '2012-2026': { sparkPlugs: SP('Mopar SP143877AA / NGK 92145 (3.6L V6) / NGK ILZKR7A8 (2.0L Turbo)', '0.028-0.043"', 'Mopar SP143877AA / NGK 92145 (3.6L); NGK ILZKR7A8 / Mopar 68418729AA (2.0T)') } } },
  ram: { '1500': { '2009-2026': { sparkPlugs: SP('Mopar SP143877AA / NGK 92145 (3.6L V6 & 5.7L V8)', '0.043"', 'Mopar SP143877AA / NGK 92145') } } },
  subaru: { outback: { '2010-2026': { sparkPlugs: SP('NGK 93209 (2.5L I4) / NGK ILFR6B10 (2.4L Turbo)', '0.039-0.044"', 'NGK 93209 / Subaru 22401AA830 (2.5L); NGK ILFR6B10 / Subaru 22401AA81A (2.4T)') } }, forester: { '2011-2026': { sparkPlugs: SP('NGK Iridium', '0.039-0.044"', 'NGK 93209 / Subaru 22401AA830') } } },
  nissan: { altima: { '2013-2026': { sparkPlugs: SP('NGK Iridium', '0.043"', 'NGK 9029 / Denso 3452') } }, rogue: { '2014-2026': { sparkPlugs: SP('NGK Iridium', '0.043"', 'NGK 9029 / Denso 3452') } } },
  hyundai: { tucson: { '2016-2026': { sparkPlugs: SP('NGK Iridium', '0.039"', 'NGK 97265') } }, elantra: { '2011-2026': { sparkPlugs: SP('NGK Iridium', '0.039"', 'NGK 97265') } } },
  kia: { sportage: { '2017-2026': { sparkPlugs: SP('NGK Iridium', '0.039"', 'NGK 97265') } } },
  mazda: { 'cx-5': { '2013-2026': { sparkPlugs: SP('NGK 94109 / Denso 3484 (2.5L NA) / NGK ILKAR7H6 (2.5T)', '0.039-0.043"', 'NGK 94109 / Denso 3484 (2.5L); NGK ILKAR7H6 (2.5T)') } } },
  bmw: { '3 series': { '2013-2026': { sparkPlugs: SP('Bosch Iridium', '0.028-0.031"', 'Bosch ZR5TPP33 / BMW 12120037638') } } },
  mercedes: { 'c-class': { '2015-2026': { sparkPlugs: SP('Bosch Iridium', '0.028"', 'Bosch 0242245580 / Mercedes 0041591803') } } }
};
for (const [make, models] of Object.entries(wave18SparkPlugs)) {
  if (!referenceSpecs[make]) continue; // skip makes with no prior data
  for (const [model, yearRanges] of Object.entries(models)) {
    if (!referenceSpecs[make][model]) continue; // skip models with no prior data
    for (const [yearRange, waveData] of Object.entries(yearRanges)) {
      const [wStart, wEnd] = yearRange.split('-').map(Number);
      for (const [existingRange, existingData] of Object.entries(referenceSpecs[make][model])) {
        const [eStart, eEnd] = existingRange.split('-').map(Number);
        if (isNaN(eStart)) continue; // skip non-year-range keys
        // Patch spark plugs into ALL overlapping year ranges
        if (wStart <= eEnd && wEnd >= eStart) {
          if (!existingData.sparkPlugs || !existingData.sparkPlugs.oemPN) {
            existingData.sparkPlugs = { ...existingData.sparkPlugs, ...waveData.sparkPlugs };
          }
        }
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Wave 19: pre-2015 backfill (part A — Toyota / Honda / Ford).
// Adds year ranges for earlier generations of models whose data previously
// started at 2015+ but that existed well before 2015. All new ranges are
// non-overlapping with existing entries (findSpecs returns the first match).
// Values from OEM owner's manuals / service data; uncertain values marked.
// Merged at module bottom after the wave18 spark-plug patch (so patch ranges
// never collide with these additions).
// ═══════════════════════════════════════════════════════════════════════════
const wave19BackfillA = {
  toyota: {
    tacoma: {
      '1995-2004': {
        engine: {
          oilViscosity: '5W-30 (2.4L 2RZ-FE / 2.7L 3RZ-FE I4 / 3.4L 5VZ-FE V6)',
          oilCapacity: '4.9 qt (2.4L) / 5.6 qt (2.7L) / 5.0 qt (3.4L) — approx',
          oilFilterPN: 'Toyota 90915-YZZD1 — verify by engine',
          coolantType: 'Toyota Genuine Long Life Coolant (red)',
          coolantCapacity: '7.5 qt (3.4L) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF Type T-IV (A340F 4-speed auto) / SAE 75W-90 GL-4 (5-speed manual)',
          capacity: '2.5 qt drain-and-refill (auto)'
        },
        transferCase: { fluidType: 'Toyota Genuine Transfer Gear Oil LF 75W (older units: GL-4 75W-90 — verify)', capacity: '1.5 qt', note: '4WD models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.1 qt', note: '4WD models only.' },
          rear: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.4 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 26, rearPSI: 29,
          oemSizes: ['P225/75R15 (2WD)', 'P235/75R15 (4WD)', 'P265/70R16 (TRD)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: '9006 (halogen) — verify by trim',
          highBeam: '9005 (halogen) — verify by trim',
          frontTurn: '1157 (amber) — verify',
          rearTurn: '1157 — verify',
          tailBrake: '1157 — verify',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard (OBD-II on 1996+ models; 1995 uses pre-OBD-II connector).'
      },
      '2005-2015': {
        engine: {
          oilViscosity: '5W-30 (2005-2009) / 0W-20 (2010-2015) — 2.7L 2TR-FE I4 / 4.0L 1GR-FE V6',
          oilCapacity: '5.6 qt (2.7L w/filter) / 6.1 qt (4.0L w/filter) — approx',
          oilFilterPN: 'Toyota 90915-YZZD1 (2.7L) / 90915-YZZD3 (4.0L)',
          coolantType: 'Toyota Long Life Coolant (red) / Super Long Life Coolant (pink)',
          coolantCapacity: '7.1 qt (2.7L) / 8.7 qt (4.0L) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (4-speed auto 2005-2009 / 5-speed auto 2010-2015) / 75W-90 GL-4 (6-speed manual)',
          capacity: '2.5 qt drain-and-refill (auto) — approx'
        },
        transferCase: { fluidType: 'Toyota Genuine Transfer Gear Oil LF 75W', capacity: '1.5 qt', note: '4WD models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.2 qt', note: '4WD models only.' },
          rear: { fluidType: 'SAE 75W-90 GL-5 (limited-slip: add friction modifier)', capacity: '2.6 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 29, rearPSI: 29,
          oemSizes: ['P245/75R16 (SR5)', 'P265/70R16 (TRD Off-Road)', 'P265/65R17 (TRD Sport)', 'P265/60R18 (Limited)'],
          lugNutTorque: 83
        },
        bulbs: {
          lowBeam: '9006 (halogen) — verify by trim',
          highBeam: '9005 (halogen) — verify by trim',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, near the hood release.'
      }
    },
    camry: {
      '2007-2011': {
        engine: {
          oilViscosity: '5W-30 (2.4L 2AZ-FE I4 / 3.5L 2GR-FE V6)',
          oilCapacity: '4.6 qt (2.4L w/filter) / 6.4 qt (3.5L w/filter)',
          oilFilterPN: 'Toyota 90915-YZZD1',
          coolantType: 'Toyota Genuine Long Life Coolant (red) — Super Long Life (pink) on later years',
          coolantCapacity: '6.9 qt (2.4L) / 9.3 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (U250E 5-speed auto 2.4L / U660E 6-speed auto 3.5L) / eCVT fluid (hybrid)',
          capacity: '3.9 qt drain-and-refill (auto)'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30, rearPSI: 30,
          oemSizes: ['P205/65R16 (CE, LE)', 'P215/60R16 (SE)', 'P215/55R17 (XLE)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: '9006 (halogen)',
          highBeam: '9005 (halogen)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, near the hood release lever.'
      },
      '2012-2017': {
        engine: {
          oilViscosity: '0W-20 (2.5L 2AR-FE I4 / 3.5L 2GR-FE V6 / 2.5L hybrid)',
          oilCapacity: '4.6 qt (2.5L w/filter) / 6.4 qt (3.5L w/filter)',
          oilFilterPN: 'Toyota 90915-YZZF1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '6.9 qt (2.5L) / 9.5 qt (3.5L) — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (U760E 6-speed auto 2.5L / U660E 6-speed auto 3.5L) / eCVT fluid (hybrid)',
          capacity: '3.9 qt drain-and-refill (auto)'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32, rearPSI: 32,
          oemSizes: ['P205/65R16 (L, LE)', 'P215/55R17 (SE, XLE)', 'P225/45R18 (XSE)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'H11 (halogen) — verify by trim',
          highBeam: '9005 (halogen)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, near the hood release lever.'
      }
    },
    rav4: {
      '2013-2018': {
        engine: {
          oilViscosity: '0W-20 (2.5L 2AR-FE I4 / 2.5L hybrid)',
          oilCapacity: '4.6 qt (2.5L w/filter)',
          oilFilterPN: 'Toyota 90915-YZZF1',
          coolantType: 'Toyota Super Long Life Coolant (pink)',
          coolantCapacity: '6.5 qt — approx'
        },
        transmission: {
          fluidType: 'Toyota ATF WS (U760E 6-speed auto) / eCVT fluid (hybrid)',
          capacity: '3.9 qt drain-and-refill (auto)'
        },
        transferCase: {
          fluidType: 'Toyota Transfer Gear Oil LF 75W',
          capacity: '0.5 qt',
          note: 'AWD gas models only. Hybrid AWD uses rear electric motor — no transfer case fluid.'
        },
        differentials: {
          front: null,
          rear: { fluidType: 'Toyota Differential Gear Oil LT 75W-85 GL-5', capacity: '0.5 qt', note: 'AWD gas models only.' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32, rearPSI: 32,
          oemSizes: ['P225/65R17 (LE, XLE)', 'P235/55R18 (Limited)'],
          lugNutTorque: 76
        },
        bulbs: {
          lowBeam: 'H11 (halogen) / LED (Limited)',
          highBeam: '9005 (halogen) / LED (Limited)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, near the hood release lever.'
      }
    }
  },
  honda: {
    civic: {
      '2006-2011': {
        engine: {
          oilViscosity: '5W-20 (1.8L R18A1 / 2.0L K20Z3 Si)',
          oilCapacity: '3.8 qt (1.8L w/filter) / 4.5 qt (Si w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '5.0 qt (1.8L) — approx'
        },
        transmission: {
          fluidType: 'Honda ATF DW-1 (5-speed auto; Z1 on 2006-2009) / Honda Manual Transmission Fluid (5-speed manual)',
          capacity: '2.5 qt drain-and-refill (auto)'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32, rearPSI: 32,
          oemSizes: ['P195/65R15 (DX, LX)', 'P205/55R16 (EX)', 'P215/45R17 (Si)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: '9006 (halogen)',
          highBeam: '9005 (halogen)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      },
      '2012-2015': {
        engine: {
          oilViscosity: '0W-20 (1.8L R18A1 / 2.4L K24Z7 Si / 1.5L hybrid)',
          oilCapacity: '4.4 qt (1.8L w/filter) / 4.6 qt (Si w/filter)',
          oilFilterPN: 'Honda 15400-PLM-A02',
          coolantType: 'Honda Type 2 (blue)',
          coolantCapacity: '5.5 qt (1.8L) — approx'
        },
        transmission: {
          fluidType: 'Honda HCF-2 (CVT, 2014-2015) / Honda ATF DW-1 (5-speed auto 2012-2013) / Honda MTF (manual)',
          capacity: '3.7 qt drain-and-refill (CVT) / 2.5 qt (auto)'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32, rearPSI: 32,
          oemSizes: ['P195/65R15 (LX)', 'P205/55R16 (EX)', 'P215/45R17 (Si)'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'H11 (halogen) — verify by trim',
          highBeam: '9005 (halogen)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map)',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      }
    }
  },
  ford: {
    'f-250': {
      '1999-2007': {
        engine: {
          oilViscosity: '5W-20 (5.4L Triton V8 / 6.8L V10 gas) / 15W-40 CJ-4 (7.3L Power Stroke 1999-2003 / 6.0L Power Stroke 2003-2007 diesel)',
          oilCapacity: '6.0 qt (5.4L/6.8L w/filter) / 15 qt (7.3L) / 15 qt (6.0L) — approx',
          oilFilterPN: 'Motorcraft FL-820S (gas) / FL-2016 (7.3L) / FL-1995 (6.0L) — verify',
          coolantType: 'Motorcraft Premium Gold (diesel) / Green (gas)',
          coolantCapacity: "Consult owner's manual (large system, 25+ qt)"
        },
        transmission: {
          fluidType: 'Mercon (4R100 4-speed auto 1999-2003) / Mercon SP (5R110W 5-speed auto 2003-2007) / manual per Ford spec',
          capacity: '4.5 qt drain-and-refill (4R100) — approx'
        },
        transferCase: { fluidType: 'Motorcraft MERCON (part-time 4x4)', capacity: '2.5 qt', note: '4x4 models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '4.0 qt — approx', note: '4x4 models only.' },
          rear: { fluidType: 'SAE 75W-140 GL-5 (limited-slip: add friction modifier)', capacity: '3.5 qt — approx' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 55, rearPSI: 80,
          oemSizes: ['LT245/75R16E', 'LT265/75R16E'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: '9007 (halogen) — verify',
          highBeam: '9007 (halogen) — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column (OBD-II from 1996).'
      },
      '2008-2016': {
        engine: {
          oilViscosity: '5W-20 (5.4L V8 gas 2008-2010) / 5W-30 (6.2L V8 gas 2011-2016) / 15W-40 CJ-4 (6.4L diesel 2008-2010 / 6.7L Power Stroke diesel 2011-2016)',
          oilCapacity: '6.0 qt (5.4L w/filter) / 7.0 qt (6.2L w/filter) / 15.0 qt (6.4L) / 13.0 qt (6.7L) — approx',
          oilFilterPN: 'Motorcraft FL-820S (gas) / FL-1995 (6.4L) / FL-2051 (6.7L) — verify',
          coolantType: 'Motorcraft Gold (6.4L) / Motorcraft Orange (6.7L diesel & 6.2L gas) / Green (5.4L)',
          coolantCapacity: "Consult owner's manual (large system)"
        },
        transmission: {
          fluidType: 'Mercon SP (5R110W 5-speed auto 2008-2010) / Mercon LV (6R140 6-speed auto 2011-2016)',
          capacity: '5.0 qt drain-and-refill — approx'
        },
        transferCase: { fluidType: 'Motorcraft MERCON/MERCON V (part-time 4x4)', capacity: '2.5 qt', note: '4x4 models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '4.0 qt — approx', note: '4x4 models only.' },
          rear: { fluidType: 'SAE 75W-140 GL-5 (limited-slip: add friction modifier)', capacity: '3.5 qt — approx' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 60, rearPSI: 80,
          oemSizes: ['LT245/75R17E', 'LT265/70R17E', 'LT275/65R18E', 'LT275/70R18E'],
          lugNutTorque: 150
        },
        bulbs: {
          lowBeam: 'H13 (9008) — verify',
          highBeam: 'H13 (9008) — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      }
    },
    ranger: {
      '1998-2011': {
        engine: {
          oilViscosity: '5W-30 (2.3L/2.5L I4, 3.0L Vulcan V6, 4.0L V6)',
          oilCapacity: '5.0 qt (2.3L w/filter) / 4.5 qt (3.0L w/filter) / 5.0 qt (4.0L w/filter) — approx',
          oilFilterPN: 'Motorcraft FL-400S (2.3L/2.5L) / FL-820S (3.0L/4.0L)',
          coolantType: 'Motorcraft Premium Gold (later years) / Green (earlier)',
          coolantCapacity: '7.5 qt (4.0L) — approx'
        },
        transmission: {
          fluidType: 'Mercon V (5R44E/5R55E 5-speed auto) / Mercon (4R44E 1998-2000) / M5OD-R1 manual: Mercon',
          capacity: '2.0 qt drain-and-refill (auto) — approx'
        },
        transferCase: { fluidType: 'Mercon (BorgWarner 1354)', capacity: '1.5 qt', note: '4x4 models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.0 qt', note: '4x4 models only.' },
          rear: { fluidType: 'SAE 75W-90 GL-5 (limited-slip: add friction modifier)', capacity: '2.0 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30, rearPSI: 30,
          oemSizes: ['P215/70R15', 'P225/70R15', 'P235/75R15', 'P255/70R16 (FX4)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: '9007 (halogen) — verify',
          highBeam: '9007 (halogen) — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906 (dome) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard (OBD-II from 1996).'
      }
    },
    escape: {
      '2001-2012': {
        engine: {
          oilViscosity: '5W-20 (2.0L Zetec / 2.3L Duratec I4 / 3.0L Duratec V6)',
          oilCapacity: '4.5 qt (2.0L w/filter) / 4.5 qt (2.3L w/filter) / 5.0 qt (3.0L w/filter) — approx',
          oilFilterPN: 'Motorcraft FL-400S (I4) / FL-820S (V6)',
          coolantType: 'Motorcraft Premium Gold',
          coolantCapacity: '8.0 qt — approx'
        },
        transmission: {
          fluidType: 'Mercon V (CD4E 4-speed auto) / Mercon (manual)',
          capacity: '2.0 qt drain-and-refill (auto) — approx'
        },
        transferCase: { fluidType: 'Mercon V (PTU)', capacity: '0.5 qt', note: 'AWD models only.' },
        differentials: {
          front: null,
          rear: { fluidType: 'Mercon V (rear drive unit)', capacity: '1.0 qt', note: 'AWD models only.' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 30, rearPSI: 30,
          oemSizes: ['P215/70R16', 'P235/70R16', 'P225/65R17 (2008+)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: '9006 (halogen) — verify',
          highBeam: '9005 (halogen) — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard.'
      },
      '2013-2019': {
        engine: {
          oilViscosity: '5W-20 (1.6L EcoBoost / 2.0L EcoBoost / 2.5L)',
          oilCapacity: '4.5 qt (1.6L w/filter) / 5.0 qt (2.0L w/filter) / 4.5 qt (2.5L w/filter) — approx',
          oilFilterPN: 'Motorcraft FL-910S',
          coolantType: 'Motorcraft Orange',
          coolantCapacity: '7.5 qt — approx'
        },
        transmission: {
          fluidType: 'Motorcraft MERCON LV (6F35 6-speed auto)',
          capacity: '2.0 qt drain-and-refill — approx'
        },
        transferCase: { fluidType: 'Motorcraft MERCON LV (PTU)', capacity: '0.5 qt', note: 'AWD models only.' },
        differentials: {
          front: null,
          rear: { fluidType: 'Motorcraft MERCON LV (RDU)', capacity: '1.0 qt', note: 'AWD models only.' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 34, rearPSI: 34,
          oemSizes: ['P235/70R16', 'P225/65R17', 'P235/50R18 (Titanium)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen) — verify by trim',
          highBeam: '9005 (halogen)',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard.'
      }
    }
  }
};
for (const [make, models] of Object.entries(wave19BackfillA)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) {
    referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Wave 19: pre-2015 backfill (part B — GM / Nissan / BMW / Polaris /
// John Deere / Mercury / Thor). Non-overlapping year ranges added for
// earlier generations of models that existed well before 2015.
// ═══════════════════════════════════════════════════════════════════════════
const wave19BackfillB = {
  chevrolet: {
    colorado: {
      '2004-2012': {
        engine: {
          oilViscosity: '5W-30 (2.8L/2.9L I4, 3.5L/3.7L I5, 5.3L V8)',
          oilCapacity: '5.0 qt (I4 w/filter) / 5.5 qt (I5 w/filter) / 6.0 qt (5.3L V8 w/filter) — approx',
          oilFilterPN: 'ACDelco PF61 (I4/I5) / PF48 (5.3L V8) — verify',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '9.5 qt (I5) — approx'
        },
        transmission: {
          fluidType: 'DEXRON-VI (4L60E 4-speed auto; 4L70E on 5.3L) / GM manual transmission fluid (manual)',
          capacity: '2.5 qt drain-and-refill (auto) — approx'
        },
        transferCase: { fluidType: 'GM Auto-Trak II (NVG 236)', capacity: '1.5 qt', note: '4WD models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '1.5 qt', note: '4WD models only.' },
          rear: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.0 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32, rearPSI: 32,
          oemSizes: ['P225/75R15', 'P235/75R15', 'P245/75R16', 'P265/70R16 (Z71)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: '9006 (halogen) — verify',
          highBeam: '9005 (halogen) — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, near the steering column.'
      }
    },
    camaro: {
      '2010-2015': {
        engine: {
          oilViscosity: '5W-30 dexos1 (3.6L LLT/LFX V6, 6.2L LS3/L99 V8) / 5W-30 (6.2L LSA supercharged ZL1)',
          oilCapacity: '6.0 qt (V6 w/filter) / 8.0 qt (V8 w/filter) — approx',
          oilFilterPN: 'ACDelco PF48 (all engines)',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '9.5 qt (V6) / 11.0 qt (V8) — approx'
        },
        transmission: {
          fluidType: 'DEXRON-VI (6L80 6-speed auto) / GM Synchromesh manual transmission fluid (TR-6060 6-speed manual)',
          capacity: '2.5 qt drain-and-refill (auto) — approx'
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: { fluidType: 'SAE 75W-90 GL-5 (limited-slip w/ friction modifier)', capacity: '1.9 qt (V8)' }
        },
        brakeFluid: 'DOT 3 (DOT 4 for track use — verify)',
        tires: {
          frontPSI: 36, rearPSI: 36,
          oemSizes: ['P245/55R18 (base V6)', 'P245/45R20 (RS)', 'P245/45ZR20 F / P275/40ZR20 R (SS)', 'P285/35ZR20 F / P305/35ZR20 R (ZL1)'],
          lugNutTorque: 100
        },
        bulbs: {
          lowBeam: 'H11 (halogen projector) — verify',
          highBeam: 'H11 (halogen) — verify',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      }
    },
    silverado: {
      '1999-2006': {
        engine: {
          oilViscosity: '5W-30 (4.3L V6, 4.8L/5.3L V8)',
          oilCapacity: '5.0 qt (4.3L w/filter) / 6.0 qt (V8 w/filter)',
          oilFilterPN: 'ACDelco PF46 (5.3L) — verify',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '14.5 qt (5.3L) — approx'
        },
        transmission: {
          fluidType: 'DEXRON-VI (4L60E 4-speed auto; DEXRON-III originally specified)',
          capacity: '2.5 qt drain-and-refill — approx'
        },
        transferCase: { fluidType: 'GM Auto-Trak II (NVG 246) / NVG 149', capacity: '1.5 qt', note: '4WD models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.5 qt', note: '4WD models only.' },
          rear: { fluidType: 'SAE 75W-90 GL-5 (limited-slip: add friction modifier)', capacity: '3.0 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35, rearPSI: 35,
          oemSizes: ['P245/75R16', 'P265/70R17 (Z71)', 'P265/75R16'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: '9007 — verify',
          highBeam: '9007 — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      },
      '2007-2013': {
        engine: {
          oilViscosity: '5W-30 (4.3L V6, 4.8L/5.3L/6.0L/6.2L V8)',
          oilCapacity: '5.0 qt (4.3L w/filter) / 6.0 qt (V8 w/filter)',
          oilFilterPN: 'ACDelco PF48 (5.3L/6.0L/6.2L) / PF46 (4.3L/4.8L) — verify',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '15.0 qt (5.3L) — approx'
        },
        transmission: {
          fluidType: 'DEXRON-VI (4L60E 4-speed / 6L80 6-speed auto)',
          capacity: '2.5 qt drain-and-refill (4L60E) — approx'
        },
        transferCase: { fluidType: 'GM Auto-Trak II (NVG 246)', capacity: '1.5 qt', note: '4WD models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.5 qt', note: '4WD models only.' },
          rear: { fluidType: 'SAE 75W-90 GL-5 (limited-slip: add friction modifier)', capacity: '3.0 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35, rearPSI: 35,
          oemSizes: ['P265/70R17', 'P265/65R18', 'P275/55R20'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: 'H13 (9008) — verify',
          highBeam: 'H13 (9008) — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      }
    }
  },
  gmc: {
    sierra: {
      '1999-2006': {
        engine: {
          oilViscosity: '5W-30 (4.3L V6, 4.8L/5.3L V8)',
          oilCapacity: '5.0 qt (4.3L w/filter) / 6.0 qt (V8 w/filter)',
          oilFilterPN: 'ACDelco PF46 (5.3L) — verify',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '14.5 qt (5.3L) — approx'
        },
        transmission: {
          fluidType: 'DEXRON-VI (4L60E 4-speed auto; DEXRON-III originally specified)',
          capacity: '2.5 qt drain-and-refill — approx'
        },
        transferCase: { fluidType: 'GM Auto-Trak II (NVG 246) / NVG 149', capacity: '1.5 qt', note: '4WD models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.5 qt', note: '4WD models only.' },
          rear: { fluidType: 'SAE 75W-90 GL-5 (limited-slip: add friction modifier)', capacity: '3.0 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35, rearPSI: 35,
          oemSizes: ['P245/75R16', 'P265/70R17 (Z71)', 'P265/75R16'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: '9007 — verify',
          highBeam: '9007 — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      },
      '2007-2013': {
        engine: {
          oilViscosity: '5W-30 (4.3L V6, 4.8L/5.3L/6.0L/6.2L V8)',
          oilCapacity: '5.0 qt (4.3L w/filter) / 6.0 qt (V8 w/filter)',
          oilFilterPN: 'ACDelco PF48 (5.3L/6.0L/6.2L) / PF46 (4.3L/4.8L) — verify',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '15.0 qt (5.3L) — approx'
        },
        transmission: {
          fluidType: 'DEXRON-VI (4L60E 4-speed / 6L80 6-speed auto)',
          capacity: '2.5 qt drain-and-refill (4L60E) — approx'
        },
        transferCase: { fluidType: 'GM Auto-Trak II (NVG 246)', capacity: '1.5 qt', note: '4WD models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.5 qt', note: '4WD models only.' },
          rear: { fluidType: 'SAE 75W-90 GL-5 (limited-slip: add friction modifier)', capacity: '3.0 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35, rearPSI: 35,
          oemSizes: ['P265/70R17', 'P265/65R18', 'P275/55R20'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: 'H13 (9008) — verify',
          highBeam: 'H13 (9008) — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      }
    },
    yukon: {
      '2007-2014': {
        engine: {
          oilViscosity: '5W-30 (4.8L/5.3L/6.0L/6.2L V8)',
          oilCapacity: '6.0 qt (5.3L w/filter) — approx',
          oilFilterPN: 'ACDelco PF48',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '16.0 qt — approx'
        },
        transmission: {
          fluidType: 'DEXRON-VI (4L60E/4L70E/6L80 auto)',
          capacity: '2.5 qt drain-and-refill — approx'
        },
        transferCase: { fluidType: 'GM Auto-Trak II', capacity: '1.5 qt', note: '4WD models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.5 qt', note: '4WD models only.' },
          rear: { fluidType: 'SAE 75W-90 GL-5 (limited-slip: add friction modifier)', capacity: '3.0 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35, rearPSI: 35,
          oemSizes: ['P265/70R17', 'P275/55R20', 'P285/45R22 (Denali)'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: 'H13 (9008) — verify',
          highBeam: 'H13 (9008) — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      }
    },
    'yukon xl': {
      '2007-2014': {
        engine: {
          oilViscosity: '5W-30 (5.3L/6.0L/6.2L V8)',
          oilCapacity: '6.0 qt (5.3L w/filter) — approx',
          oilFilterPN: 'ACDelco PF48',
          coolantType: 'Dex-Cool (orange)',
          coolantCapacity: '16.0 qt — approx'
        },
        transmission: {
          fluidType: 'DEXRON-VI (4L60E/4L70E/6L80 auto)',
          capacity: '2.5 qt drain-and-refill — approx'
        },
        transferCase: { fluidType: 'GM Auto-Trak II', capacity: '1.5 qt', note: '4WD models only.' },
        differentials: {
          front: { fluidType: 'SAE 75W-90 GL-5', capacity: '2.5 qt', note: '4WD models only.' },
          rear: { fluidType: 'SAE 75W-90 GL-5 (limited-slip: add friction modifier)', capacity: '3.0 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35, rearPSI: 35,
          oemSizes: ['P265/70R17', 'P275/55R20', 'P285/45R22 (Denali)'],
          lugNutTorque: 140
        },
        bulbs: {
          lowBeam: 'H13 (9008) — verify',
          highBeam: 'H13 (9008) — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      }
    }
  },
  nissan: {
    armada: {
      '2004-2015': {
        engine: {
          oilViscosity: '5W-30 (5.6L VK56DE V8)',
          oilCapacity: '6.9 qt w/filter — approx',
          oilFilterPN: 'Nissan 15208-65F0A',
          coolantType: 'Nissan Genuine Coolant (blue)',
          coolantCapacity: '13.5 qt — approx'
        },
        transmission: {
          fluidType: 'Nissan Matic J (RE5R05A 5-speed auto)',
          capacity: '4.0 qt drain-and-refill — approx'
        },
        transferCase: { fluidType: 'Nissan Genuine ATF (Matic D/K) — verify', capacity: '2.0 qt', note: '4WD models only.' },
        differentials: {
          front: { fluidType: 'SAE 80W-90 GL-5', capacity: '2.0 qt', note: '4WD models only.' },
          rear: { fluidType: 'SAE 80W-90 GL-5 (limited-slip: add friction modifier)', capacity: '2.5 qt' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 35, rearPSI: 35,
          oemSizes: ['P265/70R18', 'P285/60R20 (2008+)'],
          lugNutTorque: 98
        },
        bulbs: {
          lowBeam: '9007 — verify',
          highBeam: '9007 — verify',
          frontTurn: '3157NA (amber)',
          rearTurn: '3157',
          tailBrake: '3157',
          interior: '906/912 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, near the steering column.'
      }
    },
    murano: {
      '2003-2007': {
        engine: {
          oilViscosity: '5W-30 (3.5L VQ35DE V6)',
          oilCapacity: '4.9 qt w/filter — approx',
          oilFilterPN: 'Nissan 15208-65F0A',
          coolantType: 'Nissan Genuine Coolant (blue)',
          coolantCapacity: '8.5 qt — approx'
        },
        transmission: {
          fluidType: 'Nissan CVT Fluid NS-1 — verify (early Murano CVT)',
          capacity: "Consult owner's manual (CVT fill procedure)"
        },
        transferCase: { fluidType: 'Nissan Genuine ATF — verify', capacity: '1.0 qt', note: 'AWD models only.' },
        differentials: {
          front: null,
          rear: { fluidType: 'SAE 80W-90 GL-5', capacity: '1.0 qt', note: 'AWD models only.' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 32, rearPSI: 32,
          oemSizes: ['P235/65R18'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: '9006 (halogen) — verify',
          highBeam: '9005 (halogen) — verify',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, near the steering column.'
      },
      '2009-2014': {
        engine: {
          oilViscosity: '5W-30 (3.5L VQ35DE V6)',
          oilCapacity: '4.9 qt w/filter — approx',
          oilFilterPN: 'Nissan 15208-65F0A',
          coolantType: 'Nissan Genuine Coolant (blue)',
          coolantCapacity: '8.5 qt — approx'
        },
        transmission: {
          fluidType: 'Nissan CVT Fluid NS-2 (2009-2011) / NS-3 (2012+)',
          capacity: "Consult owner's manual (CVT fill procedure)"
        },
        transferCase: { fluidType: 'Nissan Genuine ATF — verify', capacity: '1.0 qt', note: 'AWD models only.' },
        differentials: {
          front: null,
          rear: { fluidType: 'SAE 80W-90 GL-5', capacity: '1.0 qt', note: 'AWD models only.' }
        },
        brakeFluid: 'DOT 3',
        tires: {
          frontPSI: 33, rearPSI: 33,
          oemSizes: ['P235/65R18', 'P235/55R20'],
          lugNutTorque: 80
        },
        bulbs: {
          lowBeam: 'H11 (halogen) — verify',
          highBeam: '9005 (halogen) — verify',
          frontTurn: '7444NA (amber)',
          rearTurn: '7440 (amber)',
          tailBrake: '7443',
          interior: 'DE3175 (dome/map) — verify',
          license: '168 (W5W)'
        },
        obd2Location: 'Under driver side dashboard, near the steering column.'
      }
    }
  },
  bmw: {
    '330i': {
      '2001-2005': {
        engine: {
          oilViscosity: '5W-30 (BMW LL-98/LL-01 — M54B30 3.0L I6)',
          oilCapacity: "Consult owner's manual",
          oilFilterPN: 'BMW 11427511287 (M54)',
          coolantType: 'BMW Long Life Coolant (blue)',
          coolantCapacity: "Consult owner's manual"
        },
        transmission: {
          fluidType: 'ZF Lifeguard 5 (5HP19 auto) / BMW MTF LT-2 (5-speed manual)',
          capacity: "Consult owner's manual"
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models are rear-wheel drive.' }
        },
        brakeFluid: 'DOT 4',
        tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['205/55R16', '225/45R17', '225/40R18'], lugNutTorque: 88 },
        bulbs: { lowBeam: 'H7 (halogen) — verify', highBeam: 'H7 (halogen) — verify', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      },
      '2006-2008': {
        engine: {
          oilViscosity: '5W-30 (BMW LL-01 — N52B30 3.0L I6)',
          oilCapacity: "Consult owner's manual",
          oilFilterPN: 'BMW 11427512301 (N52)',
          coolantType: 'BMW Long Life Coolant (blue)',
          coolantCapacity: "Consult owner's manual"
        },
        transmission: {
          fluidType: 'ZF Lifeguard 6 (6HP auto) / BMW MTF LT-2 (6-speed manual)',
          capacity: "Consult owner's manual"
        },
        transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: "Consult owner's manual", note: 'xDrive AWD models only. RWD: no transfer case.' },
        differentials: {
          front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: "Consult owner's manual", note: 'xDrive models only' },
          rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models' }
        },
        brakeFluid: 'DOT 4',
        tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['225/45R17', '225/40R18'], lugNutTorque: 88 },
        bulbs: { lowBeam: 'H7 (halogen) / D1S (xenon) — verify', highBeam: 'H7 (halogen) — verify', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      }
    },
    '540i': {
      '1997-2003': {
        engine: {
          oilViscosity: '5W-30 (BMW LL-98/LL-01 — M62/M62TU 4.4L V8)',
          oilCapacity: "Consult owner's manual",
          oilFilterPN: 'BMW 11421746479 (M62) — verify',
          coolantType: 'BMW Long Life Coolant (blue)',
          coolantCapacity: "Consult owner's manual"
        },
        transmission: {
          fluidType: 'ZF Lifeguard 5 (5HP24 auto) / BMW MTF LT-2 (6-speed manual)',
          capacity: "Consult owner's manual"
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models are rear-wheel drive.' }
        },
        brakeFluid: 'DOT 4',
        tires: { frontPSI: 32, rearPSI: 35, oemSizes: ['235/45R17', '235/40R18', '255/35R18 (rear, staggered)'], lugNutTorque: 88 },
        bulbs: { lowBeam: 'H7 (halogen) — verify', highBeam: 'H7 (halogen) — verify', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      },
      '2006-2010': {
        engine: {
          oilViscosity: '5W-30 (BMW LL-01 — N62B48 4.8L V8)',
          oilCapacity: "Consult owner's manual",
          oilFilterPN: 'BMW 11427558627 (N62) — verify',
          coolantType: 'BMW Long Life Coolant (blue)',
          coolantCapacity: "Consult owner's manual"
        },
        transmission: {
          fluidType: 'ZF Lifeguard 6 (6HP19 auto) / BMW MTF LT-2 (6-speed manual)',
          capacity: "Consult owner's manual"
        },
        transferCase: { fluidType: 'BMW transfer case fluid (xDrive only)', capacity: "Consult owner's manual", note: 'xDrive AWD models only. RWD: no transfer case.' },
        differentials: {
          front: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: "Consult owner's manual", note: 'xDrive models only' },
          rear: { fluidType: 'BMW hypoid gear oil 75W-90 GL-5', capacity: "Consult owner's manual", note: 'All models' }
        },
        brakeFluid: 'DOT 4',
        tires: { frontPSI: 33, rearPSI: 38, oemSizes: ['225/50R17', '245/45R17', '245/40R18', '275/35R18 (rear, staggered)'], lugNutTorque: 88 },
        bulbs: { lowBeam: 'H7 (halogen) / D1S (xenon) — verify', highBeam: 'H7 (halogen) — verify', frontTurn: 'Consult owner\'s manual', rearTurn: 'Consult owner\'s manual', tailBrake: 'Consult owner\'s manual', interior: 'Consult owner\'s manual', license: 'Consult owner\'s manual' },
        obd2Location: 'Under driver side dashboard, left of steering column.'
      }
    }
  },
  polaris: {
    'sportsman 850': {
      '2006-2015': polarisSpec('Polaris Sportsman 850 — 850cc twin-cylinder 4-stroke (78 hp, 2006-2015 generation)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        'approx 2 qt (verify in manual)',
        7, 7, ["Consult owner's manual (27x9-12 front / 27x11-12 rear typical)"], 55)
    },
    'sportsman 850 high lifter': {
      '2007-2015': polarisSpec('Polaris Sportsman 850 High Lifter — 850cc twin-cylinder 4-stroke (78 hp, lifted suspension)',
        'Polaris PS-4 full-synthetic 5W-50 (equivalents: 5W-50 full synthetic, e.g., AMSOIL/Mobil 1)',
        'approx 2 qt (verify in manual)',
        7, 7, ["Consult owner's manual (27x9-12 front / 27x11-12 rear typical)"], 55)
    }
  },
  'john deere': {
    '5r': { '2012-2014': agSpec('John Deere 5R Series — diesel compact utility tractor; IVT or PowerShift', '15W-40 JD Plus-50 II diesel oil', 'John Deere Hy-Gard') },
    '7r': { '2012-2014': agSpec('John Deere 7R Series — diesel row-crop tractor; IVT or PowerShift', '15W-40 JD Plus-50 II diesel oil', 'John Deere Hy-Gard') },
    '8r': { '2012-2014': agSpec('John Deere 8R Series — diesel row-crop tractor; IVT or PowerShift', '15W-40 JD Plus-50 II diesel oil', 'John Deere Hy-Gard') },
    '9r': { '2012-2014': agSpec('John Deere 9R Series — diesel articulated/row-crop tractor; IVT or PowerShift', '15W-40 JD Plus-50 II diesel oil', 'John Deere Hy-Gard') },
    '3039r': { '2012-2014': agSpec('John Deere 3039R — 3-cylinder Yanmar diesel compact tractor; HST', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '4044m': { '2014-2014': agSpec('John Deere 4M Series — diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '4052m': { '2014-2014': agSpec('John Deere 4M Series — diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '5045e': { '2013-2014': agSpec('John Deere 5045E — 3-cylinder diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '5055e': { '2013-2014': agSpec('John Deere 5055E — 3-cylinder diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    '5065e': { '2013-2014': agSpec('John Deere 5065E — 3-cylinder diesel utility tractor', '15W-40 diesel oil', 'John Deere Hy-Gard') },
    'xuv825m': { '2014-2014': jdGatorSpec('John Deere Gator XUV825M — 812cc gasoline utility vehicle', 'gasoline') },
    'xuv865m': { '2014-2014': jdGatorSpec('John Deere Gator XUV865M — diesel utility vehicle', 'diesel') },
    'xuv590e': { '2014-2014': jdGatorSpec('John Deere Gator XUV590E — gasoline utility vehicle', 'gasoline') },
    'xuv560e': { '2014-2014': jdGatorSpec('John Deere Gator XUV560E — gasoline utility vehicle', 'gasoline') },
    'gator-hpx': { '2003-2014': jdGatorSpec('John Deere Gator HPX — gasoline/diesel utility vehicle', 'gasoline/diesel') },
    'gator-te': { '2004-2014': jdGatorSpec('John Deere Gator TE — electric utility vehicle', 'electric') },
    'gator-tx': { '2004-2014': jdGatorSpec('John Deere Gator TX — gasoline utility vehicle', 'gasoline') }
  },
  mercury: {
    '300 verado': {
      '2008-2014': marineOutboardSpec('Mercury Verado — supercharged 3.4L inline-6 4-stroke outboard (275/300 hp, L6 generation)',
        'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
        'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
        'Mercury SmartCraft / VesselView diagnostic connector under the cowl — dealer software; no OBD-II port.')
    },
    '350 verado': {
      '2010-2014': marineOutboardSpec('Mercury Verado — supercharged 3.4L inline-6 4-stroke outboard (350 hp, L6 generation)',
        'Mercury/Quicksilver 4-Stroke Outboard Oil SAE 10W-30 (NMMA FC-W certified)',
        'Mercury High Performance Gear Lube / Quicksilver Premium Blend (SAE 80W-90)',
        'Mercury SmartCraft / VesselView diagnostic connector under the cowl — dealer software; no OBD-II port.')
    }
  },
  thor: {
    'four winds': {
      '2005-2014': rvSpec(
        'Ford E-350/E-450 chassis, 6.8L Triton V10 gasoline',
        '5W-20/5W-30 chassis oil (engine and model year dependent)',
        'Ford TorqShift 5-speed automatic (2008+) / 4R100 (2005-2007)',
        'Onan gasoline generator oil',
        '2005-2014'
      )
    }
  }
};
for (const [make, models] of Object.entries(wave19BackfillB)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) {
    referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
  }
}

export default referenceSpecs;


// ── Wave 20 automotive reference backfill ─────────────
const wave20AutoBackfill = {
  "pontiac": {
    "g6": {
      "2005-2010": {
        "engine": {
          "oilViscosity": "5W-30 2.4L I4 / 3.5L and 3.9L V6",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 4T45-E/6T70",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 30,
          "rearPSI": 30,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "bonneville": {
      "2000-2005": {
        "engine": {
          "oilViscosity": "5W-30 3.8L 3800 V6 / 4.6L Northstar V8",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 4T65-E",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "grand am": {
      "1999-2005": {
        "engine": {
          "oilViscosity": "5W-30 2.2L Ecotec / 3.4L V6",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 4T45-E",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 30,
          "rearPSI": 30,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "sunfire": {
      "1995-2005": {
        "engine": {
          "oilViscosity": "5W-30 2.2L/2.4L I4",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 4T40-E",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 30,
          "rearPSI": 30,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "montana": {
      "1999-2009": {
        "engine": {
          "oilViscosity": "5W-30 3.4L/3.5L/3.9L V6",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 4T65-E",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "torrent": {
      "2006-2009": {
        "engine": {
          "oilViscosity": "5W-30 3.4L/3.6L V6",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 6T70",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "solstice gxp": {
      "2007-2009": {
        "engine": {
          "oilViscosity": "5W-30 2.0L turbo Ecotec LNF",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 5-speed manual/5L40-E",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "g8 gt": {
      "2008-2009": {
        "engine": {
          "oilViscosity": "5W-30 6.0L V8 L76",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 6L80",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": null,
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "g8 gxp": {
      "2009-2009": {
        "engine": {
          "oilViscosity": "5W-30 6.2L LS3 V8",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 6L80/Tremec manual",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": null,
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "vibe gt": {
      "2003-2006": {
        "engine": {
          "oilViscosity": "5W-30 1.8L 2ZZ-GE",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Toyota manual gear oil 6-speed",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 30,
          "rearPSI": 30,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "firebird trans am": {
      "1993-2002": {
        "engine": {
          "oilViscosity": "5W-30 5.7L LT1/LS1 V8",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-II/III 4L60E or T56 fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": null,
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "firebird formula": {
      "1993-2002": {
        "engine": {
          "oilViscosity": "5W-30 5.7L LT1/LS1 V8",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-II/III 4L60E or T56 fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": null,
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "mazda": {
    "626": {
      "1993-2002": {
        "engine": {
          "oilViscosity": "5W-30 2.0L FS / 2.5L KL",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Mazda ATF M-III",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "cx-50": {
      "2023-2026": {
        "engine": {
          "oilViscosity": "0W-20 2.5L Skyactiv-G/turbo",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Mazda ATF-FZ 6-speed",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 35,
          "rearPSI": 35,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "cx-90": {
      "2024-2026": {
        "engine": {
          "oilViscosity": "0W-20 3.3L turbo I6 / 2.5L PHEV",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Mazda ATF-FZ 8-speed",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 36,
          "rearPSI": 36,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "mazda6": {
      "2003-2021": {
        "engine": {
          "oilViscosity": "5W-20 2.3L/2.5L or 5W-30 3.0L",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Mazda ATF M-V/FZ",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "mx-6": {
      "1993-1997": {
        "engine": {
          "oilViscosity": "5W-30 2.0L/2.5L KL-DE",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Mazda ATF M-III",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "protege": {
      "1995-2003": {
        "engine": {
          "oilViscosity": "5W-30 1.6L/1.8L/2.0L",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Mazda ATF M-III",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "millenia": {
      "1995-2002": {
        "engine": {
          "oilViscosity": "5W-30 2.3L Miller-cycle KJ-ZEM/2.5L V6",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Mazda ATF M-III",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "b-series": {
      "1994-2009": {
        "engine": {
          "oilViscosity": "5W-30 2.3L/2.5L I4 or 3.0L/4.0L V6",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "MERCON/MERCON V",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 30,
          "rearPSI": 30,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "rx-7": {
      "1993-1995": {
        "engine": {
          "oilViscosity": "Rotary-specific oil; 1.3L 13B-REW twin-turbo with oil injection; no conventional piston-engine specification",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "API GL-4 manual transmission oil",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": null,
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "rx-8": {
      "2004-2011": {
        "engine": {
          "oilViscosity": "Rotary-specific oil; 1.3L Renesis oil metering injection; frequent level checks",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Mazda manual transmission oil or Mazda ATF M-V",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": null,
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "buick": {
    "envision": {
      "2016-2026": {
        "engine": {
          "oilViscosity": "Dexos1 5W-30 2.0L turbo/2.5L I4",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 9T50",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 35,
          "rearPSI": 35,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "encore": {
      "2013-2022": {
        "engine": {
          "oilViscosity": "Dexos1 5W-30 1.4L turbo LUJ/LUV",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 6T40",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 35,
          "rearPSI": 35,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "lacrosse": {
      "2005-2009": {
        "engine": {
          "oilViscosity": "5W-30 3.8L V6/5.3L V8",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 4T65-E",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      },
      "2010-2016": {
        "engine": {
          "oilViscosity": "5W-30 2.4L eAssist/3.0L/3.6L V6",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 6T40/6T50/6T70",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      },
      "2017-2019": {
        "engine": {
          "oilViscosity": "5W-30 3.6L V6",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-VI 9-speed",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "gnx": {
      "1987-1987": {
        "engine": {
          "oilViscosity": "5W-30 3.8L turbo V6 LC2",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-II/III 200-4R",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": null,
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "riviera": {
      "1995-1999": {
        "engine": {
          "oilViscosity": "5W-30 3.8L supercharged L67",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-III/VI 4T65-E",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "lesabre": {
      "2000-2005": {
        "engine": {
          "oilViscosity": "5W-30 3.8L 3800 Series II",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-III/VI 4T65-E",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "park avenue": {
      "1997-2005": {
        "engine": {
          "oilViscosity": "5W-30 3.8L 3800 Series II/III",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-III/VI 4T65-E",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "rendezvous": {
      "2002-2007": {
        "engine": {
          "oilViscosity": "5W-30 3.4L LA1/3.6L LY7",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Dex-Cool or manufacturer-approved coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DEXRON-III/VI 4T65-E",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 35,
          "rearPSI": 35,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  }
};
for (const [make, models] of Object.entries(wave20AutoBackfill)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}
const wave21AutoBackfill = {
  "chevrolet": {
    "suburban": {
      "2000-2006": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      },
      "2007-2014": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      },
      "2015-2020": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      },
      "2021-2026": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "trax": {
      "2015-2022": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "blazer": {
      "2019-2026": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "corvette": {
      "2005-2013": {
        "engine": {
          "oilViscosity": "5W-30; 0W-40 dry-sump performance models",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      },
      "2014-2019": {
        "engine": {
          "oilViscosity": "5W-30; 0W-40 dry-sump performance models",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      },
      "2020-2026": {
        "engine": {
          "oilViscosity": "5W-30; 0W-40 dry-sump performance models",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "impala": {
      "2000-2020": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "express": {
      "2000-2026": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "ford": {
    "transit": {
      "2015-2026": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "focus": {
      "2000-2011": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      },
      "2012-2018": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "f-350": {
      "1999-2026": {
        "engine": {
          "oilViscosity": "5W-30 gasoline; 15W-40 diesel; 6.7L diesel 13 qt",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "e-series": {
      "2000-2026": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "mitsubishi": {
    "eclipse": {
      "2000-2012": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "montero": {
      "2000-2006": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "3000gt": {
      "1991-1999": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "galant": {
      "2000-2012": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "infiniti": {
    "q60": {
      "2014-2022": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "qx50": {
      "2014-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "qx60": {
      "2014-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Nissan NS-3 CVT; 9-speed automatic 2022+",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "qx80": {
      "2014-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "hyundai": {
    "kona": {
      "2018-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "ioniq 6": {
      "2023-2026": {
        "engine": {
          "oilViscosity": "No engine oil",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Gear reduction unit fluid; battery coolant",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "venue": {
      "2020-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "nissan": {
    "versa": {
      "2007-2026": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "kicks": {
      "2018-2026": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "maxima": {
      "2000-2023": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "lincoln": {
    "corsair": {
      "2020-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "nautilus": {
      "2019-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "aviator": {
      "2020-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "honda": {
    "element": {
      "2003-2011": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Honda ATF DW-1",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "ridgeline": {
      "2006-2026": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Honda ATF DW-1; rear differential Honda DPSF-II",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "jeep": {
    "patriot": {
      "2007-2017": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    },
    "wagoneer": {
      "2022-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "toyota": {
    "camry hybrid": {
      "2007-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Toyota ATF WS eCVT transaxle; separate inverter coolant loop",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "bmw": {
    "4 series": {
      "2014-2026": {
        "engine": {
          "oilViscosity": "BMW LL-01/LL-04 0W-30/5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "ZF Lifeguard 8",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "audi": {
    "a3": {
      "2006-2026": {
        "engine": {
          "oilViscosity": "VW 502.00/504.00",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "DSG fluid/manual per model",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "volvo": {
    "xc40": {
      "2019-2026": {
        "engine": {
          "oilViscosity": "0W-20",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": {
          "fluidType": "Consult owner's manual",
          "capacity": "Consult owner's manual"
        },
        "differentials": {
          "front": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          },
          "rear": {
            "fluidType": "SAE 75W-90 GL-5",
            "capacity": "Consult owner's manual"
          }
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  },
  "dodge": {
    "journey": {
      "2009-2020": {
        "engine": {
          "oilViscosity": "5W-30",
          "oilCapacity": "Consult owner's manual",
          "oilFilterPN": "Consult owner's manual",
          "coolantType": "Manufacturer-approved long-life coolant",
          "coolantCapacity": "Consult owner's manual"
        },
        "transmission": {
          "fluidType": "Manufacturer-specified automatic/CVT/DCT fluid",
          "capacity": "Consult owner's manual"
        },
        "transferCase": null,
        "differentials": {
          "front": null,
          "rear": null
        },
        "brakeFluid": "DOT 3",
        "tires": {
          "frontPSI": 32,
          "rearPSI": 32,
          "oemSizes": [
            "Consult owner's manual"
          ],
          "lugNutTorque": 100
        },
        "bulbs": {
          "lowBeam": "Consult owner's manual",
          "highBeam": "Consult owner's manual",
          "frontTurn": "Consult owner's manual",
          "rearTurn": "Consult owner's manual",
          "tailBrake": "Consult owner's manual",
          "interior": "Consult owner's manual",
          "license": "Consult owner's manual"
        },
        "obd2Location": "Under driver-side dashboard near steering column."
      }
    }
  }
};
for (const [make, models] of Object.entries(wave21AutoBackfill)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}

// Wave 22: Kubota agricultural equipment reference-spec backfill.
// Values intentionally remain conservative where configurations vary by engine, market, or implement.
const wave22AgBackfill = {
  kubota: {
    mx5200: {
      '2013-2026': {
        engine: {
          oilViscosity: '15W-40 diesel oil (Kubota DH-2 or equivalent; viscosity varies by ambient temperature)',
          oilCapacity: "Consult owner's manual",
          oilFilterPN: "Consult owner's manual",
          coolantType: 'Kubota-approved long-life diesel coolant',
          coolantCapacity: "Consult owner's manual"
        },
        transmission: {
          fluidType: 'Kubota UDT or Super UDT-2 universal trans-hydraulic fluid (HST or gear transmission)',
          capacity: "Consult owner's manual"
        },
        transferCase: null,
        differentials: {
          front: { fluidType: 'Kubota UDT or Super UDT-2 universal trans-hydraulic fluid', capacity: "Consult owner's manual" },
          rear: { fluidType: 'Kubota UDT or Super UDT-2 universal trans-hydraulic fluid', capacity: "Consult owner's manual" }
        },
        brakeFluid: 'Consult owner\'s manual',
        tires: {
          frontPSI: "Consult owner's manual",
          rearPSI: "Consult owner's manual",
          oemSizes: ["Consult owner's manual"],
          lugNutTorque: "Consult owner's manual"
        },
        bulbs: {
          lowBeam: null,
          highBeam: null,
          frontTurn: null,
          rearTurn: null,
          tailBrake: null,
          interior: null,
          license: null
        },
        obd2Location: 'No conventional OBD-II port; diagnostic connector and access vary by engine/control-system configuration. Consult dealer service information.',
        serviceUnit: 'hrs'
      }
    },
    b2601: {
      '2014-2026': {
        engine: {
          oilViscosity: '15W-40 diesel oil (Kubota DH-2 or equivalent; viscosity varies by ambient temperature)',
          oilCapacity: "Consult owner's manual",
          oilFilterPN: "Consult owner's manual",
          coolantType: 'Kubota-approved long-life diesel coolant',
          coolantCapacity: "Consult owner's manual"
        },
        transmission: {
          fluidType: 'Kubota UDT or Super UDT-2 universal trans-hydraulic fluid (HST)',
          capacity: "Consult owner's manual"
        },
        transferCase: null,
        differentials: {
          front: { fluidType: 'Kubota UDT or Super UDT-2 universal trans-hydraulic fluid', capacity: "Consult owner's manual" },
          rear: { fluidType: 'Kubota UDT or Super UDT-2 universal trans-hydraulic fluid', capacity: "Consult owner's manual" }
        },
        brakeFluid: 'Consult owner\'s manual',
        tires: {
          frontPSI: "Consult owner's manual",
          rearPSI: "Consult owner's manual",
          oemSizes: ["Consult owner's manual"],
          lugNutTorque: "Consult owner's manual"
        },
        bulbs: {
          lowBeam: null,
          highBeam: null,
          frontTurn: null,
          rearTurn: null,
          tailBrake: null,
          interior: null,
          license: null
        },
        obd2Location: 'No conventional OBD-II port; diagnostic connector and access vary by engine/control-system configuration. Consult dealer service information.',
        serviceUnit: 'hrs'
      }
    },
    z700: {
      '2008-2026': {
        engine: {
          oilViscosity: 'Consult owner\'s manual (Kawasaki or Kohler gasoline engine; commonly SAE 10W-30)',
          oilCapacity: "Consult owner's manual",
          oilFilterPN: "Consult owner's manual",
          coolantType: null,
          coolantCapacity: null
        },
        transmission: {
          fluidType: 'Hydrostatic drive fluid specified for the installed wheel motors/transaxles; consult owner\'s manual',
          capacity: "Consult owner's manual"
        },
        transferCase: null,
        differentials: {
          front: null,
          rear: null
        },
        brakeFluid: null,
        tires: {
          frontPSI: "Consult owner's manual",
          rearPSI: "Consult owner's manual",
          oemSizes: ["Consult owner's manual"],
          lugNutTorque: "Consult owner's manual"
        },
        bulbs: {
          lowBeam: null,
          highBeam: null,
          frontTurn: null,
          rearTurn: null,
          tailBrake: null,
          interior: null,
          license: null
        },
        obd2Location: 'No conventional OBD-II port; small-engine diagnostic access varies by installed Kawasaki or Kohler engine.',
        serviceUnit: 'hrs'
      }
    }
  }
};
for (const [make, models] of Object.entries(wave22AgBackfill)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models)) {
    referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
  }
}


// Wave 23: Yamaha WaveRunner GP and SVHO personal watercraft reference specs.
const wave23PWCBackfill = {
  yamaha: {
    gp: {
      '2018-2026': {
        engine: {
          oilViscosity: 'Yamalube marine 10W-40',
          oilCapacity: "Consult owner's manual",
          oilFilterPN: "Consult owner's manual",
          coolantType: 'Closed-loop cooling system; marine coolant',
          coolantCapacity: "Consult owner's manual"
        },
        transmission: {
          fluidType: 'Jet pump — no conventional transmission. Use Yamalube marine grease for pump bearings.',
          capacity: 'N/A — jet pump'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'N/A — watercraft braking via reverse bucket / deceleration',
        tires: {
          frontPSI: 'N/A',
          rearPSI: 'N/A',
          oemSizes: [],
          lugNutTorque: 'N/A'
        },
        bulbs: {
          lowBeam: 'N/A',
          highBeam: 'N/A',
          frontTurn: 'N/A',
          rearTurn: 'N/A',
          tailBrake: 'N/A',
          interior: 'N/A',
          license: 'N/A'
        },
        obd2Location: 'Yamaha Diagnostic System (YDS) connector, typically under seat or in engine compartment. Not standard OBD-II.',
        serviceUnit: 'hrs'
      }
    },
    svho: {
      '2015-2026': {
        engine: {
          oilViscosity: 'Yamalube marine 10W-40',
          oilCapacity: "Consult owner's manual",
          oilFilterPN: "Consult owner's manual",
          coolantType: 'Closed-loop cooling system; marine coolant',
          coolantCapacity: "Consult owner's manual"
        },
        transmission: {
          fluidType: 'Jet pump — no conventional transmission. Use Yamalube marine grease for pump bearings.',
          capacity: 'N/A — jet pump'
        },
        transferCase: null,
        differentials: { front: null, rear: null },
        brakeFluid: 'N/A — watercraft braking via reverse bucket / deceleration',
        tires: {
          frontPSI: 'N/A',
          rearPSI: 'N/A',
          oemSizes: [],
          lugNutTorque: 'N/A'
        },
        bulbs: {
          lowBeam: 'N/A',
          highBeam: 'N/A',
          frontTurn: 'N/A',
          rearTurn: 'N/A',
          tailBrake: 'N/A',
          interior: 'N/A',
          license: 'N/A'
        },
        obd2Location: 'Yamaha Diagnostic System (YDS) connector, typically under seat or in engine compartment. Not standard OBD-II.',
        serviceUnit: 'hrs'
      }
    }
  }
};
for (const [make, models] of Object.entries(wave23PWCBackfill)) {
  referenceSpecs[make] = referenceSpecs[make] || {};
  for (const [model, years] of Object.entries(models))
    referenceSpecs[make][model] = { ...referenceSpecs[make][model], ...years };
}
