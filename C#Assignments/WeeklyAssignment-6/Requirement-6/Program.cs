using System;
using System.Collections.Generic;

namespace Requirement_6
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // List to store all vehicle objects
            List<Vehicle> vlist = new List<Vehicle>();

            Console.WriteLine("Requirement -6");

            int n = 0;

            try
            {
                // Read number of vehicles from user
                Console.WriteLine("Enter no . of Vehicles : ");
                n = Convert.ToInt32(Console.ReadLine());
            }
            catch (FormatException)
            {
                // Handles invalid numeric input
                Console.WriteLine("Invalid number entered.");
                return;
            }

            // Loop to input vehicle details
            for (int i = 0; i < n; i++)
            {
                try
                {
                    Console.WriteLine("Enter the details of the vehicle in the format RegistrationNo,Name,Type,Weight");

                    string detail = Console.ReadLine();

                    // Create vehicle object using factory method
                    Vehicle vehicle = Vehicle.CreateVehicle(detail);

                    // Add vehicle to list
                    vlist.Add(vehicle);
                }
                catch (Exception ex)
                {
                    // If input format is wrong, retry same index
                    Console.WriteLine("Invalid vehicle details: " + ex.Message);
                    i--;
                }
            }

            // Get type-wise vehicle count using static method
            SortedDictionary<string, int> typeCount = Vehicle.TypeWiseCount(vlist);

            // Display result header
            Console.WriteLine("{0,-15} {1}", "Type", "No. of Vehicles");

            // Display each type and its count
            foreach (var item in typeCount)
            {
                Console.WriteLine("{0,-15} {1}", item.Key, item.Value);
            }
        }
    }
}
