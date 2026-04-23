using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Lemmikloomad.Data;
using Lemmikloomad.Models;

namespace Lemmikloomad.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VaccineController : ControllerBase
{
    private readonly AppDbContext _context;

    public VaccineController(AppDbContext context) => _context = context;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin() => User.IsInRole("Admin");

    [HttpGet("pet/{petId}")]
    public async Task<IActionResult> GetForPet(int petId)
    {
        var pet = await _context.Lemmikloomad.FindAsync(petId);
        if (pet == null) return NotFound();
        if (!IsAdmin() && pet.UserId != GetUserId()) return Forbid();

        var vaccines = await _context.Vaccines
            .Where(v => v.LemmikloomId == petId)
            .OrderByDescending(v => v.ManustamisKuupAev)
            .Select(v => new
            {
                v.Id, v.LemmikloomId, v.Nimetus,
                v.ManustamisKuupAev, v.JargmineKuupAev,
                v.Arst, v.Partii, v.Markused, v.LoodudAeg
            })
            .ToListAsync();

        return Ok(vaccines);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] VaccineDto dto)
    {
        var pet = await _context.Lemmikloomad.FindAsync(dto.LemmikloomId);
        if (pet == null) return NotFound(new { message = "Lemmikloom ei leitud." });

        var v = new Vaccine
        {
            LemmikloomId      = dto.LemmikloomId,
            Nimetus           = dto.Nimetus,
            ManustamisKuupAev = dto.ManustamisKuupAev,
            JargmineKuupAev   = dto.JargmineKuupAev,
            Arst              = dto.Arst,
            Partii            = dto.Partii,
            Markused          = dto.Markused,
            LoodudAeg         = DateTime.UtcNow
        };

        _context.Vaccines.Add(v);
        await _context.SaveChangesAsync();
        return Ok(v);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] VaccineDto dto)
    {
        var v = await _context.Vaccines.FindAsync(id);
        if (v == null) return NotFound();

        v.Nimetus           = dto.Nimetus;
        v.ManustamisKuupAev = dto.ManustamisKuupAev;
        v.JargmineKuupAev   = dto.JargmineKuupAev;
        v.Arst              = dto.Arst;
        v.Partii            = dto.Partii;
        v.Markused          = dto.Markused;

        await _context.SaveChangesAsync();
        return Ok(v);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var v = await _context.Vaccines.FindAsync(id);
        if (v == null) return NotFound();
        _context.Vaccines.Remove(v);
        await _context.SaveChangesAsync();
        return Ok();
    }
}

public class VaccineDto
{
    public int LemmikloomId { get; set; }
    public string Nimetus { get; set; } = string.Empty;
    public DateTime ManustamisKuupAev { get; set; }
    public DateTime? JargmineKuupAev { get; set; }
    public string? Arst { get; set; }
    public string? Partii { get; set; }
    public string? Markused { get; set; }
}
