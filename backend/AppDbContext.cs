using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Level 1: Core Master Data
        public DbSet<Permission> permissions { get; set; }
        public DbSet<Role> roles { get; set; }
        public DbSet<VehicleTypes> vehicle_types { get; set; }
        public DbSet<Zone> zones { get; set; }
        public DbSet<Users> users { get; set; }
        public DbSet<Employee> employees { get; set; }
        public DbSet<OcrConfigs> ocr_configs { get; set; }
        public DbSet<OverrideConfigs> override_configs { get; set; }

        // Level 2: Master configurations
        public DbSet<HolidayRate> holiday_rates { get; set; }
        public DbSet<FeeConfig> fee_configs { get; set; }

        // Level 3: Role & User related
        public DbSet<RolePermission> role_permissions { get; set; }
        public DbSet<UserSession> user_sessions { get; set; }
        public DbSet<UserLoginLogs> user_login_logs { get; set; }
        public DbSet<UserLoginStats> user_login_stats { get; set; }

        // Level 4: Vehicle & Gate infrastructure
        public DbSet<FeeTier> fee_tiers { get; set; }
        public DbSet<Vehicle> vehicles { get; set; }
        public DbSet<RfidCard> rfid_cards { get; set; }
        public DbSet<Gate> gates { get; set; }
        public DbSet<GateDevice> gate_devices { get; set; }
        public DbSet<EnteranceTracking> enterance_trackings { get; set; }

        // Level 6: Transaction & Payment
        public DbSet<Transaction> transactions { get; set; }
        // Level 6: Payment
        public DbSet<Payment> payments { get; set; }
        public DbSet<MidtransCallback> midtrans_callbacks { get; set; }
        public DbSet<Refund> refunds { get; set; }

        // Level 6.5: Parking Tickets
        public DbSet<TicketParking> ticket_parkings { get; set; }

        // Level 7: OCR & Review
        public DbSet<OcrResults> ocr_results { get; set; }
        public DbSet<OcrReviewLogs> ocr_review_logs { get; set; }

        // Level 8: Audit & Logs
        public DbSet<AuditLogs> audit_logs { get; set; }
        public DbSet<AuditLogExports> audit_log_exports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed Permissions (5 data)
            modelBuilder.Entity<Permission>().HasData(
                new Permission { id = 1, node = "permission.view", description = "View permissions", created_at = DateTime.Now },
                new Permission { id = 2, node = "permission.create", description = "Create permissions", created_at = DateTime.Now },
                new Permission { id = 3, node = "permission.edit", description = "Edit permissions", created_at = DateTime.Now },
                new Permission { id = 4, node = "permission.delete", description = "Delete permissions", created_at = DateTime.Now },
                new Permission { id = 5, node = "zone.manage", description = "Manage zones", created_at = DateTime.Now }
            );

            // Seed Roles (5 data)
            var now = DateTime.Now;
            modelBuilder.Entity<Role>().HasData(
                new Role { id = 1, name = "Super Admin", description = "Full access to all system features", created_by = "System", created_at = now, updated_at = now },
                new Role { id = 2, name = "Admin", description = "Administrative access", created_by = "System", created_at = now, updated_at = now },
                new Role { id = 3, name = "Operator", description = "Gate and parking operator", created_by = "System", created_at = now, updated_at = now },
                new Role { id = 4, name = "Manager", description = "Zone manager and reporting", created_by = "System", created_at = now, updated_at = now },
                new Role { id = 5, name = "Viewer", description = "View-only access", created_by = "System", created_at = now, updated_at = now }
            );

            // Seed Users (5 data) - References Roles
            modelBuilder.Entity<Users>().HasData(
                new Users { id = 1, name = "Super Administrator", email = "superadmin@parkir.local", password_hash = "$2a$11$abc123hash", is_active = true, role_id = 1, created_at = now, updated_at = now },
                new Users { id = 2, name = "Admin User", email = "admin@parkir.local", password_hash = "$2a$11$def456hash", is_active = true, role_id = 2, created_at = now, updated_at = now },
                new Users { id = 3, name = "Gate Operator 1", email = "operator1@parkir.local", password_hash = "$2a$11$ghi789hash", is_active = true, role_id = 3, created_at = now, updated_at = now },
                new Users { id = 4, name = "Zone Manager", email = "manager@parkir.local", password_hash = "$2a$11$jkl012hash", is_active = true, role_id = 4, created_at = now, updated_at = now },
                new Users { id = 5, name = "Viewer User", email = "viewer@parkir.local", password_hash = "$2a$11$mno345hash", is_active = true, role_id = 5, created_at = now, updated_at = now }
            );

            // Seed VehicleTypes (5 data)
            modelBuilder.Entity<VehicleTypes>().HasData(
                new VehicleTypes { id = 1, name = "Motor", minimum_fee = 5000, description = "Motorcycle/Scooter", created_at = now },
                new VehicleTypes { id = 2, name = "Mobil", minimum_fee = 10000, description = "Car/Sedan", created_at = now },
                new VehicleTypes { id = 3, name = "Bus", minimum_fee = 25000, description = "Bus/Large Vehicle", created_at = now },
                new VehicleTypes { id = 4, name = "Truck", minimum_fee = 20000, description = "Truck/Pickup", created_at = now },
                new VehicleTypes { id = 5, name = "Kendaraan Khusus", minimum_fee = 15000, description = "Special vehicles", created_at = now }
            );

            // Seed Zones (5 data)
            modelBuilder.Entity<Zone>().HasData(
                new Zone { id = 1, name = "Zona A - Lantai 1", description = "Ground floor parking zone", capacity = 100, additional_fee = 0, is_active = true, created_by = "System", created_at = now, updated_at = now },
                new Zone { id = 2, name = "Zona B - Lantai 2", description = "Second floor parking zone", capacity = 150, additional_fee = 2000, is_active = true, created_by = "System", created_at = now, updated_at = now },
                new Zone { id = 3, name = "Zona C - Lantai 3", description = "Third floor parking zone", capacity = 120, additional_fee = 3000, is_active = true, created_by = "System", created_at = now, updated_at = now },
                new Zone { id = 4, name = "Zona D - Outdoor", description = "Outdoor parking area", capacity = 200, additional_fee = 0, is_active = true, created_by = "System", created_at = now, updated_at = now },
                new Zone { id = 5, name = "Zona E - VIP", description = "VIP parking zone with premium services", capacity = 50, additional_fee = 10000, is_active = true, created_by = "System", created_at = now, updated_at = now }
            );

            // Seed RolePermissions (5 data minimum - Super Admin gets all permissions)
            modelBuilder.Entity<RolePermission>().HasData(
                new RolePermission { id = 1, role_id = 1, permission_id = 1, granted_by = "System", granted_at = now },
                new RolePermission { id = 2, role_id = 1, permission_id = 2, granted_by = "System", granted_at = now },
                new RolePermission { id = 3, role_id = 1, permission_id = 3, granted_by = "System", granted_at = now },
                new RolePermission { id = 4, role_id = 1, permission_id = 4, granted_by = "System", granted_at = now },
                new RolePermission { id = 5, role_id = 1, permission_id = 5, granted_by = "System", granted_at = now }
            );

            // // Seed OcrConfigs (5 data)
            // var guid1 = Guid.Parse("00000000-0000-0000-0000-000000000001");
            // var guid2 = Guid.Parse("00000000-0000-0000-0000-000000000002");
            // var guid3 = Guid.Parse("00000000-0000-0000-0000-000000000003");
            // var guid4 = Guid.Parse("00000000-0000-0000-0000-000000000004");
            // var guid5 = Guid.Parse("00000000-0000-0000-0000-000000000005");

            // modelBuilder.Entity<OcrConfigs>().HasData(
            //     new OcrConfigs { Id = guid1, CreatedBy = guid1, AutoAcceptThreshold = 0.95m, IsActive = true, EffectiveFrom = now, CreatedAt = now },
            //     new OcrConfigs { Id = guid2, CreatedBy = guid2, AutoAcceptThreshold = 0.90m, IsActive = false, EffectiveFrom = now.AddDays(-30), CreatedAt = now.AddDays(-30) },
            //     new OcrConfigs { Id = guid3, CreatedBy = guid3, AutoAcceptThreshold = 0.92m, IsActive = true, EffectiveFrom = now.AddDays(-15), CreatedAt = now.AddDays(-15) },
            //     new OcrConfigs { Id = guid4, CreatedBy = guid4, AutoAcceptThreshold = 0.88m, IsActive = false, EffectiveFrom = now.AddDays(-60), CreatedAt = now.AddDays(-60) },
            //     new OcrConfigs { Id = guid5, CreatedBy = guid5, AutoAcceptThreshold = 0.97m, IsActive = true, EffectiveFrom = now.AddDays(-7), CreatedAt = now.AddDays(-7) }
            // );

            // // Seed OverrideConfigs (5 data)
            // var guidO1 = Guid.Parse("10000000-0000-0000-0000-000000000001");
            // var guidO2 = Guid.Parse("10000000-0000-0000-0000-000000000002");
            // var guidO3 = Guid.Parse("10000000-0000-0000-0000-000000000003");
            // var guidO4 = Guid.Parse("10000000-0000-0000-0000-000000000004");
            // var guidO5 = Guid.Parse("10000000-0000-0000-0000-000000000005");

            // modelBuilder.Entity<OverrideConfigs>().HasData(
            //     new OverrideConfigs { Id = guidO1, EscalationNotifyUserId = guidO1, CreatedBy = guidO1, MaxOverridesPerDay = 10, MaxOverridesPerWeek = 50, IsActive = true, CreatedAt = now, UpdatedAt = now },
            //     new OverrideConfigs { Id = guidO2, EscalationNotifyUserId = guidO2, CreatedBy = guidO2, MaxOverridesPerDay = 15, MaxOverridesPerWeek = 75, IsActive = true, CreatedAt = now, UpdatedAt = now },
            //     new OverrideConfigs { Id = guidO3, EscalationNotifyUserId = guidO3, CreatedBy = guidO3, MaxOverridesPerDay = 5, MaxOverridesPerWeek = 25, IsActive = false, CreatedAt = now, UpdatedAt = now },
            //     new OverrideConfigs { Id = guidO4, EscalationNotifyUserId = guidO4, CreatedBy = guidO4, MaxOverridesPerDay = 20, MaxOverridesPerWeek = 100, IsActive = true, CreatedAt = now, UpdatedAt = now },
            //     new OverrideConfigs { Id = guidO5, EscalationNotifyUserId = guidO5, CreatedBy = guidO5, MaxOverridesPerDay = 8, MaxOverridesPerWeek = 40, IsActive = true, CreatedAt = now, UpdatedAt = now }
            // );

            // Seed HolidayRates (5 data) - References Zones & VehicleTypes
            modelBuilder.Entity<HolidayRate>().HasData(
                new HolidayRate { id = 1, name = "Lebaran 2026", date_start = new DateTime(2026, 4, 10), date_aend = new DateTime(2026, 4, 14), rate_type = "multiplier", multiplier = 1.5f, override_fee = 0, created_by = "System", applies_to_zone_id = 1, applies_to_vehicle_type_id = 2, created_at = now, updated_at = now },
                new HolidayRate { id = 2, name = "Tahun Baru", date_start = new DateTime(2026, 1, 1), date_aend = new DateTime(2026, 1, 3), rate_type = "override", multiplier = 1f, override_fee = 25000, created_by = "System", applies_to_zone_id = 5, applies_to_vehicle_type_id = 1, created_at = now, updated_at = now },
                new HolidayRate { id = 3, name = "Hari Raya", date_start = new DateTime(2026, 4, 18), date_aend = new DateTime(2026, 4, 20), rate_type = "multiplier", multiplier = 2.0f, override_fee = 0, created_by = "System", applies_to_zone_id = 2, applies_to_vehicle_type_id = 3, created_at = now, updated_at = now },
                new HolidayRate { id = 4, name = "Malam Tahun Baru", date_start = new DateTime(2025, 12, 31), date_aend = new DateTime(2026, 1, 1), rate_type = "override", multiplier = 1f, override_fee = 50000, created_by = "System", applies_to_zone_id = 5, applies_to_vehicle_type_id = 2, created_at = now, updated_at = now },
                new HolidayRate { id = 5, name = "Libur Nasional", date_start = new DateTime(2026, 5, 1), date_aend = new DateTime(2026, 5, 3), rate_type = "multiplier", multiplier = 1.3f, override_fee = 0, created_by = "System", applies_to_zone_id = 3, applies_to_vehicle_type_id = 4, created_at = now, updated_at = now }
            );

            // Seed Gates (5 data) - References Zones
            modelBuilder.Entity<Gate>().HasData(
                new Gate { id = 1, name = "Gate A1 - Entrance", gate_type = "entrance", location_desc = "Main entrance gate Zona A", zone_id = 1, is_active = true, created_by = "System", created_at = now.AddDays(-30), updated_at = now.AddDays(-30) },
                new Gate { id = 2, name = "Gate A2 - Exit", gate_type = "exit", location_desc = "Main exit gate Zona A", zone_id = 1, is_active = true, created_by = "System", created_at = now.AddDays(-30), updated_at = now.AddDays(-25) },
                new Gate { id = 3, name = "Gate B1 - Entrance", gate_type = "entrance", location_desc = "Second floor entrance Zona B", zone_id = 2, is_active = true, created_by = "System", created_at = now.AddDays(-20), updated_at = now.AddDays(-20) },
                new Gate { id = 4, name = "Gate C1 - Entrance", gate_type = "entrance", location_desc = "Third floor entrance Zona C", zone_id = 3, is_active = true, created_by = "System", created_at = now.AddDays(-15), updated_at = now.AddDays(-10) },
                new Gate { id = 5, name = "Gate E1 - VIP", gate_type = "entrance", location_desc = "Premium VIP entrance Zona E", zone_id = 5, is_active = true, created_by = "System", created_at = now.AddDays(-5), updated_at = now }
            );

            // Seed GateDevices (5 data) - References Gates
            modelBuilder.Entity<GateDevice>().HasData(
                new GateDevice { id = 1, gate_id = 1, device_type = "RFID_READER", status = true, las_ping_at = now, error_message = null, created_at = now, updated_at = now },
                new GateDevice { id = 2, gate_id = 2, device_type = "BARRIER_ARM", status = true, las_ping_at = now, error_message = null, created_at = now, updated_at = now },
                new GateDevice { id = 3, gate_id = 3, device_type = "RFID_READER", status = true, las_ping_at = now, error_message = null, created_at = now, updated_at = now },
                new GateDevice { id = 4, gate_id = 4, device_type = "BARRIER_ARM", status = false, las_ping_at = now, error_message = "Connection timeout", created_at = now, updated_at = now },
                new GateDevice { id = 5, gate_id = 5, device_type = "CAMERA", status = true, las_ping_at = now, error_message = null, created_at = now, updated_at = now }
            );

            // Seed FeeConfigs (5 data) - References Zones, VehicleTypes, Users
            var nowOffset = DateTimeOffset.UtcNow;
            modelBuilder.Entity<FeeConfig>().HasData(
                new FeeConfig { id = 1, zone_id = 1, vehicle_type_id = 2, created_by = 1, base_fee = 10000, grace_period_minutes = 15, is_active = true, effective_from = nowOffset, effective_until = null, created_at = nowOffset, updated_at = nowOffset },
                new FeeConfig { id = 2, zone_id = 1, vehicle_type_id = 1, created_by = 1, base_fee = 5000, grace_period_minutes = 10, is_active = true, effective_from = nowOffset, effective_until = null, created_at = nowOffset, updated_at = nowOffset },
                new FeeConfig { id = 3, zone_id = 5, vehicle_type_id = 2, created_by = 1, base_fee = 20000, grace_period_minutes = 20, is_active = true, effective_from = nowOffset, effective_until = null, created_at = nowOffset, updated_at = nowOffset },
                new FeeConfig { id = 4, zone_id = 2, vehicle_type_id = 3, created_by = 2, base_fee = 25000, grace_period_minutes = 30, is_active = true, effective_from = nowOffset, effective_until = null, created_at = nowOffset, updated_at = nowOffset },
                new FeeConfig { id = 5, zone_id = 3, vehicle_type_id = 4, created_by = 2, base_fee = 20000, grace_period_minutes = 15, is_active = true, effective_from = nowOffset, effective_until = null, created_at = nowOffset, updated_at = nowOffset }
            );

            // Seed FeeTiers (5 data minimum, 1 per FeeConfig) - References FeeConfigs
            modelBuilder.Entity<FeeTier>().HasData(
                new FeeTier { id = 1, fee_config_id = 1, tier_order = 1, duration_minutes = 60, fee_amount = 10000, is_last_tier = true },
                new FeeTier { id = 2, fee_config_id = 2, tier_order = 1, duration_minutes = 60, fee_amount = 5000, is_last_tier = true },
                new FeeTier { id = 3, fee_config_id = 3, tier_order = 1, duration_minutes = 60, fee_amount = 20000, is_last_tier = true },
                new FeeTier { id = 4, fee_config_id = 4, tier_order = 1, duration_minutes = 60, fee_amount = 25000, is_last_tier = true },
                new FeeTier { id = 5, fee_config_id = 5, tier_order = 1, duration_minutes = 60, fee_amount = 20000, is_last_tier = true }
            );

            // Seed Employees (5 data) - References Roles
            modelBuilder.Entity<Employee>().HasData(
                new Employee { id = 1, name = "Budi Santoso", role_id = 3, created_at = DateTimeOffset.UtcNow, updated_at = DateTimeOffset.UtcNow, deleted_at = null },
                new Employee { id = 2, name = "Siti Nurhaliza", role_id = 3, created_at = DateTimeOffset.UtcNow, updated_at = DateTimeOffset.UtcNow, deleted_at = null },
                new Employee { id = 3, name = "Ahmad Wijaya", role_id = 3, created_at = DateTimeOffset.UtcNow, updated_at = DateTimeOffset.UtcNow, deleted_at = null },
                new Employee { id = 4, name = "Rina Kusuma", role_id = 4, created_at = DateTimeOffset.UtcNow, updated_at = DateTimeOffset.UtcNow, deleted_at = null },
                new Employee { id = 5, name = "Dedi Gunawan", role_id = 3, created_at = DateTimeOffset.UtcNow, updated_at = DateTimeOffset.UtcNow, deleted_at = null }
            );

            // Seed Vehicles (5 data) - References VehicleTypes
            modelBuilder.Entity<Vehicle>().HasData(
                new Vehicle { id = 1, plate_number = "B 1234 ABC", vehicle_type_id = 2, source = "Manual", notes = "Red Sedan", created_at = now, updated_at = now },
                new Vehicle { id = 2, plate_number = "B 5678 XYZ", vehicle_type_id = 1, source = "RFID", notes = "Black Motorcycle", created_at = now, updated_at = now },
                new Vehicle { id = 3, plate_number = "B 9012 DEF", vehicle_type_id = 3, source = "Manual", notes = "White Bus", created_at = now, updated_at = now },
                new Vehicle { id = 4, plate_number = "B 3456 GHI", vehicle_type_id = 4, source = "OCR", notes = "Blue Truck", created_at = now, updated_at = now },
                new Vehicle { id = 5, plate_number = "B 7890 JKL", vehicle_type_id = 2, source = "Manual", notes = "Silver Car", created_at = now, updated_at = now }
            );

            // Seed RFIDCards (5 data) - References Vehicles & Employees
            modelBuilder.Entity<RfidCard>().HasData(
                new RfidCard { id = 1, card_uid = "08D4B2C0", vehicle_id = 1, is_guest = false, is_member = true, employee_id = null, deactivated_by = null, created_at = now.AddDays(-30), deactivated_at = null },
                new RfidCard { id = 2, card_uid = "08D4B2C1", vehicle_id = 2, is_guest = false, is_member = true, employee_id = null, deactivated_by = null, created_at = now.AddDays(-20), deactivated_at = null },
                new RfidCard { id = 3, card_uid = "08D4B2C2", vehicle_id = 3, is_guest = true, is_member = false, employee_id = null, deactivated_by = null, created_at = now.AddDays(-15), deactivated_at = null },
                new RfidCard { id = 4, card_uid = "08D4B2C3", vehicle_id = null, is_guest = false, is_member = false, employee_id = 1, deactivated_by = null, created_at = now.AddDays(-10), deactivated_at = null },
                new RfidCard { id = 5, card_uid = "08D4B2C4", vehicle_id = null, is_guest = false, is_member = false, employee_id = 2, deactivated_by = null, created_at = now.AddDays(-5), deactivated_at = null }
            );

            // Seed EnteranceTracking (5 data) - References RfidCard, TicketParking & Gate
            modelBuilder.Entity<EnteranceTracking>().HasData(
                new EnteranceTracking { id = 1, rfid_card_id = 1, ticket_id = null, gate_id = 1, in_at = now.AddDays(-2), out_at = now.AddDays(-2).AddHours(2), created_at = now.AddDays(-2) },
                new EnteranceTracking { id = 2, rfid_card_id = 2, ticket_id = null, gate_id = 3, in_at = now.AddDays(-1).AddHours(-13).AddMinutes(-30), out_at = null, created_at = now.AddDays(-1).AddHours(-13).AddMinutes(-30) },
                new EnteranceTracking { id = 3, rfid_card_id = 3, ticket_id = null, gate_id = 1, in_at = now.AddDays(-2).AddHours(-3), out_at = now.AddDays(-2).AddHours(-1), created_at = now.AddDays(-2).AddHours(-3) },
                new EnteranceTracking { id = 4, rfid_card_id = 4, ticket_id = null, gate_id = 5, in_at = now.AddDays(-3).AddHours(-4), out_at = now.AddDays(-2).AddHours(-22), created_at = now.AddDays(-3).AddHours(-4) },
                new EnteranceTracking { id = 5, rfid_card_id = 5, ticket_id = null, gate_id = 4, in_at = now.AddDays(-3).AddHours(-15).AddMinutes(-15), out_at = now.AddDays(-2).AddHours(-23).AddMinutes(-30), created_at = now.AddDays(-3).AddHours(-15).AddMinutes(-15) }
            );

            // // Seed UserSessions (5 data) - References Users
            // modelBuilder.Entity<UserSession>().HasData(
            //     new UserSession { id = 1, user_id = 1, token_hash = "hash1token", ip_address = "192.168.1.1", user_agent = "Mozilla/5.0", created_at = now, expires_at = now.AddHours(24), revoked_at = null },
            //     new UserSession { id = 2, user_id = 2, token_hash = "hash2token", ip_address = "192.168.1.2", user_agent = "Mozilla/5.0", created_at = now, expires_at = now.AddHours(24), revoked_at = null },
            //     new UserSession { id = 3, user_id = 3, token_hash = "hash3token", ip_address = "192.168.1.3", user_agent = "Mozilla/5.0", created_at = now, expires_at = now.AddHours(24), revoked_at = null },
            //     new UserSession { id = 4, user_id = 4, token_hash = "hash4token", ip_address = "192.168.1.4", user_agent = "Mozilla/5.0", created_at = now, expires_at = now.AddHours(24), revoked_at = null },
            //     new UserSession { id = 5, user_id = 5, token_hash = "hash5token", ip_address = "192.168.1.5", user_agent = "Mozilla/5.0", created_at = now, expires_at = now.AddHours(24), revoked_at = null }
            // );

            // // Seed UserLoginLogs (5 data) - References Users
            // modelBuilder.Entity<UserLoginLogs>().HasData(
            //     new UserLoginLogs { id = 1, user_id = 1, ip_address = "192.168.1.1", user_agent = "Mozilla/5.0", attempt_type = "web", success = true, failure_reason = null, attempted_at = now },
            //     new UserLoginLogs { id = 2, user_id = 2, ip_address = "192.168.1.2", user_agent = "Mozilla/5.0", attempt_type = "web", success = true, failure_reason = null, attempted_at = now.AddHours(-1) },
            //     new UserLoginLogs { id = 3, user_id = 3, ip_address = "192.168.1.3", user_agent = "Mozilla/5.0", attempt_type = "mobile", success = false, failure_reason = "Invalid password", attempted_at = now.AddHours(-2) },
            //     new UserLoginLogs { id = 4, user_id = 4, ip_address = "192.168.1.4", user_agent = "Mozilla/5.0", attempt_type = "web", success = true, failure_reason = null, attempted_at = now.AddHours(-3) },
            //     new UserLoginLogs { id = 5, user_id = 5, ip_address = "192.168.1.5", user_agent = "Mozilla/5.0", attempt_type = "api", success = true, failure_reason = null, attempted_at = now.AddHours(-4) }
            // );

            // // Seed UserLoginStats (5 data) - References Users
            // modelBuilder.Entity<UserLoginStats>().HasData(
            //     new UserLoginStats { id = 1, user_id = 1, total_attempts = 10, total_failed_attempts = 0, last_attempt_at = now, last_success_at = now, last_failed_ip = null, is_locked = false, locked_at = now, locked_reason = null, updated_at = now },
            //     new UserLoginStats { id = 2, user_id = 2, total_attempts = 8, total_failed_attempts = 1, last_attempt_at = now.AddHours(-1), last_success_at = now.AddHours(-1), last_failed_ip = null, is_locked = false, locked_at = now, locked_reason = null, updated_at = now },
            //     new UserLoginStats { id = 3, user_id = 3, total_attempts = 5, total_failed_attempts = 2, last_attempt_at = now.AddHours(-2), last_success_at = now.AddHours(-5), last_failed_ip = "192.168.1.3", is_locked = false, locked_at = now, locked_reason = null, updated_at = now },
            //     new UserLoginStats { id = 4, user_id = 4, total_attempts = 12, total_failed_attempts = 0, last_attempt_at = now.AddHours(-3), last_success_at = now.AddHours(-3), last_failed_ip = null, is_locked = false, locked_at = now, locked_reason = null, updated_at = now },
            //     new UserLoginStats { id = 5, user_id = 5, total_attempts = 6, total_failed_attempts = 0, last_attempt_at = now.AddHours(-4), last_success_at = now.AddHours(-4), last_failed_ip = null, is_locked = false, locked_at = now, locked_reason = null, updated_at = now }
            // );

            // // Seed Transactions (5 data)
            // modelBuilder.Entity<Transaction>().HasData(
            //     new Transaction { id = 1, transaction_code = "TRX001", entry_method = "RFID", entry_qr_code = "QR001", entry_at = now.AddHours(-2), entry_photo_url = "photo1.jpg", entry_gate_id = 1, exit_gate_id = 2, exit_method = "RFID", exit_at = now, calculated_fee = 10000, status = "completed", receipt_printed = true, receipt_printed_at = now, created_at = now },
            //     new Transaction { id = 2, transaction_code = "TRX002", entry_method = "RFID", entry_qr_code = "QR002", entry_at = now.AddHours(-1), entry_photo_url = "photo2.jpg", entry_gate_id = 1, exit_gate_id = 2, exit_method = "MANUAL", exit_at = now, calculated_fee = 5000, status = "completed", receipt_printed = true, receipt_printed_at = now, created_at = now },
            //     new Transaction { id = 3, transaction_code = "TRX003", entry_method = "OCR", entry_qr_code = "QR003", entry_at = now.AddHours(-3), entry_photo_url = "photo3.jpg", entry_gate_id = 3, exit_gate_id = 4, exit_method = "MANUAL", exit_at = null, calculated_fee = 0, status = "pending", receipt_printed = false, receipt_printed_at = null, created_at = now },
            //     new Transaction { id = 4, transaction_code = "TRX004", entry_method = "RFID", entry_qr_code = "QR004", entry_at = now.AddHours(-4), entry_photo_url = "photo4.jpg", entry_gate_id = 2, exit_gate_id = 5, exit_method = "RFID", exit_at = now, calculated_fee = 20000, status = "completed", receipt_printed = true, receipt_printed_at = now, created_at = now },
            //     new Transaction { id = 5, transaction_code = "TRX005", entry_method = "OCR", entry_qr_code = "QR005", entry_at = now.AddHours(-5), entry_photo_url = "photo5.jpg", entry_gate_id = 4, exit_gate_id = 5, exit_method = "OCR", exit_at = now, calculated_fee = 25000, status = "completed", receipt_printed = true, receipt_printed_at = now, created_at = now }
            // );

            // // Seed Payments (5 data)
            // modelBuilder.Entity<Payment>().HasData(
            //     new Payment { id = 1, transaction_id = 1, method = "cash", amount = 10000, status = "paid", cash_tendered = 10000, cash_change = 0, midtrans_order_id = "MID001", midtrans_transaction_id = null, qris_url = null, qris_expires_at = null, midtrans_status = null, paid_at = now, created_at = now, updated_at = now },
            //     new Payment { id = 2, transaction_id = 2, method = "qris", amount = 5000, status = "pending", cash_tendered = 0, cash_change = 0, midtrans_order_id = "MID002", midtrans_transaction_id = null, qris_url = "qris_001.png", qris_expires_at = now.AddMinutes(5), midtrans_status = "pending", paid_at = null, created_at = now, updated_at = now },
            //     new Payment { id = 3, transaction_id = 3, method = "card", amount = 0, status = "unpaid", cash_tendered = 0, cash_change = 0, midtrans_order_id = "MID003", midtrans_transaction_id = null, qris_url = null, qris_expires_at = null, midtrans_status = "pending", paid_at = null, created_at = now, updated_at = now },
            //     new Payment { id = 4, transaction_id = 4, method = "cash", amount = 20000, status = "paid", cash_tendered = 20000, cash_change = 0, midtrans_order_id = "MID004", midtrans_transaction_id = null, qris_url = null, qris_expires_at = null, midtrans_status = null, paid_at = now, created_at = now, updated_at = now },
            //     new Payment { id = 5, transaction_id = 5, method = "qris", amount = 25000, status = "paid", cash_tendered = 0, cash_change = 0, midtrans_order_id = "MID005", midtrans_transaction_id = "MTX005", qris_url = "qris_005.png", qris_expires_at = now.AddMinutes(10), midtrans_status = "settlement", paid_at = now, created_at = now, updated_at = now }
            // );

            // // Seed TicketParkings (5 data)
            // modelBuilder.Entity<TicketParking>().HasData(
            //     new TicketParking { id = 1, ticket_code = "TKT001", vehicle_plate = "B 1234 ABC", entry_time = now.AddHours(-2), exit_time = now, fee = 10000, status = "paid", created_at = now },
            //     new TicketParking { id = 2, ticket_code = "TKT002", vehicle_plate = "B 5678 XYZ", entry_time = now.AddHours(-1), exit_time = now, fee = 5000, status = "paid", created_at = now },
            //     new TicketParking { id = 3, ticket_code = "TKT003", vehicle_plate = "B 9012 DEF", entry_time = now.AddHours(-3), exit_time = null, fee = 0, status = "active", created_at = now },
            //     new TicketParking { id = 4, ticket_code = "TKT004", vehicle_plate = "B 3456 GHI", entry_time = now.AddHours(-4), exit_time = now, fee = 20000, status = "paid", created_at = now },
            //     new TicketParking { id = 5, ticket_code = "TKT005", vehicle_plate = "B 7890 JKL", entry_time = now.AddHours(-5), exit_time = now, fee = 25000, status = "paid", created_at = now }
            // );

            // // Seed OcrResults (5 data)
            // modelBuilder.Entity<OcrResults>().HasData(
            //     new OcrResults { id = 1, image_url = "ocr_img_001.jpg", recognized_plate = "B 1234 ABC", confidence_score = 0.98f, status = "verified", created_at = now },
            //     new OcrResults { id = 2, image_url = "ocr_img_002.jpg", recognized_plate = "B 5678 XYZ", confidence_score = 0.95f, status = "verified", created_at = now },
            //     new OcrResults { id = 3, image_url = "ocr_img_003.jpg", recognized_plate = "B 9012 DEF", confidence_score = 0.87f, status = "unverified", created_at = now },
            //     new OcrResults { id = 4, image_url = "ocr_img_004.jpg", recognized_plate = "B 3456 GHI", confidence_score = 0.92f, status = "verified", created_at = now },
            //     new OcrResults { id = 5, image_url = "ocr_img_005.jpg", recognized_plate = "B 7890 JKL", confidence_score = 0.89f, status = "verified", created_at = now }
            // );

            // // Seed OcrReviewLogs (5 data)
            // modelBuilder.Entity<OcrReviewLogs>().HasData(
            //     new OcrReviewLogs { id = 1, ocr_result_id = 1, reviewed_by = "System", status = "approved", notes = "Good quality", created_at = now },
            //     new OcrReviewLogs { id = 2, ocr_result_id = 2, reviewed_by = "System", status = "approved", notes = "Good quality", created_at = now },
            //     new OcrReviewLogs { id = 3, ocr_result_id = 3, reviewed_by = "admin@parkir.local", status = "rejected", notes = "Blurry image", created_at = now },
            //     new OcrReviewLogs { id = 4, ocr_result_id = 4, reviewed_by = "System", status = "approved", notes = "Good quality", created_at = now },
            //     new OcrReviewLogs { id = 5, ocr_result_id = 5, reviewed_by = "System", status = "approved", notes = "Good quality", created_at = now }
            // );

            // // Seed AuditLogs (5 data)
            // modelBuilder.Entity<AuditLogs>().HasData(
            //     new AuditLogs { id = 1, user_id = 1, action = "CREATE", entity_type = "User", entity_id = 2, changes = "Created new admin user", ip_address = "192.168.1.1", created_at = now },
            //     new AuditLogs { id = 2, user_id = 2, action = "UPDATE", entity_type = "Zone", entity_id = 1, changes = "Updated zone capacity", ip_address = "192.168.1.2", created_at = now },
            //     new AuditLogs { id = 3, user_id = 1, action = "DELETE", entity_type = "User", entity_id = 5, changes = "Deleted viewer account", ip_address = "192.168.1.1", created_at = now },
            //     new AuditLogs { id = 4, user_id = 3, action = "READ", entity_type = "Transaction", entity_id = 1, changes = "Viewed transaction details", ip_address = "192.168.1.3", created_at = now },
            //     new AuditLogs { id = 5, user_id = 4, action = "UPDATE", entity_type = "Payment", entity_id = 2, changes = "Updated payment status", ip_address = "192.168.1.4", created_at = now }
            // );

            // // Seed AuditLogExports (5 data)
            // modelBuilder.Entity<AuditLogExports>().HasData(
            //     new AuditLogExports { id = 1, exported_by = 1, file_path = "/exports/audit_2026_01.csv", start_date = new DateTime(2026, 1, 1), end_date = new DateTime(2026, 1, 31), total_records = 1000, status = "completed", created_at = now },
            //     new AuditLogExports { id = 2, exported_by = 2, file_path = "/exports/audit_2026_02.csv", start_date = new DateTime(2026, 2, 1), end_date = new DateTime(2026, 2, 28), total_records = 950, status = "completed", created_at = now },
            //     new AuditLogExports { id = 3, exported_by = 1, file_path = "/exports/audit_2026_03.csv", start_date = new DateTime(2026, 3, 1), end_date = new DateTime(2026, 3, 31), total_records = 1100, status = "completed", created_at = now },
            //     new AuditLogExports { id = 4, exported_by = 4, file_path = "/exports/audit_2026_04.csv", start_date = new DateTime(2026, 4, 1), end_date = new DateTime(2026, 4, 8), total_records = 250, status = "pending", created_at = now },
            //     new AuditLogExports { id = 5, exported_by = 2, file_path = "/exports/audit_2026_q1.csv", start_date = new DateTime(2026, 1, 1), end_date = new DateTime(2026, 3, 31), total_records = 3050, status = "completed", created_at = now }
            // );
        }
    }
}