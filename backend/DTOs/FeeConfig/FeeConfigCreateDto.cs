using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.FeeConfig
{
    public class FeeConfigCreateDto
    {
        [Required(ErrorMessage = "Zone ID tidak boleh kosong")]
        public int zone_id { get; set; }

        [Required(ErrorMessage = "Vehicle type ID tidak boleh kosong")]
        public int vehicle_type_id { get; set; }

        [Required(ErrorMessage = "Created by tidak boleh kosong")]
        public int created_by { get; set; }

        [Required(ErrorMessage = "Base fee tidak boleh kosong")]
        public int base_fee { get; set; }

        public int grace_period_minutes { get; set; }

        [Required(ErrorMessage = "Is active tidak boleh kosong")]
        public bool is_active { get; set; }

        [Required(ErrorMessage = "Effective from tidak boleh kosong")]
        public DateTimeOffset effective_from { get; set; }

        public DateTimeOffset? effective_until { get; set; }
    }
}
