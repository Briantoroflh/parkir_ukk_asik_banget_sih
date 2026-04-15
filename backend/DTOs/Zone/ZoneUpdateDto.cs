using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Zone
{
    public class ZoneUpdateDto
    {
        [Required(ErrorMessage = "Created by tidak boleh kosong")]
        public string created_by { get; set; }

        [Required(ErrorMessage = "Name tidak boleh kosong")]
        public string name { get; set; }

        public string description { get; set; }

        [Required(ErrorMessage = "Capacity tidak boleh kosong")]
        public int capacity { get; set; }

        public int additional_fee { get; set; }

        [Required(ErrorMessage = "Is active tidak boleh kosong")]
        public bool is_active { get; set; }
    }
}
