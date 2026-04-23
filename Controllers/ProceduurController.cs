using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Lemmikloomad.Data;
using Lemmikloomad.Models;

namespace Lemmikloomad.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProceduurController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProceduurController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> List() =>
        Ok(await _context.Protseduurid.ToListAsync());

    // Ühe protseduuri andmed ID järgi
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var proc = await _context.Protseduurid.FindAsync(id);
        return proc == null ? NotFound() : Ok(proc);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Add([FromBody] ProceduurDto dto)
    {
        var proc = MapDto(new Protseduur(), dto);
        _context.Protseduurid.Add(proc);
        await _context.SaveChangesAsync();
        return Ok(proc);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] ProceduurDto dto)
    {
        var proc = await _context.Protseduurid.FindAsync(id);
        if (proc == null) return NotFound();
        MapDto(proc, dto);
        await _context.SaveChangesAsync();
        return Ok(proc);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var proc = await _context.Protseduurid.FindAsync(id);
        if (proc == null) return NotFound();
        _context.Protseduurid.Remove(proc);
        await _context.SaveChangesAsync();
        return Ok();
    }

    // Abifunktsioon DTO väljade kopeerimiseks mudelisse
    private static Protseduur MapDto(Protseduur proc, ProceduurDto dto)
    {
        proc.Nimi        = dto.Nimi;
        proc.NimiRu      = dto.NimiRu;
        proc.NimiEn      = dto.NimiEn;
        proc.Kirjeldus   = dto.Kirjeldus;
        proc.KirjeldusRu = dto.KirjeldusRu;
        proc.KirjeldusEn = dto.KirjeldusEn;
        proc.Hind        = dto.Hind;
        proc.Kestus      = dto.Kestus;
        proc.Kategooria  = dto.Kategooria;
        proc.Ikoon       = dto.Ikoon ?? "🏥";
        return proc;
    }
}

public class ProceduurDto
{
    public string Nimi { get; set; } = string.Empty;
    public string? NimiRu { get; set; }
    public string? NimiEn { get; set; }
    public string Kirjeldus { get; set; } = string.Empty;
    public string? KirjeldusRu { get; set; }
    public string? KirjeldusEn { get; set; }
    public decimal Hind { get; set; }
    public int Kestus { get; set; }
    public string Kategooria { get; set; } = string.Empty;
    public string? Ikoon { get; set; }
}
