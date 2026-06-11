namespace Ecoture.Model.DTO
{
    public class RefundRequestDTO
    {
        public int Id { get; set; }
        public int OrderItemId { get; set; }
        public int UserId { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ProductTitle { get; set; }
        public string ImageFile { get; set; }
    }
}
