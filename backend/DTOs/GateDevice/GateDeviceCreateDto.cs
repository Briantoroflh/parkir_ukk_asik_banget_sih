using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.GateDevice
{
    public class GateDeviceCreateDto
    {
        [Required(ErrorMessage = "Gate ID tidak boleh kosong")]
        public int gate_id { get; set; }

        public string device_type { get; set; }

        [Required(ErrorMessage = "Status tidak boleh kosong")]
        public bool status { get; set; }

        public DateTime? las_ping_at { get; set; }

        public string error_message { get; set; }
    }
}
