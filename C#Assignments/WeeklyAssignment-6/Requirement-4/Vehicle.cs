using System;

namespace Requirement_4
{
    public class Vehicle
    {
        // Private field to store registration number
        private string _registrationNo;

        // Public property for Registration Number
        public string RegistrationNo
        {
            get { return _registrationNo; }
            set { _registrationNo = value; }
        }

        // Private field to store owner name
        private string _name;

        // Public property for Name
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        // Private field to store vehicle type
        private string _type;

        // Public property for Type
        public string Type
        {
            get { return _type; }
            set { _type = value; }
        }

        // Private field to store vehicle weight
        private double _weight;

        // Public property for Weight
        public double Weight
        {
            get { return _weight; }
            set { _weight = value; }
        }

        // Private field for Ticket object (HAS-A relationship)
        private Ticket _ticket;

        // Public property for Ticket
        public Ticket Ticket
        {
            get { return _ticket; }
            set { _ticket = value; }
        }

        // Parameterized constructor to initialize vehicle details
        public Vehicle(string _registrationNo, string _name, string _type, double _weight, Ticket _ticket)
        {
            this._registrationNo = _registrationNo;
            this._name = _name;
            this._type = _type;
            this._weight = _weight;
            this._ticket = _ticket;
        }

        // Default constructor
        public Vehicle() { }

        // Static factory method to create Vehicle from comma-separated input
        public static Vehicle CreateVehicle(string detail)
        {
            // Step 1: Split input string using comma
            string[] data = detail.Split(',');

            // Step 2: Extract and convert values
            string registrationNo = data[0];
            string ownerName = data[1];
            string type = data[2];
            double weight = Convert.ToDouble(data[3]);
            string ticketNo = data[4];
            DateTime parkedTime = DateTime.ParseExact(data[5], "dd-MM-yyyy HH:mm:ss", null);
            double cost = Convert.ToDouble(data[6]);

            // Step 3: Create Ticket object
            Ticket ticket = new Ticket(ticketNo, parkedTime, cost);

            // Step 4: Create and return Vehicle object
            return new Vehicle(registrationNo, ownerName, type, weight, ticket);
        }

        // Override ToString() to return vehicle details in formatted string
        public override string ToString()
        {
            return string.Format("{0,-15} {1,-10} {2,-12} {3,-7:F1} {4}",
                RegistrationNo,
                Name,
                Type,
                Weight,
                Ticket != null ? Ticket.TicketNo : "N/A");
        }

        // Display method to print vehicle details in table format
        public void Display()
        {
            Console.WriteLine("{0,-15} {1,-10} {2,-12} {3,-7:F1} {4}",
                RegistrationNo,
                Name,
                Type,
                Weight,
                Ticket != null ? Ticket.TicketNo : "N/A");
        }
    }
}
