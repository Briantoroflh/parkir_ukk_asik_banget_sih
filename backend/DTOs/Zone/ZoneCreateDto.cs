using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Zone
{
    public class ZoneCreateDto
    {
        [Required(ErrorMessage = "Name tidak boleh kosong")]
        public string name { get; set; }

        public string description { get; set; }

        public int additional_fee { get; set; }
    }
}
