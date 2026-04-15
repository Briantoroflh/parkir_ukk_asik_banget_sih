using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.VehicleType
{
    public class VehicleTypeCreateDto
    {
        [Required(ErrorMessage = "Name tidak boleh kosong")]
        public string name { get; set; }

        [Required(ErrorMessage = "Minimum fee tidak boleh kosong")]
        public int minimum_fee { get; set; }

        public string description { get; set; }
    }
}
