using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Lemmikloomad.Data;
using Lemmikloomad.Models;
using Lemmikloomad.Models.DTO;

namespace Lemmikloomad.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KliinikController : ControllerBase
{
    private readonly AppDbContext _context;

    public KliinikController(AppDbContext context) => _context = context;

    [HttpGet("list")]
    public async Task<IActionResult> List() =>
        Ok(await _context.Kliinikud
            .Select(k => new { k.Id, k.Nimi, k.Aadress, k.Telefon, k.Email, k.Kirjeldus })
            .ToListAsync());

    // Ühe kliiniku täielikud andmed koos lemmikloomadega
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var k = await _context.Kliinikud
            .Include(x => x.Lemmikloomad)
            .FirstOrDefaultAsync(x => x.Id == id);
        return k == null ? NotFound() : Ok(k);
    }

    [HttpPost("add")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Add([FromBody] KliinikCreateDto dto)
    {
        var kliinik = new Kliinik
        {
            Nimi      = dto.Nimi,
            Aadress   = dto.Aadress,
            Telefon   = dto.Telefon,
            Email     = dto.Email,
            Kirjeldus = dto.Kirjeldus
        };
        _context.Kliinikud.Add(kliinik);
        await _context.SaveChangesAsync();
        return Ok(kliinik);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] KliinikCreateDto dto)
    {
        var k = await _context.Kliinikud.FindAsync(id);
        if (k == null) return NotFound();

        k.Nimi      = dto.Nimi;
        k.Aadress   = dto.Aadress;
        k.Telefon   = dto.Telefon;
        k.Email     = dto.Email;
        k.Kirjeldus = dto.Kirjeldus;
        await _context.SaveChangesAsync();
        return Ok(k);
    }

    [HttpDelete("delete/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var k = await _context.Kliinikud.FindAsync(id);
        if (k == null) return NotFound();
        _context.Kliinikud.Remove(k);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
