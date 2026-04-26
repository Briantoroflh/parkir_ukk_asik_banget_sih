using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Parking.EntryParking
{
    public class CheckTransactionRequestDto
    {
        public string rfid { get; set; }
        public string gate { get; set; }
    }
}