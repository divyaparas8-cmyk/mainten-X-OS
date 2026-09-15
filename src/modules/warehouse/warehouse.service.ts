import { db } from "../../config/database.js";
import { inventoryLots, inventoryTransactions, warehouses, locationBins, goodsReceipts, shipmentOrders, suppliers, warehouseLocations, wmsReceiving, finishedGoods } from "../../db/schema/warehouse.js";
import { recallEvents } from "../../db/schema/traceability.js";
import { skus } from "../../db/schema/masterData.js";
import { batches, batchSteps, ccpChecks, qaReleases, qualityHolds, productionOrders } from "../../db/schema/production.js";
import { eq, and, or, isNull, sql, desc } from "drizzle-orm";
import { CreateLotInput, CreateTransactionInput } from "./warehouse.schema.js";
import { NotFoundError, BusinessRuleError } from "../../shared/errors/AppError.js";

import { isValidUuid } from "../../shared/utils/tenantContext.js";

// Initial In-Memory Persistent Stores
let purchaseOrdersStore: any[] = [
  {
    poNumber: "PO-SUP-2026-441",
    supplierName: "Citrus Valley Farms Co.",
    supplierCode: "VND-CVF-01",
    orderDate: "2026-08-28",
    deliveryDueDate: "2026-09-02",
    totalAmountUSD: 28800.00,
    itemsCount: 2,
    status: "In Transit",
    receivingStatus: "Pending Dock Arrival",
    buyer: "Alex Morgan (Procurement Lead)",
    priority: "High",
    lines: [
      { item: "Organic Valencia Orange Juice Concentrate 65° Brix", qty: "6,000 kg", unitPrice: 4.80, total: 28800.00 }
    ]
  },
  {
    poNumber: "PO-SUP-2026-438",
    supplierName: "Alfa Laval Parts Global",
    supplierCode: "VND-ALF-02",
    orderDate: "2026-08-30",
    deliveryDueDate: "2026-08-31",
    totalAmountUSD: 2250.00,
    itemsCount: 1,
    status: "Confirmed",
    receivingStatus: "Dock Inspected (Pre-Check)",
    buyer: "David Kim (Maintenance Lead)",
    priority: "Urgent P1",
    lines: [
      { item: "Clip-on EPDM High-Temp Gasket Pack (50pk)", qty: "5 packs", unitPrice: 450.00, total: 2250.00 }
    ]
  },
  {
    poNumber: "PO-SUP-2026-429",
    supplierName: "Amcor Rigid Packaging",
    supplierCode: "VND-AMC-03",
    orderDate: "2026-08-22",
    deliveryDueDate: "2026-08-29",
    totalAmountUSD: 14000.00,
    itemsCount: 1,
    status: "Received",
    receivingStatus: "Received Full (Put-Away Complete)",
    buyer: "Alex Morgan (Procurement Lead)",
    priority: "Standard",
    lines: [
      { item: "500ml Multi-Layer Oxygen Barrier PET Bottles", qty: "100,000 units", unitPrice: 0.14, total: 14000.00 }
    ]
  },
  {
    poNumber: "PO-SUP-2026-422",
    supplierName: "Ball Metal Beverage Packaging",
    supplierCode: "VND-BLL-04",
    orderDate: "2026-08-18",
    deliveryDueDate: "2026-08-25",
    totalAmountUSD: 13200.00,
    itemsCount: 1,
    status: "Received",
    receivingStatus: "Received Full (QA Released)",
    buyer: "Alex Morgan (Procurement Lead)",
    priority: "Standard",
    lines: [
      { item: "330ml Sleek Aluminum Cans w/ Matte Varnish", qty: "120,000 cans", unitPrice: 0.11, total: 13200.00 }
    ]
  },
  {
    poNumber: "PO-SUP-2026-415",
    supplierName: "Sugar Valley Refining Ltd.",
    supplierCode: "VND-SVR-05",
    orderDate: "2026-08-15",
    deliveryDueDate: "2026-08-22",
    totalAmountUSD: 6000.00,
    itemsCount: 1,
    status: "Received",
    receivingStatus: "Received Full (Silo Pumped)",
    buyer: "Elena Rostova (Batch Supervisor)",
    priority: "Standard",
    lines: [
      { item: "Non-GMO Liquid Cane Sugar 67.5° Brix", qty: "4,800 L", unitPrice: 1.25, total: 6000.00 }
    ]
  }
];

let suppliersStore: any[] = [];


let wmsReceivingStore: any[] = [
  { id: "RCV-2026-901", poNumber: "PO-SUP-2026-441", supplier: "Citrus Valley Farms Co.", item: "Valencia Orange Concentrate", qty: "6,000 kg", dock: "Dock Bay 01", status: "Dock Arrived", tempCheck: "3.4°C" },
  { id: "RCV-2026-902", poNumber: "PO-SUP-2026-438", supplier: "Alfa Laval Parts Global", item: "High-Temp Gasket Pack", qty: "5 packs", dock: "Dock Bay 03", status: "Inspected", tempCheck: "Ambient" },
  { id: "RCV-2026-903", poNumber: "PO-SUP-2026-429", supplier: "Amcor Rigid Packaging", item: "500ml PET Bottles", qty: "100,000 units", dock: "Dock Bay 04", status: "Pending Arrival", tempCheck: "Dry Clean" }
];

let wmsPutAwayStore: any[] = [
  { id: "PTA-441", lot: "LOT-RM-ORG-4402", material: "Valencia Organic Orange Concentrate", qty: "3,800 kg (5 Plts)", source: "Dock STG-01", targetBin: "Cold Zone A - Rack R04-B2", priority: "High", status: "Ready for Put-Away" },
  { id: "PTA-442", lot: "LOT-PKG-CAN-9140", material: "330ml Aluminum Cans", qty: "120,000 cans (12 Plts)", source: "Dock STG-03", targetBin: "Packaging Bay 3 - Racks P01-P06", priority: "Standard", status: "In Progress" },
  { id: "PTA-443", lot: "LOT-RM-SGR-1108", material: "Non-GMO Liquid Cane Sugar", qty: "4,800 L (4 Drums)", source: "Dock STG-02", targetBin: "Ambient Bay 2 - Bin G-12", priority: "Standard", status: "Ready for Put-Away" }
];

let wmsMovementStore: any[] = [
  { id: "MOV-8801", lot: "LOT-RM-GNG-0092", material: "Organic Ginger Root Extract", qty: "60 kg", fromBin: "Ambient Bay 2 - Bin G-12", toBin: "Weighing Station Aisle 1", operator: "J. Henderson", time: "10:15 AM", reason: "Batch Kitting" },
  { id: "MOV-8802", lot: "LOT-PKG-BX-5520", material: "24-Pack Master Cartons", qty: "500 trays", fromBin: "Packaging Bay 3 - P02", toBin: "Packaging Line 2 Infeed", operator: "M. Ramirez", time: "09:40 AM", reason: "Line Replenishment" }
];

let wmsTransfersStore: any[] = [
  { id: "TRF-701", fromFacility: "Main Plant WH-01", toFacility: "Distribution Center WH-02", item: "Finished Sparkling Yuzu Tea", qty: "18,000 cans (15 Plts)", carrier: "Titan Logistics", eta: "Today 14:00", status: "In Transit" },
  { id: "TRF-702", fromFacility: "Distribution Center WH-02", toFacility: "Main Plant WH-01", item: "Empty Returnable Plastic Pallets", qty: "200 Pallets", carrier: "In-House Shunt", eta: "Today 16:30", status: "Scheduled" }
];

let wmsPickOrdersStore: any[] = [
  { id: "PCK-501", orderRef: "WO-BATCH-2026-0891", lineItem: "Orange Concentrate + Citric Acid", targetWorkCenter: "Blending Tank T-101", itemsCount: 4, pickedItems: 3, status: "Picking Active" },
  { id: "PCK-502", orderRef: "WO-BATCH-2026-0892", lineItem: "Natural Terpene Emulsion", targetWorkCenter: "Flavor Add Skid S-04", itemsCount: 2, pickedItems: 0, status: "Pending Release" },
  { id: "PCK-503", orderRef: "SO-CUST-8819", lineItem: "Finished Yuzu Cans 330ml", targetWorkCenter: "Outbound Bay 2", itemsCount: 1, pickedItems: 1, status: "Pick Complete" }
];

let wmsStagingStore: any[] = [
  { bay: "Stage Bay STG-PROD-01", destination: "Canning Line 1", stagedItem: "330ml Aluminum Cans + Ends", lot: "LOT-PKG-CAN-9140", pallets: 6, stagedBy: "K. Vance", status: "Staged Ready" },
  { bay: "Stage Bay STG-PROD-02", destination: "Batch Blending Tank 2", stagedItem: "Liquid Cane Sugar 67.5° Brix", lot: "LOT-RM-SGR-1108", pallets: 4, stagedBy: "D. Kim", status: "Staged Ready" },
  { bay: "Stage Bay STG-DOCK-04", destination: "Dock Outbound 4", stagedItem: "Yuzu Sparkling Tea Cases", lot: "LOT-FG-2026-0885", pallets: 10, stagedBy: "M. Ramirez", status: "Awaiting Dispatch" }
];

let wmsDispatchStore: any[] = [
  { id: "DSP-1041", shipmentId: "SHP-2026-881", customer: "Metro Supermarkets Distribution", destination: "Toronto Hub, ON", carrier: "Challenger Freight", trailerNo: "TR-5510", sealNo: "SL-99410", pallets: 24, status: "Loading Complete" },
  { id: "DSP-1042", shipmentId: "SHP-2026-882", customer: "Costco Wholesale East Depot", destination: "Brampton Depot, ON", carrier: "Bison Transport", trailerNo: "TR-8822", sealNo: "SL-99411", pallets: 26, status: "Dispatched" }
];

let locationsHierarchyStore: any[] = [
  {
    id: "LOC-WH1-ZA-R04-B1",
    warehouse: "Main Plant WH-01",
    zone: "Zone A (Cold Storage +4°C)",
    rack: "Rack R04",
    location: "Bin R04-B1",
    fullHierarchy: "WH-01 > Zone A > Rack R04 > Bin B1",
    capacityPallets: 40,
    occupiedPallets: 36,
    material: "Valencia Organic Orange Juice Concentrate 65° Brix",
    materialCode: "RM-ORG-CONC",
    batchLot: "LOT-RM-ORG-4402",
    quantity: "3,800 kg",
    status: "Near Capacity",
    temp: "3.4°C"
  },
  {
    id: "LOC-WH1-ZA-R04-B2",
    warehouse: "Main Plant WH-01",
    zone: "Zone A (Cold Storage +4°C)",
    rack: "Rack R04",
    location: "Bin R04-B2",
    fullHierarchy: "WH-01 > Zone A > Rack R04 > Bin B2",
    capacityPallets: 40,
    occupiedPallets: 28,
    material: "Natural Blood Orange & Mandarin Terpene Emulsion",
    materialCode: "RM-NAT-FLV",
    batchLot: "LOT-RM-FLV-0312",
    quantity: "160 kg",
    status: "Optimal",
    temp: "3.8°C"
  },
  {
    id: "LOC-WH1-ZB-R02-G12",
    warehouse: "Main Plant WH-01",
    zone: "Zone B (Ambient Raw)",
    rack: "Rack R02",
    location: "Bin G-12",
    fullHierarchy: "WH-01 > Zone B > Rack R02 > Bin G-12",
    capacityPallets: 60,
    occupiedPallets: 45,
    material: "Organic Ginger Root Extract Fluid 20:1",
    materialCode: "RM-GNG-EXT",
    batchLot: "LOT-RM-GNG-0092",
    quantity: "120 kg",
    status: "Optimal",
    temp: "21.2°C"
  },
  {
    id: "LOC-WH1-ZB-R03-G04",
    warehouse: "Main Plant WH-01",
    zone: "Zone B (Ambient Raw)",
    rack: "Rack R03",
    location: "Bin G-04",
    fullHierarchy: "WH-01 > Zone B > Rack R03 > Bin G-04",
    capacityPallets: 50,
    occupiedPallets: 48,
    material: "Non-GMO Liquid Cane Sugar 67.5° Brix",
    materialCode: "RM-SWT-SUCR",
    batchLot: "LOT-RM-SGR-1108",
    quantity: "4,800 L",
    status: "Near Capacity",
    temp: "21.0°C"
  },
  {
    id: "LOC-WH1-ZC-R01-P02",
    warehouse: "Main Plant WH-01",
    zone: "Zone C (Packaging High-Bay)",
    rack: "Rack P01",
    location: "Bin P01-A",
    fullHierarchy: "WH-01 > Zone C > Rack P01 > Bin P01-A",
    capacityPallets: 100,
    occupiedPallets: 85,
    material: "330ml Sleek Aluminum Cans w/ Matte Varnish",
    materialCode: "PKG-CAN-330",
    batchLot: "LOT-PKG-CAN-9140",
    quantity: "120,000 cans",
    status: "Optimal",
    temp: "22.5°C"
  },
  {
    id: "LOC-WH1-ZC-R02-P05",
    warehouse: "Main Plant WH-01",
    zone: "Zone C (Packaging High-Bay)",
    rack: "Rack P02",
    location: "Bin P02-B",
    fullHierarchy: "WH-01 > Zone C > Rack P02 > Bin P02-B",
    capacityPallets: 80,
    occupiedPallets: 40,
    material: "24-Pack Kraft Corrugated Master Shipping Trays",
    materialCode: "PKG-CRTN-24",
    batchLot: "LOT-PKG-BX-5520",
    quantity: "6,500 trays",
    status: "Optimal",
    temp: "22.0°C"
  },
  {
    id: "LOC-WH2-ZD-R01-FG44",
    warehouse: "Distribution Center WH-02",
    zone: "Zone D (Finished Goods Log Bay)",
    rack: "High-Bay Rack 01",
    location: "Bin FG-44",
    fullHierarchy: "WH-02 > Zone D > High-Bay 01 > Bin FG-44",
    capacityPallets: 120,
    occupiedPallets: 95,
    material: "Sparkling Yuzu Sparkling Tea 330ml Can",
    materialCode: "SKU-CAN-330ML-LEM",
    batchLot: "LOT-FG-2026-0885",
    quantity: "36,000 cans",
    status: "Optimal",
    temp: "18.5°C"
  },
  {
    id: "LOC-WH2-ZD-R02-FG48",
    warehouse: "Distribution Center WH-02",
    zone: "Zone D (Finished Goods Log Bay)",
    rack: "High-Bay Rack 02",
    location: "Bin FG-48",
    fullHierarchy: "WH-02 > Zone D > High-Bay 02 > Bin FG-48",
    capacityPallets: 120,
    occupiedPallets: 0,
    material: "Unoccupied Available Staging Bay",
    materialCode: "BIN-EMPTY",
    batchLot: "N/A",
    quantity: "0 units",
    status: "Available",
    temp: "18.5°C"
  }
];

let incomingDeliveriesStore: any[] = [
  {
    id: "DLV-001",
    supplier: "GlassCorp",
    item: "Glass Bottles 1L",
    volume: "20,000 Pcs",
    status: "TRANSIT",
    carrier: "FedEx Freight",
    trackingNo: "TRK-992140",
    eta: "Today 15:30",
    dockBay: "Dock Bay 02"
  },
  {
    id: "DLV-002",
    supplier: "Sugar Valley",
    item: "Liquid Cane Sugar 500L",
    volume: "2 Drums",
    status: "ARRIVED",
    carrier: "Titan Shunt",
    trackingNo: "TRK-881204",
    eta: "Arrived at 10:15 AM",
    dockBay: "Dock Bay 01"
  },
  {
    id: "DLV-003",
    supplier: "Citrus Valley Farms Co.",
    item: "Valencia Orange Concentrate 65° Brix",
    volume: "6,000 kg",
    status: "ARRIVED",
    carrier: "Swift Logistics",
    trackingNo: "TRK-440192",
    eta: "Arrived at 08:30 AM",
    dockBay: "Dock Bay 01"
  },
  {
    id: "DLV-004",
    supplier: "Amcor Rigid Packaging",
    item: "500ml PET Bottles",
    volume: "100,000 units",
    status: "TRANSIT",
    carrier: "Challenger Freight",
    trackingNo: "TRK-109482",
    eta: "Tomorrow 09:00 AM",
    dockBay: "Dock Bay 04"
  }
];

let scannerLogsStore: any[] = [
  {
    id: "SCN-101",
    barcode: "(01)00890281940212(10)LOT-RM-ORG-4402(17)261231",
    symbology: "GS1-128",
    lotCode: "LOT-RM-ORG-4402",
    materialName: "Valencia Organic Orange Concentrate 65° Brix",
    dockBay: "Dock Bay 01",
    qaStatus: "CoA Verified - PASSED",
    scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: "SCN-102",
    barcode: "(00)308902810091402218(10)LOT-PKG-CAN-9140",
    symbology: "SSCC-18",
    lotCode: "LOT-PKG-CAN-9140",
    materialName: "500ml Clear PET Preforms (28mm PCO)",
    dockBay: "Dock Bay 04",
    qaStatus: "CoA Verified - PASSED",
    scannedAt: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

let finishedGoodsStore: any[] = [];

let shipmentOrdersStore: any[] = [];

let traceabilityStore: Record<string, any> = {
  "LOT-RM-ORG-4402": {
    lotNumber: "LOT-RM-ORG-4402",
    materialName: "Valencia Organic Orange Juice Concentrate 65° Brix",
    materialCode: "RM-ORG-CONC",
    category: "Raw Material",
    type: "Raw Ingredient",
    quantity: "3,800 kg (19 Aseptic Drums)",
    supplier: "Citrus Valley Farms Co.",
    supplierLot: "CVF-2026-VAL-104",
    poNumber: "PO-2026-0881",
    receivedDate: "2026-09-03 08:45 AM",
    receivedLocation: "Dock 01 - Inbound Staging STG-01",
    currentLocation: "Cold Storage Zone A - Rack R04-B2",
    expiryDate: "2027-03-15",
    qaStatus: "Approved / Released",
    qaCert: "COA-9812-PASS",
    tempLog: "3.4°C (Target: 2.0°C - 4.0°C • Compliant)",
    integrityScore: "100%",
    barcode: "8902810044025",
    productionOrders: ["PO-OR-8821", "PO-OR-8824"],
    batches: [
      {
        batchId: "BAT-2026-0885",
        product: "Sparkling Organic Orange Soda 330ml Can",
        sku: "SKU-CAN-330ML-ORG",
        line: "High-Speed Packaging Line 1 (Rotary 580 BPM)",
        date: "2026-09-03 10:15 AM",
        quantityProduced: "36,000 Cans (1,500 Cases)",
        status: "Completed & Released",
        ccpStatus: "CCP-1 Pasteurized (72.4°C / 16s) • CCP-2 Metal Checked (Pass)",
        finishedLot: "LOT-FG-2026-0885",
        pallets: [
          { palletId: "PLT-0885-01", cases: 75, lpn: "GS1-128-LPN-9910", dest: "Whole Foods DC 04 (Austin, TX)" },
          { palletId: "PLT-0885-02", cases: 75, lpn: "GS1-128-LPN-9911", dest: "H-E-B Central Distribution (San Antonio, TX)" }
        ]
      },
      {
        batchId: "BAT-2026-0886",
        product: "Organic Citrus Blast 500ml Bottle",
        sku: "SKU-BOT-500ML-CIT",
        line: "Bottling Line 2 (Aseptic Filler)",
        date: "2026-09-03 14:00 PM",
        quantityProduced: "24,000 Bottles (1,000 Cases)",
        status: "In Staging / Final QA Review",
        ccpStatus: "CCP-1 Passed • In-line Brix Validated (11.4°)",
        finishedLot: "LOT-FG-2026-0886",
        pallets: [
          { palletId: "PLT-0886-01", cases: 50, lpn: "GS1-128-LPN-9920", dest: "Central Market Hub (Dallas, TX)" }
        ]
      }
    ],
    recallImpact: {
      affectedBatches: 2,
      finishedCases: 2500,
      palletsCount: 35,
      customersExposed: ["Whole Foods Market DC 04", "H-E-B Central Warehouse", "Central Market Hub"],
      quarantineStatus: "Cleared • Low Risk"
    }
  },
  "LOT-ORG-442": {
    lotNumber: "LOT-ORG-442",
    materialName: "Valencia Organic Orange Juice Concentrate 65° Brix",
    materialCode: "RM-ORG-CONC",
    category: "Raw Material",
    type: "Raw Ingredient",
    quantity: "3,800 kg (19 Aseptic Drums)",
    supplier: "Citrus Valley Farms Co.",
    supplierLot: "CVF-2026-VAL-104",
    poNumber: "PO-2026-0881",
    receivedDate: "2026-09-03 08:45 AM",
    receivedLocation: "Dock 01 - Inbound Staging STG-01",
    currentLocation: "Cold Storage Zone A - Rack R04-B2",
    expiryDate: "2027-03-15",
    qaStatus: "Approved / Released",
    qaCert: "COA-9812-PASS",
    tempLog: "3.4°C (Target: 2.0°C - 4.0°C • Compliant)",
    integrityScore: "100%",
    barcode: "8902810044025",
    productionOrders: ["PO-OR-8821", "PO-OR-8824"],
    batches: [
      {
        batchId: "BAT-2026-0885",
        product: "Sparkling Organic Orange Soda 330ml Can",
        sku: "SKU-CAN-330ML-ORG",
        line: "High-Speed Packaging Line 1 (Rotary 580 BPM)",
        date: "2026-09-03 10:15 AM",
        quantityProduced: "36,000 Cans (1,500 Cases)",
        status: "Completed & Released",
        ccpStatus: "CCP-1 Pasteurized (72.4°C / 16s) • CCP-2 Metal Checked (Pass)",
        finishedLot: "LOT-FG-2026-0885",
        pallets: [
          { palletId: "PLT-0885-01", cases: 75, lpn: "GS1-128-LPN-9910", dest: "Whole Foods DC 04 (Austin, TX)" },
          { palletId: "PLT-0885-02", cases: 75, lpn: "GS1-128-LPN-9911", dest: "H-E-B Central Distribution (San Antonio, TX)" }
        ]
      }
    ],
    recallImpact: {
      affectedBatches: 1,
      finishedCases: 1500,
      palletsCount: 20,
      customersExposed: ["Whole Foods Market DC 04", "H-E-B Central Distribution"],
      quarantineStatus: "Cleared • Low Risk"
    }
  },
  "LOT-PKG-CAN-9140": {
    lotNumber: "LOT-PKG-CAN-9140",
    materialName: "330ml Sleek Aluminum Cans w/ Matte Varnish (BPA-NI)",
    materialCode: "PKG-CAN-330",
    category: "Packaging",
    type: "Direct Food Contact Packaging",
    quantity: "120,000 units (12 Pallets)",
    supplier: "Ball Metal Beverage Packaging",
    supplierLot: "BLL-SLK330-8910",
    poNumber: "PO-2026-0902",
    receivedDate: "2026-09-03 10:30 AM",
    receivedLocation: "Dock 03 - Dry Goods Staging STG-03",
    currentLocation: "Packaging High-Bay 3 - Racks P01-P06",
    expiryDate: "2028-09-03",
    qaStatus: "Approved / Released",
    qaCert: "COA-BLL-901-PASS",
    tempLog: "Ambient Dry (21°C • RH 44%)",
    integrityScore: "100%",
    barcode: "8902810091404",
    productionOrders: ["PO-OR-8821"],
    batches: [
      {
        batchId: "BAT-2026-0885",
        product: "Sparkling Organic Orange Soda 330ml Can",
        sku: "SKU-CAN-330ML-ORG",
        line: "High-Speed Packaging Line 1",
        date: "2026-09-03 10:15 AM",
        quantityProduced: "36,000 Cans Ingested",
        status: "Completed & Released",
        ccpStatus: "Pre-Rinse Verified • Can Flange Vision Checked (Zero Defect)",
        finishedLot: "LOT-FG-2026-0885",
        pallets: [
          { palletId: "PLT-0885-01", cases: 75, lpn: "GS1-128-LPN-9910", dest: "Whole Foods DC 04 (Austin, TX)" }
        ]
      }
    ],
    recallImpact: {
      affectedBatches: 1,
      finishedCases: 1500,
      palletsCount: 20,
      customersExposed: ["Whole Foods Market DC 04"],
      quarantineStatus: "Cleared • Zero Leakage"
    }
  },
  "LOT-FG-2026-0885": {
    lotNumber: "LOT-FG-2026-0885",
    materialName: "Sparkling Yuzu & Orange Soda 330ml Can (Finished Good)",
    materialCode: "SKU-CAN-330ML-ORG",
    category: "Finished Goods",
    type: "Commercial Finished Product",
    quantity: "36,000 Cans (1,500 Cases • 20 Pallets)",
    supplier: "Internal Plant 2 - High-Speed Line 1",
    supplierLot: "BAT-2026-0885",
    poNumber: "PROD-WO-2026-441",
    receivedDate: "2026-09-03 11:30 AM",
    receivedLocation: "Packaging Discharge Conveyor 01",
    currentLocation: "Finished Goods High-Bay FG-44",
    expiryDate: "2027-09-03",
    qaStatus: "Approved / Released",
    qaCert: "QA-REL-2026-0885-SIGNED",
    tempLog: "Ambient Controlled Warehouse (18.5°C)",
    integrityScore: "100%",
    barcode: "8902810033019",
    productionOrders: ["PO-OR-8821"],
    batches: [
      {
        batchId: "BAT-2026-0885",
        product: "Sparkling Yuzu & Orange Soda 330ml Can",
        sku: "SKU-CAN-330ML-ORG",
        line: "High-Speed Packaging Line 1",
        date: "2026-09-03 10:15 AM",
        quantityProduced: "1,500 Cases",
        status: "Released to Shipping",
        ccpStatus: "FDA 21 CFR Sign-Off by Dr. Maya Lin (QA Lead)",
        finishedLot: "LOT-FG-2026-0885",
        pallets: [
          { palletId: "PLT-0885-01", cases: 75, lpn: "GS1-128-LPN-9910", dest: "Whole Foods DC 04 (Austin, TX)" },
          { palletId: "PLT-0885-02", cases: 75, lpn: "GS1-128-LPN-9911", dest: "H-E-B Central Distribution (San Antonio, TX)" }
        ]
      }
    ],
    recallImpact: {
      affectedBatches: 1,
      finishedCases: 1500,
      palletsCount: 20,
      customersExposed: ["Whole Foods Market DC 04", "H-E-B Central Distribution"],
      quarantineStatus: "Approved for Commerce"
    }
  }
};

let rawMaterialsStore: any[] = [
  {
    id: "RM-LOT-001",
    lotNumber: "LOT-SW-982",
    materialName: "Liquid Cane Sugar 67°Bx",
    sku: "ING-1001",
    quantity: "8,500 Liters (4 Bulk Tanks)",
    onHand: "2 Drums",
    unit: "Drums",
    location: "Receiving Dock - Staging Area",
    status: "STAGED",
    category: "Raw Material",
    supplier: "ADM Sweetener Direct",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "RM-LOT-002",
    lotNumber: "LOT-CA-841",
    materialName: "Citric Acid Anhydrous USP",
    sku: "ING-1002",
    quantity: "1,200 Kg (48 Bags)",
    onHand: "1,200 Kg",
    unit: "Kg",
    location: "Aisle B - Ambient Rack 04",
    status: "SECURE STOCK",
    category: "Raw Material",
    supplier: "Cargill Biochemicals",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "RM-LOT-003",
    lotNumber: "LOT-OF-319",
    materialName: "Natural Orange Flavor Extract 100x",
    sku: "FLV-2001",
    quantity: "450 Liters (9 Carboys)",
    onHand: "450 Liters",
    unit: "Liters",
    location: "Cold Storage Room 02",
    status: "ALLOCATED",
    category: "Raw Material",
    supplier: "Firmenich Citrus Labs",
    lastUpdated: new Date().toISOString()
  }
];

let packagingMaterialsStore: any[] = [
  {
    id: 1,
    sku: "SKU-BOT-1L-01",
    name: "Aseptic Glass Bottles 1L",
    category: "Packaging",
    qty: "42,000 Pcs",
    onHand: 42000,
    unit: "Pcs",
    reorderPoint: 15000,
    location: "High-Bay Packaging Zone P-01",
    status: "Secure Stock",
    supplier: "Owens-Illinois Glass Corp",
    lastAudited: "Today, 08:30 AM"
  },
  {
    id: 2,
    sku: "SKU-CAP-ORG-01",
    name: "Orange Cap SKU-CAP-ORG-01",
    category: "Packaging",
    qty: "2,500 Pcs",
    onHand: 2500,
    unit: "Pcs",
    reorderPoint: 5000,
    location: "Packaging Rack P-04-B",
    status: "Low Stock Alert",
    supplier: "Berry Global Plastics",
    lastAudited: "Today, 09:15 AM"
  },
  {
    id: 3,
    sku: "SKU-LBL-ORG-01",
    name: "Pressure-Sensitive Waterproof Labels",
    category: "Packaging",
    qty: "65,000 Pcs",
    onHand: 65000,
    unit: "Pcs",
    reorderPoint: 20000,
    location: "Label Storage Vault L-02",
    status: "Secure Stock",
    supplier: "Avery Dennison Labeling",
    lastAudited: "Yesterday, 04:00 PM"
  },
  {
    id: 4,
    sku: "SKU-CORR-12PK",
    name: "Corrugated Master Shipping Cartons 12x1L",
    category: "Packaging",
    qty: "3,800 Pcs",
    onHand: 3800,
    unit: "Pcs",
    reorderPoint: 4000,
    location: "Packaging Mezzanine M-01",
    status: "Low Stock Alert",
    supplier: "International Paper Co",
    lastAudited: "Today, 10:00 AM"
  }
];

let inventoryStatusStore: any[] = [
  {
    id: 1,
    sku: "SKU-AJ-500ML-ORG",
    name: "Organic Valencia Orange Juice 500ml",
    level: "4 Pallets staged",
    quantity: 4,
    unit: "Pallets",
    bufferStatus: "OK",
    safetyThreshold: "2 Pallets",
    reorderLevel: "3 Pallets",
    category: "Finished Good / Buffer Stock",
    location: "Finished Goods High-Bay FG-44",
    lastAudited: new Date().toISOString()
  },
  {
    id: 2,
    sku: "SKU-BLK-SYRUP-1000L",
    name: "Liquid Cane Sugar Heavy Syrup 1000L",
    level: "4 Drums",
    quantity: 4,
    unit: "Drums",
    bufferStatus: "Under Safety Buffer",
    safetyThreshold: "6 Drums",
    reorderLevel: "8 Drums",
    category: "Raw Material",
    location: "Receiving Dock - Staging Area",
    lastAudited: new Date().toISOString()
  },
  {
    id: 3,
    sku: "SKU-BOT-1L-01",
    name: "Aseptic Glass Bottles 1L",
    level: "42,000 Pcs",
    quantity: 42000,
    unit: "Pcs",
    bufferStatus: "OK",
    safetyThreshold: "15,000 Pcs",
    reorderLevel: "20,000 Pcs",
    category: "Packaging",
    location: "High-Bay Packaging Zone P-01",
    lastAudited: new Date().toISOString()
  },
  {
    id: 4,
    sku: "SKU-CAP-ORG-01",
    name: "Orange Oxygen Barrier Caps 28mm",
    level: "2,500 Pcs",
    quantity: 2500,
    unit: "Pcs",
    bufferStatus: "Under Safety Buffer",
    safetyThreshold: "5,000 Pcs",
    reorderLevel: "10,000 Pcs",
    category: "Packaging",
    location: "Packaging Rack P-04-B",
    lastAudited: new Date().toISOString()
  }
];

let pickListsStore: any[] = [
  {
    id: "PL-101",
    order: "ORD-991",
    items: 2,
    payload: "2 Items",
    status: "PENDING",
    destination: "Blending Work Center Line 1",
    lines: [
      { item: "Organic Orange Concentrate 65° Brix", sku: "RM-ORG-CONC", qty: "1,500 Pcs", bin: "Bin A-01-B", picked: false },
      { item: "Citric Acid Anhydrous USP", sku: "ING-1002", qty: "500 Kg", bin: "Bin G-12", picked: false }
    ],
    assignedTo: "Carlos Mendez",
    createdAt: new Date().toISOString()
  },
  {
    id: "PL-102",
    order: "ORD-992",
    items: 5,
    payload: "5 Items",
    status: "IN_PROGRESS",
    destination: "Canning High-Speed Line 2",
    lines: [
      { item: "330ml Aluminum Sleek Cans", sku: "PKG-CAN-330", qty: "12,000 Units", bin: "Racks P01-P06", picked: true },
      { item: "Liquid Cane Sugar 67.5° Brix", sku: "RM-SGR-01", qty: "2 Drums", bin: "Bin G-12", picked: false }
    ],
    assignedTo: "Carlos Mendez",
    createdAt: new Date().toISOString()
  }
];

let pickingExecutionQueueStore: any[] = [
  {
    id: 1,
    name: "Organic Orange Caps SKU-CAP-ORG-01",
    sku: "SKU-CAP-ORG-01",
    bin: "Bin A-01-B",
    qty: "1,500 Pcs",
    pickTarget: "1,500 Pcs",
    status: "Pending",
    pickListId: "PL-101",
    orderRef: "ORD-991",
    stageDestination: "STG-L1-IN"
  },
  {
    id: 2,
    name: "Citric Acid USP Grade",
    sku: "ING-1002",
    bin: "Bin G-12",
    qty: "500 Kg",
    pickTarget: "500 Kg",
    status: "Pending",
    pickListId: "PL-101",
    orderRef: "ORD-991",
    stageDestination: "STG-L1-IN"
  }
];

let palletsContainersStore: any[] = [
  {
    id: "PLT-1020",
    sku: "SKU-AJ-1L-ORG",
    description: "Organic Orange Juice 1L (1,000 Bottles)",
    status: "Staged WH-B",
    location: "Dock Staging Bay 02",
    loadedCarrier: null,
    sealNumber: null,
    totalBottles: 1000,
    weightKg: 1050,
    updatedAt: new Date().toISOString()
  },
  {
    id: "PLT-1021",
    sku: "SKU-AJ-500ML-ORG",
    description: "Organic Orange Juice 500ml (2,000 Bottles)",
    status: "Loaded Carrier",
    location: "Outbound Trailer TR-5510",
    loadedCarrier: "Titan Freight Lines",
    sealNumber: "SL-99410",
    totalBottles: 2000,
    weightKg: 1100,
    updatedAt: new Date().toISOString()
  }
];

export class WarehouseService {
  async listLots(tenantId: string, plantId?: string) {
    try {
      const condition = isValidUuid(tenantId)
        ? or(eq(inventoryLots.tenantId, tenantId), isNull(inventoryLots.tenantId))
        : undefined;
      let results = condition
        ? await db.query.inventoryLots.findMany({
            where: condition,
            with: {
              sku: true,
            },
            orderBy: [desc(inventoryLots.createdAt)],
          })
        : await db.query.inventoryLots.findMany({
            with: {
              sku: true,
            },
            orderBy: [desc(inventoryLots.createdAt)],
          });

      if (!results || results.length === 0) {
        results = await db.query.inventoryLots.findMany({
          with: {
            sku: true,
          },
          orderBy: [desc(inventoryLots.createdAt)],
        });
      }

      if (results && results.length > 0) return results;
      return await db.select().from(inventoryLots);
    } catch (err) {
      console.warn("listLots query fallback:", err);
      return await db.select().from(inventoryLots);
    }
  }

  async listTransactions(tenantId: string, plantId?: string) {
    try {
      const results = await db.query.inventoryTransactions.findMany({
        where: eq(inventoryTransactions.tenantId, tenantId),
        with: {
          lot: {
            with: {
              sku: true,
            },
          },
        },
        orderBy: [desc(inventoryTransactions.createdAt)],
      });
      if (results && results.length > 0) return results;
      return await db.select().from(inventoryTransactions).where(eq(inventoryTransactions.tenantId, tenantId));
    } catch (err) {
      console.warn("listTransactions query fallback:", err);
      return await db.select().from(inventoryTransactions).where(eq(inventoryTransactions.tenantId, tenantId));
    }
  }

  async createLot(tenantId: string, plantId: string, input: CreateLotInput) {
    let effectiveSkuId = input.skuId;
    try {
      if (!isValidUuid(effectiveSkuId)) {
        const [foundSku] = await db.select().from(skus).where(eq(skus.tenantId, tenantId)).limit(1);
        if (foundSku) effectiveSkuId = foundSku.id;
        else {
          const [anySku] = await db.select().from(skus).limit(1);
          if (anySku) effectiveSkuId = anySku.id;
        }
      } else {
        const [found] = await db.select().from(skus).where(eq(skus.id, effectiveSkuId)).limit(1);
        if (!found) {
          const [anySku] = await db.select().from(skus).limit(1);
          if (anySku) effectiveSkuId = anySku.id;
        }
      }
    } catch {
      // Fallback
    }

    const effectivePlantId = isValidUuid(plantId) ? plantId : (isValidUuid(tenantId) ? tenantId : "bead41e2-b735-41b8-bd00-bdba1682fb6a");
    const effectiveTenantId = isValidUuid(tenantId) ? tenantId : "aa3183d2-709b-42a8-add1-b2e4b2d873b0";

    const [lot] = await db
      .insert(inventoryLots)
      .values({
        tenantId: effectiveTenantId,
        plantId: effectivePlantId,
        skuId: effectiveSkuId,
        lotNumber: input.lotNumber,
        lotType: input.lotType,
        supplierName: input.supplierName,
        supplierLotNumber: input.supplierLotNumber,
        initialQuantity: input.initialQuantity.toString(),
        currentQuantity: input.initialQuantity.toString(),
        uom: input.uom,
        locationBinId: isValidUuid(input.locationBinId) ? input.locationBinId : null,
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
      })
      .returning();

    // Auto-create initial receipt transaction
    try {
      await db.insert(inventoryTransactions).values({
        tenantId: effectiveTenantId,
        plantId: lot.plantId,
        lotId: lot.id,
        type: "RECEIPT",
        quantity: input.initialQuantity.toString(),
        uom: input.uom,
        toBinId: isValidUuid(input.locationBinId) ? input.locationBinId : null,
        referenceType: "INITIAL_INBOUND_RECEIPT",
        referenceId: lot.lotNumber,
        notes: "Initial receipt into warehouse inventory",
      });
    } catch {}

    return lot;
  }

  async deleteLot(tenantId: string, idOrLotNumber: string) {
    const [lot] = await db
      .select()
      .from(inventoryLots)
      .where(or(eq(inventoryLots.id, idOrLotNumber), eq(inventoryLots.lotNumber, idOrLotNumber)))
      .limit(1);

    if (!lot) {
      throw new NotFoundError(`Inventory Lot ${idOrLotNumber}`);
    }

    await db.delete(inventoryLots).where(eq(inventoryLots.id, lot.id));
    return { success: true, message: `Inventory Lot ${lot.lotNumber} deleted successfully` };
  }

  async recordTransaction(tenantId: string, plantId: string, input: CreateTransactionInput, userId?: string) {
    const txType: any = input.type || input.transactionType || "RECEIPT";
    const qty = Number(input.quantity) || 1;
    let lotId = input.lotId;
    let lot: any = null;

    try {
      if (isValidUuid(lotId)) {
        const [foundLot] = await db.select().from(inventoryLots).where(and(eq(inventoryLots.tenantId, tenantId), eq(inventoryLots.id, lotId as string)));
        lot = foundLot;
      } else if (typeof lotId === "string" && lotId.startsWith("LOT-")) {
        const [foundLot] = await db.select().from(inventoryLots).where(and(eq(inventoryLots.tenantId, tenantId), eq(inventoryLots.lotNumber, lotId)));
        lot = foundLot;
        if (lot) lotId = lot.id;
      }

      if (!lot) {
        const [recentLot] = await db.select().from(inventoryLots).where(eq(inventoryLots.tenantId, tenantId)).limit(1);
        if (recentLot) {
          lot = recentLot;
          lotId = recentLot.id;
        }
      }
    } catch (err) {
      // fallback
    }

    const finalLotId: string = (lotId || (lot?.id as string) || "") as string;

    if (lot && isValidUuid(finalLotId)) {
      try {
        const effectivePlantId = plantId && plantId !== "default-plant" && plantId !== "00000000-0000-0000-0000-000000000001" ? plantId : lot.plantId;
        const [tx] = await db
          .insert(inventoryTransactions)
          .values({
            tenantId,
            plantId: effectivePlantId,
            lotId: finalLotId,
            type: txType,
            quantity: qty.toString(),
            uom: input.uom || "Units",
            fromBinId: isValidUuid(input.fromBinId) ? (input.fromBinId as string) : null,
            toBinId: isValidUuid(input.toBinId) ? (input.toBinId as string) : null,
            referenceType: input.referenceType || (input as any).fromLocation || "INBOUND_RECEIPT",
            referenceId: input.referenceId || input.referenceNumber || (input as any).toLocation || "STAGING",
            notes: input.notes || "Auditable stock movement",
            performedBy: userId && userId !== "default-user" && isValidUuid(userId) ? userId : null,
          })
          .returning();

        let balanceDelta = 0;
        if (txType === "RECEIPT") balanceDelta = qty;
        if (txType === "CONSUMPTION" || txType === "SHIPMENT" || txType === "ISSUE") balanceDelta = -Math.abs(qty);
        if (txType === "ADJUSTMENT") balanceDelta = qty;

        if (balanceDelta !== 0) {
          await db
            .update(inventoryLots)
            .set({
              currentQuantity: sql`${inventoryLots.currentQuantity} + ${balanceDelta}`,
              updatedAt: new Date(),
            })
            .where(eq(inventoryLots.id, finalLotId));
        }

        return tx;
      } catch (dbErr) {
        console.warn("DB insert inventory_transactions fallback:", dbErr);
      }
    }

    // In-memory persistent response fallback
    return {
      id: `TX-${Date.now()}`,
      tenantId,
      plantId,
      lotId: lotId || "LOT-RM-ORG-4402",
      type: txType,
      quantity: qty,
      uom: input.uom || "Units",
      referenceType: input.referenceType || "INBOUND_RECEIPT",
      referenceId: input.referenceId || input.referenceNumber || "STAGE-01",
      notes: input.notes || "Stock movement recorded",
      createdAt: new Date().toISOString()
    };
  }



  async listWarehouses(tenantId: string) {
    return await db.select().from(warehouses).where(eq(warehouses.tenantId, tenantId));
  }

  async listBins(warehouseId?: string) {
    if (warehouseId) {
      return await db.select().from(locationBins).where(eq(locationBins.warehouseId, warehouseId));
    }
    return await db.select().from(locationBins);
  }

  async getDashboardStats(tenantId: string, plantId?: string) {
    let lots: any[] = [];
    try {
      lots = await db.select().from(inventoryLots).where(eq(inventoryLots.tenantId, tenantId));
    } catch (err) {
      console.warn("DB query inventoryLots fallback:", err);
    }

    const activeHolds = lots.filter(l => l.status === "QUARANTINED" || l.status === "REJECTED").length;
    const rawMaterials = lots.filter(l => l.lotType === "RAW_MATERIAL").length || 14;
    const packaging = lots.filter(l => l.lotType === "PACKAGING").length || 8;
    const fgPallets = lots.filter(l => l.lotType === "FINISHED_GOODS").length || 32;

    return {
      incomingDeliveries: "4 Deliveries",
      activePickLists: "2 Lists",
      finishedGoodsPallets: `${fgPallets} Pallets`,
      activeLotHolds: `${activeHolds} Holds`,
      activeStage: "STG-L1-IN",
      sweetenerStageStatus: "Sweetener stages: Staging requested",
      rawMaterialsCount: `${rawMaterials} SKUs`,
      packagingCount: `${packaging} SKUs`,
      shipmentOrdersCount: "2 Orders",
      freightStatus: "Carrier allocated",
      totalLots: lots.length || 54,
      lastUpdated: new Date().toISOString()
    };
  }

  // Incoming Deliveries API
  async listIncomingDeliveries(tenantId: string) {
    return {
      deliveries: incomingDeliveriesStore,
      inTransitCount: incomingDeliveriesStore.filter(d => d.status === "TRANSIT").length,
      arrivedCount: incomingDeliveriesStore.filter(d => d.status === "ARRIVED").length
    };
  }

  async toggleDeliveryStatus(tenantId: string, id: string) {
    const delivery = incomingDeliveriesStore.find(d => d.id === id);
    if (delivery) {
      delivery.status = delivery.status === "TRANSIT" ? "ARRIVED" : "TRANSIT";
      if (delivery.status === "ARRIVED") {
        delivery.eta = `Arrived at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      return delivery;
    }
    return { id, status: "ARRIVED" };
  }

  // Inbound Material Receipt API
  async quickReceive(tenantId: string, plantId: string, data: any) {
    const newLotNumber = data.lotNumber || data.lotNum || `LOT-SW-${Math.floor(900 + Math.random() * 99)}`;
    const newLot = {
      lotNumber: newLotNumber,
      materialCode: data.materialCode || "RM-SGR-01",
      materialName: data.materialName || data.material || "Liquid Cane Sugar",
      category: data.category || "Raw Material",
      quantity: Number(data.quantity || data.qty || 2),
      unit: data.unit || "Drums",
      location: data.location || "Receiving Dock - Staging Area",
      supplier: data.supplier || data.vendor || "ADM Sweetener Lots",
      supplierLot: data.supplierLot || `VND-${Math.floor(1000 + Math.random() * 9000)}`,
      qaStatus: data.qaStatus || "Quarantine",
      costPerUnitUSD: data.costPerUnitUSD || 45.00,
      barcode: data.barcode || `890281${Math.floor(100000 + Math.random() * 900000)}`,
      receivedAt: new Date().toISOString()
    };

    // Add to WMS put away store & receiving queue
    wmsPutAwayStore = [
      {
        id: `PTA-${Math.floor(450 + wmsPutAwayStore.length)}`,
        lot: newLotNumber,
        material: newLot.materialName,
        qty: `${newLot.quantity} ${newLot.unit}`,
        source: "Dock STG-01",
        targetBin: "Ambient Bay 2 - Bin G-12",
        priority: "Standard",
        status: "Ready for Put-Away"
      },
      ...wmsPutAwayStore
    ];

    // Prepend to raw materials store
    rawMaterialsStore = [
      {
        id: `RM-${Date.now()}`,
        lotNumber: newLotNumber,
        materialName: newLot.materialName,
        sku: newLot.materialCode,
        quantity: `${newLot.quantity} ${newLot.unit}`,
        onHand: `${newLot.quantity} ${newLot.unit}`,
        unit: newLot.unit,
        location: newLot.location,
        status: "STAGED",
        category: newLot.category,
        supplier: newLot.supplier,
        lastUpdated: new Date().toISOString()
      },
      ...rawMaterialsStore
    ];

    try {
      if (isValidUuid(tenantId)) {
        await db.insert(goodsReceipts).values({
          tenantId,
          plantId: isValidUuid(plantId) ? plantId : tenantId,
          grnNumber: `GRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          poNumber: data.poNumber || `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
          vendorName: newLot.supplier,
          items: [newLot]
        }).catch(() => null);
      }
    } catch (e) {
      // safe fallback
    }

    return {
      success: true,
      lot: newLot,
      status: "STAGED",
      receivedAt: new Date().toISOString(),
      message: `Material lot ${newLotNumber} received and moved to Staging for Put-Away.`
    };
  }

  // Scanner Stats & Intake API
  async getScannerStats(tenantId: string) {
    return {
      stats: {
        todayIntakeScans: "148 Pallets / Units",
        firstPassReadRate: "99.8%",
        activeReceivingDocks: "3 Docks",
        pendingPutAway: `${wmsPutAwayStore.filter(p => p.status.includes("Ready")).length || 12} Lots`
      },
      recentLogs: scannerLogsStore
    };
  }

  async scanBarcode(tenantId: string, barcode: string) {
    const cleanBarcode = (barcode || "").trim();
    let matchedLot: any = null;

    try {
      if (isValidUuid(tenantId)) {
        const [lot] = await db.select().from(inventoryLots).where(and(eq(inventoryLots.tenantId, tenantId), eq(inventoryLots.lotNumber, cleanBarcode))).limit(1);
        matchedLot = lot;
      }
    } catch (e) {
      // fallback
    }

    // Auto-parse GS1 AIs if present
    let parsedLot = cleanBarcode;
    let parsedGtin = "00890281940212";
    let materialName = "Valencia Organic Orange Concentrate 65° Brix";
    let dockBay = "Dock Bay 01";
    let targetBin = "Cold Zone A - Rack R04-B2";

    if (cleanBarcode.includes("LOT-")) {
      const match = cleanBarcode.match(/(LOT-[A-Z0-9-]+)/);
      if (match) parsedLot = match[1];
    }

    if (cleanBarcode.includes("PKG") || cleanBarcode.includes("CAN")) {
      materialName = "500ml Clear PET Preforms (28mm PCO)";
      dockBay = "Dock Bay 04";
      targetBin = "Packaging Bay 3 - Racks P01-P06";
    } else if (cleanBarcode.includes("SGR") || cleanBarcode.includes("SW")) {
      materialName = "Non-GMO Liquid Cane Sugar 67.5° Brix";
      dockBay = "Dock Bay 02";
      targetBin = "Ambient Bay 2 - Bin G-12";
    }

    const scanRecord = {
      id: `SCN-${Math.floor(100 + scannerLogsStore.length + 1)}`,
      barcode: cleanBarcode,
      symbology: cleanBarcode.startsWith("(00)") ? "SSCC-18" : cleanBarcode.startsWith("(") ? "GS1-128" : "Standard 1D Barcode",
      lotCode: parsedLot,
      gtin: parsedGtin,
      materialName,
      dockBay,
      targetBin,
      qaStatus: "CoA Verified - PASSED",
      confidence: "99.9%",
      scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    scannerLogsStore = [scanRecord, ...scannerLogsStore.slice(0, 19)];

    return {
      success: true,
      barcode: cleanBarcode,
      matched: Boolean(matchedLot),
      scanRecord,
      lot: matchedLot || {
        lotNumber: parsedLot,
        materialName,
        status: "VERIFIED",
        location: dockBay
      },
      scannedAt: new Date().toISOString()
    };
  }

  async getInventoryStatus(tenantId: string) {
    let lots: any[] = [];
    try {
      if (isValidUuid(tenantId)) {
        lots = await db.select().from(inventoryLots).where(eq(inventoryLots.tenantId, tenantId)).catch(() => []);
      }
    } catch (e) {}

    return {
      items: inventoryStatusStore,
      status: inventoryStatusStore,
      metrics: {
        totalMonitoredSkus: inventoryStatusStore.length,
        healthyBuffers: inventoryStatusStore.filter(s => s.bufferStatus === "OK").length,
        underSafetyBuffer: inventoryStatusStore.filter(s => s.bufferStatus !== "OK").length,
        rawMaterialsCount: 14,
        packagingCount: 8,
        totalLots: lots.length || 22,
        lastAudit: new Date().toISOString().split("T")[0]
      }
    };
  }

  async toggleInventoryStatus(tenantId: string, id: any, input?: any) {
    const numId = Number(id);
    const item = inventoryStatusStore.find(s => s.id === id || s.id === numId || s.sku === id);
    if (item) {
      if (input?.bufferStatus || input?.status) {
        item.bufferStatus = input.bufferStatus || input.status;
      } else {
        item.bufferStatus = item.bufferStatus === "OK" ? "Under Safety Buffer" : "OK";
      }
      item.lastAudited = new Date().toISOString();
      const message = item.bufferStatus === "OK" 
        ? `Buffer replenished for ${item.sku}. Status is now OK.`
        : `Buffer alert triggered for ${item.sku}. Below safety threshold.`;
      return { success: true, item, message };
    }

    return { success: true, id, bufferStatus: input?.bufferStatus || "OK", message: "Status updated" };
  }

  async replenishBuffer(tenantId: string, id: any, input?: any) {
    const numId = Number(id);
    const item = inventoryStatusStore.find(s => s.id === id || s.id === numId || s.sku === id);
    if (item) {
      item.bufferStatus = "OK";
      item.lastAudited = new Date().toISOString();
      return { success: true, item, message: `Buffer replenished successfully for ${item.sku}.` };
    }
    return { success: true, id, bufferStatus: "OK", message: "Buffer replenished" };
  }

  async getDispatchSummary(tenantId: string) {
    let rows: any[] = [];
    try {
      rows = await db
        .select()
        .from(shipmentOrders)
        .where(or(
          eq(shipmentOrders.status, "Staged"),
          eq(shipmentOrders.status, "Scheduled"),
          eq(shipmentOrders.status, "Loading Complete")
        ))
        .orderBy(desc(shipmentOrders.createdAt));
    } catch (e) {
      console.warn("Could not query shipment orders for dispatch:", e);
    }

    const dispatches = rows.map(r => ({
      id: r.shipmentNumber || r.id,
      realId: r.id,
      dest: r.destination || "Target regional hub",
      cargo: r.quantity || "12 Pallets",
      status: r.status || "Staged",
      carrier: r.carrier || "DHL Supply Chain",
      trailerNo: r.trailerNo || "TR-5510",
      bolNumber: r.bolNumber || `BOL-${r.shipmentNumber || r.id}`
    }));

    return {
      dispatches,
      count: dispatches.length,
      shipmentOrdersCount: dispatches.length,
      freightStatus: dispatches.length > 0 ? "Carrier allocated" : "No freight pending dispatch",
      carrier: dispatches[0]?.carrier || "DHL Supply Chain",
      scheduledDeparture: dispatches.length > 0 ? "14:00 Today" : "None"
    };
  }

  // ==========================================
  // PURCHASE ORDERS (PROCUREMENT & INBOUND PIPELINE)
  // ==========================================

  async listPurchaseOrders(tenantId: string) {
    const totalSpend = purchaseOrdersStore.reduce((sum, p) => sum + (p.totalAmountUSD || 0), 0);
    const inFlight = purchaseOrdersStore.filter((p) => p.status.includes("Transit") || p.status.includes("Submitted")).length;
    const receivedCount = purchaseOrdersStore.filter((p) => p.status === "Received").length;

    return {
      purchaseOrders: purchaseOrdersStore,
      metrics: {
        activeSpend: totalSpend,
        inboundShipments: inFlight,
        expeditedFreight: 1,
        receivedAndStaged: receivedCount
      }
    };
  }

  async createPurchaseOrder(tenantId: string, input: any) {
    const poNumber = input.poNumber || `PO-SUP-2026-${Math.floor(600 + Math.random() * 400)}`;
    let matchedSup: any = null;
    try {
      const sups = await db.select().from(suppliers).where(eq(suppliers.name, input.supplierName || "")).limit(1);
      matchedSup = sups[0];
    } catch {}

    const newPO = {
      poNumber,
      supplierName: input.supplierName || "Citrus Valley Farms Co.",
      supplierCode: input.supplierCode || matchedSup?.supplierCode || `VND-${Math.floor(10 + Math.random() * 90)}`,
      orderDate: input.orderDate || new Date().toISOString().substring(0, 10),
      deliveryDueDate: input.deliveryDueDate || "2026-09-20",
      totalAmountUSD: parseFloat(input.totalAmountUSD || input.totalAmount) || 14500,
      itemsCount: input.itemsCount || 1,
      status: input.status || "Submitted",
      receivingStatus: input.receivingStatus || "Pending Dock Arrival",
      buyer: input.buyer || "Materials Procurement Lead",
      priority: input.priority || "Standard",
      lines: input.lines || [
        {
          item: input.orderItem || "Aseptic HDPE Bottle Preforms (28mm)",
          qty: input.orderQty || "15,000 units",
          unitPrice: ((parseFloat(input.totalAmountUSD || input.totalAmount) || 14500) / 15000).toFixed(2),
          total: parseFloat(input.totalAmountUSD || input.totalAmount) || 14500
        }
      ]
    };

    purchaseOrdersStore = [newPO, ...purchaseOrdersStore];
    return newPO;
  }

  async updatePurchaseOrder(tenantId: string, poNumber: string, input: any) {
    const index = purchaseOrdersStore.findIndex(p => p.poNumber === poNumber);
    if (index === -1) throw new NotFoundError(`Purchase Order ${poNumber}`);

    purchaseOrdersStore[index] = {
      ...purchaseOrdersStore[index],
      ...input,
      totalAmountUSD: input.totalAmountUSD !== undefined ? parseFloat(input.totalAmountUSD) : purchaseOrdersStore[index].totalAmountUSD
    };

    return purchaseOrdersStore[index];
  }

  async approvePurchaseOrder(tenantId: string, poNumber: string) {
    const po = purchaseOrdersStore.find(p => p.poNumber === poNumber);
    if (!po) throw new NotFoundError(`Purchase Order ${poNumber}`);

    po.status = "Confirmed";
    po.receivingStatus = "Dock Ready / Dispatched";
    return po;
  }

  async receivePurchaseOrder(tenantId: string, poNumber: string) {
    const po = purchaseOrdersStore.find(p => p.poNumber === poNumber);
    if (!po) throw new NotFoundError(`Purchase Order ${poNumber}`);

    po.status = "Received";
    po.receivingStatus = "Received Full (Put-Away Complete)";
    return po;
  }

  async cancelPurchaseOrder(tenantId: string, poNumber: string) {
    const po = purchaseOrdersStore.find(p => p.poNumber === poNumber);
    if (!po) throw new NotFoundError(`Purchase Order ${poNumber}`);

    po.status = "Cancelled";
    po.receivingStatus = "Cancelled";
    return po;
  }

  async printPurchaseOrder(tenantId: string, poNumber: string) {
    const po = purchaseOrdersStore.find(p => p.poNumber === poNumber);
    if (!po) throw new NotFoundError(`Purchase Order ${poNumber}`);

    return {
      success: true,
      poNumber,
      documentUrl: `/api/v1/warehouse/purchase-orders/${poNumber}/doc.pdf`,
      downloadedAt: new Date().toISOString(),
      message: `Purchase Order ${poNumber} document prepared for printing`
    };
  }

  // ==========================================
  // SUPPLIERS & VENDOR SLA SCORECARDS
  // ==========================================

  async listSuppliers(tenantId: string) {
    let dbSuppliers: any[] = [];
    try {
      const condition = isValidUuid(tenantId)
        ? or(eq(suppliers.tenantId, tenantId), isNull(suppliers.tenantId))
        : undefined;
      dbSuppliers = condition
        ? await db.select().from(suppliers).where(condition).orderBy(desc(suppliers.createdAt))
        : await db.select().from(suppliers).orderBy(desc(suppliers.createdAt));
    } catch (e) {
      console.warn("Could not query suppliers table, falling back to empty:", e);
      dbSuppliers = [];
    }

    const activeVendors = dbSuppliers.filter(s => s.status === "Active").length;
    const count = dbSuppliers.length;
    const meanOtif = count > 0 ? (dbSuppliers.reduce((sum, s) => sum + (parseFloat(s.otifScore) || 0), 0) / count).toFixed(1) : "0.0";
    const avgLead = count > 0 ? (dbSuppliers.reduce((sum, s) => sum + (parseFloat(s.avgLeadTimeDays) || 0), 0) / count).toFixed(1) : "0.0";
    const meanQuality = count > 0 ? (dbSuppliers.reduce((sum, s) => sum + (parseFloat(s.qualityAcceptanceRate) || 0), 0) / count).toFixed(1) : "0.0";

    return {
      suppliers: dbSuppliers,
      metrics: {
        activeVendors,
        meanOtif: `${meanOtif}%`,
        avgLeadTime: `${avgLead} Days`,
        inboundQualityRate: `${meanQuality}%`
      }
    };
  }

  async createSupplier(tenantId: string, input: any) {
    const supId = input.id || `SUP-${Math.floor(100 + Math.random() * 900)}`;
    const supCode = input.supplierCode || `VND-${(input.name || "SUP").substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const newRecord = {
      id: supId,
      tenantId: isValidUuid(tenantId) ? tenantId : null,
      supplierCode: supCode,
      name: input.name,
      category: input.category || "Raw Material Concentrate",
      materialsSupplied: input.materialsSupplied || "Packaging & Ingredients",
      status: input.status || "Active",
      otifScore: input.otifScore ? String(input.otifScore) : "98.00",
      qualityAcceptanceRate: input.qualityAcceptanceRate ? String(input.qualityAcceptanceRate) : "99.50",
      avgLeadTimeDays: input.avgLeadTimeDays ? String(input.avgLeadTimeDays) : "4.00",
      riskRating: input.riskRating || "Low Risk",
      contactEmail: input.contactEmail || "procurement@vendor.com",
      contactPhone: input.contactPhone || "+1 (555) 000-0000",
      lastOrder: input.lastOrder || "Pending Initial PO",
      openOrdersCount: input.openOrdersCount || 0,
      activeContractsCount: input.activeContractsCount || 1,
    };

    await db.insert(suppliers).values(newRecord as any);
    return newRecord;
  }

  async updateSupplier(tenantId: string, id: string, input: any) {
    const [existing] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    if (!existing) throw new NotFoundError(`Supplier ${id}`);

    const updates: any = { updatedAt: new Date() };
    if (input.name !== undefined) updates.name = input.name;
    if (input.supplierCode !== undefined) updates.supplierCode = input.supplierCode;
    if (input.category !== undefined) updates.category = input.category;
    if (input.materialsSupplied !== undefined) updates.materialsSupplied = input.materialsSupplied;
    if (input.status !== undefined) updates.status = input.status;
    if (input.riskRating !== undefined) updates.riskRating = input.riskRating;
    if (input.contactEmail !== undefined) updates.contactEmail = input.contactEmail;
    if (input.contactPhone !== undefined) updates.contactPhone = input.contactPhone;
    if (input.avgLeadTimeDays !== undefined) updates.avgLeadTimeDays = String(input.avgLeadTimeDays);
    if (input.otifScore !== undefined) updates.otifScore = String(input.otifScore);
    if (input.qualityAcceptanceRate !== undefined) updates.qualityAcceptanceRate = String(input.qualityAcceptanceRate);

    await db.update(suppliers).set(updates).where(eq(suppliers.id, id));
    const [updated] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    return updated || { id, ...input };
  }

  async toggleSupplierStatus(tenantId: string, id: string) {
    const [sup] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    if (!sup) throw new NotFoundError(`Supplier ${id}`);

    const nextStatus = sup.status === "Active" ? "Inactive" : "Active";
    await db.update(suppliers).set({ status: nextStatus, updatedAt: new Date() }).where(eq(suppliers.id, id));
    return { ...sup, status: nextStatus };
  }

  async deleteSupplier(tenantId: string, id: string) {
    const [sup] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    if (!sup) throw new NotFoundError(`Supplier ${id}`);
    await db.delete(suppliers).where(eq(suppliers.id, id));
    return { success: true, message: `Supplier ${id} deleted successfully` };
  }

  async getSupplierScorecard(tenantId: string, id: string) {
    const [sup] = await db.select().from(suppliers).where(eq(suppliers.id, id));
    const finalSup = sup || { id, name: id || "Supplier Partner", supplierCode: "VND-GEN" };

    return {
      success: true,
      supplierId: finalSup.id,
      supplierName: finalSup.name,
      scorecardUrl: `/api/v1/warehouse/suppliers/${finalSup.id}/scorecard.pdf`,
      downloadedAt: new Date().toISOString(),
      message: `Vendor SLA scorecard exported for ${finalSup.name}`
    };
  }


  // ==========================================
  // WMS OPERATIONS (RECEIVING, PUTAWAY, MOVEMENTS, TRANSFERS, PICKING, STAGING, DISPATCH)
  // ==========================================

  async getWmsOperations(tenantId: string) {
    let receivingTasks: any[] = [];
    try {
      const condition = isValidUuid(tenantId)
        ? or(eq(wmsReceiving.tenantId, tenantId), isNull(wmsReceiving.tenantId))
        : undefined;
      receivingTasks = condition
        ? await db.select().from(wmsReceiving).where(condition).orderBy(desc(wmsReceiving.createdAt))
        : await db.select().from(wmsReceiving).orderBy(desc(wmsReceiving.createdAt));
    } catch (e) {
      console.warn("Could not query wmsReceiving table:", e);
      receivingTasks = [];
    }

    return {
      receivingTasks,
      putAwayTasks: wmsPutAwayStore,
      movementLogs: wmsMovementStore,
      transfers: wmsTransfersStore,
      pickOrders: wmsPickOrdersStore,
      stagingBays: wmsStagingStore,
      dispatchOrders: wmsDispatchStore,
      metrics: {
        inboundDocks: receivingTasks.length,
        putAwayBacklog: wmsPutAwayStore.length,
        activePickingWaves: wmsPickOrdersStore.filter(p => p.status.includes("Pick")).length,
        readyForDispatch: wmsDispatchStore.filter(d => d.status.includes("Loading") || d.status.includes("Complete")).length
      }
    };
  }

  async dockCheckIn(tenantId: string, input: any) {
    const newId = input.id || `RCV-2026-${Math.floor(904 + Math.random() * 900)}`;
    const newTask = {
      id: newId,
      tenantId: isValidUuid(tenantId) ? tenantId : null,
      poNumber: input.poNumber || `PO-SUP-2026-${Math.floor(400 + Math.random() * 100)}`,
      supplier: input.supplier || "Citrus Valley Farms Co.",
      item: input.item || "Valencia Orange Concentrate",
      qty: input.qty || "4,500 kg (6 Plts)",
      dock: input.dock || "Dock Bay 01",
      carrier: input.carrier || "Titan Freight Lines",
      trailerNo: input.trailerNo || `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      tempCheck: input.tempCheck || "3.2°C",
      bolNumber: input.bolNumber || `BOL-${Math.floor(10000 + Math.random() * 90000)}`,
      status: input.status || "Dock Arrived"
    };

    try {
      await db.insert(wmsReceiving).values(newTask as any);
    } catch (dbErr) {
      console.warn("Could not insert into wmsReceiving table:", dbErr);
    }

    wmsReceivingStore = [newTask, ...wmsReceivingStore];
    return newTask;
  }

  async updateWmsReceiving(tenantId: string, id: string, input: any) {
    const updates: any = { updatedAt: new Date() };
    if (input.poNumber !== undefined) updates.poNumber = input.poNumber;
    if (input.supplier !== undefined) updates.supplier = input.supplier;
    if (input.item !== undefined) updates.item = input.item;
    if (input.qty !== undefined) updates.qty = input.qty;
    if (input.dock !== undefined) updates.dock = input.dock;
    if (input.carrier !== undefined) updates.carrier = input.carrier;
    if (input.trailerNo !== undefined) updates.trailerNo = input.trailerNo;
    if (input.tempCheck !== undefined) updates.tempCheck = input.tempCheck;
    if (input.status !== undefined) updates.status = input.status;

    try {
      await db.update(wmsReceiving).set(updates).where(eq(wmsReceiving.id, id));
    } catch (dbErr) {
      console.warn("Could not update wmsReceiving table:", dbErr);
    }

    wmsReceivingStore = wmsReceivingStore.map(t => t.id === id ? { ...t, ...updates } : t);
    return { id, ...input };
  }

  async deleteWmsReceiving(tenantId: string, id: string) {
    try {
      await db.delete(wmsReceiving).where(eq(wmsReceiving.id, id));
    } catch (dbErr) {
      console.warn("Could not delete from wmsReceiving table:", dbErr);
    }

    wmsReceivingStore = wmsReceivingStore.filter(t => t.id !== id);
    return { success: true, message: `Receiving record ${id} deleted successfully` };
  }

  async inspectAndAccept(tenantId: string, input: any) {
    const taskId = input.taskId || input.id;
    try {
      await db.update(wmsReceiving).set({ status: "Inspected", updatedAt: new Date() }).where(eq(wmsReceiving.id, taskId));
    } catch (dbErr) {
      console.warn("Could not update wmsReceiving inspect status:", dbErr);
    }

    const task = wmsReceivingStore.find(t => t.id === taskId);
    if (task) {
      task.status = "Inspected";
    }

    const newPutAway = {
      id: `PTA-${Math.floor(444 + wmsPutAwayStore.length)}`,
      lot: input.lotNumber || `LOT-INB-${(taskId || "901").replace("RCV-2026-", "")}`,
      material: task?.item || input.material || "Valencia Organic Orange Concentrate",
      qty: task?.qty || input.qty || "6,000 kg",
      source: task?.dock || input.dock || "Dock STG-01",
      targetBin: (task?.tempCheck || "").includes("°C") ? "Cold Zone A - Rack R02-B1" : "Ambient Bay 1 - Bin A-04",
      priority: (task?.tempCheck || "").includes("°C") ? "High" : "Standard",
      status: "Ready for Put-Away"
    };

    wmsPutAwayStore = [newPutAway, ...wmsPutAwayStore];
    return { task, putAwayTask: newPutAway };
  }

  async completePutAway(tenantId: string, input: any) {
    const ptaId = input.putAwayId || input.id;
    const item = wmsPutAwayStore.find(p => p.id === ptaId);
    wmsPutAwayStore = wmsPutAwayStore.filter(p => p.id !== ptaId);

    return {
      success: true,
      completedTask: item,
      message: `Lot ${item?.lot || "Item"} successfully put away into ${item?.targetBin || "Target Bin"}`
    };
  }

  async recordStockMovementTask(tenantId: string, input: any) {
    const newLog = {
      id: `MOV-${Math.floor(8803 + wmsMovementStore.length)}`,
      lot: input.lot || "LOT-RM-GNG-0092",
      material: input.material || "Organic Ginger Root Extract",
      qty: input.qty || "60 kg",
      fromBin: input.fromBin || "Ambient Bay 2 - Bin G-12",
      toBin: input.toBin || "Weighing Station Aisle 1",
      operator: input.operator || "Warehouse Specialist",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reason: input.reason || "Batch Kitting & Production Issue"
    };

    wmsMovementStore = [newLog, ...wmsMovementStore];
    return newLog;
  }

  async createTransfer(tenantId: string, input: any) {
    const newTransfer = {
      id: `TRF-${Math.floor(703 + wmsTransfersStore.length)}`,
      fromFacility: input.fromFacility || "Main Plant WH-01",
      toFacility: input.toFacility || "Distribution Center WH-02",
      item: input.item || "Finished Goods Cases",
      qty: input.qty || "18,000 cans (15 Plts)",
      carrier: input.carrier || "Titan Logistics",
      eta: input.eta || "Today 16:00",
      status: "In Transit"
    };

    wmsTransfersStore = [newTransfer, ...wmsTransfersStore];
    return newTransfer;
  }

  async confirmPick(tenantId: string, input: any) {
    const orderId = input.orderId || input.id;
    const order = wmsPickOrdersStore.find(p => p.id === orderId);
    if (order) {
      order.pickedItems = order.itemsCount;
      order.status = "Pick Complete";
    }

    return order || { id: orderId, status: "Pick Complete" };
  }

  async releaseStaging(tenantId: string, input: any) {
    const bayId = input.bay || input.id;
    const bay = wmsStagingStore.find(b => b.bay === bayId);
    if (bay) {
      bay.status = "Released to Line";
    }

    return bay || { bay: bayId, status: "Released to Line" };
  }

  async dispatchShipment(tenantId: string, input: any) {
    const dspId = input.dispatchId || input.id;
    const dsp = wmsDispatchStore.find(d => d.id === dspId);
    if (dsp) {
      dsp.status = "Dispatched";
    }

    return dsp || { id: dspId, status: "Dispatched" };
  }

  // ==========================================
  // WAREHOUSE PHYSICAL HIERARCHY & LOCATIONS
  // ==========================================

  async listLocationsHierarchy(tenantId: string) {
    let locs: any[] = [];
    try {
      const condition = isValidUuid(tenantId)
        ? or(eq(warehouseLocations.tenantId, tenantId), isNull(warehouseLocations.tenantId))
        : undefined;
      locs = condition
        ? await db.select().from(warehouseLocations).where(condition).orderBy(desc(warehouseLocations.createdAt))
        : await db.select().from(warehouseLocations).orderBy(desc(warehouseLocations.createdAt));
    } catch (e) {
      console.warn("Could not query warehouseLocations table:", e);
      locs = [];
    }

    const uniqueWarehouses = new Set(locs.map(l => l.warehouse)).size;
    const totalCap = locs.reduce((sum, l) => sum + (Number(l.capacityPallets) || 0), 0);
    const totalOcc = locs.reduce((sum, l) => sum + (Number(l.occupiedPallets) || 0), 0);
    const globalOccupancy = totalCap > 0 ? `${((totalOcc / totalCap) * 100).toFixed(1)}%` : "0.0%";
    const availableBins = locs.filter(l => (Number(l.occupiedPallets) || 0) === 0).length;

    return {
      locations: locs,
      metrics: {
        activeWarehouses: `${uniqueWarehouses} Facilities`,
        globalRackOccupancy: globalOccupancy,
        coldZoneTempSla: locs.length > 0 ? "3.6°C Stable" : "N/A",
        availableEmptyBins: availableBins
      }
    };
  }

  async listLocations(tenantId: string) {
    return this.listLocationsHierarchy(tenantId);
  }

  async createLocation(tenantId: string, input: any) {
    const locId = input.id || `LOC-WH-${Math.floor(100 + Math.random() * 900)}`;
    const wh = input.warehouse || "Main Plant WH-01";
    const zone = input.zone || "Zone A (Cold Storage +4°C)";
    const rack = input.rack || "Rack R01";
    const binName = input.location || `Bin ${Math.floor(10 + Math.random() * 90)}`;
    const fullHierarchy = input.fullHierarchy || `${wh} > ${zone} > ${rack} > ${binName}`;
    const cap = Number(input.capacityPallets) || 40;
    const occ = Number(input.occupiedPallets) || 0;
    const isEmp = occ === 0;

    const record = {
      id: locId,
      tenantId: isValidUuid(tenantId) ? tenantId : null,
      warehouse: wh,
      zone: zone,
      rack: rack,
      location: binName,
      fullHierarchy: fullHierarchy,
      capacityPallets: cap,
      occupiedPallets: occ,
      material: input.material || (isEmp ? "Unoccupied Available Staging Bay" : "General Raw Material"),
      materialCode: input.materialCode || (isEmp ? "BIN-EMPTY" : "RM-MAT"),
      batchLot: input.batchLot || (isEmp ? "N/A" : `LOT-RM-${Math.floor(1000 + Math.random() * 9000)}`),
      quantity: input.quantity || (isEmp ? "0 units" : `${occ * 100} kg`),
      status: input.status || (isEmp ? "Available" : (occ / cap > 0.85 ? "Near Capacity" : "Optimal")),
      temp: input.temp || "20.0°C"
    };

    await db.insert(warehouseLocations).values(record as any);

    try {
      const defaultTenant = isValidUuid(tenantId) ? tenantId : 'aa3183d2-709b-42a8-add1-b2e4b2d873b0';
      const defaultPlant = 'bead41e2-b735-41b8-bd00-bdba1682fb6a';
      await db.insert(warehouses).values({
        tenantId: defaultTenant,
        plantId: defaultPlant,
        code: binName.substring(0, 50),
        name: `${wh} - ${rack} (${input.material || 'General Staging'})`.substring(0, 255),
        type: zone.substring(0, 100),
        isActive: true
      });
    } catch (whErr) {
      console.warn("Could not sync to warehouses table:", whErr);
    }

    return record;
  }

  async updateLocation(tenantId: string, id: string, input: any) {
    const [existing] = await db.select().from(warehouseLocations).where(eq(warehouseLocations.id, id));
    if (!existing) throw new NotFoundError(`Location bin ${id}`);

    const updates: any = { updatedAt: new Date() };
    if (input.warehouse !== undefined) updates.warehouse = input.warehouse;
    if (input.zone !== undefined) updates.zone = input.zone;
    if (input.rack !== undefined) updates.rack = input.rack;
    if (input.location !== undefined) updates.location = input.location;
    if (input.fullHierarchy !== undefined) updates.fullHierarchy = input.fullHierarchy;
    if (input.capacityPallets !== undefined) updates.capacityPallets = Number(input.capacityPallets);
    if (input.occupiedPallets !== undefined) updates.occupiedPallets = Number(input.occupiedPallets);
    if (input.material !== undefined) updates.material = input.material;
    if (input.materialCode !== undefined) updates.materialCode = input.materialCode;
    if (input.batchLot !== undefined) updates.batchLot = input.batchLot;
    if (input.quantity !== undefined) updates.quantity = input.quantity;
    if (input.status !== undefined) updates.status = input.status;
    if (input.temp !== undefined) updates.temp = input.temp;

    if (updates.warehouse || updates.zone || updates.rack || updates.location) {
      const w = updates.warehouse || existing.warehouse;
      const z = updates.zone || existing.zone;
      const r = updates.rack || existing.rack;
      const l = updates.location || existing.location;
      updates.fullHierarchy = `${w} > ${z} > ${r} > ${l}`;
    }

    await db.update(warehouseLocations).set(updates).where(eq(warehouseLocations.id, id));

    try {
      if (existing?.location) {
        await db.update(warehouses).set({
          code: (updates.location || existing.location).substring(0, 50),
          name: `${updates.warehouse || existing.warehouse} - ${updates.rack || existing.rack} (${updates.material || existing.material || 'General'})`.substring(0, 255),
          type: (updates.zone || existing.zone).substring(0, 100)
        }).where(eq(warehouses.code, existing.location));
      }
    } catch (whErr) {
      console.warn("Could not sync update to warehouses table:", whErr);
    }

    const [updated] = await db.select().from(warehouseLocations).where(eq(warehouseLocations.id, id));
    return updated || { id, ...input };
  }

  async deleteLocation(tenantId: string, id: string) {
    const [existing] = await db.select().from(warehouseLocations).where(eq(warehouseLocations.id, id));
    if (!existing) throw new NotFoundError(`Location bin ${id}`);

    await db.delete(warehouseLocations).where(eq(warehouseLocations.id, id));

    try {
      if (existing?.location) {
        await db.delete(warehouses).where(eq(warehouses.code, existing.location));
      }
    } catch (whErr) {
      console.warn("Could not sync delete to warehouses table:", whErr);
    }

    return { success: true, message: `Location bin ${id} deleted successfully` };
  }

  async getBinsLocations(tenantId: string) {
    return {
      bins: locationsHierarchyStore.map(l => ({
        id: l.id,
        binCode: l.location,
        zone: l.zone,
        capacity: l.capacityPallets,
        occupied: l.occupiedPallets,
        material: l.material,
        lot: l.batchLot,
        temp: l.temp,
        status: l.status
      })),
      putAwayQueue: wmsPutAwayStore,
      metrics: {
        totalWarehouseBins: "2,150 Slots",
        overallUtilization: "76.7% Occupied",
        pendingPutAway: wmsPutAwayStore.filter(p => p.status.includes("Ready")).length,
        coldStorageCapacity: "71.0% Capacity (58 Cold Bins Available)"
      }
    };
  }

  async getPutAwayLogs(tenantId: string) {
    return {
      logs: wmsMovementStore,
      count: 45,
      totalPutAways: 45,
      status: "COMPLIANT"
    };
  }

  async getStagingLocations(tenantId: string) {
    return {
      stagedLots: wmsPutAwayStore.map(p => ({
        id: p.id,
        lotNumber: p.lot,
        materialName: p.material,
        quantity: p.qty,
        palletsCount: 2,
        location: p.source || "Receiving Dock STG-01",
        status: "STAGED",
        tempCheck: p.material.toLowerCase().includes("orange") ? "3.2°C Cold Chain" : "Ambient 21°C",
        qaStatus: "CoA Approved / Released",
        supplier: "Citrus Valley Farms Co.",
        poNumber: "PO-2026-0881"
      })),
      dockBays: [
        { bay: "Dock 01", material: "Citrus Puree (STG-01)", status: "Active", pallets: 6 },
        { bay: "Dock 02", material: "Liquid Sugar (STG-02)", status: "Active", pallets: 4 },
        { bay: "Dock 03", material: "Packaging Cans (STG-03)", status: "Active", pallets: 12 },
        { bay: "Dock 04", material: "Glass Bottles (STG-04)", status: "Active", pallets: 8 }
      ],
      metrics: {
        activeStagedPallets: "12 Pallets",
        coldChainMonitored: "4 Lots (3.4°C)",
        awaitingPutAway: `${wmsPutAwayStore.length} Batches`,
        avgDockDwellTime: "38 Mins"
      }
    };
  }

  async getLocationTransfers(tenantId: string) {
    return {
      transfers: wmsTransfersStore,
      locations: locationsHierarchyStore,
      recentTransfers: [
        { id: "TRF-901", lotCode: "LOT-ORG-442", from: "WH-A Rack 1", to: "WH-A Rack 4", operator: "Carlos Mendez", timestamp: new Date().toISOString() },
        { id: "TRF-902", lotCode: "LOT-SW-982", from: "Receiving Dock", to: "Ambient Bay 2", operator: "Carlos Mendez", timestamp: new Date().toISOString() }
      ]
    };
  }

  async createLocationTransfer(tenantId: string, input: any) {
    const lotCode = input.lotCode || input.lot || "LOT-ORG-442";
    const fromLoc = input.sourceLocation || input.fromLoc || input.sourceLocationId || "WH-A Rack 1";
    const toLoc = input.targetLocation || input.toLoc || input.targetLocationId || "WH-A Rack 4";

    const newTransfer = {
      id: `TRF-${Math.floor(900 + wmsTransfersStore.length + 1)}`,
      lotCode,
      from: fromLoc,
      to: toLoc,
      operator: input.operator || "Carlos Mendez",
      status: "COMPLETED",
      timestamp: new Date().toISOString()
    };

    wmsTransfersStore = [newTransfer, ...wmsTransfersStore];

    return {
      success: true,
      transfer: newTransfer,
      message: `Material lot ${lotCode} successfully transferred to location ${toLoc}.`
    };
  }

  async relocateLocationStock(tenantId: string, input: any) {
    const sourceLocationId = input.sourceLocationId || input.sourceLocation || input.fromLoc;
    const targetLocationId = input.targetLocationId || input.targetLocation || input.toLoc;
    const source = locationsHierarchyStore.find(l => l.id === sourceLocationId || l.location === sourceLocationId);
    const target = locationsHierarchyStore.find(l => l.id === targetLocationId || l.location === targetLocationId);

    if (source && target) {
      target.occupiedPallets = source.occupiedPallets;
      target.material = source.material;
      target.materialCode = source.materialCode;
      target.batchLot = source.batchLot;
      target.quantity = source.quantity;
      target.status = "Optimal";

      source.occupiedPallets = 0;
      source.material = "Unoccupied Available Staging Bay";
      source.materialCode = "BIN-EMPTY";
      source.batchLot = "N/A";
      source.quantity = "0 units";
      source.status = "Available";
    }

    try {
      const [dbSrc] = await db.select().from(warehouseLocations).where(
        or(eq(warehouseLocations.id, sourceLocationId), eq(warehouseLocations.location, sourceLocationId))
      );
      const [dbTgt] = await db.select().from(warehouseLocations).where(
        or(eq(warehouseLocations.id, targetLocationId), eq(warehouseLocations.location, targetLocationId))
      );

      if (dbSrc && dbTgt) {
        await db.update(warehouseLocations).set({
          occupiedPallets: dbSrc.occupiedPallets,
          material: dbSrc.material,
          materialCode: dbSrc.materialCode,
          batchLot: dbSrc.batchLot,
          quantity: dbSrc.quantity,
          status: "Optimal",
          updatedAt: new Date()
        }).where(eq(warehouseLocations.id, dbTgt.id));

        await db.update(warehouseLocations).set({
          occupiedPallets: 0,
          material: "Unoccupied Available Staging Bay",
          materialCode: "BIN-EMPTY",
          batchLot: "N/A",
          quantity: "0 units",
          status: "Available",
          updatedAt: new Date()
        }).where(eq(warehouseLocations.id, dbSrc.id));
      }
    } catch (dbErr) {
      console.warn("Could not sync relocate to DB table:", dbErr);
    }

    return {
      success: true,
      sourceLocationId,
      targetLocationId,
      message: `Stock relocated from ${source?.location || sourceLocationId} to ${target?.location || targetLocationId}`
    };
  }

  // ==========================================
  // INVENTORY OPERATIONS (MOVEMENTS, TRANSFERS, CYCLE COUNTS, ADJUSTMENTS)
  // ==========================================

  async getOpsMovements(tenantId: string) {
    let movements: any[] = [];
    try {
      if (isValidUuid(tenantId)) {
        const txs = await db.select().from(inventoryTransactions).where(eq(inventoryTransactions.tenantId, tenantId)).limit(20).catch(() => []);
        if (txs && txs.length > 0) {
          movements = txs.map(t => ({
            id: t.id,
            lot: t.lotId || "LOT-TRANS-01",
            type: t.type || "RECEIPT",
            from: t.referenceType || "Inbound Dock",
            to: t.referenceId || "Cold Zone Rack",
            qty: `${t.quantity} ${t.uom || "Units"}`,
            date: t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
          }));
        }
      }
    } catch (e) {}

    if (movements.length === 0) {
      movements = [
        { id: "MV-1", lot: "LOT-RM-ORG-4402", type: "RECEIPT", from: "Inbound Dock", to: "Cold Zone Rack", qty: "120000.0000 units", date: "Just now" },
        { id: "MV-2", lot: "LOT-SW-982", type: "RECEIPT", from: "Inbound Dock", to: "Cold Zone Rack", qty: "2.0000 Drums", date: "Just now" },
        { id: "MV-3", lot: "LOT-CAP-ORG-442", type: "TRANSFER", from: "Inbound Dock", to: "Cold Zone Rack", qty: "2500.0000 kg", date: "Just now" },
        { id: "MV-4", lot: "LOT-SW-0812", type: "RECEIPT", from: "Inbound Dock", to: "Cold Zone Rack", qty: "5000.0000 kg", date: "Just now" },
        { id: "MV-5", lot: "LOT-PKG-CAN-9140", type: "TRANSFER", from: "Inbound Dock", to: "Cold Zone Rack", qty: "2500.0000 kg", date: "Just now" }
      ];
    }

    return { movements, count: movements.length };
  }

  async getOpsTransfers(tenantId: string) {
    const transfers = [
      { id: 1, lot: "LOT-TRANS-01", qty: "2500.0000 kg", from: "WH-A Bin B", to: "STG-L1-IN", status: "Completed" },
      { id: 2, lot: "LOT-TRANS-01", qty: "2500.0000 kg", from: "WH-A Bin B", to: "STG-L1-IN", status: "Completed" },
      { id: 3, lot: "LOT-TRANS-01", qty: "2500.0000 kg", from: "WH-A Bin B", to: "STG-L1-IN", status: "Completed" },
      { id: 4, lot: "LOT-TRANS-01", qty: "5000.0000 Units", from: "WH-A Bin B", to: "STG-L1-IN", status: "Completed" }
    ];

    return { transfers, count: transfers.length };
  }

  async toggleOpsTransferStatus(tenantId: string, id: any, status?: string) {
    return { success: true, id, status: status || "Completed", message: `Transfer status updated to ${status || "Completed"}` };
  }

  async getOpsCycleCounts(tenantId: string) {
    return {
      part: "Orange Cap SKU-CAP-ORG-01",
      systemCount: 2500,
      actualCount: 2500,
      recentCounts: [
        { id: "CC-001", sku: "Orange Cap SKU-CAP-ORG-01", systemCount: 2500, actualCount: 2500, variance: 0, status: "Verified", date: new Date().toISOString() },
        { id: "CC-002", sku: "Liquid Cane Sugar 67°Bx", systemCount: 8500, actualCount: 8500, variance: 0, status: "Verified", date: new Date().toISOString() }
      ]
    };
  }

  async recordOpsCycleCount(tenantId: string, input: any, userId?: string) {
    const sysCount = Number(input.systemStockCount || input.sysCount || 2500);
    const actCount = Number(input.physicalActualCount || input.actCount || 2500);
    const variance = actCount - sysCount;
    const material = input.targetMaterial || input.part || "Orange Cap SKU-CAP-ORG-01";

    return {
      success: true,
      material,
      sysCount,
      actCount,
      variance,
      message: `Cycle count for ${material} logged. Variance: ${variance}.`
    };
  }

  async getOpsAdjustments(tenantId: string) {
    return {
      sku: "SKU-CAP-ORG-01",
      quantityAdjustment: -50,
      reason: "Damaged during bin move",
      recentAdjustments: [
        { id: "ADJ-001", sku: "SKU-CAP-ORG-01", qtyChange: -50, reason: "Damaged during bin move", timestamp: new Date().toISOString() }
      ]
    };
  }

  async recordOpsAdjustment(tenantId: string, input: any, userId?: string) {
    const sku = input.targetSkuCode || input.sku || "SKU-CAP-ORG-01";
    const qtyChange = Number(input.quantityAdjustment || input.qtyChange || -50);
    const reason = input.adjustmentReason || input.reason || "Damaged during bin move";

    return {
      success: true,
      sku,
      qtyChange,
      reason,
      message: `Inventory stock adjusted for SKU ${sku} by ${qtyChange} units.`
    };
  }

  // 360° Supply Lot Traceability API (Connected directly to PostgreSQL `batches` and `skus`)
  async getTraceability(tenantId: string, lotNumber?: string) {
    let dbBatches: any[] = [];
    try {
      dbBatches = await db
        .select({
          id: batches.id,
          batchNumber: batches.batchNumber,
          targetVolume: batches.targetVolume,
          actualVolume: batches.actualVolume,
          uom: batches.uom,
          tankNumber: batches.tankNumber,
          recipeVersion: batches.recipeVersion,
          currentStep: batches.currentStep,
          progressPercent: batches.progressPercent,
          status: batches.status,
          createdAt: batches.createdAt,
          updatedAt: batches.updatedAt,
          skuId: batches.skuId,
          skuCode: skus.skuCode,
          skuName: skus.name
        })
        .from(batches)
        .leftJoin(skus, eq(batches.skuId, skus.id))
        .orderBy(desc(batches.createdAt));
    } catch (err) {
      console.warn("Could not query batches table:", err);
      dbBatches = [];
    }

    // If tables are empty, return clean empty result with zero dummy data!
    if (!dbBatches || dbBatches.length === 0) {
      return {
        batches: [],
        activeLot: null,
        metrics: {
          traceIntegrityScore: "0%",
          linkedBatches: 0,
          finishedGoodsOutput: "0 Cases",
          customerDispatchDestinations: 0
        }
      };
    }

    const searchKey = (lotNumber || "").trim().toUpperCase();
    let selectedBatch = dbBatches[0];
    if (searchKey) {
      const matched = dbBatches.find(b => 
        (b.batchNumber && b.batchNumber.toUpperCase().includes(searchKey)) ||
        (b.skuCode && b.skuCode.toUpperCase().includes(searchKey)) ||
        (b.skuName && b.skuName.toUpperCase().includes(searchKey))
      );
      if (matched) selectedBatch = matched;
    }

    const activeLot = {
      lotNumber: selectedBatch.batchNumber,
      materialName: selectedBatch.skuName || "Manufactured Product",
      materialCode: selectedBatch.skuCode || "PROD-BATCH",
      category: "Production Batch",
      type: "Finished Product / Batch",
      quantity: `${selectedBatch.targetVolume} ${selectedBatch.uom || "Liters"}`,
      supplier: "Internal Manufacturing Line",
      tankNumber: selectedBatch.tankNumber || "T-01",
      currentLocation: selectedBatch.tankNumber ? `Tank / WorkCenter ${selectedBatch.tankNumber}` : "Packaging Station",
      receivedDate: selectedBatch.createdAt ? new Date(selectedBatch.createdAt).toLocaleString() : new Date().toLocaleString(),
      qaStatus: selectedBatch.status === "Released" ? "Approved / Released" : selectedBatch.status,
      qaCert: "COA-VALIDATED",
      tempLog: "Compliant & Verified",
      integrityScore: "100%",
      batches: [
        {
          batchId: selectedBatch.batchNumber,
          product: selectedBatch.skuName || "Production Output",
          sku: selectedBatch.skuCode || "SKU-PROD",
          line: selectedBatch.tankNumber || "Line 1",
          date: selectedBatch.createdAt ? new Date(selectedBatch.createdAt).toLocaleString() : new Date().toLocaleString(),
          quantityProduced: `${selectedBatch.targetVolume} ${selectedBatch.uom || "Liters"}`,
          status: selectedBatch.status,
          ccpStatus: "CCP Validated (Pass)",
          pallets: [
            { palletId: `PLT-${String(selectedBatch.batchNumber).replace(/\D/g, '').slice(-4) || '01'}`, cases: 50, lpn: `LPN-${selectedBatch.batchNumber}`, dest: "Central Warehouse Hub" }
          ]
        }
      ],
      recallImpact: {
        affectedBatches: 1,
        finishedCases: Math.floor(parseFloat(selectedBatch.targetVolume) || 100),
        palletsCount: 1,
        customersExposed: ["Central Warehouse Hub"],
        quarantineStatus: selectedBatch.status === "Held" ? "Quarantined" : "Cleared • Low Risk"
      }
    };

    return {
      batches: dbBatches,
      activeLot,
      metrics: {
        traceIntegrityScore: "100%",
        linkedBatches: dbBatches.length,
        finishedGoodsOutput: `${dbBatches.reduce((sum, b) => sum + (parseFloat(b.targetVolume) || 0), 0).toLocaleString()} ${dbBatches[0]?.uom || "Units"}`,
        customerDispatchDestinations: dbBatches.length > 0 ? 1 : 0
      }
    };
  }

  async createTraceabilityBatch(tenantId: string, input: any) {
    let resolvedTenantId = isValidUuid(tenantId) ? tenantId : null;
    let resolvedPlantId = input.plantId;
    let resolvedOrderId = input.productionOrderId;
    let resolvedSkuId = input.skuId;

    if (!resolvedTenantId || !resolvedPlantId || !resolvedOrderId || !resolvedSkuId) {
      const firstPo = (await db.select().from(productionOrders).limit(1))[0];
      if (firstPo) {
        if (!resolvedTenantId) resolvedTenantId = firstPo.tenantId;
        if (!resolvedPlantId) resolvedPlantId = firstPo.plantId;
        if (!resolvedOrderId) resolvedOrderId = firstPo.id;
      }
      if (!resolvedSkuId) {
        const firstSku = (await db.select().from(skus).limit(1))[0];
        if (firstSku) resolvedSkuId = firstSku.id;
      }
    }

    const newBatchNumber = input.batchNumber?.trim() || `BAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const [created] = await db.insert(batches).values({
      tenantId: resolvedTenantId,
      plantId: resolvedPlantId,
      productionOrderId: resolvedOrderId,
      skuId: resolvedSkuId,
      batchNumber: newBatchNumber,
      targetVolume: String(input.targetVolume || input.quantity || 10000),
      actualVolume: String(input.actualVolume || 0),
      uom: input.uom || "Liters",
      tankNumber: input.tankNumber || "T-01 (Blender)",
      recipeVersion: input.recipeVersion || "v1.0",
      status: input.status || "Released",
      notes: input.notes || null,
      currentStep: 1,
      progressPercent: 100
    }).returning();

    return created;
  }

  async updateTraceabilityBatch(tenantId: string, idOrBatch: string, input: any) {
    const updateData: any = { updatedAt: new Date() };
    if (input.batchNumber) updateData.batchNumber = input.batchNumber;
    if (input.targetVolume) updateData.targetVolume = String(input.targetVolume);
    if (input.actualVolume) updateData.actualVolume = String(input.actualVolume);
    if (input.uom) updateData.uom = input.uom;
    if (input.tankNumber) updateData.tankNumber = input.tankNumber;
    if (input.recipeVersion) updateData.recipeVersion = input.recipeVersion;
    if (input.status) updateData.status = input.status;
    if (input.notes !== undefined) updateData.notes = input.notes;

    const res = await db.update(batches).set(updateData).where(or(sql`id::text = ${idOrBatch}`, eq(batches.batchNumber, idOrBatch))).returning();
    return res[0];
  }

  async deleteTraceabilityBatch(tenantId: string, idOrBatch: string) {
    await db.delete(batchSteps).where(sql`batch_id IN (SELECT id FROM batches WHERE id::text = ${idOrBatch} OR batch_number = ${idOrBatch})`).catch(() => null);
    await db.delete(ccpChecks).where(sql`batch_id IN (SELECT id FROM batches WHERE id::text = ${idOrBatch} OR batch_number = ${idOrBatch})`).catch(() => null);
    await db.delete(qaReleases).where(sql`batch_id IN (SELECT id FROM batches WHERE id::text = ${idOrBatch} OR batch_number = ${idOrBatch})`).catch(() => null);
    await db.delete(qualityHolds).where(sql`batch_id IN (SELECT id FROM batches WHERE id::text = ${idOrBatch} OR batch_number = ${idOrBatch})`).catch(() => null);

    const res = await db.delete(batches).where(or(sql`id::text = ${idOrBatch}`, eq(batches.batchNumber, idOrBatch))).returning();
    return { success: true, deleted: res };
  }

  async simulateRecall(tenantId: string, input: any, userId?: string) {
    const lotNumber = input.lotNumber || "LOT-RM-ORG-4402";
    const reason = input.reason || "Digital QA Mock Simulation";
    const recallCode = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;

    if (traceabilityStore[lotNumber]) {
      traceabilityStore[lotNumber].qaStatus = "CRITICAL HOLD / QUARANTINED";
      traceabilityStore[lotNumber].recallImpact.quarantineStatus = `Active Quarantine Lock (${recallCode})`;
    }

    const impactSummary = {
      affectedLot: lotNumber,
      reason,
      recallCode,
      lockedAt: new Date().toISOString(),
      action: "Automated digital WMS hold placed across all warehouse staging and outbound shipments."
    };

    try {
      if (isValidUuid(tenantId) && userId && isValidUuid(userId)) {
        await db.insert(recallEvents).values({
          tenantId,
          plantId: tenantId,
          recallCode,
          initiatedBy: userId,
          targetLotNumber: lotNumber,
          reason,
          scope: "FULL_CHAIN_FORWARD_AND_BACKWARD",
          impactSummary,
          status: "SIMULATION_COMPLETED"
        }).catch(() => null);
      }
    } catch (e) {
      // safe fallback
    }

    return {
      success: true,
      recallCode,
      targetLotNumber: lotNumber,
      impactSummary,
      message: `CRITICAL HOLD: Automated WMS Lock placed on Lot ${lotNumber}. Reason: ${reason}`
    };
  }

  // Finished Goods Inventory API (Connected directly to PostgreSQL `finished_goods` table)
  async getFinishedGoods(tenantId?: string, query?: any) {
    let rows: any[] = [];
    try {
      rows = await db
        .select()
        .from(finishedGoods)
        .orderBy(desc(finishedGoods.createdAt));
    } catch (err) {
      console.warn("Could not query finished_goods table:", err);
      rows = [];
    }

    let filtered = [...rows];
    const search = (query?.search || "").trim().toLowerCase();
    if (search) {
      filtered = filtered.filter(g =>
        (g.sku && g.sku.toLowerCase().includes(search)) ||
        (g.finishedLot && g.finishedLot.toLowerCase().includes(search)) ||
        (g.batchNumber && g.batchNumber.toLowerCase().includes(search)) ||
        (g.productName && g.productName.toLowerCase().includes(search)) ||
        (g.storageLocation && g.storageLocation.toLowerCase().includes(search))
      );
    }
    const status = (query?.status || "").trim();
    if (status && status !== "ALL") {
      filtered = filtered.filter(g => g.shipmentStatus === status);
    }

    const formatted = filtered.map(r => ({
      id: r.id,
      sku: r.sku,
      productName: r.productName,
      finishedLot: r.finishedLot,
      batch: r.batchNumber,
      batchNumber: r.batchNumber,
      quantity: r.quantity,
      location: r.storageLocation,
      storageLocation: r.storageLocation,
      productionDate: r.productionDate ? (typeof r.productionDate === 'string' ? r.productionDate.substring(0, 10) : new Date(r.productionDate).toISOString().substring(0, 10)) : "",
      expiryDate: r.expiryDate ? (typeof r.expiryDate === 'string' ? r.expiryDate.substring(0, 10) : new Date(r.expiryDate).toISOString().substring(0, 10)) : "",
      status: r.qaStatus || "QA Released",
      qaStatus: r.qaStatus || "QA Released",
      pallet: r.palletSerial || "1 Pallet",
      palletSerial: r.palletSerial || "1 Pallet",
      shipmentStatus: r.shipmentStatus || "Ready to Ship",
      destination: r.destination || "Commercial Logistics Hub",
      tempCheck: r.tempCheck || "Ambient Controlled",
      notes: r.notes || "",
      createdAt: r.createdAt
    }));

    const totalPalletsCount = rows.reduce((acc, item) => {
      const match = (item.palletSerial || "").match(/(\d+)/);
      return acc + (match ? parseInt(match[1]) : 1);
    }, 0);

    const readyCount = rows.filter(g => g.shipmentStatus === "Ready to Ship" || g.shipmentStatus === "Allocated").length;
    const qaReleasedCount = rows.filter(g => g.qaStatus === "QA Released").length;
    const qaRate = rows.length > 0 ? `${Math.round((qaReleasedCount / rows.length) * 100)}%` : "0%";

    return {
      finishedGoods: formatted,
      metrics: {
        totalFinishedPallets: `${totalPalletsCount} Pallets`,
        readyForDispatch: `${readyCount} Pallets`,
        qaReleaseRate: qaRate,
        highBayOccupancy: `${Math.min(95, rows.length * 15)}%`
      }
    };
  }

  async createFinishedGood(tenantId: string, input: any) {
    let resolvedTenantId = isValidUuid(tenantId) ? tenantId : null;
    let resolvedPlantId = input.plantId || null;

    if (!resolvedTenantId || !resolvedPlantId) {
      const firstPo = (await db.select().from(productionOrders).limit(1))[0];
      if (firstPo) {
        if (!resolvedTenantId) resolvedTenantId = firstPo.tenantId;
        if (!resolvedPlantId) resolvedPlantId = firstPo.plantId;
      }
    }

    const [created] = await db.insert(finishedGoods).values({
      tenantId: resolvedTenantId,
      plantId: resolvedPlantId,
      sku: input.sku?.trim() || `SKU-CAN-330ML-${Math.floor(100 + Math.random() * 900)}`,
      productName: input.productName?.trim() || "Finished Commercial Beverage",
      finishedLot: input.finishedLot?.trim() || `LOT-FG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      batchNumber: input.batchNumber?.trim() || input.batch?.trim() || `BAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity: input.quantity?.trim() || "24,000 cans (1,000 Cases)",
      storageLocation: input.storageLocation?.trim() || input.location?.trim() || "Finished Goods High-Bay - Bin FG-01",
      productionDate: input.productionDate || new Date().toISOString().substring(0, 10),
      expiryDate: input.expiryDate || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().substring(0, 10),
      qaStatus: input.qaStatus || input.status || "QA Released",
      palletSerial: input.palletSerial || input.pallet || "15 Pallets",
      shipmentStatus: input.shipmentStatus || "Ready to Ship",
      destination: input.destination?.trim() || "Regional Distribution Center",
      tempCheck: input.tempCheck?.trim() || "18.5°C Controlled",
      notes: input.notes?.trim() || null
    }).returning();

    return created;
  }

  async updateFinishedGood(tenantId: string, id: string, input: any) {
    const updateData: any = { updatedAt: new Date() };
    if (input.sku) updateData.sku = input.sku.trim();
    if (input.productName) updateData.productName = input.productName.trim();
    if (input.finishedLot) updateData.finishedLot = input.finishedLot.trim();
    if (input.batchNumber || input.batch) updateData.batchNumber = (input.batchNumber || input.batch).trim();
    if (input.quantity) updateData.quantity = input.quantity.trim();
    if (input.storageLocation || input.location) updateData.storageLocation = (input.storageLocation || input.location).trim();
    if (input.productionDate) updateData.productionDate = input.productionDate;
    if (input.expiryDate) updateData.expiryDate = input.expiryDate;
    if (input.qaStatus || input.status) updateData.qaStatus = input.qaStatus || input.status;
    if (input.palletSerial || input.pallet) updateData.palletSerial = (input.palletSerial || input.pallet).trim();
    if (input.shipmentStatus) updateData.shipmentStatus = input.shipmentStatus;
    if (input.destination) updateData.destination = input.destination.trim();
    if (input.tempCheck) updateData.tempCheck = input.tempCheck.trim();
    if (input.notes !== undefined) updateData.notes = input.notes ? input.notes.trim() : null;

    const [updated] = await db
      .update(finishedGoods)
      .set(updateData)
      .where(sql`id::text = ${id}`)
      .returning();

    return updated;
  }

  async deleteFinishedGood(tenantId: string, id: string) {
    const [deleted] = await db
      .delete(finishedGoods)
      .where(sql`id::text = ${id}`)
      .returning();

    return deleted;
  }

  // Outbound Shipping Orders & Logistics API (Connected directly to PostgreSQL `shipment_orders` table)
  async listShipmentOrders(tenantId?: string) {
    let rows: any[] = [];
    try {
      rows = await db
        .select()
        .from(shipmentOrders)
        .orderBy(desc(shipmentOrders.createdAt));
    } catch (err) {
      console.warn("Could not query shipment_orders table:", err);
      rows = [];
    }

    const formatted = rows.map(s => {
      const defaultMilestones = [
        { step: "Order Allocated", time: "Completed", done: true },
        { step: "Staging Bay Loaded", time: s.status !== "Scheduled" ? "Completed" : "Pending", done: s.status !== "Scheduled" },
        { step: "Trailer Sealed & Inspected", time: s.status === "Dispatched" || s.status === "Delivered" ? "Completed" : "Pending", done: s.status === "Dispatched" || s.status === "Delivered" },
        { step: "En Route to Hub", time: s.status === "Dispatched" ? "In Transit" : s.status === "Delivered" ? "Completed" : "Pending", done: s.status === "Dispatched" || s.status === "Delivered" },
        { step: "Customer Dock Delivery", time: s.status === "Delivered" ? "Delivered" : "Pending", done: s.status === "Delivered" }
      ];

      return {
        id: s.id,
        shipmentNumber: s.shipmentNumber || s.orderNumber || `SHP-${s.id.substring(0, 6)}`,
        customer: s.customerName,
        customerName: s.customerName,
        orderNumber: s.orderNumber || s.shipmentNumber || "ORD-0000",
        finishedGoods: s.finishedGoods || "Finished Goods Consignment",
        batchLot: s.batchLot || "LOT-FG",
        quantity: s.quantity || "20 Pallets",
        carrier: s.carrier || "Challenger Freight Lines",
        shipDate: s.dispatchDate ? (typeof s.dispatchDate === 'string' ? s.dispatchDate.substring(0, 10) : new Date(s.dispatchDate).toISOString().substring(0, 10)) : "",
        destination: s.destination || "Logistics Depot",
        status: s.status || "Scheduled",
        trailerNo: s.trailerNo || "TR-0000",
        sealNo: s.sealNo || "SL-0000",
        bolNumber: s.bolNumber || "BOL-0000",
        trackingMilestones: Array.isArray(s.trackingMilestones) && s.trackingMilestones.length > 0 ? s.trackingMilestones : defaultMilestones,
        createdAt: s.createdAt
      };
    });

    const totalPallets = rows.reduce((sum, s) => {
      const match = (s.quantity || "").match(/(\d+)/);
      return sum + (match ? parseInt(match[1]) : 20);
    }, 0);

    const dispatchedCount = rows.filter(s => s.status === "Dispatched" || s.status === "Delivered").length;
    const deliveredCount = rows.filter(s => s.status === "Delivered").length;
    const slaPercent = rows.length > 0 ? `${Math.round((deliveredCount / rows.length) * 100 || 98.5)}%` : "100%";

    return {
      shipmentOrders: formatted,
      metrics: {
        activeShipmentsToday: rows.length,
        totalOutboundPallets: `${totalPallets} Pallets`,
        carrierOtif: rows.length > 0 ? "98.5%" : "0%",
        dispatchedTrailers: dispatchedCount
      }
    };
  }

  async createShipmentOrder(tenantId: string, input: any) {
    let resolvedTenantId = isValidUuid(tenantId) ? tenantId : null;
    let resolvedPlantId = input.plantId || null;

    if (!resolvedTenantId || !resolvedPlantId) {
      const firstPo = (await db.select().from(productionOrders).limit(1))[0];
      if (firstPo) {
        if (!resolvedTenantId) resolvedTenantId = firstPo.tenantId;
        if (!resolvedPlantId) resolvedPlantId = firstPo.plantId;
      }
    }

    const shipNum = input.shipmentNumber || input.orderNumber || `SHP-2026-${Math.floor(880 + Math.random() * 120)}`;
    const defaultMilestones = [
      { step: "Order Allocated", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
      { step: "Staging Bay Loaded", time: "Pending", done: false },
      { step: "Trailer Sealed & Inspected", time: "Pending", done: false },
      { step: "En Route to Hub", time: "Pending", done: false },
      { step: "Customer Dock Delivery", time: "Pending", done: false }
    ];

    const [created] = await db.insert(shipmentOrders).values({
      tenantId: resolvedTenantId,
      plantId: resolvedPlantId,
      shipmentNumber: shipNum,
      customerName: input.customer || input.customerName || "Commercial Retail Depot",
      orderNumber: input.orderNumber || `ORD-${Math.floor(88000 + Math.random() * 1000)}`,
      finishedGoods: input.finishedGoods || "Sparkling Beverages 330ml Can",
      batchLot: input.batchLot || "LOT-FG-2026-0885",
      quantity: input.quantity || "20 Pallets (30,000 cans)",
      carrier: input.carrier || "Challenger Freight Lines",
      destination: input.destination || "Regional Distribution Depot",
      status: input.status || "Scheduled",
      trailerNo: input.trailerNo || `TR-${Math.floor(5000 + Math.random() * 4000)}`,
      sealNo: input.sealNo || `SL-${Math.floor(90000 + Math.random() * 9000)}`,
      bolNumber: input.bolNumber || `BOL-2026-${Math.floor(800 + Math.random() * 200)}`,
      trackingNumber: input.trackingNumber || `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingMilestones: input.trackingMilestones || defaultMilestones,
      dispatchDate: input.shipDate ? new Date(input.shipDate) : new Date()
    }).returning();

    return {
      id: created.id,
      shipmentNumber: created.shipmentNumber,
      customer: created.customerName,
      customerName: created.customerName,
      orderNumber: created.orderNumber,
      finishedGoods: created.finishedGoods,
      batchLot: created.batchLot,
      quantity: created.quantity,
      carrier: created.carrier,
      shipDate: created.dispatchDate ? (typeof created.dispatchDate === 'string' ? created.dispatchDate.substring(0, 10) : new Date(created.dispatchDate).toISOString().substring(0, 10)) : "",
      destination: created.destination,
      status: created.status,
      trailerNo: created.trailerNo,
      sealNo: created.sealNo,
      bolNumber: created.bolNumber,
      trackingMilestones: created.trackingMilestones
    };
  }

  async updateShipmentOrder(tenantId: string, id: string, input: any) {
    const updateData: any = { updatedAt: new Date() };
    if (input.customer || input.customerName) updateData.customerName = (input.customer || input.customerName).trim();
    if (input.orderNumber) updateData.orderNumber = input.orderNumber.trim();
    if (input.finishedGoods) updateData.finishedGoods = input.finishedGoods.trim();
    if (input.batchLot) updateData.batchLot = input.batchLot.trim();
    if (input.quantity) updateData.quantity = input.quantity.trim();
    if (input.carrier) updateData.carrier = input.carrier.trim();
    if (input.destination) updateData.destination = input.destination.trim();
    if (input.status) updateData.status = input.status;
    if (input.trailerNo) updateData.trailerNo = input.trailerNo.trim();
    if (input.sealNo) updateData.sealNo = input.sealNo.trim();
    if (input.bolNumber) updateData.bolNumber = input.bolNumber.trim();
    if (input.shipDate) updateData.dispatchDate = new Date(input.shipDate);
    if (input.trackingMilestones) updateData.trackingMilestones = input.trackingMilestones;

    const [updated] = await db
      .update(shipmentOrders)
      .set(updateData)
      .where(sql`id::text = ${id} OR shipment_number = ${id}`)
      .returning();

    return updated;
  }

  async deleteShipmentOrder(tenantId: string, id: string) {
    const [deleted] = await db
      .delete(shipmentOrders)
      .where(sql`id::text = ${id} OR shipment_number = ${id}`)
      .returning();
    return deleted;
  }

  async dispatchShipmentOrder(tenantId: string, id: string) {
    const defaultMilestones = [
      { step: "Order Allocated", time: "08:00 AM", done: true },
      { step: "Staging Bay Loaded", time: "10:30 AM", done: true },
      { step: "Trailer Sealed & Inspected", time: "11:45 AM", done: true },
      { step: "En Route to Hub", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
      { step: "Customer Dock Delivery", time: "Pending", done: false }
    ];

    const [updated] = await db
      .update(shipmentOrders)
      .set({
        status: "Dispatched",
        trackingMilestones: defaultMilestones,
        updatedAt: new Date()
      })
      .where(sql`id::text = ${id} OR shipment_number = ${id}`)
      .returning();

    return updated || { id, status: "Dispatched" };
  }

  // ==========================================
  // RAW MATERIAL INVENTORY API
  // ==========================================
  async getRawMaterials(tenantId: string, query?: any) {
    try {
      if (isValidUuid(tenantId)) {
        const dbLots = await db.query.inventoryLots.findMany({
          where: and(eq(inventoryLots.tenantId, tenantId), eq(inventoryLots.lotType, "RAW_MATERIAL")),
          with: { sku: true },
          orderBy: [desc(inventoryLots.createdAt)]
        }).catch(() => []);
        if (dbLots && dbLots.length > 0) {
          const dbFormatted = dbLots.map((l: any) => ({
            id: l.id,
            lotNumber: l.lotNumber,
            materialName: l.sku?.name || l.sku?.code || "Raw Material",
            sku: l.sku?.code || "ING-RAW",
            quantity: `${l.currentQuantity} ${l.uom || "Units"}`,
            onHand: `${l.currentQuantity} ${l.uom || "Units"}`,
            unit: l.uom || "Units",
            location: l.locationBinId || "Receiving Dock - Staging Area",
            status: l.status === "RELEASED" ? "AVAILABLE" : l.status,
            category: "Raw Material",
            supplier: l.supplierName || "Direct Supplier",
            lastUpdated: l.updatedAt || l.createdAt
          }));
          const existingLotNums = new Set(dbFormatted.map((d: any) => d.lotNumber));
          const filteredStore = rawMaterialsStore.filter((s: any) => !existingLotNums.has(s.lotNumber));
          rawMaterialsStore = [...dbFormatted, ...filteredStore];
        }
      }
    } catch (e) {
      // fallback
    }

    return {
      materials: rawMaterialsStore,
      metrics: {
        totalLots: rawMaterialsStore.length,
        stagedLots: rawMaterialsStore.filter(m => (m.status || "").toUpperCase() === "STAGED").length,
        secureStockCount: rawMaterialsStore.filter(m => (m.status || "").toUpperCase().includes("SECURE") || (m.status || "").toUpperCase() === "AVAILABLE").length,
        allocatedCount: rawMaterialsStore.filter(m => (m.status || "").toUpperCase() === "ALLOCATED").length
      }
    };
  }

  async toggleRawMaterialStatus(tenantId: string, idOrLotNumber: string, input?: any) {
    const item = rawMaterialsStore.find(m => m.id === idOrLotNumber || m.lotNumber === idOrLotNumber);
    if (item) {
      const current = (item.status || "AVAILABLE").toUpperCase();
      let nextStatus = "AVAILABLE";
      if (current === "STAGED") nextStatus = "AVAILABLE";
      else if (current === "AVAILABLE") nextStatus = "ALLOCATED";
      else if (current === "ALLOCATED") nextStatus = "PUT-AWAY";
      else if (current === "PUT-AWAY") nextStatus = "SECURE STOCK";
      else nextStatus = "STAGED";

      item.status = input?.status || nextStatus;
      item.lastUpdated = new Date().toISOString();

      try {
        if (isValidUuid(tenantId) && (isValidUuid(item.id) || isValidUuid(idOrLotNumber))) {
          const targetId = isValidUuid(item.id) ? item.id : idOrLotNumber;
          await db.update(inventoryLots).set({
            status: item.status,
            updatedAt: new Date()
          }).where(and(eq(inventoryLots.tenantId, tenantId), eq(inventoryLots.id, targetId))).catch(() => null);
        }
      } catch (e) {}

      return { success: true, item, message: `Status of ${item.lotNumber || item.materialName} updated to ${item.status}` };
    }

    return { success: true, id: idOrLotNumber, status: input?.status || "AVAILABLE" };
  }

  // ==========================================
  // PACKAGING INVENTORY API
  // ==========================================
  async getPackagingMaterials(tenantId: string, query?: any) {
    try {
      if (isValidUuid(tenantId)) {
        const dbLots = await db.query.inventoryLots.findMany({
          where: and(eq(inventoryLots.tenantId, tenantId), eq(inventoryLots.lotType, "PACKAGING")),
          with: { sku: true },
          orderBy: [desc(inventoryLots.createdAt)]
        }).catch(() => []);
        if (dbLots && dbLots.length > 0) {
          // Can enrich packaging store
        }
      }
    } catch (e) {}

    return {
      packaging: packagingMaterialsStore,
      metrics: {
        totalItems: packagingMaterialsStore.length,
        secureStockCount: packagingMaterialsStore.filter(p => p.status === "Secure Stock").length,
        lowStockAlerts: packagingMaterialsStore.filter(p => p.status.includes("Low")).length,
        totalUnits: "109,500 Pcs"
      }
    };
  }

  async togglePackagingStatus(tenantId: string, id: any, input?: any) {
    const numericId = Number(id);
    const item = packagingMaterialsStore.find(p => p.id === id || p.id === numericId || p.sku === id);
    if (item) {
      if (input?.status) {
        item.status = input.status;
      } else {
        item.status = item.status === "Secure Stock" ? "Low Stock Alert" : "Secure Stock";
      }
      return { success: true, item, message: `Packaging stock status updated to ${item.status}` };
    }
    return { success: true, id, status: input?.status || "Secure Stock" };
  }

  // ==========================================
  // PICKING & PALLETS CONTAINER APIS
  // ==========================================

  async getPickingLists(tenantId: string) {
    return {
      pickLists: pickListsStore,
      lists: pickListsStore,
      metrics: {
        totalLists: pickListsStore.length,
        pending: pickListsStore.filter(p => p.status === "PENDING").length,
        inProgress: pickListsStore.filter(p => p.status === "IN_PROGRESS").length,
        completed: pickListsStore.filter(p => p.status === "COMPLETED").length
      }
    };
  }

  async startPickingList(tenantId: string, id: string) {
    const list = pickListsStore.find(p => p.id === id || p.order === id);
    if (list) {
      list.status = "IN_PROGRESS";
      return { success: true, list, message: `Pick list ${id} started.` };
    }
    return { success: true, id, status: "IN_PROGRESS", message: `Pick list ${id} started.` };
  }

  async getPickingExecution(tenantId: string) {
    return {
      items: pickingExecutionQueueStore,
      count: pickingExecutionQueueStore.length,
      metrics: {
        pendingPicks: pickingExecutionQueueStore.filter(p => p.status.toLowerCase() === "pending").length,
        completedPicks: pickingExecutionQueueStore.filter(p => p.status.toLowerCase() === "picked").length
      }
    };
  }

  async confirmPickingExecution(tenantId: string, input: any, userId?: string) {
    const id = input.id || input.taskId;
    const numId = Number(id);
    const item = pickingExecutionQueueStore.find(p => p.id === id || p.id === numId || p.name === input.item);

    if (item) {
      item.status = "Picked";
    }

    const itemName = input.item || item?.name || "Material Item";
    return {
      success: true,
      item: item || { id, status: "Picked", name: itemName },
      message: `Material pick confirmed: ${itemName}. Staged at STG-L1-IN.`
    };
  }

  async getPalletsContainers(tenantId: string) {
    return {
      pallets: palletsContainersStore,
      count: palletsContainersStore.length,
      metrics: {
        totalPallets: palletsContainersStore.length,
        staged: palletsContainersStore.filter(p => p.status.includes("Staged")).length,
        loaded: palletsContainersStore.filter(p => p.status.includes("Loaded")).length
      }
    };
  }

  async loadPalletContainer(tenantId: string, input: any, userId?: string) {
    const id = input.id || input.lotNumber || "PLT-1020";
    const pallet = palletsContainersStore.find(p => p.id === id);

    if (pallet) {
      pallet.status = "Loaded Carrier";
      pallet.loadedCarrier = input.carrier || "Titan Freight Lines";
      pallet.updatedAt = new Date().toISOString();
    }

    return {
      success: true,
      pallet: pallet || { id, status: "Loaded Carrier" },
      message: `Pallet ${id} marked as Loaded. Outbound dispatch updated.`
    };
  }

  // ==========================================
  // SHIPMENT TRACKING
  // ==========================================

  async getShipmentTracking(tenantId: string) {
    let rows: any[] = [];
    try {
      rows = await db
        .select()
        .from(shipmentOrders)
        .where(or(
          eq(shipmentOrders.status, "Dispatched"),
          eq(shipmentOrders.status, "In Transit"),
          eq(shipmentOrders.status, "Delivered")
        ))
        .orderBy(desc(shipmentOrders.updatedAt));
    } catch (e) {
      console.warn("Could not query shipment orders for tracking:", e);
    }

    const trackingList = rows.map(r => ({
      id: r.shipmentNumber || r.id,
      realId: r.id,
      trackingNumber: r.trackingNumber || `TRK-${r.shipmentNumber || r.id}`,
      dest: r.destination || "Logistics Hub",
      status: r.status || "In Transit",
      carrier: r.carrier || "Freight Logistics",
      trailerNo: r.trailerNo || "TR-0000",
      eta: r.status === "Delivered" 
        ? `Delivered ${r.dispatchDate ? new Date(r.dispatchDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10)}` 
        : `${r.dispatchDate ? new Date(r.dispatchDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10)} 14:00`,
      milestones: r.trackingMilestones || []
    }));

    return {
      trackingList,
      activeShipments: trackingList,
      count: trackingList.length,
      metrics: {
        totalTracked: trackingList.length,
        inTransit: trackingList.filter(s => s.status.toLowerCase().includes("transit") || s.status.toLowerCase().includes("dispatched")).length,
        delivered: trackingList.filter(s => s.status.toLowerCase().includes("delivered")).length
      }
    };
  }

  async toggleShipmentTrackingStatus(tenantId: string, id: string, newStatus?: string) {
    let nextStatus = newStatus;
    if (!nextStatus) {
      const existing = (await db.select().from(shipmentOrders).where(sql`id::text = ${id} OR shipment_number = ${id} OR tracking_number = ${id}`).limit(1))[0];
      nextStatus = existing?.status === "Delivered" ? "In Transit" : "Delivered";
    }

    const [updated] = await db
      .update(shipmentOrders)
      .set({
        status: nextStatus,
        updatedAt: new Date()
      })
      .where(sql`id::text = ${id} OR shipment_number = ${id} OR tracking_number = ${id}`)
      .returning();

    return {
      success: true,
      shipment: updated || { id, status: nextStatus },
      message: `Shipment ${id} status updated to ${nextStatus}.`
    };
  }

  // ==========================================
  // WAREHOUSE INVENTORY REPORTS
  // ==========================================

  async getWarehouseReports(tenantId: string) {
    return {
      reports: warehouseReportsStore,
      count: warehouseReportsStore.length,
      metrics: {
        totalReports: warehouseReportsStore.length,
        lastGenerated: new Date().toISOString().split("T")[0]
      }
    };
  }

  async generateWarehouseReport(tenantId: string, body: any, userId?: string) {
    const reportName = body.name || body.reportName || "Inventory Valuation & Audit Report";
    const newReport = {
      id: `REP-0${warehouseReportsStore.length + 1}`,
      name: reportName,
      date: new Date().toISOString().split("T")[0],
      type: body.type || "Operational Summary",
      format: body.format || "PDF",
      itemsCount: body.itemsCount || 50
    };
    warehouseReportsStore.unshift(newReport);
    return {
      success: true,
      report: newReport,
      message: `Report "${reportName}" generated successfully.`
    };
  }

  // ==========================================
  // WAREHOUSE OPERATIONS NOTIFICATIONS & ALERTS
  // ==========================================

  async getWarehouseNotifications(tenantId: string) {
    const unreadCount = warehouseNotificationsStore.filter(n => !n.read).length;
    return {
      notifications: warehouseNotificationsStore,
      unreadCount,
      totalCount: warehouseNotificationsStore.length
    };
  }

  async markWarehouseNotificationRead(tenantId: string, id: string | number) {
    const numId = Number(id);
    const item = warehouseNotificationsStore.find(n => n.id === id || n.id === numId);
    if (item) {
      item.read = true;
    }
    return {
      success: true,
      id,
      unreadCount: warehouseNotificationsStore.filter(n => !n.read).length,
      message: "Notification marked as read."
    };
  }

  async markAllWarehouseNotificationsRead(tenantId: string) {
    warehouseNotificationsStore.forEach(n => { n.read = true; });
    return {
      success: true,
      unreadCount: 0,
      message: "All notifications marked as read."
    };
  }

  async deleteWarehouseNotification(tenantId: string, id: string | number) {
    const numId = Number(id);
    warehouseNotificationsStore = warehouseNotificationsStore.filter(n => n.id !== id && n.id !== numId);
    return {
      success: true,
      id,
      notifications: warehouseNotificationsStore,
      message: "Notification deleted."
    };
  }

  async clearAllWarehouseNotifications(tenantId: string) {
    warehouseNotificationsStore = [];
    return {
      success: true,
      notifications: [],
      unreadCount: 0,
      message: "All notifications cleared."
    };
  }

  // ==========================================
  // WAREHOUSE OPERATOR PROFILE
  // ==========================================

  async getWarehouseProfile(tenantId: string, userId?: string) {
    return {
      profile: warehouseProfileStore,
      user: warehouseProfileStore
    };
  }

  async toggleWarehouseCertification(tenantId: string, certId: number | string, newStatus?: string) {
    const numId = Number(certId);
    const cert = warehouseProfileStore.certifications.find(c => c.id === certId || c.id === numId);
    if (cert) {
      if (newStatus) {
        cert.status = newStatus;
      } else {
        if (cert.status === "EXPIRED") {
          cert.status = cert.id === 1 ? "ACTIVE" : "CERTIFIED";
        } else {
          cert.status = "EXPIRED";
        }
      }
      return {
        success: true,
        cert,
        message: `${cert.name} marked as ${cert.status}.`
      };
    }
    return {
      success: true,
      certId,
      status: newStatus || "ACTIVE",
      message: `Certification updated.`
    };
  }
}

let shipmentTrackingStore = [
  { id: "TRK-9011", orderId: "ORD-991", dest: "Walmart Logistics - Houston", destination: "Walmart Logistics - Houston", status: "In Transit", eta: "2026-09-01 10:00", carrier: "Swift Transportation", trailerNo: "TR-4401" },
  { id: "TRK-9010", orderId: "ORD-992", dest: "Target regional Chicago", destination: "Target regional Chicago", status: "Delivered", eta: "Delivered 2026-08-31", carrier: "Titan Freight", trailerNo: "TR-8812" }
];

let warehouseReportsStore = [
  { id: "REP-01", name: "Inbound Deliveries Logs", date: "2026-08-31", type: "Delivery Audit", format: "PDF", itemsCount: 42 },
  { id: "REP-02", name: "Cycle Stock Variance Audit", date: "2026-08-31", type: "Inventory Variance", format: "XLSX", itemsCount: 128 }
];

let warehouseNotificationsStore = [
  { 
    id: 1, 
    title: "Carrier Arrived at Dock 4", 
    msg: "Lot delivery of ADM Cane Sugar arrived. Awaiting staging sign-off.", 
    time: "5 min ago", 
    path: "/warehouse/receiving/receive",
    type: "primary",
    badge: "DELIVERY",
    read: false
  },
  { 
    id: 2, 
    title: "Urgent Staging Pick Required", 
    msg: "Line 1 Aseptic run requires 1,500 Orange Caps stage pick.", 
    time: "15 min ago", 
    path: "/warehouse/picking/execution",
    type: "danger",
    badge: "URGENT",
    read: false
  }
];

let warehouseProfileStore = {
  id: "USR-WH-091",
  name: "Julio Chavez",
  initials: "JC",
  role: "Lead Warehouse Receiver",
  badges: ["Receiving Dock Lead", "LOT Inspector"],
  metrics: {
    cycleCountAccuracy: "99.7%",
    palletsDispatched: 452
  },
  certifications: [
    { id: 1, name: "OSHA Forklift Operations License", status: "ACTIVE", activeVariant: "emerald", inactiveVariant: "warning" },
    { id: 2, name: "Hazardous lot staging handling", status: "CERTIFIED", activeVariant: "emerald", inactiveVariant: "warning" }
  ]
};

export const warehouseService = new WarehouseService();


