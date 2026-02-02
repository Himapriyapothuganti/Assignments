namespace Assignment_1
{
    internal class Program
    {

        static void Swap()
        {
            int temp, num1, num2;

            num1 = 5;
            num2 = 10;
            Console.WriteLine("Before Swapping :" + num1, +num2);
            temp = num1;
            num1 = num2;
            num2 = temp;
            Console.WriteLine("After Swapping :" + num1, +num2);


        }

        static int avg(int n1, int n2, int n3, int n4)
        {

            return ((n1 + n2 + n3 + n4) / 4);
        }

        static void pattern()
        {
            int m = 4;
            int n = 5;
            for (int i = 0; i < m; i++)
            {
                for (int j = 0; j < n; j++)
                {
                    Console.Write('*');
                }
                Console.WriteLine(' ');
            }

        }
        static void palindrome()
        {
            String m = "madam";
            int l = m.Length;
            int h = l / 2;
            bool pal = true;
            for (int i = 0; i < h; i++)
            {
                if (m[i] != m[l - i - 1])
                {
                    pal = false;
                    break;
                }
            }
            if (pal)
            {
                Console.WriteLine($"{m} is a palindrome");
            }
            else
            {
                Console.WriteLine($"{m} is not a palindrome");
            }


        }
        public static void Factorial_number(int number)
        {
            int fact = 1;
            for (int i = 1; i <= number; i++)
            {
                fact = fact * i;
            }
            Console.WriteLine("Factorial of a number is : " + fact);
        }
        public static void sumOfArray()
        {
            int number, n;
            Console.WriteLine("Enter size of array: ");
            n = Convert.ToInt32(Console.ReadLine());
            int sum = 0;
            for (int i = 0; i < n; i++)
            {
                number = Convert.ToInt32(Console.ReadLine());
                sum += number;
            }
            Console.WriteLine("sum is: " + sum);
        }

        static void Main(string[] args)
        {
            Swap();
            int avgresult = avg(1, 2, 3, 4);
            Console.WriteLine("average of four numbers is "+avgresult);
            pattern();
            Factorial_number(5);
            sumOfArray();

        }
    }
}
