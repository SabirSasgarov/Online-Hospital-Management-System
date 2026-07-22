namespace HMS.API.Controllers
{
	/// <summary>
	/// Generic image upload endpoint used for profile photos (doctors, nurses, admins, patients)
	/// and any other place that needs a hosted image URL. Files are stored under wwwroot/uploads
	/// and served back as static files.
	/// </summary>
	[Authorize]
	public class UploadController : BaseApiController
	{
		private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
		private static readonly string[] AllowedContentTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
		private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

		[HttpPost("image")]
		[RequestSizeLimit(MaxFileSizeBytes)]
		public async Task<IActionResult> UploadImage(IFormFile? file)
		{
			if (file is null || file.Length == 0)
				return BadRequest(Result.Failure("No file was uploaded."));

			if (file.Length > MaxFileSizeBytes)
				return BadRequest(Result.Failure("File is too large. Maximum size is 5 MB."));

			var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
			if (!AllowedExtensions.Contains(extension) || !AllowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
				return BadRequest(Result.Failure("Unsupported file type. Please upload a JPG, PNG, GIF, or WEBP image."));

			var uploadsRoot = Path.Combine(AppContext.BaseDirectory, "wwwroot", "uploads");
			Directory.CreateDirectory(uploadsRoot);

			var fileName = $"{Guid.NewGuid()}{extension}";
			var filePath = Path.Combine(uploadsRoot, fileName);

			await using (var stream = new FileStream(filePath, FileMode.Create))
			{
				await file.CopyToAsync(stream);
			}

			var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
			return Ok(Result<string>.Success(url, "File uploaded."));
		}
	}
}
