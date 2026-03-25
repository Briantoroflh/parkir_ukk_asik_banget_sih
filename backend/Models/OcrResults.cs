using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class OcrResults
    {
        public Guid Id { get; set; }
        public Guid OcrJobId { get; set; }
        public string PlateDetected { get; set; }
        public decimal Confidence { get; set; }
        public string RawOutput { get; set; }
        public Guid VehicleId { get; set; }
        public bool IsVerified { get; set; }
        public Guid VerifiedBy { get; set; }
        public DateTime VerifiedAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}