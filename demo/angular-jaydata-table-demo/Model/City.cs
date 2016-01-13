using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace angular_jaydata_table_demo.Model
{
    public class City
    {
        [Key]
        public int IDCity { get; set; }
        public string Name { get; set; }

        public int IDState { get; set; }
        public State State { get; set; }
    }
}