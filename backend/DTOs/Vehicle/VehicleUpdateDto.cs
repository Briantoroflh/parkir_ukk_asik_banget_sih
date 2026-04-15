using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Vehicle
{
    public class VehicleUpdateDto
    {
        [Required(ErrorMessage = "Plate number tidak boleh kosong")]
        public string plate_number { get; set; }

        [Required(ErrorMessage = "Vehicle type ID tidak boleh kosong")]
        public int vehicle_type_id { get; set; }

        public string source { get; set; }

        public string notes { get; set; }
    }
}
