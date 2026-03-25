using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Zone
    {
        [Key]
        public int id { get; set; }
        public string created_by { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public int capacity { get; set; }
        public int additional_fee { get; set; }
        public bool is_active { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;
    }
}