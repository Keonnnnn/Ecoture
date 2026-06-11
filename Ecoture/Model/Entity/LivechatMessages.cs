namespace Ecoture.Model.Entity
{
    public class LivechatMessages
    {
        public int Id { get; set; }
        public string Sender { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public bool IsDelivered { get; set; }
    }
}
