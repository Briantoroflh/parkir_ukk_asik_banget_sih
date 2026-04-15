using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.HolidayRate
{
    public class HolidayRateUpdateDto
    {
        [Required(ErrorMessage = "Created by tidak boleh kosong")]
        public string created_by { get; set; }

        [Required(ErrorMessage = "Name tidak boleh kosong")]
        public string name { get; set; }

        [Required(ErrorMessage = "Date start tidak boleh kosong")]
        public DateTime date_start { get; set; }

        public DateTime? date_aend { get; set; }

        [Required(ErrorMessage = "Rate type tidak boleh kosong")]
        public string rate_type { get; set; }

        [Required(ErrorMessage = "Multiplier tidak boleh kosong")]
        public float multiplier { get; set; }

        public int override_fee { get; set; }

        [Required(ErrorMessage = "Applies to zone ID tidak boleh kosong")]
        public int applies_to_zone_id { get; set; }

        [Required(ErrorMessage = "Applies to vehicle type ID tidak boleh kosong")]
        public int applies_to_vehicle_type_id { get; set; }
    }
}
