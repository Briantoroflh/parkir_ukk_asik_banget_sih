using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Parking.ExitParking
{
    public class ExitParkingTIcketDto
    {
        public string plate_number { get; set; }
        public string gate { get; set; }
    }
}