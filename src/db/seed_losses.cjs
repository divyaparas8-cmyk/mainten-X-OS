const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:aashi%401234@localhost:5432/maintenxos' });

async function seedLosses() {
  try {
    const existing = await pool.query("SELECT id FROM ci_losses WHERE id LIKE 'LOSS-QL-%' OR id LIKE 'LOSS-YD-%' OR id LIKE 'LOSS-SC-%'");
    if (existing.rows.length > 0) {
      console.log('Seeded losses already exist (' + existing.rows.length + ' records).');
      pool.end();
      return;
    }

    const losses = [
      // Quality Losses
      {
        id: 'LOSS-QL-001',
        category: 'Quality Loss',
        plant_id: 'PLT-01',
        line_id: 'LIN-01',
        asset_id: 'PROC-PAST-01',
        stage: 'PROCESSING',
        event_name: 'Pasteurizer Thermal Hold Under-Temperature Deviation (Batch #402)',
        hours_lost: 0.0,
        units_lost: 1200,
        financial_impact_usd: 1450.00,
        trend: 'Tracked',
        date: new Date().toISOString().substring(0, 10)
      },
      {
        id: 'LOSS-QL-002',
        category: 'Quality Loss',
        plant_id: 'PLT-01',
        line_id: 'LIN-02',
        asset_id: 'PACK-CAPP-01',
        stage: 'PACKAGING',
        event_name: 'Vision Inspection Cap Crooked & Thread Seal Failure',
        hours_lost: 0.0,
        units_lost: 450,
        financial_impact_usd: 680.00,
        trend: 'Tracked',
        date: new Date().toISOString().substring(0, 10)
      },

      // Yield Losses
      {
        id: 'LOSS-YD-001',
        category: 'Yield Loss',
        plant_id: 'PLT-01',
        line_id: 'LIN-01',
        asset_id: 'PROC-COOK-01',
        stage: 'PROCESSING',
        event_name: 'Thermal Hold Deaerator Cooking Evaporation Shrinkage',
        hours_lost: 0.0,
        units_lost: 850,
        financial_impact_usd: 1280.00,
        trend: 'Tracked',
        date: new Date().toISOString().substring(0, 10)
      },
      {
        id: 'LOSS-YD-002',
        category: 'Yield Loss',
        plant_id: 'PLT-01',
        line_id: 'LIN-02',
        asset_id: 'PACK-FILL-01',
        stage: 'PACKAGING',
        event_name: 'Rotary Monobloc Filler Volumetric Overfill Giveaway',
        hours_lost: 0.0,
        units_lost: 620,
        financial_impact_usd: 930.00,
        trend: 'Tracked',
        date: new Date().toISOString().substring(0, 10)
      },
      {
        id: 'LOSS-YD-003',
        category: 'Mass-Balance Loss',
        plant_id: 'PLT-01',
        line_id: 'LIN-01',
        asset_id: 'PROC-MIX-01',
        stage: 'PROCESSING',
        event_name: 'Holding Tank HT-102 CIP Flush Heel Residue',
        hours_lost: 0.0,
        units_lost: 400,
        financial_impact_usd: 600.00,
        trend: 'Tracked',
        date: new Date().toISOString().substring(0, 10)
      },

      // Scrap & Rework Losses
      {
        id: 'LOSS-SC-001',
        category: 'Scrap Loss',
        plant_id: 'PLT-01',
        line_id: 'LIN-02',
        asset_id: 'PACK-FILL-01',
        stage: 'PACKAGING',
        event_name: 'Preform Neck Ovality Blow-Molder Rejects',
        hours_lost: 0.0,
        units_lost: 850,
        financial_impact_usd: 1020.00,
        trend: 'Tracked',
        date: new Date().toISOString().substring(0, 10)
      },
      {
        id: 'LOSS-SC-002',
        category: 'Rework Loss',
        plant_id: 'PLT-01',
        line_id: 'LIN-01',
        asset_id: 'PROC-MIX-01',
        stage: 'PROCESSING',
        event_name: 'Out-of-Spec Brix Syrup Re-Blending Rework',
        hours_lost: 0.0,
        units_lost: 1500,
        financial_impact_usd: 1150.00,
        trend: 'Tracked',
        date: new Date().toISOString().substring(0, 10)
      },
      {
        id: 'LOSS-SC-003',
        category: 'Scrap Loss',
        plant_id: 'PLT-01',
        line_id: 'LIN-02',
        asset_id: 'PACK-CASE-01',
        stage: 'PACKAGING',
        event_name: 'End-of-Line Outer Case Packer Corrugate Jam & Crush',
        hours_lost: 0.0,
        units_lost: 320,
        financial_impact_usd: 480.00,
        trend: 'Tracked',
        date: new Date().toISOString().substring(0, 10)
      }
    ];

    for (const l of losses) {
      await pool.query(
        `INSERT INTO ci_losses (
          id, category, plant_id, line_id, asset_id, stage, event_name,
          hours_lost, units_lost, financial_impact_usd, trend, date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING`,
        [l.id, l.category, l.plant_id, l.line_id, l.asset_id, l.stage, l.event_name, l.hours_lost, l.units_lost, l.financial_impact_usd, l.trend, l.date]
      );
    }

    console.log('Successfully seeded ' + losses.length + ' realistic loss events into ci_losses.');
    pool.end();
  } catch (err) {
    console.error('Error seeding losses:', err);
    pool.end();
  }
}

seedLosses();
