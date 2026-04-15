Table Zone {
  id int [pk, increment]
  created_by varchar
  name varchar
  description varchar
  capacity int
  additional_fee int
  is_active boolean
  created_at datetime
  updated_at datetime
}

Table VehicleTypes {
  id int [pk, increment]
  name varchar
  minimum_fee int
  description varchar
  created_at datetime
}

Table Vehicle {
  id int [pk, increment]
  plate_number varchar
  vehicle_type_id int [ref: > VehicleTypes.id]
  source varchar
  notes varchar
  created_at datetime
  updated_at datetime
}

Table FeeConfig {
  id int [pk, increment]
  zone_id int [ref: > Zone.id]
  vehicle_type_id int [ref: > VehicleTypes.id]
  created_by int [ref: > Users.id]
  base_fee int
  grace_period_minutes int
  is_active boolean
  effective_from datetime
  effective_until datetime
  created_at datetime
  updated_at datetime
}

Table FeeTier {
  id int [pk, increment]
  fee_config_id int [ref: > FeeConfig.id]
  tier_order int
  duration_minutes int
  fee_amount int
  is_last_tier boolean
}

Table Gate {
  id int [pk, increment]
  created_by varchar
  zone_id int
  name varchar
  gate_type varchar
  location_desc varchar
  is_active boolean
  created_at datetime
  updated_at datetime
}

Table GateDevice {
  id int [pk, increment]
  gate_id int [ref: > Gate.id]
  device_type varchar
  status boolean
  las_ping_at datetime
  error_message text
  created_at datetime
  updated_at datetime
}

Table HolidayRate {
  id int [pk, increment]
  created_by varchar
  name varchar
  date_start datetime
  date_aend datetime
  rate_type varchar
  multiplier float
  override_fee int
  created_at datetime
  updated_at datetime
  applies_to_zone_id int [ref: > Zone.id]
  applies_to_vehicle_type_id int [ref: > VehicleTypes.id]
}

Table RfidCard {
  id int [pk, increment]
  deactivated_by varchar
  card_uid varchar
  vehicle_id int
  is_active boolean
  created_at datetime
  deactivated_at datetime
}

Table Role {
  id int [pk, increment]
  created_by varchar
  name varchar
  description varchar
  created_at datetime
  updated_at datetime
  deleted_at datetime
}

Table Users {
  id int [pk, increment]
  name varchar
  email varchar
  password_hash varchar
  is_active boolean
  created_at datetime
  updated_at datetime
  deleted_at datetime
  role_id int [ref: > Role.id]
}

Table Permission {
  id int [pk, increment]
  node varchar [unique]
  description varchar
  created_at datetime
}

Table RolePermission {
  id int [pk, increment]
  granted_by varchar
  role_id int [ref: > Role.id]
  permission_id int [ref: > Permission.id]
  granted_at datetime
}

Table Transaction {
  id int [pk, increment]
  transaction_code varchar
  entry_method varchar
  entry_qr_code varchar
  entry_at datetime
  entry_photo_url text
  entry_gate_id int [ref: > Gate.id]
  exit_gate_id int [ref: > Gate.id]
  exit_method varchar
  exit_at datetime
  calculated_fee int
  status varchar
  receipt_printed boolean
  receipt_printed_at datetime
  created_at datetime
  holiday_rate_id int [ref: > HolidayRate.id]
  updated_at datetime
  zone_id int [ref: > Zone.id]
  vehicle_id int [ref: > Vehicle.id]
  rfid_card_id int [ref: > RfidCard.id]
  fee_config_id int [ref: > FeeConfig.id]
}

Table Payment {
  id int [pk, increment]
  transaction_id int [ref: > Transaction.id]
  method varchar
  amount int
  status varchar
  cash_tendered int
  cash_change int
  midtrans_order_id varchar
  midtrans_transaction_id varchar
  qris_url text
  qris_expires_at datetime
  midtrans_status varchar
  paid_at datetime
  created_at datetime
  updated_at datetime
  handled_by_user_id int [ref: > Users.id]
}

Table MidtransCallback {
  id int [pk, increment]
  payment_id int [ref: > Payment.id]
  midtrans_order_id varchar
  raw_payload json
  signature_valid boolean
  processed boolean
  processed_at datetime
  received_at datetime
  error_message text
}

Table Refund {
  id int [pk, increment]
  payment_id int [ref: > Payment.id]
  transaction_id int [ref: > Transaction.id]
  refund_amount int
  reason text
  status varchar
  midtrans_refund_id varchar
  processed_at datetime
  created_at datetime
  updated_at datetime
  requested_by int [ref: > Users.id]
  approved_by int [ref: > Users.id]
}

Table UserLoginLogs {
  id int [pk, increment]
  user_id int [ref: > Users.id]
  ip_address varchar
  user_agent varchar
  attempt_type varchar
  success boolean
  failure_reason varchar
  attempted_at datetime
}

Table UserLoginStats {
  id int [pk, increment]
  user_id int [ref: > Users.id]
  total_attempts int
  total_failed_attempts int
  last_attempt_at datetime
  last_success_at datetime
  last_failed_ip varchar
  is_locked boolean
  locked_at datetime
  locked_reason varchar
  updated_at datetime
}

Table UserSession {
  id int [pk, increment]
  user_id int
  token_hash varchar
  ip_address varchar
  user_agent varchar
  created_at datetime
  expires_at datetime
  revoked_at datetime
}

Table AuditLogs {
  id uuid [pk]
  EventType varchar
  ActorRole varchar
  TargetType varchar
  TargetId uuid
  BeforeState varchar
  AfterState varchar
  IpAddress varchar
  UserAgent varchar
  CreatedAt datetime
  ActorId uuid
}

Table AuditLogExports {
  id uuid [pk]
  ExportFormat varchar
  FilePath varchar
  DateRangeStart datetime
  DateRangeEnd datetime
  TotalRecords int
  ExportStatus varchar
  ExportedAt datetime
  ExportedBy uuid
}

Table OcrConfigs {
  id uuid [pk]
  CreatedBy uuid
  AutoAcceptThreshold decimal
  IsActive boolean
  EffectiveFrom datetime
  CreatedAt datetime
}

Table OcrResults {
  id uuid [pk]
  OcrJobId uuid
  PlateDetected varchar
  Confidence decimal
  RawOutput varchar
  VehicleId uuid
  IsVerified boolean
  VerifiedBy uuid
  VerifiedAt datetime
  CreatedAt datetime
}

Table OcrReviewLogs {
  id uuid [pk]
  ReviewedBy uuid
  OcrResultId uuid
  OcrPlate varchar
  OcrConfidence decimal
  ManualPlate varchar
  Match boolean
  ReviewNote varchar
  ReviewedAt datetime
}

Table OverrideConfigs {
  id uuid [pk]
  EscalationNotifyUserId uuid
  CreatedBy uuid
  MaxOverridesPerDay int
  MaxOverridesPerWeek int
  IsActive boolean
  CreatedAt datetime
  UpdatedAt datetime
}