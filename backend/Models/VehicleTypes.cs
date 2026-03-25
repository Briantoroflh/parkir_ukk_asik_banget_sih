using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class VehicleTypes
    {
        [Key]
        public int id { get; set; }
        public string name { get; set; }
        public int minimum_fee { get; set; }
        public string description { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
    }
}