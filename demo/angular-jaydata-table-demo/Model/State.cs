using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace angular_jaydata_table_demo.Model
{
    public class State
    {
        [Key]
        public int IDState { get; set; }
        public string Name { get; set; }
    }
}