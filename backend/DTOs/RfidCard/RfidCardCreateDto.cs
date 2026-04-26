using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.RfidCard
{
    public class RfidCardCreateDto
    {
        public string card_uid { get; set; }
        public int? vehicle_id { get; set; }
        public bool? is_guest { get; set; }
        public bool? is_member { get; set; }
        public int? employee_id { get; set; }
        public int? pic_tenant_id { get; set; }
    }
}