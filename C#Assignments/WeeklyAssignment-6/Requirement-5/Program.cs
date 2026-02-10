using System;
using System.Collections.Generic;
using static Requirement_5.Vehicle;

namespace Requirement_5
{
    internal class Program
    {
        static void Main(string[] args)
        {
            // List to store all vehicles
            List<Vehicle> vlist = new List<Vehicle>();

            Console.WriteLine("Requirement -5");

            int option = 0;
            int n = 0;

            try
            {
                // Read number of vehicles
                Console.WriteLine("Enter no . of Vehicles : ");
                n = Convert.ToInt32(Console.ReadLine());
            }
            catch (FormatException)
            {
                Console.WriteLine("Invalid number entered.");
                return;
            }

            // Loop to get vehicle details
            for (int i = 0; i < n; i++)
            {
                try
                {
                    Console.WriteLine("Enter the details of the vehicle in the format RegistrationNo,Name,Type,Weight,Parked Time,cost");

                    string detail = Console.ReadLine();

                    // Create vehicle object using factory method
                    Vehicle vehicle = Vehicle.CreateVehicle(detail);

                    // Add vehicle to list
                    vlist.Add(vehicle);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Invalid vehicle details: " + ex.Message);
                    i--; // Retry same input
                }
            }

            // Menu loop for sorting
            do
            {
                Console.WriteLine("1.Sort by Weight");
                Console.WriteLine("2.Sort by Parked Time");
                Console.WriteLine("3.Exit");
                Console.WriteLine("Enter Choice : ");

                try
                {
                    option = Convert.ToInt32(Console.ReadLine());
                }
                catch (FormatException)
                {
                    Console.WriteLine("Invalid choice. Please enter a number.");
                    continue;
                }

                switch (option)
                {
                    case 1:
                        // Sort vehicles by Weight using IComparable
                        vlist.Sort();

                        Console.WriteLine("{0,-15} {1,-10} {2,-12} {3,-7} {4}",
                            "Registration No", "Name", "Type", "Weight", "Ticket No");

                        foreach (Vehicle vehicle in vlist)
                        {
                            vehicle.Display();
                        }
                        break;

                    case 2:
                        // Sort vehicles by Parked Time using IComparer
                        vlist.Sort(new parkedTimeComparer());

                        Console.WriteLine("{0,-15} {1,-10} {2,-12} {3,-7} {4}",
                            "Registration No", "Name", "Type", "Weight", "Ticket No");

                        foreach (Vehicle vehicle in vlist)
                        {
                            vehicle.Display();
                        }
                        break;

                    case 3:
                        // Exit program
                        return;

                    default:
                        Console.WriteLine("Invalid Choice");
                        break;
                }

            } while (option != 3);
        }
    }
}
