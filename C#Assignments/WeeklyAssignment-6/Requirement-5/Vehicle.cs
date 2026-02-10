using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Requirement_5
{
    public class Vehicle : IComparable<Vehicle>
    {
        private string _registrationNo;

        public string RegistrationNo
        {
            get { return _registrationNo; }
            set { _registrationNo = value; }
        }

        private string _name;

        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }
        private string _type;

        public string Type
        {
            get { return _type; }
            set { _type = value; }
        }
        private double _weight;

        public double Weight
        {
            get { return _weight; }
            set { _weight = value; }
        }

        private Ticket _ticket;

        public Ticket Tickett
        {
            get { return _ticket; }
            set { _ticket = value; }
        }
        // Constructor to initialize vehicle details
        public Vehicle(string _registrationNo, string _name, string _type, double _weight, Ticket _ticket)
        {
            this._registrationNo = _registrationNo;
            this._name = _name;
            this._type = _type;
            this._weight = _weight;
            this._ticket = _ticket;

        }

        public Vehicle() { }

        //Method to create a Vehicle object from a comma-separated string
        public static Vehicle CreateVehicle(string detail)
        {
            // Step 1: Split the string by commaD
            string[] data = detail.Split(',');

            // Step 2: Extract values
            string registrationNo = data[0];
            string ownerName = data[1];
            string type = data[2];
            double weight = Convert.ToDouble(data[3]);
            string ticketNo = data[4];
            DateTime parkedTime = DateTime.ParseExact(data[5], "dd-MM-yyyy HH:mm:ss", null);
            double cost = Convert.ToDouble(data[6]);

            Ticket ticket = new Ticket(ticketNo, parkedTime, cost);
            // Step 3: Create vehicle object
            Vehicle vehicle = new Vehicle(
       registrationNo,
       ownerName,
       type,
       weight,
       ticket
     );

            // Step 4: Return vehicle object
            return vehicle;
        }
        // Returns vehicle details in formatted string form
        public override string ToString()
        {
            return string.Format("{0,-15}{1,-10}{2,-12}{3,-7:F1}{4}",
                this.RegistrationNo,
                this.Name,
                this.Type,
                this.Weight,
                this.Tickett.TicketNo);
        }

        // Compares vehicles based on Weight - sorting (ascending order of weight)
        public int CompareTo(Vehicle other)
        {
            return this.Weight.CompareTo(other.Weight);
        }
        // Custom comparer class to sort vehicles by ParkedTime

        public class parkedTimeComparer : IComparer<Vehicle>
        {
            // Compares two vehicles based on their parked time
            public int Compare(Vehicle x, Vehicle y)
            {
                return x.Tickett.ParkedTime.CompareTo(y.Tickett.ParkedTime);
            }
        }
        // Displays vehicle details in table format
        public void Display()
        {
            Console.WriteLine("{0,-15} {1,-10} {2,-12} {3,-7:F1} {4}",
                RegistrationNo,
                Name,
                Type,
                Weight,
                Tickett != null ? Tickett.TicketNo : "N/A");
        }
    }
}