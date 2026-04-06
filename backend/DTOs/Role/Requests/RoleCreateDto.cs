using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Role.Requests
{
    public class RoleCreateDto
    {
        [Required(ErrorMessage = "Nama role tidak boleh kosong!")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Nama role harus antara 1-100 karakter!")]
        public string name { get; set; }

        [StringLength(500, ErrorMessage = "Deskripsi maksimal 500 karakter!")]
        public string description { get; set; }
    }
}
