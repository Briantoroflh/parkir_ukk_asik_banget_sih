using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class OcrReviewLogs
    {
        public Guid Id { get; set; }
        public Guid ReviewedBy { get; set; }
        public Guid OcrResultId { get; set; }
        public string? OcrPlate { get; set; }
        public decimal OcrConfidence { get; set; }
        public string? ManualPlate { get; set; }
        public bool Match { get; set; }
        public string? ReviewNote { get; set; }
        public DateTime ReviewedAt { get; set; }
    }
}