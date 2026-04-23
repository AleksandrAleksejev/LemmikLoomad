namespace Lemmikloomad.Models.DTO
{
    public class BroneeringCreateDto
    {
        public int LemmikloomId { get; set; }
        public int ProtseduurId { get; set; }
        public int KliinikId { get; set; }
        public DateTime KuupAev { get; set; }
        public string? Markused { get; set; }
    }
}
