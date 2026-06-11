using System.ComponentModel.DataAnnotations;

namespace Ecoture.Model.Request
{
	public class AddResponse
	{
		[Required]
		public int EnquiryId { get; set; } // ID of the associated enquiry

		[Required]
		[MaxLength(1000)]
		public string Message { get; set; } = string.Empty;

		public bool IsCustomerReply { get; set; } = false;
	}
}
