using Microsoft.EntityFrameworkCore;
using backend.DTOs;
using backend.Models;
using backend.Utility;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text.Json;

namespace backend.Service.Implementation;

public class AuthService : IAuthService
{
    private readonly NSDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(NSDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<string> RegisterUserAsync(RegisterDTO newUser)
    {
        if (await _context.Users.AnyAsync(u => u.Email == newUser.Email || u.Username == newUser.Username))
        {
            return "User with this email or username already exists.";
        }

        newUser.Password = HashPassword(newUser.Password);

        User user = new()
        {
            FullName = newUser.FullName,
            Username = newUser.Username,
            Email = newUser.Email,
            Password = newUser.Password,
            PhoneNumber = newUser.Phone
        };  

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return "User registered successfully!";
    }

    public async Task<string> LoginUserAsync(LoginDTO loginRequest)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);
        if (user == null)
        {
            return "User does not exist.";
        }

        if (!VerifyPassword(loginRequest.Password, user.Password))
        {
            return "Invalid password.";
        }

        return GenerateJwtToken(user, loginRequest);
    }

    private string GenerateJwtToken(User user, LoginDTO loginRequest)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var expirationTime = loginRequest.rememberMe ? DateTime.Now.AddDays(30) : DateTime.Now.AddMinutes(120);

        var Sectoken = new JwtSecurityToken(_configuration["Jwt:Issuer"],
          _configuration["Jwt:Issuer"],
          null,
          expires: expirationTime,
          signingCredentials: credentials);

        var access_token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

        Dictionary<string, string> response_token = new Dictionary<string, string>
            {
                { "access_token", access_token },
                { "token_type", "Bearer" },
                { "valid_to", Sectoken.ValidTo.ToString("O") }
            };

        return JsonSerializer.Serialize(response_token);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string enteredPassword, string storedPassword)
    {
        return HashPassword(enteredPassword) == storedPassword;
    }
}
