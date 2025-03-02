using backend.Models;
using backend.DTOs;

namespace backend.Service
{
    public interface IAuthService
    {
        Task<string> LoginUserAsync(LoginDTO loginRequest);
        Task<string> RegisterUserAsync(RegisterDTO newUser);
    }
}
