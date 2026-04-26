using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.MembershipPackage
{
    public class MembershipPackageUpdateDto
    {
        public string package_name { get; set; }
        public int price { get; set; }
        public int time_period_month { get; set; }
        public bool is_active { get; set; }
    }
}