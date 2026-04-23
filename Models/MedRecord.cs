namespace Lemmikloomad.Models
{
    public class MedRecord
    {
        public int Id { get; set; }

        public int LemmikloomId { get; set; }
        public Lemmikloom Lemmikloom { get; set; } = null!;

        public DateTime KuupAev { get; set; } = DateTime.UtcNow;
        public string Diagnoos { get; set; } = string.Empty;
        public string Ravi { get; set; } = string.Empty;
        public string? ArstNimi { get; set; }
        public string? Markused { get; set; }
        public decimal? Kaal { get; set; }      // kaal vastuvõtu hetkel (kg)
        public string? Ravimid { get; set; }
        public DateTime LoodudAeg { get; set; } = DateTime.UtcNow;
    }
}
