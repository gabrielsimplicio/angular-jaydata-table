using angular_jaydata_table_demo.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Query;

namespace angular_jaydata_table_demo.Controllers
{
    public class SchoolController : ODataController
    {
        [EnableQuery(AllowedQueryOptions = AllowedQueryOptions.Expand)]
        public IHttpActionResult Get()
        {            
            return Ok(GetSchools());
        }

        public List<School> GetSchools()
        {
            var schoolsList = new List<School>();
            var citiesList = GetCities();
            var r = new Random();

            for (int i = 0; i < 15; i++)
            {
                var index = r.Next(4);
                schoolsList.Add(new School()
                {
                    IDSchool = i,
                    Name = "School " + i,
                    Address = "Address " + i,
                    IDCity = citiesList[index].IDCity,
                    City = citiesList[index]
                });
            }

            return schoolsList;
        }

        private List<City> GetCities()
        {
            var citiesList = new List<City>();

            for (int i = 0; i < 5; i++)
            {
                citiesList.Add(new City()
                {
                    IDCity = i,
                    Name = "City " + i
                });
            }

            return citiesList;
        }
    }
}