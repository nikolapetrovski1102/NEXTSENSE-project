namespace backend.DTOs.Filters
{
    public class FilterDTO
    {
        public List<string> manufacturers { get; set; } = new List<string>();
        public string sort { get; set; } = "";
    }
}
