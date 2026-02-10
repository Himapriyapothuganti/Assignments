using InsuranceLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsuranceLibrary.Services
{
    public class PolicyService
    {
        private List <InsurancePolicy> policies=new List <InsurancePolicy> ();
        public void AddPolicy(InsurancePolicy policy)
        {
            //Add 
            policies.Add (policy);
        }

        public List<InsurancePolicy> GetAllPolicies()
        {
            //View All 
            return policies;
        }

        public InsurancePolicy GetPolicyById(int id)
        {
            //View by ID 
            foreach (InsurancePolicy policy in policies) {
                if (policy.PolicyId == id)
                {
                    return policy;
                }
                
            }
            return null;
        }

        public bool UpdatePolicy(int id, decimal newPremium, int newTerm)
        {
            //Edit 
            InsurancePolicy policy = GetPolicyById(id);
            if (policy != null)
            {
                policy.PremiumAmount = newPremium;
                policy.PolicyTerm = newTerm;
                return true;
            }
            return false;
        }

        public bool DeletePolicy(int id)
        {
            //Delete 
            InsurancePolicy policy = GetPolicyById(id);
            if (policy != null)
            {
                policies.Remove(policy);
                return true;
            }
            return false;
        }
    }
}
