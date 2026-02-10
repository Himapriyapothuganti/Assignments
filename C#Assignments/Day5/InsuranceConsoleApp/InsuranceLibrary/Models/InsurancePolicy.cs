using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InsuranceLibrary.Models
{
	public class InsurancePolicy
	{
        public int PolicyId { get; set; }
        public string PolicyHolderName { get; set; }
        public string PolicyType { get; set; }   
        public decimal PremiumAmount { get; set; }
        public int PolicyTerm { get; set; }      
        public bool IsActive { get; set; }
        public InsurancePolicy()
		{

		}
		public InsurancePolicy(int policyId, string holderName, string policyType,decimal premiumAmount, int policyTerm, bool isActive)
		{
            PolicyId = policyId;
            PolicyHolderName = holderName;
            PolicyType = policyType;
            PremiumAmount = premiumAmount;
            PolicyTerm = policyTerm;
            IsActive = isActive;

        }

        public override string ToString()
        {
            return $"{PolicyId} {PolicyHolderName} {PolicyType} {PremiumAmount} {PolicyTerm} {IsActive}";
        }

	}

}
