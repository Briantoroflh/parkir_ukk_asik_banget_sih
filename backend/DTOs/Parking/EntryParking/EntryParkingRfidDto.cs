using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Parking.EntryParking
{
    public class EntryParkingRfidDto
    {
        public string rfid { get; set; }
        public string plate { get; set; }
        public string vehicle_type { get; set; }
        public string gate { get; set; }
    }
}