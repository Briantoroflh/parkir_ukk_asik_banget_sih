using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.GateDevice
{
    public class GateDeviceAdsCreateDto
    {
        [Required(ErrorMessage = "Gate Device ID tidak boleh kosong")]
        public int gate_device_id { get; set; }

        [Required(ErrorMessage = "Image tidak boleh kosong")]
        public string image { get; set; }

        [Required(ErrorMessage = "Title tidak boleh kosong")]
        public string title { get; set; }

        [Required(ErrorMessage = "Company tidak boleh kosong")]
        public string company { get; set; }
    }
}
