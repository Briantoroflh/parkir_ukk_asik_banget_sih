using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.TenantMember
{
    public class TenantMemberUpdateDto
    {
        public int user_id { get; set; }
        public string? pic { get; set; }
        public string? tenant_name { get; set; }
        public int membership_id { get; set; }
    }
}