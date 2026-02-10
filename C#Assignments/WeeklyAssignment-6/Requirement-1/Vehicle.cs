using System;

namespace Requirement_1
{
    public class Vehicle
    {
        // Private field to store registration number
        private string _registrationNo;

        // Private field to store vehicle name
        private string _name;

        // Private field to store vehicle type (TwoWheeler/FourWheeler)
        private string _type;

        // Private field to store vehicle weight
        private double _weight;

        // Private field to store Ticket object (HAS-A relationship)
        private Ticket _ticket;

        // Public property for Registration Number
        public string RegistrationNo
        {
            get { return _registrationNo; }
            set { _registrationNo = value; }
        }

        // Public property for Name
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        // Public property for Type
        public string Type
        {
            get { return _type; }
            set { _type = value; }
        }

        // Public property for Weight
        public double Weight
        {
            get { return _weight; }
            set { _weight = value; }
        }

        // Public property for Ticket object
        public Ticket Ticket
        {
            get { return _ticket; }
            set { _ticket = value; }
        }

        // Default constructor
        public Vehicle()
        {
        }

        // Parameterized constructor to initialize all attributes
        public Vehicle(string _registrationNo, string _name, string _type, double _weight, Ticket _ticket)
        {
            RegistrationNo = _registrationNo;
            Name = _name;
            Type = _type;
            Weight = _weight;
            Ticket = _ticket;
        }

        // Override ToString() to display vehicle details
        public override string ToString()
        {
            return $"Registration No:\"{_registrationNo}\"\n" +
                   $"Name:\"{_name}\"\n" +
                   $"Type:\"{_type}\"\n" +
                   $"Weight:\"{_weight}\"\n" +
                   $"Ticket No:\"{_ticket.TicketNo}\"";
        }

        // Override Equals() to compare two Vehicle objects
        // Vehicles are considered equal if RegistrationNo and Name are same
        public override bool Equals(object? obj)
        {
            Vehicle v = obj as Vehicle;

            return RegistrationNo.Equals(v.RegistrationNo) &&
                   Name.Equals(v.Name);
        }
    }
}
