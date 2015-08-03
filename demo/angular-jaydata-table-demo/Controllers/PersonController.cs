using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using angular_jaydata_table_demo.Model;
using Microsoft.Data.OData;
using System.Web.OData;

namespace angular_jaydata_table_demo.Controllers
{
    public class PersonController : ODataController
    {
        public IHttpActionResult Get()
        {
            var demoList = new List<Person>();

            for (int i = 0; i < 45; i++)
            {
                demoList.Add(new Person()
                {
                    IDPerson = i,
                    Name = "Person " + i,
                    DateOfBirth = new DateTime(1980, 01, 01),
                    Phone = "123 456 789"
                });
            }

            return Ok(demoList);
        }
    }
}
