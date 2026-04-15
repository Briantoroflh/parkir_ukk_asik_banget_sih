using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Gate
{
    public class GateCreateDto
    {
        [Required(ErrorMessage = "Created by tidak boleh kosong")]
        public string created_by { get; set; }

        [Required(ErrorMessage = "Zone ID tidak boleh kosong")]
        public int zone_id { get; set; }

        [Required(ErrorMessage = "Name tidak boleh kosong")]
        public string name { get; set; }

        [Required(ErrorMessage = "Gate type tidak boleh kosong")]
        public string gate_type { get; set; }

        public string location_desc { get; set; }

        [Required(ErrorMessage = "Is active tidak boleh kosong")]
        public bool is_active { get; set; }
    }
}
