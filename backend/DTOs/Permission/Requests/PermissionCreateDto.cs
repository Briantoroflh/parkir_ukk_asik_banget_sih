using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Permission.Requests
{
    public class PermissionCreateDto
    {
        [Required(ErrorMessage = "Node permission tidak boleh kosong!")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Node permission harus antara 1-100 karakter!")]
        public string node { get; set; }

        [StringLength(500, ErrorMessage = "Deskripsi maksimal 500 karakter!")]
        public string description { get; set; }
    }
}
