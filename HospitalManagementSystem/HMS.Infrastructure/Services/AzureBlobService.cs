using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;

namespace HMS.Infrastructure.Services
{
	public class AzureBlobService : IBlobStorageService
	{
		private readonly BlobContainerClient _container;

		public AzureBlobService(IOptions<AzureBlobSettings> options)
		{
			var settings = options.Value;

			var client = new BlobServiceClient(settings.ConnectionString);

			_container = client.GetBlobContainerClient(settings.ContainerName);

			// No public access requested here — many storage accounts have "Allow Blob anonymous
			// access" disabled at the account level, which makes CreateIfNotExists(PublicAccessType.Blob)
			// throw even with a valid account key. Containers are created private; each uploaded
			// blob gets its own long-lived SAS read URL instead (see UploadAsync below), which works
			// regardless of that account setting.
			_container.CreateIfNotExists();
		}

		public async Task<string> UploadAsync(Stream content, string fileName, string contentType,
			CancellationToken cancellationToken = default)
		{
			var blobName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
			var blobClient = _container.GetBlobClient(blobName);

			await blobClient.UploadAsync(
				content,
				new BlobHttpHeaders { ContentType = contentType },
				cancellationToken: cancellationToken);

			// Effectively-permanent read-only signed URL (works even though the container is private).
			if (blobClient.CanGenerateSasUri)
			{
				var sasUri = blobClient.GenerateSasUri(BlobSasPermissions.Read, DateTimeOffset.UtcNow.AddYears(50));
				return sasUri.ToString();
			}

			return blobClient.Uri.ToString();
		}
	}
}
