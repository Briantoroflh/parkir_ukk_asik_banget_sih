using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class AuditLogExports
    {
        public Guid Id { get; set; }
        public string? ExportFormat { get; set; }
        public string? FilePath { get; set; }
        public DateTime DateRangeStart { get; set; }
        public DateTime DateRangeEnd { get; set; }
        public int TotalRecords { get; set; }
        public string? ExportStatus { get; set; }
        public DateTime ExportedAt { get; set; }
        public Guid ExportedBy { get; set; }
    }
}