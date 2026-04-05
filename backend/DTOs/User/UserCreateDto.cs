using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.User
{
    public class UserCreateDto
    {
        [Required]
        public string name { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string password_hash { get; set; }
        [Required]
        public int role_id { get; set; }
    }
}