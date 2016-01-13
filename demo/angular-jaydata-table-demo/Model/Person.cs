using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace angular_jaydata_table_demo.Model
{
    public class Person
    {
        [Key]
        public int IDPerson { get; set; }
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Phone { get; set; }

        public int IDSchool { get; set; }
        public School School { get; set; }
    }
}