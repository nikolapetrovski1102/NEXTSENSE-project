﻿namespace backend.DTOs
{
    public class LoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool rememberMe { get; set; }
    }
}
