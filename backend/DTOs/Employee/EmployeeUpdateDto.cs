using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs.Employee
{
    public class EmployeeUpdateDto
    {
        [Required(ErrorMessage = "Nama karyawan wajib diisi")]
        public string name { get; set; }

        [Required(ErrorMessage = "Role ID wajib diisi")]
        public int role_id { get; set; }
    }
}