using angular_jaydata_table_demo.Model;
using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;

namespace angular_jaydata_table_demo.Controllers
{
    public class PersonController : ODataController
    {
        [EnableQuery(PageSize = 10, AllowedQueryOptions = AllowedQueryOptions.All)]
        public IHttpActionResult Get()
        {
            return Ok(GetPeople());
        }

        public List<Person> GetPeople()
        {
            var peopleList = new List<Person>();
            var r = new Random();

            var schoolController = new SchoolController();
            var schoolList = schoolController.GetSchools();

            for (int i = 0; i < 45; i++)
            {
                var index = r.Next(14);
                peopleList.Add(new Person()
                {
                    IDPerson = i,
                    Name = "Person " + i,
                    DateOfBirth = new DateTime(1980, 01, 01),
                    Phone = "123 456 789",
                    IDSchool = schoolList[index].IDSchool,
                    School = schoolList[index]
                });
            }

            return peopleList;
        }
    }
}
