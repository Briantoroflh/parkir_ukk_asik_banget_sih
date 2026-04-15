using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    [Index(nameof(uniq_id), IsUnique = true)]
    public class TicketParking
    {
        [Key]
        public int id { get; set; }
        public string uniq_id { get; set; }
        public string barcode { get; set; }
        public int vehicle_id { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;

        [ForeignKey("vehicle_id")]
        public Vehicle? vehicle { get; set; }
    }
}