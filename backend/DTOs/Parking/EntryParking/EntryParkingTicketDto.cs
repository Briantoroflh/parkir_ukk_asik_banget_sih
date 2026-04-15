using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Parking.EntryParking
{
    public class EntryParkingTicketDto
    {
        public string plate_number { get; set; }
        public string gate { get; set; }
    }
}