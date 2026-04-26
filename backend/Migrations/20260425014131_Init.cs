using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "audit_log_exports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ExportFormat = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FilePath = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DateRangeStart = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DateRangeEnd = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    TotalRecords = table.Column<int>(type: "int", nullable: false),
                    ExportStatus = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExportedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ExportedBy = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_log_exports", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    EventType = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ActorRole = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TargetType = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TargetId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    BeforeState = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AfterState = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IpAddress = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserAgent = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ActorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_logs", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "employees",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    role_id = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employees", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "gate_device_ads",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    gate_device_id = table.Column<int>(type: "int", nullable: false),
                    image = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    title = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    company = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_gate_device_ads", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "gate_devices",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    gate_id = table.Column<int>(type: "int", nullable: false),
                    uniqUrl = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    device_type = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    las_ping_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    error_message = table.Column<string>(type: "text", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_gate_devices", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "gates",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    created_by = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    zone_id = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    gate_type = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    location_desc = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_gates", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "membership_packages",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    package_name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    price = table.Column<int>(type: "int", nullable: false),
                    time_period_month = table.Column<int>(type: "int", nullable: false),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_membership_packages", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "permissions",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    node = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_permissions", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    created_by = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_sessions",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    refresh_token = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ip_address = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    user_agent = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    expires_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    revoked_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_sessions", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "vehicle_types",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    minimum_fee = table.Column<int>(type: "int", nullable: false),
                    description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vehicle_types", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "zones",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    created_by = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    additional_fee = table.Column<int>(type: "int", nullable: false),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_zones", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "role_permissions",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    granted_by = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    role_id = table.Column<int>(type: "int", nullable: false),
                    permission_id = table.Column<int>(type: "int", nullable: false),
                    granted_at = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role_permissions", x => x.id);
                    table.ForeignKey(
                        name: "FK_role_permissions_permissions_permission_id",
                        column: x => x.permission_id,
                        principalTable: "permissions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_role_permissions_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    password_hash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    role_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                    table.ForeignKey(
                        name: "FK_users_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "vehicles",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    plate_number = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vehicle_type_id = table.Column<int>(type: "int", nullable: false),
                    source = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    notes = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vehicles", x => x.id);
                    table.ForeignKey(
                        name: "FK_vehicles_vehicle_types_vehicle_type_id",
                        column: x => x.vehicle_type_id,
                        principalTable: "vehicle_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "holiday_rates",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    created_by = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    date_start = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    date_aend = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    rate_type = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    multiplier = table.Column<float>(type: "float", nullable: false),
                    override_fee = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    applies_to_zone_id = table.Column<int>(type: "int", nullable: false),
                    applies_to_vehicle_type_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_holiday_rates", x => x.id);
                    table.ForeignKey(
                        name: "FK_holiday_rates_vehicle_types_applies_to_vehicle_type_id",
                        column: x => x.applies_to_vehicle_type_id,
                        principalTable: "vehicle_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_holiday_rates_zones_applies_to_zone_id",
                        column: x => x.applies_to_zone_id,
                        principalTable: "zones",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "fee_configs",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    zone_id = table.Column<int>(type: "int", nullable: false),
                    vehicle_type_id = table.Column<int>(type: "int", nullable: false),
                    created_by = table.Column<int>(type: "int", nullable: false),
                    base_fee = table.Column<int>(type: "int", nullable: false),
                    grace_period_minutes = table.Column<int>(type: "int", nullable: false),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    effective_from = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false),
                    effective_until = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fee_configs", x => x.id);
                    table.ForeignKey(
                        name: "FK_fee_configs_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_fee_configs_vehicle_types_vehicle_type_id",
                        column: x => x.vehicle_type_id,
                        principalTable: "vehicle_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_fee_configs_zones_zone_id",
                        column: x => x.zone_id,
                        principalTable: "zones",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "tenant_members",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    pic = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    tenant_name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    status_membership = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    total_bill = table.Column<int>(type: "int", nullable: false),
                    total_current_payment = table.Column<int>(type: "int", nullable: false),
                    is_active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    membership_id = table.Column<int>(type: "int", nullable: true),
                    start_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    due_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    deleted_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tenant_members", x => x.id);
                    table.ForeignKey(
                        name: "FK_tenant_members_membership_packages_membership_id",
                        column: x => x.membership_id,
                        principalTable: "membership_packages",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_tenant_members_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_login_logs",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    ip_address = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    user_agent = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    attempt_type = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    success = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    failure_reason = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    attempted_at = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_login_logs", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_login_logs_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "user_login_stats",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    total_attempts = table.Column<int>(type: "int", nullable: false),
                    total_failed_attempts = table.Column<int>(type: "int", nullable: false),
                    last_attempt_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    last_success_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    last_failed_ip = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    is_locked = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    locked_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    locked_reason = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_login_stats", x => x.id);
                    table.ForeignKey(
                        name: "FK_user_login_stats_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "fee_tiers",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    fee_config_id = table.Column<int>(type: "int", nullable: false),
                    tier_order = table.Column<int>(type: "int", nullable: false),
                    duration_minutes = table.Column<int>(type: "int", nullable: false),
                    fee_amount = table.Column<int>(type: "int", nullable: false),
                    is_last_tier = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fee_tiers", x => x.id);
                    table.ForeignKey(
                        name: "FK_fee_tiers_fee_configs_fee_config_id",
                        column: x => x.fee_config_id,
                        principalTable: "fee_configs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "rfid_cards",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    card_uid = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    vehicle_id = table.Column<int>(type: "int", nullable: true),
                    is_guest = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    is_member = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    employee_id = table.Column<int>(type: "int", nullable: true),
                    pic_tenant_id = table.Column<int>(type: "int", nullable: true),
                    deactivated_by = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    deactivated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rfid_cards", x => x.id);
                    table.ForeignKey(
                        name: "FK_rfid_cards_employees_employee_id",
                        column: x => x.employee_id,
                        principalTable: "employees",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_rfid_cards_tenant_members_pic_tenant_id",
                        column: x => x.pic_tenant_id,
                        principalTable: "tenant_members",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_rfid_cards_vehicles_vehicle_id",
                        column: x => x.vehicle_id,
                        principalTable: "vehicles",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "transactions",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    transaction_code = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    entry_method = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    entry_qr_code = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    entry_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    entry_photo_url = table.Column<string>(type: "text", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    entry_gate_id = table.Column<int>(type: "int", nullable: false),
                    exit_gate_id = table.Column<int>(type: "int", nullable: true),
                    exit_method = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    exit_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    calculated_fee = table.Column<int>(type: "int", nullable: true),
                    total_payment = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    receipt_printed = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    receipt_printed_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    vehicle_type_id = table.Column<int>(type: "int", nullable: false),
                    holiday_rate_id = table.Column<int>(type: "int", nullable: true),
                    zone_id = table.Column<int>(type: "int", nullable: true),
                    member_vehicle_id = table.Column<int>(type: "int", nullable: true),
                    rfid_card_id = table.Column<int>(type: "int", nullable: true),
                    fee_config_id = table.Column<int>(type: "int", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_transactions", x => x.id);
                    table.ForeignKey(
                        name: "FK_transactions_fee_configs_fee_config_id",
                        column: x => x.fee_config_id,
                        principalTable: "fee_configs",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_transactions_gates_entry_gate_id",
                        column: x => x.entry_gate_id,
                        principalTable: "gates",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_transactions_gates_exit_gate_id",
                        column: x => x.exit_gate_id,
                        principalTable: "gates",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_transactions_holiday_rates_holiday_rate_id",
                        column: x => x.holiday_rate_id,
                        principalTable: "holiday_rates",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_transactions_rfid_cards_rfid_card_id",
                        column: x => x.rfid_card_id,
                        principalTable: "rfid_cards",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_transactions_vehicle_types_vehicle_type_id",
                        column: x => x.vehicle_type_id,
                        principalTable: "vehicle_types",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_transactions_vehicles_member_vehicle_id",
                        column: x => x.member_vehicle_id,
                        principalTable: "vehicles",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_transactions_zones_zone_id",
                        column: x => x.zone_id,
                        principalTable: "zones",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "payments",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    transaction_id = table.Column<int>(type: "int", nullable: false),
                    method = table.Column<string>(type: "varchar(26)", maxLength: 26, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    amount = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "varchar(26)", maxLength: 26, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    cash_tendered = table.Column<int>(type: "int", nullable: false),
                    cash_change = table.Column<int>(type: "int", nullable: false),
                    midtrans_order_id = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    midtrans_transaction_id = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    qris_url = table.Column<string>(type: "text", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    qris_expires_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    midtrans_status = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    paid_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    handled_by_user_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_payments", x => x.id);
                    table.ForeignKey(
                        name: "FK_payments_transactions_transaction_id",
                        column: x => x.transaction_id,
                        principalTable: "transactions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_payments_users_handled_by_user_id",
                        column: x => x.handled_by_user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "midtrans_callbacks",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    payment_id = table.Column<int>(type: "int", nullable: false),
                    midtrans_order_id = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    raw_payload = table.Column<string>(type: "json", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    signature_valid = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    processed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    processed_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    received_at = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    error_message = table.Column<string>(type: "text", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_midtrans_callbacks", x => x.id);
                    table.ForeignKey(
                        name: "FK_midtrans_callbacks_payments_payment_id",
                        column: x => x.payment_id,
                        principalTable: "payments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "employees",
                columns: new[] { "id", "created_at", "deleted_at", "name", "role_id", "updated_at" },
                values: new object[,]
                {
                    { 1, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 806, DateTimeKind.Unspecified).AddTicks(661), new TimeSpan(0, 0, 0, 0, 0)), null, "Budi Santoso", 3, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 806, DateTimeKind.Unspecified).AddTicks(1132), new TimeSpan(0, 0, 0, 0, 0)) },
                    { 2, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 806, DateTimeKind.Unspecified).AddTicks(2023), new TimeSpan(0, 0, 0, 0, 0)), null, "Siti Nurhaliza", 3, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 806, DateTimeKind.Unspecified).AddTicks(2024), new TimeSpan(0, 0, 0, 0, 0)) },
                    { 3, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 806, DateTimeKind.Unspecified).AddTicks(2059), new TimeSpan(0, 0, 0, 0, 0)), null, "Ahmad Wijaya", 3, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 806, DateTimeKind.Unspecified).AddTicks(2060), new TimeSpan(0, 0, 0, 0, 0)) },
                    { 4, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 806, DateTimeKind.Unspecified).AddTicks(2065), new TimeSpan(0, 0, 0, 0, 0)), null, "Rina Kusuma", 4, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 806, DateTimeKind.Unspecified).AddTicks(2065), new TimeSpan(0, 0, 0, 0, 0)) },
                    { 5, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 806, DateTimeKind.Unspecified).AddTicks(2070), new TimeSpan(0, 0, 0, 0, 0)), null, "Dedi Gunawan", 3, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 806, DateTimeKind.Unspecified).AddTicks(2071), new TimeSpan(0, 0, 0, 0, 0)) }
                });

            migrationBuilder.InsertData(
                table: "gate_devices",
                columns: new[] { "id", "created_at", "device_type", "error_message", "gate_id", "las_ping_at", "status", "uniqUrl", "updated_at" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "RFID_READER", null, 1, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), true, "https://device.parkir.com/gate1", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 2, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "BARRIER_ARM", null, 2, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), true, "https://device.parkir.com/gate2", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 3, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "RFID_READER", null, 3, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), true, "https://device.parkir.com/gate3", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 4, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "BARRIER_ARM", "Connection timeout", 4, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), false, "https://device.parkir.com/gate4", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "CAMERA", null, 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), true, "https://device.parkir.com/gate5", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) }
                });

            migrationBuilder.InsertData(
                table: "gates",
                columns: new[] { "id", "created_at", "created_by", "gate_type", "is_active", "location_desc", "name", "updated_at", "zone_id" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 3, 26, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", "entrance", true, "Main entrance gate Zona A", "Gate A1 - Entrance", new DateTime(2026, 3, 26, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 1 },
                    { 2, new DateTime(2026, 3, 26, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", "exit", true, "Main exit gate Zona A", "Gate A2 - Exit", new DateTime(2026, 3, 31, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 1 },
                    { 3, new DateTime(2026, 4, 5, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", "entrance", true, "Second floor entrance Zona B", "Gate B1 - Entrance", new DateTime(2026, 4, 5, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 2 },
                    { 4, new DateTime(2026, 4, 10, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", "entrance", true, "Third floor entrance Zona C", "Gate C1 - Entrance", new DateTime(2026, 4, 15, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 3 },
                    { 5, new DateTime(2026, 4, 20, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", "entrance", true, "Premium VIP entrance Zona E", "Gate E1 - VIP", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 5 }
                });

            migrationBuilder.InsertData(
                table: "permissions",
                columns: new[] { "id", "created_at", "description", "node" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 25, 8, 41, 29, 798, DateTimeKind.Local).AddTicks(4080), "View permissions", "permission.view" },
                    { 2, new DateTime(2026, 4, 25, 8, 41, 29, 798, DateTimeKind.Local).AddTicks(4541), "Create permissions", "permission.create" },
                    { 3, new DateTime(2026, 4, 25, 8, 41, 29, 798, DateTimeKind.Local).AddTicks(4544), "Edit permissions", "permission.edit" },
                    { 4, new DateTime(2026, 4, 25, 8, 41, 29, 798, DateTimeKind.Local).AddTicks(4546), "Delete permissions", "permission.delete" },
                    { 5, new DateTime(2026, 4, 25, 8, 41, 29, 798, DateTimeKind.Local).AddTicks(4549), "Manage zones", "zone.manage" }
                });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "id", "created_at", "created_by", "deleted_at", "description", "name", "updated_at" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", new DateTime(2026, 4, 25, 8, 41, 29, 800, DateTimeKind.Local).AddTicks(1066), "Full access to all system features", "Super Admin", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 2, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", new DateTime(2026, 4, 25, 8, 41, 29, 800, DateTimeKind.Local).AddTicks(3703), "Administrative access", "Admin", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 3, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", new DateTime(2026, 4, 25, 8, 41, 29, 800, DateTimeKind.Local).AddTicks(3712), "Gate and parking operator", "Operator", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 4, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", new DateTime(2026, 4, 25, 8, 41, 29, 800, DateTimeKind.Local).AddTicks(3716), "Zone manager and reporting", "Manager", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", new DateTime(2026, 4, 25, 8, 41, 29, 800, DateTimeKind.Local).AddTicks(3791), "View-only access", "Viewer", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) }
                });

            migrationBuilder.InsertData(
                table: "vehicle_types",
                columns: new[] { "id", "created_at", "description", "minimum_fee", "name" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "Motorcycle/Scooter", 5000, "Motor" },
                    { 2, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "Car/Sedan", 10000, "Mobil" },
                    { 3, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "Bus/Large Vehicle", 25000, "Bus" },
                    { 4, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "Truck/Pickup", 20000, "Truck" },
                    { 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "Special vehicles", 15000, "Kendaraan Khusus" }
                });

            migrationBuilder.InsertData(
                table: "zones",
                columns: new[] { "id", "additional_fee", "created_at", "created_by", "description", "is_active", "name", "updated_at" },
                values: new object[,]
                {
                    { 1, 0, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", "Ground floor parking zone", true, "Zona A - Lantai 1", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 2, 2000, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", "Second floor parking zone", true, "Zona B - Lantai 2", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 3, 3000, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", "Third floor parking zone", true, "Zona C - Lantai 3", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 4, 0, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", "Outdoor parking area", true, "Zona D - Outdoor", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 5, 10000, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", "VIP parking zone with premium services", true, "Zona E - VIP", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) }
                });

            migrationBuilder.InsertData(
                table: "holiday_rates",
                columns: new[] { "id", "applies_to_vehicle_type_id", "applies_to_zone_id", "created_at", "created_by", "date_aend", "date_start", "multiplier", "name", "override_fee", "rate_type", "updated_at" },
                values: new object[,]
                {
                    { 1, 2, 1, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", new DateTime(2026, 4, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 1.5f, "Lebaran 2026", 0, "multiplier", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 2, 1, 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", new DateTime(2026, 1, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1f, "Tahun Baru", 25000, "override", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 3, 3, 2, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", new DateTime(2026, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 4, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 2f, "Hari Raya", 0, "multiplier", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 4, 2, 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2025, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), 1f, "Malam Tahun Baru", 50000, "override", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 5, 4, 3, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", new DateTime(2026, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2026, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1.3f, "Libur Nasional", 0, "multiplier", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) }
                });

            migrationBuilder.InsertData(
                table: "rfid_cards",
                columns: new[] { "id", "card_uid", "created_at", "deactivated_at", "deactivated_by", "employee_id", "is_guest", "is_member", "pic_tenant_id", "vehicle_id" },
                values: new object[,]
                {
                    { 4, "08D4B2C3", new DateTime(2026, 4, 15, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, null, 1, false, false, null, null },
                    { 5, "08D4B2C4", new DateTime(2026, 4, 20, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, null, 2, false, false, null, null }
                });

            migrationBuilder.InsertData(
                table: "role_permissions",
                columns: new[] { "id", "granted_at", "granted_by", "permission_id", "role_id" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", 1, 1 },
                    { 2, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", 2, 1 },
                    { 3, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", 3, 1 },
                    { 4, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", 4, 1 },
                    { 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "System", 5, 1 }
                });

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "created_at", "deleted_at", "email", "is_active", "name", "password_hash", "role_id", "updated_at" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 8, 41, 29, 800, DateTimeKind.Local).AddTicks(6512), "superadmin@parkir.local", true, "Super Administrator", "12345", 1, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 2, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 8, 41, 29, 801, DateTimeKind.Local).AddTicks(222), "admin@parkir.local", true, "Admin User", "12345", 2, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 3, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 8, 41, 29, 801, DateTimeKind.Local).AddTicks(231), "operator1@parkir.local", true, "Gate Operator 1", "12345", 3, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 4, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 8, 41, 29, 801, DateTimeKind.Local).AddTicks(235), "manager@parkir.local", true, "Zone Manager", "12345", 4, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 8, 41, 29, 801, DateTimeKind.Local).AddTicks(241), "viewer@parkir.local", true, "Viewer User", "12345", 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) }
                });

            migrationBuilder.InsertData(
                table: "vehicles",
                columns: new[] { "id", "created_at", "notes", "plate_number", "source", "updated_at", "vehicle_type_id" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "Red Sedan", "B 1234 ABC", "Manual", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 2 },
                    { 2, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "Black Motorcycle", "B 5678 XYZ", "RFID", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 1 },
                    { 3, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "White Bus", "B 9012 DEF", "Manual", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 3 },
                    { 4, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "Blue Truck", "B 3456 GHI", "OCR", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 4 },
                    { 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), "Silver Car", "B 7890 JKL", "Manual", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 2 }
                });

            migrationBuilder.InsertData(
                table: "fee_configs",
                columns: new[] { "id", "base_fee", "created_at", "created_by", "effective_from", "effective_until", "grace_period_minutes", "is_active", "updated_at", "vehicle_type_id", "zone_id" },
                values: new object[,]
                {
                    { 1, 10000, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), 1, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), null, 15, true, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), 2, 1 },
                    { 2, 5000, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), 1, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), null, 10, true, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), 1, 1 },
                    { 3, 20000, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), 1, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), null, 20, true, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), 2, 5 },
                    { 4, 25000, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), 2, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), null, 30, true, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), 3, 2 },
                    { 5, 20000, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), 2, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), null, 15, true, new DateTimeOffset(new DateTime(2026, 4, 25, 1, 41, 29, 804, DateTimeKind.Unspecified).AddTicks(6913), new TimeSpan(0, 0, 0, 0, 0)), 4, 3 }
                });

            migrationBuilder.InsertData(
                table: "rfid_cards",
                columns: new[] { "id", "card_uid", "created_at", "deactivated_at", "deactivated_by", "employee_id", "is_guest", "is_member", "pic_tenant_id", "vehicle_id" },
                values: new object[,]
                {
                    { 1, "08D4B2C0", new DateTime(2026, 3, 26, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, null, null, false, true, null, 1 },
                    { 2, "08D4B2C1", new DateTime(2026, 4, 5, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, null, null, false, true, null, 2 },
                    { 3, "08D4B2C2", new DateTime(2026, 4, 10, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, null, null, true, false, null, 3 }
                });

            migrationBuilder.InsertData(
                table: "fee_tiers",
                columns: new[] { "id", "duration_minutes", "fee_amount", "fee_config_id", "is_last_tier", "tier_order" },
                values: new object[,]
                {
                    { 1, 60, 10000, 1, true, 1 },
                    { 2, 60, 5000, 2, true, 1 },
                    { 3, 60, 20000, 3, true, 1 },
                    { 4, 60, 25000, 4, true, 1 },
                    { 5, 60, 20000, 5, true, 1 }
                });

            migrationBuilder.InsertData(
                table: "transactions",
                columns: new[] { "id", "calculated_fee", "created_at", "entry_at", "entry_gate_id", "entry_method", "entry_photo_url", "entry_qr_code", "exit_at", "exit_gate_id", "exit_method", "fee_config_id", "holiday_rate_id", "member_vehicle_id", "receipt_printed", "receipt_printed_at", "rfid_card_id", "status", "total_payment", "transaction_code", "updated_at", "vehicle_type_id", "zone_id" },
                values: new object[,]
                {
                    { 1, 10000, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 6, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 1, "RFID", "photo1.jpg", "QR001", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 2, "RFID", 1, null, null, true, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, "completed", null, "TRX001", new DateTime(2026, 4, 25, 8, 41, 29, 807, DateTimeKind.Local).AddTicks(3778), 2, 1 },
                    { 2, 5000, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 7, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 1, "RFID", "photo2.jpg", "QR002", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 2, "MANUAL", 2, null, null, true, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, "completed", null, "TRX002", new DateTime(2026, 4, 25, 8, 41, 29, 808, DateTimeKind.Local).AddTicks(1540), 1, 1 },
                    { 3, 0, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 5, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 3, "OCR", "photo3.jpg", "QR003", null, 4, "MANUAL", 4, null, null, false, null, null, "pending", null, "TRX003", new DateTime(2026, 4, 25, 8, 41, 29, 808, DateTimeKind.Local).AddTicks(1554), 3, 2 },
                    { 4, 20000, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 4, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 2, "RFID", "photo4.jpg", "QR004", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 5, "RFID", 5, null, 4, true, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, "completed", null, "TRX004", new DateTime(2026, 4, 25, 8, 41, 29, 808, DateTimeKind.Local).AddTicks(1561), 4, 1 },
                    { 5, 25000, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 3, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 4, "OCR", "photo5.jpg", "QR005", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 5, "OCR", 3, null, 5, true, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, "completed", null, "TRX005", new DateTime(2026, 4, 25, 8, 41, 29, 808, DateTimeKind.Local).AddTicks(1973), 2, 5 }
                });

            migrationBuilder.InsertData(
                table: "payments",
                columns: new[] { "id", "amount", "cash_change", "cash_tendered", "created_at", "handled_by_user_id", "method", "midtrans_order_id", "midtrans_status", "midtrans_transaction_id", "paid_at", "qris_expires_at", "qris_url", "status", "transaction_id", "updated_at" },
                values: new object[,]
                {
                    { 1, 10000, 0, 10000, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 1, "cash", "MID001", null, null, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, null, "paid", 1, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 2, 5000, 0, 0, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 2, "qris", "MID002", "pending", null, null, new DateTime(2026, 4, 25, 8, 46, 29, 799, DateTimeKind.Local).AddTicks(7820), "qris_001.png", "pending", 2, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 3, 0, 0, 0, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 3, "card", "MID003", "pending", null, null, null, null, "unpaid", 3, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 4, 20000, 0, 20000, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 4, "cash", "MID004", null, null, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), null, null, "paid", 4, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) },
                    { 5, 25000, 0, 0, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), 5, "qris", "MID005", "settlement", "MTX005", new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820), new DateTime(2026, 4, 25, 8, 51, 29, 799, DateTimeKind.Local).AddTicks(7820), "qris_005.png", "paid", 5, new DateTime(2026, 4, 25, 8, 41, 29, 799, DateTimeKind.Local).AddTicks(7820) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_fee_configs_created_by",
                table: "fee_configs",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_fee_configs_vehicle_type_id",
                table: "fee_configs",
                column: "vehicle_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_fee_configs_zone_id",
                table: "fee_configs",
                column: "zone_id");

            migrationBuilder.CreateIndex(
                name: "IX_fee_tiers_fee_config_id",
                table: "fee_tiers",
                column: "fee_config_id");

            migrationBuilder.CreateIndex(
                name: "IX_holiday_rates_applies_to_vehicle_type_id",
                table: "holiday_rates",
                column: "applies_to_vehicle_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_holiday_rates_applies_to_zone_id",
                table: "holiday_rates",
                column: "applies_to_zone_id");

            migrationBuilder.CreateIndex(
                name: "IX_midtrans_callbacks_payment_id",
                table: "midtrans_callbacks",
                column: "payment_id");

            migrationBuilder.CreateIndex(
                name: "IX_payments_handled_by_user_id",
                table: "payments",
                column: "handled_by_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_payments_transaction_id",
                table: "payments",
                column: "transaction_id");

            migrationBuilder.CreateIndex(
                name: "IX_permissions_node",
                table: "permissions",
                column: "node",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_rfid_cards_employee_id",
                table: "rfid_cards",
                column: "employee_id");

            migrationBuilder.CreateIndex(
                name: "IX_rfid_cards_pic_tenant_id",
                table: "rfid_cards",
                column: "pic_tenant_id");

            migrationBuilder.CreateIndex(
                name: "IX_rfid_cards_vehicle_id",
                table: "rfid_cards",
                column: "vehicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_role_permissions_permission_id",
                table: "role_permissions",
                column: "permission_id");

            migrationBuilder.CreateIndex(
                name: "IX_role_permissions_role_id",
                table: "role_permissions",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_tenant_members_membership_id",
                table: "tenant_members",
                column: "membership_id");

            migrationBuilder.CreateIndex(
                name: "IX_tenant_members_user_id",
                table: "tenant_members",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_transactions_entry_gate_id",
                table: "transactions",
                column: "entry_gate_id");

            migrationBuilder.CreateIndex(
                name: "IX_transactions_exit_gate_id",
                table: "transactions",
                column: "exit_gate_id");

            migrationBuilder.CreateIndex(
                name: "IX_transactions_fee_config_id",
                table: "transactions",
                column: "fee_config_id");

            migrationBuilder.CreateIndex(
                name: "IX_transactions_holiday_rate_id",
                table: "transactions",
                column: "holiday_rate_id");

            migrationBuilder.CreateIndex(
                name: "IX_transactions_member_vehicle_id",
                table: "transactions",
                column: "member_vehicle_id");

            migrationBuilder.CreateIndex(
                name: "IX_transactions_rfid_card_id",
                table: "transactions",
                column: "rfid_card_id");

            migrationBuilder.CreateIndex(
                name: "IX_transactions_vehicle_type_id",
                table: "transactions",
                column: "vehicle_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_transactions_zone_id",
                table: "transactions",
                column: "zone_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_login_logs_user_id",
                table: "user_login_logs",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_login_stats_user_id",
                table: "user_login_stats",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_users_role_id",
                table: "users",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_vehicles_vehicle_type_id",
                table: "vehicles",
                column: "vehicle_type_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "audit_log_exports");

            migrationBuilder.DropTable(
                name: "audit_logs");

            migrationBuilder.DropTable(
                name: "fee_tiers");

            migrationBuilder.DropTable(
                name: "gate_device_ads");

            migrationBuilder.DropTable(
                name: "gate_devices");

            migrationBuilder.DropTable(
                name: "midtrans_callbacks");

            migrationBuilder.DropTable(
                name: "role_permissions");

            migrationBuilder.DropTable(
                name: "user_login_logs");

            migrationBuilder.DropTable(
                name: "user_login_stats");

            migrationBuilder.DropTable(
                name: "user_sessions");

            migrationBuilder.DropTable(
                name: "payments");

            migrationBuilder.DropTable(
                name: "permissions");

            migrationBuilder.DropTable(
                name: "transactions");

            migrationBuilder.DropTable(
                name: "fee_configs");

            migrationBuilder.DropTable(
                name: "gates");

            migrationBuilder.DropTable(
                name: "holiday_rates");

            migrationBuilder.DropTable(
                name: "rfid_cards");

            migrationBuilder.DropTable(
                name: "zones");

            migrationBuilder.DropTable(
                name: "employees");

            migrationBuilder.DropTable(
                name: "tenant_members");

            migrationBuilder.DropTable(
                name: "vehicles");

            migrationBuilder.DropTable(
                name: "membership_packages");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "vehicle_types");

            migrationBuilder.DropTable(
                name: "roles");
        }
    }
}
