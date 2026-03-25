using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    [Index(nameof(node), IsUnique = true)]
    public class Permission
    {
        [Key]
        public int id { get; set; }
        public string node { get; set; }
        public string description { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
    }
}