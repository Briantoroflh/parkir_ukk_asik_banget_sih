using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class EnteranceTracking
    {
        [Key]
        public int id { get; set; }
        public int? rfid_card_id { get; set; }
        public int? ticket_id { get; set; }
        public int gate_id { get; set; }
        public DateTime in_at { get; set; } = DateTime.Now;
        public DateTime? out_at { get; set; } = DateTime.Now;
        public DateTime created_at { get; set; } = DateTime.Now;
        
        public RfidCard? rfid { get; set; }
        public TicketParking? ticket { get; set; }
        public Gate? gate { get; set; }
    }
}