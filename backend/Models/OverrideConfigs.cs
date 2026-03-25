using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class OverrideConfigs
    {
        public Guid Id { get; set; }
        public Guid EscalationNotifyUserId { get; set; }
        public Guid CreatedBy { get; set; }
        public int MaxOverridesPerDay { get; set; }
        public int MaxOverridesPerWeek { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}