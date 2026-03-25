using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class RolePermission
    {
        [Key]
        public int id { get; set; }
        public string granted_by { get; set; }
        public int role_id { get; set; }
        public int permission_id { get; set; }
        public DateTime granted_at { get; set; } = DateTime.Now;

        [ForeignKey("role_id")]
        public Role? Roles { get; set; }
        [ForeignKey("permission_id")]
        public Permission? Permissions { get; set; }
    }
}