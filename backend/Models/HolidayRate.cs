using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class HolidayRate
    {
        [Key]
        public int id { get; set; }

        public string created_by { get; set; }
        public string name { get; set; }
        public DateTime date_start { get; set; } = DateTime.Now;
        public DateTime? date_aend { get; set; } = DateTime.Now;
        public string rate_type { get; set; }
        public float multiplier { get; set; }
        public int override_fee { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;
        public int applies_to_zone_id { get; set; }
        public int applies_to_vehicle_type_id { get; set; }

        [ForeignKey("applies_to_zone_id")]
        public Zone? zone { get; set; }

        [ForeignKey("applies_to_vehicle_type_id")]
        public VehicleTypes? vehicle_type { get; set; }
    }
}