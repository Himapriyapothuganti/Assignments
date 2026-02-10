using System;
using System.Collections.Generic;

namespace Requirement_4
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // List to store all vehicle objects
            List<Vehicle> vlist = new List<Vehicle>();

            Console.WriteLine("Requirement -4");
            int choice = 0;
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

            // Loop to read vehicle details
            for (int i = 0; i < n; i++)
            {
                try
                {
                    Console.WriteLine("Enter the details of the vehicle in the format RegistrationNo,Name,Type,Weight,Parked Time,cost");

                    string detail = Console.ReadLine();

                    // Create Vehicle object using factory method
                    Vehicle vv = Vehicle.CreateVehicle(detail);

                    // Add vehicle to list
                    vlist.Add(vv);
                }
                catch (Exception ex)
                {
                    // If input format is wrong, retry same index
                    Console.WriteLine("Invalid vehicle details: " + ex.Message);
                    i--;
                }
            }

            // Menu loop for search functionality
            do
            {
                VehicleBO v = new VehicleBO();

                // Display search options
                Console.WriteLine("1.Search By Type\n2.Search By ParkedTime");
                Console.WriteLine("Enter your choice");

                try
                {
                    choice = Convert.ToInt32(Console.ReadLine());
                }
                catch (FormatException)
                {
                    Console.WriteLine("Invalid choice. Please enter a number.");
                    continue;
                }

                switch (choice)
                {
                    case 1:
                        // Search vehicles by type
                        Console.WriteLine("Enter the type of vehicle");
                        string type = Console.ReadLine();

                        List<Vehicle> result1 = v.FindVehicle(vlist, type);

                        if (result1.Count == 0)
                        {
                            Console.WriteLine("No such vehicle is present");
                        }
                        else
                        {
                            // Print table header
                            Console.WriteLine("{0,-15} {1,-10} {2,-12} {3,-7} {4}",
                                "Registration No", "Name", "Type", "Weight", "Ticket No");

                            // Display matching vehicles
                            foreach (Vehicle i in result1)
                            {
                                i.Display();
                            }
                        }
                        break;

                    case 2:
                        try
                        {
                            // Search vehicles by parked time
                            Console.WriteLine("Enter the parked time (dd-MM-yyyy HH:mm:ss)");
                            string input = Console.ReadLine();

                            // Parse date in exact format
                            DateTime parkedTime = DateTime.ParseExact(input, "dd-MM-yyyy HH:mm:ss", null);

                            List<Vehicle> result2 = v.FindVehicle(vlist, parkedTime);

                            if (result2.Count == 0)
                            {
                                Console.WriteLine("No such vehicle is present");
                            }
                            else
                            {
                                // Print table header
                                Console.WriteLine("{0,-15} {1,-10} {2,-12} {3,-7} {4}",
                                    "Registration No", "Name", "Type", "Weight", "Ticket No");

                                // Display matching vehicles
                                foreach (Vehicle vehicle in result2)
                                {
                                    vehicle.Display();
                                }
                            }
                        }
                        catch (FormatException)
                        {
                            // Handles invalid date format
                            Console.WriteLine("Invalid date format.");
                        }
                        break;

                    case 3:
                        // Exit program
                        return;

                    default:
                        Console.WriteLine("Invalid choice. Please try again.");
                        break;
                }

            } while (choice != 3);  // Continue until user exits
        }
    }
}
