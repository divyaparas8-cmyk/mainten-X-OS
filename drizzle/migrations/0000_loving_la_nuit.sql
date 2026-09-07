CREATE TABLE "plants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100),
	"country" varchar(100) DEFAULT 'India',
	"timezone" varchar(100) DEFAULT 'Asia/Kolkata' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"plan" varchar(50) DEFAULT 'ENTERPRISE' NOT NULL,
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(150) NOT NULL,
	"module" varchar(100) NOT NULL,
	"action" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid,
	"code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"userId" uuid NOT NULL,
	"roleId" uuid NOT NULL,
	"plantId" uuid,
	CONSTRAINT "user_roles_userId_roleId_pk" PRIMARY KEY("userId","roleId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"phone" varchar(50),
	"avatar_url" text,
	"digital_signature_pin_hash" varchar(255),
	"is_master_admin" boolean DEFAULT false NOT NULL,
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" varchar(50),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "digital_signatures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid,
	"user_id" uuid NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"meaning" varchar(255) NOT NULL,
	"comments" text,
	"signed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"line_id" uuid,
	"asset_code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"model_number" varchar(100),
	"manufacturer" varchar(100),
	"critical_level" varchar(50) DEFAULT 'CRITICAL_P1',
	"status" varchar(50) DEFAULT 'OPERATIONAL',
	"health_percent" integer DEFAULT 92,
	"mtbf_hours" numeric(10, 2) DEFAULT '412.5',
	"mttr_hours" numeric(10, 2) DEFAULT '1.8',
	"install_date" timestamp,
	"last_service_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bom_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bom_id" uuid NOT NULL,
	"component_sku_id" uuid NOT NULL,
	"quantity" numeric(14, 4) NOT NULL,
	"scrap_percentage" numeric(5, 2) DEFAULT '0.00',
	"uom" varchar(50) NOT NULL,
	"sequence" integer DEFAULT 1 NOT NULL,
	"stage" varchar(100) DEFAULT 'MIXING'
);
--> statement-breakpoint
CREATE TABLE "boms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"sku_id" uuid NOT NULL,
	"version" varchar(50) DEFAULT 'v1.0' NOT NULL,
	"name" varchar(255) NOT NULL,
	"batch_size" numeric(12, 2) DEFAULT '10000' NOT NULL,
	"batch_uom" varchar(50) DEFAULT 'Units' NOT NULL,
	"yield_percent" numeric(5, 2) DEFAULT '98.50',
	"is_default" boolean DEFAULT true NOT NULL,
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "production_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"work_center_id" uuid,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"line_type" varchar(100) DEFAULT 'BOTTLING',
	"nominal_speed_bpm" integer DEFAULT 250,
	"status" varchar(50) DEFAULT 'RUNNING',
	"health_score" integer DEFAULT 94,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quality_specs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"sku_id" uuid NOT NULL,
	"parameter_name" varchar(150) NOT NULL,
	"target_value" numeric(10, 3) NOT NULL,
	"min_tolerance" numeric(10, 3) NOT NULL,
	"max_tolerance" numeric(10, 3) NOT NULL,
	"uom" varchar(50) NOT NULL,
	"is_ccp" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	"start_time" varchar(10) NOT NULL,
	"end_time" varchar(10) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skus" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"sku_code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"family_id" uuid,
	"uom" varchar(50) DEFAULT 'Units' NOT NULL,
	"barcode" varchar(100),
	"standard_cost" numeric(12, 4) DEFAULT '0.00',
	"shelf_life_days" integer DEFAULT 365,
	"min_stock_level" numeric(12, 2) DEFAULT '1000',
	"max_stock_level" numeric(12, 2) DEFAULT '50000',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"employee_code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"designation" varchar(100) NOT NULL,
	"shift_code" varchar(50) DEFAULT 'SHIFT_A',
	"phone" varchar(50),
	"is_available" boolean DEFAULT true NOT NULL,
	"certifications" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_centers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"capacity_per_hour" numeric(10, 2) DEFAULT '5000',
	"hourly_rate" numeric(10, 2) DEFAULT '1500',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aps_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"line_id" uuid NOT NULL,
	"shift_id" uuid,
	"order_id" uuid,
	"sku_id" uuid NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"quantity" numeric(12, 2) NOT NULL,
	"changeover_minutes" integer DEFAULT 30,
	"cip_required" boolean DEFAULT false,
	"status" varchar(50) DEFAULT 'DRAFT' NOT NULL,
	"sequence_number" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"order_number" varchar(100) NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"sku_id" uuid NOT NULL,
	"quantity" numeric(12, 2) NOT NULL,
	"priority" varchar(50) DEFAULT 'NORMAL',
	"requested_date" timestamp NOT NULL,
	"scheduled_date" timestamp,
	"status" varchar(50) DEFAULT 'CONFIRMED' NOT NULL,
	"delivery_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forecasts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"sku_id" uuid NOT NULL,
	"period" varchar(50) NOT NULL,
	"baseline_demand" numeric(12, 2) NOT NULL,
	"promo_uplift" numeric(12, 2) DEFAULT '0.00',
	"override_quantity" numeric(12, 2),
	"final_forecast" numeric(12, 2) NOT NULL,
	"mape_accuracy" numeric(5, 2) DEFAULT '94.60',
	"model_type" varchar(100) DEFAULT 'EXPONENTIAL_SMOOTHING',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mrp_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"sku_id" uuid NOT NULL,
	"gross_requirement" numeric(14, 4) NOT NULL,
	"available_stock" numeric(14, 4) NOT NULL,
	"reserved_stock" numeric(14, 4) DEFAULT '0.00',
	"scheduled_receipts" numeric(14, 4) DEFAULT '0.00',
	"net_shortage" numeric(14, 4) NOT NULL,
	"required_date" timestamp NOT NULL,
	"status" varchar(50) DEFAULT 'SHORTAGE_ALERT',
	"calculated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_requisitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"req_number" varchar(100) NOT NULL,
	"sku_id" uuid NOT NULL,
	"quantity" numeric(14, 4) NOT NULL,
	"uom" varchar(50) NOT NULL,
	"vendor_name" varchar(255),
	"estimated_cost" numeric(12, 2),
	"urgency" varchar(50) DEFAULT 'HIGH',
	"status" varchar(50) DEFAULT 'PENDING_APPROVAL',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "batch_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_id" uuid NOT NULL,
	"step_number" integer NOT NULL,
	"step_name" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"operator_id" uuid,
	"verified_by" uuid,
	"parameters" jsonb DEFAULT '{}'::jsonb,
	"started_at" timestamp,
	"completed_at" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"production_order_id" uuid NOT NULL,
	"batch_number" varchar(100) NOT NULL,
	"sku_id" uuid NOT NULL,
	"recipe_version" varchar(50) DEFAULT 'v1.0' NOT NULL,
	"tank_number" varchar(50) DEFAULT 'T-01',
	"target_volume" numeric(12, 2) NOT NULL,
	"actual_volume" numeric(12, 2) DEFAULT '0.00',
	"uom" varchar(50) DEFAULT 'Liters' NOT NULL,
	"current_step" integer DEFAULT 1 NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'Draft' NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "batches_batch_number_unique" UNIQUE("batch_number")
);
--> statement-breakpoint
CREATE TABLE "downtime_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"line_id" uuid NOT NULL,
	"asset_id" uuid,
	"order_id" uuid,
	"reason_code" varchar(100) NOT NULL,
	"category" varchar(100) DEFAULT 'UNPLANNED_STOPPAGE' NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"duration_minutes" integer DEFAULT 0 NOT NULL,
	"comments" text,
	"logged_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "production_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"order_number" varchar(100) NOT NULL,
	"sku_id" uuid NOT NULL,
	"line_id" uuid NOT NULL,
	"target_quantity" numeric(12, 2) NOT NULL,
	"produced_quantity" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"scrap_quantity" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"status" varchar(50) DEFAULT 'PLANNED' NOT NULL,
	"priority" varchar(50) DEFAULT 'NORMAL',
	"planned_start" timestamp NOT NULL,
	"planned_end" timestamp NOT NULL,
	"actual_start" timestamp,
	"actual_end" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"line_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"shift_code" varchar(50) NOT NULL,
	"operator_id" uuid NOT NULL,
	"hour_window" varchar(50) NOT NULL,
	"good_units_produced" integer DEFAULT 0 NOT NULL,
	"scrap_units_produced" integer DEFAULT 0 NOT NULL,
	"logged_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "capa_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"capa_number" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"root_cause_method" varchar(100) DEFAULT '5_WHY',
	"root_cause_analysis" jsonb DEFAULT '{}'::jsonb,
	"corrective_action" text NOT NULL,
	"preventive_action" text NOT NULL,
	"target_completion_date" timestamp NOT NULL,
	"status" varchar(50) DEFAULT 'IN_PROGRESS',
	"assigned_to" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ccp_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"line_id" uuid NOT NULL,
	"batch_id" uuid NOT NULL,
	"ccp_code" varchar(50) NOT NULL,
	"ccp_name" varchar(255) NOT NULL,
	"target_value" numeric(10, 3) NOT NULL,
	"actual_value" numeric(10, 3) NOT NULL,
	"critical_limit_min" numeric(10, 3),
	"critical_limit_max" numeric(10, 3),
	"uom" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"operator_id" uuid NOT NULL,
	"verified_by" uuid,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "deviations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"deviation_number" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100) DEFAULT 'PROCESS_DEVIATION',
	"severity" varchar(50) DEFAULT 'MAJOR',
	"status" varchar(50) DEFAULT 'UNDER_INVESTIGATION',
	"reported_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qa_releases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"batch_id" uuid NOT NULL,
	"disposition" varchar(50) NOT NULL,
	"disposition_by" uuid NOT NULL,
	"digital_signature_pin_used" boolean DEFAULT true NOT NULL,
	"certificate_of_analysis_url" text,
	"coa_metadata" jsonb DEFAULT '{}'::jsonb,
	"comments" text,
	"released_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qa_releases_batch_id_unique" UNIQUE("batch_id")
);
--> statement-breakpoint
CREATE TABLE "quality_holds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"lot_number" varchar(100) NOT NULL,
	"batch_id" uuid,
	"reason" varchar(255) NOT NULL,
	"severity" varchar(50) DEFAULT 'HIGH',
	"status" varchar(50) DEFAULT 'ACTIVE_HOLD' NOT NULL,
	"hold_by" uuid NOT NULL,
	"hold_at" timestamp DEFAULT now() NOT NULL,
	"released_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "goods_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"grn_number" varchar(100) NOT NULL,
	"po_number" varchar(100),
	"vendor_name" varchar(255) NOT NULL,
	"received_by" uuid,
	"received_date" timestamp DEFAULT now() NOT NULL,
	"status" varchar(50) DEFAULT 'COMPLETED' NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "goods_receipts_grn_number_unique" UNIQUE("grn_number")
);
--> statement-breakpoint
CREATE TABLE "inventory_lots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"sku_id" uuid NOT NULL,
	"lot_number" varchar(100) NOT NULL,
	"lot_type" varchar(50) NOT NULL,
	"supplier_name" varchar(255),
	"supplier_lot_number" varchar(100),
	"initial_quantity" numeric(14, 4) NOT NULL,
	"current_quantity" numeric(14, 4) NOT NULL,
	"reserved_quantity" numeric(14, 4) DEFAULT '0.00' NOT NULL,
	"uom" varchar(50) NOT NULL,
	"location_bin_id" uuid,
	"mfg_date" timestamp,
	"expiry_date" timestamp,
	"status" varchar(50) DEFAULT 'RELEASED' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_lots_lot_number_unique" UNIQUE("lot_number")
);
--> statement-breakpoint
CREATE TABLE "inventory_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"lot_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"quantity" numeric(14, 4) NOT NULL,
	"uom" varchar(50) NOT NULL,
	"from_bin_id" uuid,
	"to_bin_id" uuid,
	"reference_type" varchar(100),
	"reference_id" varchar(255),
	"notes" text,
	"performed_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "location_bins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"bin_code" varchar(50) NOT NULL,
	"aisle" varchar(20),
	"rack" varchar(20),
	"shelf" varchar(20),
	"bin" varchar(20),
	"zone" varchar(50) DEFAULT 'AMBIENT',
	"is_occupied" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipment_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"shipment_number" varchar(100) NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"carrier" varchar(100) DEFAULT 'Swift Freight Logistics',
	"tracking_number" varchar(100),
	"status" varchar(50) DEFAULT 'DISPATCHED' NOT NULL,
	"dispatch_date" timestamp DEFAULT now() NOT NULL,
	"shipped_lots" jsonb DEFAULT '[]'::jsonb,
	CONSTRAINT "shipment_orders_shipment_number_unique" UNIQUE("shipment_number")
);
--> statement-breakpoint
CREATE TABLE "warehouses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) DEFAULT 'RAW_AND_FINISHED',
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lot_genealogies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"parent_lot_id" uuid NOT NULL,
	"child_lot_id" uuid NOT NULL,
	"batch_id" uuid,
	"quantity_used" numeric(14, 4) NOT NULL,
	"uom" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recall_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"recall_code" varchar(100) NOT NULL,
	"initiated_by" uuid NOT NULL,
	"target_lot_number" varchar(100) NOT NULL,
	"reason" varchar(255) NOT NULL,
	"scope" varchar(100) DEFAULT 'FULL_CHAIN_FORWARD_AND_BACKWARD' NOT NULL,
	"impact_summary" jsonb DEFAULT '{}'::jsonb,
	"status" varchar(50) DEFAULT 'SIMULATION_COMPLETED' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recall_events_recall_code_unique" UNIQUE("recall_code")
);
--> statement-breakpoint
CREATE TABLE "calibrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"instrument_name" varchar(255) NOT NULL,
	"certificate_number" varchar(100),
	"calibration_date" timestamp NOT NULL,
	"next_due_date" timestamp NOT NULL,
	"accuracy_error" numeric(6, 3) DEFAULT '0.02',
	"status" varchar(50) DEFAULT 'VALID' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "failure_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"symptom" varchar(255) NOT NULL,
	"category" varchar(100) DEFAULT 'MECHANICAL' NOT NULL,
	"standard_resolution" text,
	"success_count" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "pm_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"schedule_code" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"frequency" varchar(50) DEFAULT 'MONTHLY' NOT NULL,
	"interval_days" integer DEFAULT 30 NOT NULL,
	"last_performed_date" timestamp,
	"next_due_date" timestamp NOT NULL,
	"status" varchar(50) DEFAULT 'SCHEDULED' NOT NULL,
	"checklist_template" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spare_consumption" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"work_order_id" uuid NOT NULL,
	"spare_part_id" uuid NOT NULL,
	"quantity_used" integer DEFAULT 1 NOT NULL,
	"unit_cost" numeric(10, 2) NOT NULL,
	"consumed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spare_parts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"part_number" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100) DEFAULT 'MECHANICAL' NOT NULL,
	"current_stock" integer DEFAULT 0 NOT NULL,
	"min_stock_level" integer DEFAULT 5 NOT NULL,
	"unit_cost" numeric(10, 2) DEFAULT '450.00',
	"bin_location" varchar(50) DEFAULT 'M-BIN-04',
	"supplier_name" varchar(255),
	CONSTRAINT "spare_parts_part_number_unique" UNIQUE("part_number")
);
--> statement-breakpoint
CREATE TABLE "work_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"wo_number" varchar(100) NOT NULL,
	"asset_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) DEFAULT 'CORRECTIVE' NOT NULL,
	"priority" varchar(50) DEFAULT 'HIGH' NOT NULL,
	"status" varchar(50) DEFAULT 'OPEN' NOT NULL,
	"assigned_to" uuid,
	"reported_by" uuid,
	"failure_code_id" uuid,
	"estimated_hours" numeric(6, 2) DEFAULT '2.0',
	"actual_hours" numeric(6, 2) DEFAULT '0.0',
	"scheduled_date" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "work_orders_wo_number_unique" UNIQUE("wo_number")
);
--> statement-breakpoint
CREATE TABLE "ci_ideas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) DEFAULT 'OEE_IMPROVEMENT' NOT NULL,
	"problem_statement" text NOT NULL,
	"proposed_solution" text NOT NULL,
	"estimated_savings" numeric(12, 2) DEFAULT '0.00',
	"status" varchar(50) DEFAULT 'PROPOSED' NOT NULL,
	"submitted_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid,
	"doc_code" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(100) DEFAULT 'SOP' NOT NULL,
	"version" varchar(50) DEFAULT 'v1.0' NOT NULL,
	"file_url" text,
	"status" varchar(50) DEFAULT 'APPROVED' NOT NULL,
	"author_id" uuid,
	"approved_by" uuid,
	"effective_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exceptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"exception_code" varchar(100) NOT NULL,
	"severity" varchar(50) DEFAULT 'P1' NOT NULL,
	"module" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"reported_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plant_id" uuid,
	"user_id" uuid,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"category" varchar(100) DEFAULT 'SYSTEM' NOT NULL,
	"severity" varchar(50) DEFAULT 'INFO' NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"link_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchasing_vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"vendor_code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact_email" varchar(255),
	"phone" varchar(50),
	"rating" numeric(3, 2) DEFAULT '4.8',
	"lead_time_days" integer DEFAULT 5,
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plants" ADD CONSTRAINT "plants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_plantId_plants_id_fk" FOREIGN KEY ("plantId") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_signatures" ADD CONSTRAINT "digital_signatures_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_signatures" ADD CONSTRAINT "digital_signatures_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_signatures" ADD CONSTRAINT "digital_signatures_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_line_id_production_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."production_lines"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bom_items" ADD CONSTRAINT "bom_items_bom_id_boms_id_fk" FOREIGN KEY ("bom_id") REFERENCES "public"."boms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bom_items" ADD CONSTRAINT "bom_items_component_sku_id_skus_id_fk" FOREIGN KEY ("component_sku_id") REFERENCES "public"."skus"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boms" ADD CONSTRAINT "boms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boms" ADD CONSTRAINT "boms_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_families" ADD CONSTRAINT "product_families_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_lines" ADD CONSTRAINT "production_lines_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_lines" ADD CONSTRAINT "production_lines_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_lines" ADD CONSTRAINT "production_lines_work_center_id_work_centers_id_fk" FOREIGN KEY ("work_center_id") REFERENCES "public"."work_centers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quality_specs" ADD CONSTRAINT "quality_specs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quality_specs" ADD CONSTRAINT "quality_specs_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skus" ADD CONSTRAINT "skus_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skus" ADD CONSTRAINT "skus_family_id_product_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."product_families"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff" ADD CONSTRAINT "staff_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_centers" ADD CONSTRAINT "work_centers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_centers" ADD CONSTRAINT "work_centers_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aps_schedules" ADD CONSTRAINT "aps_schedules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aps_schedules" ADD CONSTRAINT "aps_schedules_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aps_schedules" ADD CONSTRAINT "aps_schedules_line_id_production_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."production_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aps_schedules" ADD CONSTRAINT "aps_schedules_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aps_schedules" ADD CONSTRAINT "aps_schedules_order_id_customer_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."customer_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aps_schedules" ADD CONSTRAINT "aps_schedules_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_orders" ADD CONSTRAINT "customer_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_orders" ADD CONSTRAINT "customer_orders_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_orders" ADD CONSTRAINT "customer_orders_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forecasts" ADD CONSTRAINT "forecasts_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mrp_requirements" ADD CONSTRAINT "mrp_requirements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mrp_requirements" ADD CONSTRAINT "mrp_requirements_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mrp_requirements" ADD CONSTRAINT "mrp_requirements_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_steps" ADD CONSTRAINT "batch_steps_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_steps" ADD CONSTRAINT "batch_steps_operator_id_users_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_steps" ADD CONSTRAINT "batch_steps_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_production_order_id_production_orders_id_fk" FOREIGN KEY ("production_order_id") REFERENCES "public"."production_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downtime_logs" ADD CONSTRAINT "downtime_logs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downtime_logs" ADD CONSTRAINT "downtime_logs_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downtime_logs" ADD CONSTRAINT "downtime_logs_line_id_production_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."production_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downtime_logs" ADD CONSTRAINT "downtime_logs_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downtime_logs" ADD CONSTRAINT "downtime_logs_order_id_production_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."production_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downtime_logs" ADD CONSTRAINT "downtime_logs_logged_by_users_id_fk" FOREIGN KEY ("logged_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_line_id_production_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."production_lines"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_logs" ADD CONSTRAINT "shift_logs_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_logs" ADD CONSTRAINT "shift_logs_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_logs" ADD CONSTRAINT "shift_logs_line_id_production_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."production_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_logs" ADD CONSTRAINT "shift_logs_order_id_production_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."production_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_logs" ADD CONSTRAINT "shift_logs_operator_id_users_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capa_records" ADD CONSTRAINT "capa_records_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capa_records" ADD CONSTRAINT "capa_records_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capa_records" ADD CONSTRAINT "capa_records_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ccp_checks" ADD CONSTRAINT "ccp_checks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ccp_checks" ADD CONSTRAINT "ccp_checks_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ccp_checks" ADD CONSTRAINT "ccp_checks_line_id_production_lines_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."production_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ccp_checks" ADD CONSTRAINT "ccp_checks_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ccp_checks" ADD CONSTRAINT "ccp_checks_operator_id_users_id_fk" FOREIGN KEY ("operator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ccp_checks" ADD CONSTRAINT "ccp_checks_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deviations" ADD CONSTRAINT "deviations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deviations" ADD CONSTRAINT "deviations_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deviations" ADD CONSTRAINT "deviations_reported_by_users_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qa_releases" ADD CONSTRAINT "qa_releases_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qa_releases" ADD CONSTRAINT "qa_releases_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qa_releases" ADD CONSTRAINT "qa_releases_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qa_releases" ADD CONSTRAINT "qa_releases_disposition_by_users_id_fk" FOREIGN KEY ("disposition_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quality_holds" ADD CONSTRAINT "quality_holds_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quality_holds" ADD CONSTRAINT "quality_holds_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quality_holds" ADD CONSTRAINT "quality_holds_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quality_holds" ADD CONSTRAINT "quality_holds_hold_by_users_id_fk" FOREIGN KEY ("hold_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_received_by_users_id_fk" FOREIGN KEY ("received_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_sku_id_skus_id_fk" FOREIGN KEY ("sku_id") REFERENCES "public"."skus"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_location_bin_id_location_bins_id_fk" FOREIGN KEY ("location_bin_id") REFERENCES "public"."location_bins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_lot_id_inventory_lots_id_fk" FOREIGN KEY ("lot_id") REFERENCES "public"."inventory_lots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_from_bin_id_location_bins_id_fk" FOREIGN KEY ("from_bin_id") REFERENCES "public"."location_bins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_to_bin_id_location_bins_id_fk" FOREIGN KEY ("to_bin_id") REFERENCES "public"."location_bins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "location_bins" ADD CONSTRAINT "location_bins_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_orders" ADD CONSTRAINT "shipment_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_orders" ADD CONSTRAINT "shipment_orders_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lot_genealogies" ADD CONSTRAINT "lot_genealogies_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lot_genealogies" ADD CONSTRAINT "lot_genealogies_parent_lot_id_inventory_lots_id_fk" FOREIGN KEY ("parent_lot_id") REFERENCES "public"."inventory_lots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lot_genealogies" ADD CONSTRAINT "lot_genealogies_child_lot_id_inventory_lots_id_fk" FOREIGN KEY ("child_lot_id") REFERENCES "public"."inventory_lots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lot_genealogies" ADD CONSTRAINT "lot_genealogies_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recall_events" ADD CONSTRAINT "recall_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recall_events" ADD CONSTRAINT "recall_events_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recall_events" ADD CONSTRAINT "recall_events_initiated_by_users_id_fk" FOREIGN KEY ("initiated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calibrations" ADD CONSTRAINT "calibrations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calibrations" ADD CONSTRAINT "calibrations_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calibrations" ADD CONSTRAINT "calibrations_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failure_codes" ADD CONSTRAINT "failure_codes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pm_schedules" ADD CONSTRAINT "pm_schedules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pm_schedules" ADD CONSTRAINT "pm_schedules_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pm_schedules" ADD CONSTRAINT "pm_schedules_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spare_consumption" ADD CONSTRAINT "spare_consumption_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spare_consumption" ADD CONSTRAINT "spare_consumption_spare_part_id_spare_parts_id_fk" FOREIGN KEY ("spare_part_id") REFERENCES "public"."spare_parts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spare_parts" ADD CONSTRAINT "spare_parts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spare_parts" ADD CONSTRAINT "spare_parts_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_reported_by_users_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_failure_code_id_failure_codes_id_fk" FOREIGN KEY ("failure_code_id") REFERENCES "public"."failure_codes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ci_ideas" ADD CONSTRAINT "ci_ideas_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ci_ideas" ADD CONSTRAINT "ci_ideas_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ci_ideas" ADD CONSTRAINT "ci_ideas_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exceptions" ADD CONSTRAINT "exceptions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exceptions" ADD CONSTRAINT "exceptions_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchasing_vendors" ADD CONSTRAINT "purchasing_vendors_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;