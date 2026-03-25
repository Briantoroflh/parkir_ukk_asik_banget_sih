using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Vehicle
    {
        [Key]
        public int id { get; set; }
        public string plate_number { get; set; }
        public int vehicle_type_id { get; set; }
        public string source { get; set; }    
        public string notes { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;

        [ForeignKey("vehicle_type_id")]
        public VehicleTypes? VehicleTypes { get; set; }
    }
}