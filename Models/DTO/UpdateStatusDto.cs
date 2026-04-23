namespace Lemmikloomad.Models.DTO
{
    public class UpdateStatusDto
    {
        public string Staatus { get; set; } = string.Empty;
        public int? KliinikId { get; set; }
    }
}
