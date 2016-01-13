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
                    IDCity = citiesList[index].IDState,
                    City = citiesList[index]
                });
            }

            return schoolsList;
        }

        private List<State> GetStates()
        {
            var statesList = new List<State>();

            for (int i = 0; i < 5; i++)
            {
                statesList.Add(new State()
                {
                    IDState = i,
                    Name = "State " + i
                });
            }

            return statesList;
        }

        private List<City> GetCities()
        {
            var citiesList = new List<City>();
            var statesList = GetStates();
            var r = new Random();

            for (int i = 0; i < 5; i++)
            {
                var index = r.Next(4);
                citiesList.Add(new City()
                {
                    IDCity = i,
                    Name = "City " + i,
                    IDState = statesList[index].IDState,
                    State = statesList[index]
                });
            }

            return citiesList;
        }
    }
}