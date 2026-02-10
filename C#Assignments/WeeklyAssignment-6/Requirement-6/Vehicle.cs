using System;
using System.Collections.Generic;

namespace Requirement_6
{
    public class Vehicle
    {
        // Private field for registration number
        private string _registrationNo;

        // Public property for Registration Number
        public string RegistrationNo
        {
            get { return _registrationNo; }
            set { _registrationNo = value; }
        }

        // Private field for owner name
        private string _name;

        // Public property for Name
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        // Private field for vehicle type
        private string _type;

        // Public property for Type
        public string Type
        {
            get { return _type; }
            set { _type = value; }
        }

        // Private field for vehicle weight
        private double _weight;

        // Public property for Weight
        public double Weight
        {
            get { return _weight; }
            set { _weight = value; }
        }

        // Parameterized constructor to initialize vehicle details
        public Vehicle(string _registrationNo, string _name, string _type, double _weight)
        {
            this._registrationNo = _registrationNo;
            this._name = _name;
            this._type = _type;
            this._weight = _weight;
        }

        // Default constructor
        public Vehicle()
        {
        }

        // Static factory method to create Vehicle from comma-separated input
        public static Vehicle CreateVehicle(string detail)
        {
            // Step 1: Split input string using comma
            string[] data = detail.Split(',');

            // Step 2: Extract values and convert weight
            string registrationNo = data[0];
            string ownerName = data[1];
            string type = data[2];
            double weight = Convert.ToDouble(data[3]);

            // Step 3: Create and return vehicle object
            return new Vehicle(registrationNo, ownerName, type, weight);
        }

        // Override ToString() to display vehicle details properly
        public override string ToString()
        {
            return string.Format("{0,-15} {1,-10} {2,-12} {3,-7:F1}",
                _registrationNo,
                _name,
                _type,
                _weight);
        }

        // Static method to count vehicles type-wise
        public static SortedDictionary<string, int> TypeWiseCount(List<Vehicle> vehicleList)
        {
            // SortedDictionary automatically sorts keys alphabetically
            SortedDictionary<string, int> result = new SortedDictionary<string, int>();

            // Loop through each vehicle
            foreach (Vehicle v in vehicleList)
            {
                // If type already exists, increase count
                if (result.ContainsKey(v.Type))
                {
                    result[v.Type]++;
                }
                else
                {
                    // If first occurrence, set count to 1
                    result[v.Type] = 1;
                }
            }

            // Return final type-wise count
            return result;
        }
    }
}
