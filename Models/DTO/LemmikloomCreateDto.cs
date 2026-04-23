namespace Lemmikloomad.Models.DTO
{
    public class LemmikloomCreateDto
    {
        public string Nimi { get; set; } = string.Empty;
        public string Liik { get; set; } = "Koer";
        public int Kaal { get; set; }
        public int? Vanus { get; set; }
    }
}
