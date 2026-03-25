using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Role
    {
        [Key]
        public int id { get; set; }
        public string created_by { get; set; }
        [Required]
        public string name { get; set; }
        public string description { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;
        public DateTime? deleted_at { get; set; } = DateTime.Now;
    }
}