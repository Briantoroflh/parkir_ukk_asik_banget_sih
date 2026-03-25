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

        // Level 5: Transaction & Payment
        public DbSet<Transaction> transactions { get; set; }
        public DbSet<Payment> payments { get; set; }
        public DbSet<MidtransCallback> midtrans_callbacks { get; set; }
        public DbSet<Refund> refunds { get; set; }

        // Level 6: OCR & Review
        public DbSet<OcrResults> ocr_results { get; set; }
        public DbSet<OcrReviewLogs> ocr_review_logs { get; set; }

        // Level 7: Audit & Logs
        public DbSet<AuditLogs> audit_logs { get; set; }
        public DbSet<AuditLogExports> audit_log_exports { get; set; }
    }
}