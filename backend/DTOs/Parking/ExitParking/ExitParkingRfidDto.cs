using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Parking.ExitParking
{
    public class ExitParkingRfidDto
    {
        public string transaction_id { get; set; }
        public int calculated_fee { get; set; }
        public string gate { get; set; }
    }
}