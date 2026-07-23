namespace HMS.Application.Common.Interfaces
{
    /// <summary>Uploads files (profile photos, announcement/offer images, etc.) to cloud storage and returns a public URL.</summary>
    public interface IBlobStorageService
    {
        Task<string> UploadAsync(Stream content, string fileName, string contentType,
            CancellationToken cancellationToken = default);
    }
}
