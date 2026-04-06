using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.RolePermission.Requests
{
    public class RolePermissionCreateDto
    {
        [Required(ErrorMessage = "Role ID tidak boleh kosong!")]
        [Range(1, int.MaxValue, ErrorMessage = "Role ID harus lebih besar dari 0!")]
        public int role_id { get; set; }

        [Required(ErrorMessage = "Permission ID tidak boleh kosong!")]
        [Range(1, int.MaxValue, ErrorMessage = "Permission ID harus lebih besar dari 0!")]
        public int permission_id { get; set; }
    }
}
