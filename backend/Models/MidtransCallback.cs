using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class MidtransCallback
    {
        [Key]
        public int id { get; set; }

        public int payment_id { get; set; }

        [StringLength(100)]
        public string? midtrans_order_id { get; set; }

        [Column(TypeName = "json")]
        public string? raw_payload { get; set; }

        public bool signature_valid { get; set; }

        public bool processed { get; set; }

        public DateTime? processed_at { get; set; }

        public DateTime? received_at { get; set; }

        [Column(TypeName = "text")]
        public string? error_message { get; set; }

        // Navigation Properties
        [ForeignKey("payment_id")]
        public Payment? Payment { get; set; }
    }
}