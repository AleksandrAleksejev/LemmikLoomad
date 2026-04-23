using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Lemmikloomad.Data;
using Lemmikloomad.Models;
using Lemmikloomad.Models.DTO;

namespace Lemmikloomad.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LemmikloomController : ControllerBase
{
    private readonly AppDbContext _context;

    public LemmikloomController(AppDbContext context) => _context = context;

    private int GetUserId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetMyPets()
    {
        var userId = GetUserId();
        var pets = await _context.Lemmikloomad
            .Where(p => p.UserId == userId)
            .Include(p => p.Kliinik)
            .Select(p => new
            {
                p.Id, p.Nimi, p.Liik, p.Kaal, p.Vanus, p.PhotoUrl,
                Kliinik = p.Kliinik == null ? null : new { p.Kliinik.Id, p.Kliinik.Nimi }
            })
            .ToListAsync();
        return Ok(pets);
    }

    // Lisa uus lemmikloom sisselogitud kasutaja kontole
    [HttpPost]
    public async Task<IActionResult> AddPet([FromBody] LemmikloomCreateDto dto)
    {
        var pet = new Lemmikloom
        {
            Nimi   = dto.Nimi,
            Liik   = dto.Liik,
            Kaal   = dto.Kaal,
            Vanus  = dto.Vanus,
            UserId = GetUserId()
        };
        _context.Lemmikloomad.Add(pet);
        await _context.SaveChangesAsync();
        return Ok(new { pet.Id, pet.Nimi, pet.Liik, pet.Kaal, pet.Vanus });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePet(int id, [FromBody] LemmikloomCreateDto dto)
    {
        var pet = await _context.Lemmikloomad
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == GetUserId());
        if (pet == null) return NotFound();

        pet.Nimi  = dto.Nimi;
        pet.Liik  = dto.Liik;
        pet.Kaal  = dto.Kaal;
        pet.Vanus = dto.Vanus;
        await _context.SaveChangesAsync();
        return Ok(new { pet.Id, pet.Nimi, pet.Liik, pet.Kaal, pet.Vanus });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePet(int id)
    {
        var pet = await _context.Lemmikloomad
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == GetUserId());
        if (pet == null) return NotFound();
        _context.Lemmikloomad.Remove(pet);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var pets = await _context.Lemmikloomad
            .Include(p => p.User)
            .Include(p => p.Kliinik)
            .Select(p => new
            {
                p.Id, p.Nimi, p.Liik, p.Kaal, p.Vanus,
                // Null-ohutu projekteerimine – kasutaja võib teoreetiliselt puududa
                Owner  = p.User == null ? null : new { p.User.Id, p.User.Name, p.User.Email },
                Kliinik = p.Kliinik == null ? null : new { p.Kliinik.Id, p.Kliinik.Nimi }
            })
            .ToListAsync();
        return Ok(pets);
    }

    [HttpGet("top")]
    [AllowAnonymous]
    public async Task<IActionResult> Top()
    {
        var data = await _context.Lemmikloomad
            .OrderByDescending(x => x.Kaal)
            .Take(5)
            .Select(x => new { x.Id, x.Nimi, x.Liik, x.Kaal })
            .ToListAsync();
        return Ok(data);
    }

    [HttpPost("{id}/photo")]
    public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
    {
        var pet = await _context.Lemmikloomad
            .FirstOrDefaultAsync(p => p.Id == id && p.UserId == GetUserId());
        if (pet == null) return NotFound();

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Fail puudub või on tühi." });
        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "Faili maksimaalne suurus on 5 MB." });

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext is not (".jpg" or ".jpeg" or ".png" or ".webp"))
            return BadRequest(new { message = "Lubatud formaadid: jpg, png, webp." });

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "pets");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"pet_{id}_{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
            await file.CopyToAsync(stream);

        // Kustutame vana foto kettalt, kui see eksisteerib
        if (!string.IsNullOrEmpty(pet.PhotoUrl))
        {
            var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", pet.PhotoUrl.TrimStart('/'));
            if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);
        }

        pet.PhotoUrl = $"/uploads/pets/{fileName}";
        await _context.SaveChangesAsync();

        return Ok(new { pet.Id, pet.PhotoUrl });
    }
}
