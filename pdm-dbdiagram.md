Table AuditLogExports {
  Id uuid [pk]
  ExportFormat varchar
  FilePath varchar
  DateRangeStart datetime
  DateRangeEnd datetime
  TotalRecords int
  ExportStatus varchar
  ExportedAt datetime
  ExportedBy uuid
}

Table AuditLogs {
  Id uuid [pk]
  EventType varchar
  ActorRole varchar
  TargetType varchar
  TargetId uuid
  BeforeState text
  AfterState text
  IpAddress varchar
  UserAgent text
  CreatedAt datetime
  ActorId uuid
}

Table Employee {
  id int [pk, increment]
  name varchar
  role_id int [ref: > Role.id]
  created_at datetime
  updated_at datetime
  deleted_at datetime
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

Table Gate {
  id int [pk, increment]
  created_by varchar
  zone_id int [ref: > Zone.id]
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
  uniqUrl varchar
  device_type varchar
  status boolean
  las_ping_at datetime
  error_message text
  created_at datetime
  updated_at datetime
}

Table GateDeviceAds {
  id int [pk, increment]
  gate_device_id int [ref: > GateDevice.id]
  image text
  title varchar
  company varchar
  created_at datetime
  updated_at datetime
  deleted_at datetime
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

Table MembershipPackage {
  id int [pk, increment]
  package_name varchar
  price int
  time_period_month int
  is_active boolean
  created_at datetime
  updated_at datetime
  deleted_at datetime
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

Table Permission {
  id int [pk, increment]
  node varchar [unique]
  description varchar
  created_at datetime
}

Table RfidCard {
  id int [pk, increment]
  card_uid varchar
  vehicle_id int [ref: > Vehicle.id]
  is_guest boolean
  is_member boolean
  employee_id int [ref: > Employee.id]
  pic_tenant_id int [ref: > TenantMember.id]
  deactivated_by varchar
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

Table RolePermission {
  id int [pk, increment]
  granted_by varchar
  role_id int [ref: > Role.id]
  permission_id int [ref: > Permission.id]
  granted_at datetime
}

Table TenantMember {
  id int [pk, increment]
  pic varchar
  tenant_name varchar
  status_membership varchar
  total_bill int
  total_current_payment int
  is_active boolean
  membership_id int [ref: > MembershipPackage.id]
  start_at datetime
  due_at datetime
  created_at datetime
  updated_at datetime
  deleted_at datetime
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
  total_payment int
  status varchar
  receipt_printed boolean
  receipt_printed_at datetime
  vehicle_type_id int [ref: > VehicleTypes.id]
  holiday_rate_id int [ref: > HolidayRate.id]
  zone_id int [ref: > Zone.id]
  member_vehicle_id int [ref: > Vehicle.id]
  rfid_card_id int [ref: > RfidCard.id]
  fee_config_id int [ref: > FeeConfig.id]
  created_at datetime
  updated_at datetime
}

Table UserLoginLogs {
  id int [pk, increment]
  user_id int [ref: > Users.id]
  ip_address varchar
  user_agent text
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

Table UserSession {
  id int [pk, increment]
  user_id int [ref: > Users.id]
  refresh_token text
  ip_address varchar
  user_agent text
  created_at datetime
  expires_at datetime
  revoked_at datetime
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

Table VehicleTypes {
  id int [pk, increment]
  name varchar
  minimum_fee int
  description varchar
  created_at datetime
}

Table Zone {
  id int [pk, increment]
  created_by varchar
  name varchar
  description varchar
  additional_fee int
  is_active boolean
  created_at datetime
  updated_at datetime
}