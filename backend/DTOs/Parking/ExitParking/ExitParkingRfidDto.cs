using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Parking.ExitParking
{
    public class ExitParkingRfidDto
    {
        public string rfid { get; set; }
        public string gate { get; set; }
    }
}