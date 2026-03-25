using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class OcrConfigs
    {
        public Guid Id { get; set; }
        public Guid CreatedBy { get; set; }
        public decimal AutoAcceptThreshold { get; set; }
        public bool IsActive { get; set; }
        public DateTime EffectiveFrom { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}