namespace HMS.Application.Public
{
    /// <summary>
    /// Deliberately minimal — used on the unauthenticated marketing home page's "Our Doctors"
    /// section, so it must never include PII like email or phone.
    /// </summary>
    public class PublicDoctorDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public bool IsAvailable { get; set; }
    }
}
