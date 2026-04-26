using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Payment
{
    public class PaymentMembershipRequestDto
    {
        public string order_id { get; set; }
        public int gross_amount { get; set; }
    }
}