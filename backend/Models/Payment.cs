using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class Payment
    {
        [Key]
        public int id { get; set; }

        public int transaction_id { get; set; }

        [StringLength(26)]
        public string? method { get; set; }

        public int amount { get; set; }

        [StringLength(26)]
        public string? status { get; set; }

        public int cash_tendered { get; set; }

        public int cash_change { get; set; }

        [StringLength(100)]
        public string? midtrans_order_id { get; set; }

        [StringLength(100)]
        public string? midtrans_transaction_id { get; set; }

        [Column(TypeName = "text")]
        public string? qris_url { get; set; }

        public DateTime? qris_expires_at { get; set; }

        [StringLength(50)]
        public string? midtrans_status { get; set; }

        public DateTime? paid_at { get; set; }

        public DateTime created_at { get; set; } = DateTime.Now;

        public DateTime? updated_at { get; set; } = DateTime.Now;

        public int handled_by_user_id { get; set; }

        // Navigation Properties
        [ForeignKey("transaction_id")]
        public Transaction? Transaction { get; set; }

        [ForeignKey("handled_by_user_id")]
        public Users? HandledByUser { get; set; }
    }
}