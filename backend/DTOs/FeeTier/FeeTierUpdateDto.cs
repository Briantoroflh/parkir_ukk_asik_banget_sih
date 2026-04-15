using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.FeeTier
{
    public class FeeTierUpdateDto
    {
        [Required(ErrorMessage = "Fee config ID tidak boleh kosong")]
        public int fee_config_id { get; set; }

        [Required(ErrorMessage = "Tier order tidak boleh kosong")]
        public int tier_order { get; set; }

        [Required(ErrorMessage = "Duration minutes tidak boleh kosong")]
        public int duration_minutes { get; set; }

        [Required(ErrorMessage = "Fee amount tidak boleh kosong")]
        public int fee_amount { get; set; }

        [Required(ErrorMessage = "Is last tier tidak boleh kosong")]
        public bool is_last_tier { get; set; }
    }
}
