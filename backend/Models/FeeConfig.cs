using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class FeeConfig
    {
        [Key]
        public int id { get; set; }

        public int zone_id { get; set; }

        public int vehicle_type_id { get; set; }

        public int created_by { get; set; }

        public int base_fee { get; set; }

        public int grace_period_minutes { get; set; }

        public bool is_active { get; set; }

        public DateTimeOffset effective_from { get; set; }

        public DateTimeOffset? effective_until { get; set; }

        public DateTimeOffset created_at { get; set; } = DateTimeOffset.UtcNow;

        public DateTimeOffset updated_at { get; set; } = DateTimeOffset.UtcNow;

        // Navigation properties
        [ForeignKey("zone_id")]
        public Zone? zone { get; set; }

        [ForeignKey("vehicle_type_id")]
        public VehicleTypes? vehicle_type { get; set; }

        [ForeignKey("created_by")]
        public Users? creator { get; set; }
    }
}