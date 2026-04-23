namespace Lemmikloomad.Models.DTO
{
    public class KliinikCreateDto
    {
        public string Nimi { get; set; } = string.Empty;
        public string Aadress { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Kirjeldus { get; set; } = string.Empty;
    }
}
