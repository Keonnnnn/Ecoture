using Ecoture.Model.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ecoture.Model.Entity
{
    public class Membership
    {
        public int MembershipId { get; set; }

        [MaxLength(20)]
        public MembershipTiers Tier { get; set; } = MembershipTiers.Bronze; // Default tier

        public decimal SpendingRequired { get; set; } = 0.00m;

        [Column(TypeName = "timestamp with time zone")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "timestamp with time zone")]
        public DateTime UpdatedAt { get; set; }
    }
}
