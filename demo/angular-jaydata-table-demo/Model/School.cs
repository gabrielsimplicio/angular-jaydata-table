using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace angular_jaydata_table_demo.Model
{
    public class School
    {
        [Key]
        public int IDSchool { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        public int IDCity { get; set; }
        public City City { get; set; }
    }
}