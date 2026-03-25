using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class AuditLogs
    {
        public Guid Id { get; set; }
        public string EventType { get; set; }
        public string ActorRole { get; set; }
        public string TargetType { get; set; }
        public Guid TargetId { get; set; }
        public string BeforeState { get; set; }
        public string AfterState { get; set; }
        public string IpAddress { get; set; }
        public string UserAgent { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid ActorId { get; set; }
    }
}