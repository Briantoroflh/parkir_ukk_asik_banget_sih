using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class RfidCard
    {
        [Key]
        public int id { get; set; }
        public string deactivated_by { get; set; }
        public string card_uid { get; set; }
        public int vehicle_id { get; set; }
        public bool is_active { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime deactivated_at { get; set; } = DateTime.Now;
    }
}