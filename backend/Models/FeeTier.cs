using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class FeeTier
    {
        [Key]
        public int id { get; set; }

        public int fee_config_id { get; set; }
        public int tier_order { get; set; }
        public int duration_minutes { get; set; }
        public int fee_amount { get; set; }
        public bool is_last_tier { get; set; }

        [ForeignKey("fee_config_id")]
        public FeeConfig? fee_config { get; set; }
    }
}