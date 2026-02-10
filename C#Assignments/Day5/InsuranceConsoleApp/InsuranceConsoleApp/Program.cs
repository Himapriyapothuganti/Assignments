using InsuranceLibrary.Models;
using InsuranceLibrary.Services;
using System;

namespace InsuranceConsoleApp
{
    public class Program
    {
        static PolicyService service = new PolicyService();

        static void Main(string[] args)
        {
            int choice;
            do
            {
                Console.WriteLine("\n--- Insurance Policy Management ---");
                Console.WriteLine("1. Add Policy");
                Console.WriteLine("2. View All Policies");
                Console.WriteLine("3. Search Policy by ID");
                Console.WriteLine("4. Update Policy");
                Console.WriteLine("5. Delete Policy");
                Console.WriteLine("0. Exit");
                Console.Write("Enter choice: ");

                int.TryParse(Console.ReadLine(), out choice);
                //choice=int.Parse(Console.ReadLine());

                switch (choice)
                {
                    case 1: AddPolicy(); break;
                    case 2: ViewPolicies(); break;
                    case 3: SearchPolicy(); break;
                    case 4: UpdatePolicy(); break;
                    case 5: DeletePolicy(); break;
                }

            } while (choice != 0);
        }


        static void AddPolicy()
        {
            Console.Write("Policy ID: ");
            int id = int.Parse(Console.ReadLine());

            Console.Write("Holder Name: ");
            string name = Console.ReadLine();

            Console.Write("Policy Type: ");
            string type = Console.ReadLine();

            Console.Write("Premium Amount: ");
            decimal premium = decimal.Parse(Console.ReadLine());

            Console.Write("Policy Term (years): ");
            int term = int.Parse(Console.ReadLine());

            InsurancePolicy policy = new InsurancePolicy(id, name, type, premium, term, true);
            service.AddPolicy(policy);

            Console.WriteLine("Policy added successfully.");
        }



        static void ViewPolicies()
        {

            Console.WriteLine("\nID    Name            Type       Premium    Term  Active");
            foreach (InsurancePolicy policy in service.GetAllPolicies())
            {
                Console.WriteLine(policy);
            }
        }
        




        static void SearchPolicy()
            {
            Console.Write("Enter Policy ID: ");
            int id = int.Parse(Console.ReadLine());

            InsurancePolicy policy = service.GetPolicyById(id);
            if (policy != null)
                Console.WriteLine(policy);
            else
                Console.WriteLine("Policy not found.");
            }
                        

            
            static void UpdatePolicy()
            {
            Console.Write("Enter Policy ID: ");
            int id = int.Parse(Console.ReadLine());

            Console.Write("New Premium: ");
            decimal premium = decimal.Parse(Console.ReadLine());

            Console.Write("New Term: ");
            int term = int.Parse(Console.ReadLine());

            if (service.UpdatePolicy(id, premium, term))
                Console.WriteLine("Policy updated.");
            else
                Console.WriteLine("Policy not found.");

        }
                        


           
            static void DeletePolicy()
            {
            Console.Write("Enter Policy ID: ");
            int id = int.Parse(Console.ReadLine());

            if (service.DeletePolicy(id))
                Console.WriteLine("Policy deleted.");
            else
                Console.WriteLine("Policy not found.");

        }
                        
        }
    }

