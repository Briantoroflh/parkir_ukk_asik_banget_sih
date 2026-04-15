using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class RfidCard
    {
        [Key]
        public int id { get; set; }
        public string card_uid { get; set; }
        public int? vehicle_id { get; set; }
        public bool? is_guest { get; set; }
        public bool? is_member { get; set; }
        public int? employee_id { get; set; }
        public string? deactivated_by { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? deactivated_at { get; set; } = DateTime.Now;

        [ForeignKey("vehicle_id")]
        public Vehicle? vehicle { get; set; }
        
        [ForeignKey("employee_id")]
        public Employee? employee { get; set; }
    }
}