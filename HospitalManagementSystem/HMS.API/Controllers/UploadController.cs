namespace HMS.API.Controllers
{
	/// <summary>
	/// Generic image upload endpoint used for profile photos (doctors, nurses, admins, patients)
	/// and any other place that needs a hosted image URL. Files are uploaded to Azure Blob Storage
	/// and the public blob URL is returned.
	/// </summary>
	[Authorize]
	public class UploadController(IBlobStorageService blobStorage) : BaseApiController
	{
		private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
		private static readonly string[] AllowedContentTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
		private const long MaxFileSizeBytes = 5 * 1024 * 1024;

		[HttpPost("image")]
		[RequestSizeLimit(MaxFileSizeBytes)]
		public async Task<IActionResult> UploadImage(IFormFile? file, CancellationToken ct)
		{
			if (file is null || file.Length == 0)
				return BadRequest(Result.Failure("No file was uploaded."));

			if (file.Length > MaxFileSizeBytes)
				return BadRequest(Result.Failure("File is too large. Maximum size is 5 MB."));

			var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
			if (!AllowedExtensions.Contains(extension) || !AllowedContentTypes.Contains(file.ContentType.ToLowerInvariant()))
				return BadRequest(Result.Failure("Unsupported file type. Please upload a JPG, PNG, GIF, or WEBP image."));

			await using var stream = file.OpenReadStream();
			var url = await blobStorage.UploadAsync(stream, file.FileName, file.ContentType, ct);

			return Ok(Result<string>.Success(url, "File uploaded."));
		}
	}
}
