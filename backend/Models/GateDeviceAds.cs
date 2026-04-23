using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class GateDeviceAds
    {
        [Key]
        public int id { get; set; }
        public int gate_device_id { get; set; }
        public string image { get; set; }
        public string title { get; set; }
        public string company { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;
        public DateTime? deleted_at { get; set; } = DateTime.Now;
    }
}