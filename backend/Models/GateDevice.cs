using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class GateDevice
    {
        [Key]
        public int id { get; set; }
        public int gate_id { get; set; }
        public string? device_type { get; set; }
        public bool status { get; set; }
        public DateTime? las_ping_at { get; set; } = DateTime.Now;

        [Column(TypeName = "text")]
        public string? error_message { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;
    }
}