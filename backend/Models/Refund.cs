using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Refund
    {
        [Key]
        public int id { get; set; }

        public int payment_id { get; set; }

        public int transaction_id { get; set; }

        public int refund_amount { get; set; }

        [Column(TypeName = "text")]
        public string reason { get; set; }

        [StringLength(20)]
        public string status { get; set; }

        [StringLength(100)]
        public string midtrans_refund_id { get; set; }

        public DateTime? processed_at { get; set; }

        public DateTime created_at { get; set; } = DateTime.Now;

        public DateTime? updated_at { get; set; } = DateTime.Now;

        public int requested_by { get; set; }

        public int approved_by { get; set; }

        // Navigation Properties
        [ForeignKey("payment_id")]
        public Payment? Payment { get; set; }

        [ForeignKey("transaction_id")]
        public Transaction? Transaction { get; set; }

        [ForeignKey("requested_by")]
        public Users? RequestedByUser { get; set; }

        [ForeignKey("approved_by")]
        public Users? ApprovedByUser { get; set; }
    }
}