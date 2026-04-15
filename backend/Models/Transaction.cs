using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Transaction
    {
        [Key]
        public int id { get; set; }
        [StringLength(50)]
        [Required]
        public string transaction_code { get; set; }
        [StringLength(16)]
        public string? entry_method { get; set; }
        [StringLength(255)]
        [Required]
        public string? entry_qr_code { get; set; }
        public DateTime? entry_at { get; set; }
        [Column(TypeName = "text")]
        public string? entry_photo_url { get; set; }
        public int entry_gate_id { get; set; }
        public int? exit_gate_id { get; set; }
        [StringLength(16)]
        public string exit_method { get; set; }
        public DateTime? exit_at { get; set; }
        public int calculated_fee { get; set; }
        [StringLength(20)]
        public string status { get; set; }
        public bool? receipt_printed { get; set; }
        public DateTime? receipt_printed_at { get; set; }
        public int? holiday_rate_id { get; set; }
        public int? zone_id { get; set; }
        public int? vehicle_id { get; set; }
        public int? rfid_card_id { get; set; }
        public int? fee_config_id { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public DateTime? updated_at { get; set; } = DateTime.Now;

        // Navigation Properties
        [ForeignKey("entry_gate_id")]
        public Gate? EntryGate { get; set; }

        [ForeignKey("exit_gate_id")]
        public Gate? ExitGate { get; set; }

        [ForeignKey("holiday_rate_id")]
        public HolidayRate? HolidayRate { get; set; }

        [ForeignKey("zone_id")]
        public Zone? Zone { get; set; }

        [ForeignKey("vehicle_id")]
        public Vehicle? Vehicle { get; set; }

        [ForeignKey("rfid_card_id")]
        public RfidCard? RfidCard { get; set; }

        [ForeignKey("fee_config_id")]
        public FeeConfig? FeeConfig { get; set; }
    }
}