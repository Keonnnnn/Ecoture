using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Ecoture.Model.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecoture.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FileController(IConfiguration configuration, ILogger<FileController> logger) : ControllerBase
    {
        private readonly ILogger<FileController> _logger = logger;

        private Cloudinary GetCloudinary()
        {
            var cloudName = configuration["Cloudinary:CloudName"]
                ?? throw new Exception("Cloudinary:CloudName is not configured.");
            var apiKey = configuration["Cloudinary:ApiKey"]
                ?? throw new Exception("Cloudinary:ApiKey is not configured.");
            var apiSecret = configuration["Cloudinary:ApiSecret"]
                ?? throw new Exception("Cloudinary:ApiSecret is not configured.");

            var account = new Account(cloudName, apiKey, apiSecret);
            return new Cloudinary(account) { Api = { Secure = true } };
        }

        [HttpPost("upload"), Authorize]
        [ProducesResponseType(typeof(UploadResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file.Length > 1024 * 1024)
            {
                return BadRequest(new { message = "Maximum file size is 1MB" });
            }

            try
            {
                var cloudinary = GetCloudinary();
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    UseFilename = false,
                    UniqueFilename = true,
                    Overwrite = false
                };

                var result = await cloudinary.UploadAsync(uploadParams);
                if (result.Error != null)
                {
                    _logger.LogError("Cloudinary upload error: {Error}", result.Error.Message);
                    return StatusCode(500, new { message = "File upload failed." });
                }

                return Ok(new UploadResponse { Filename = result.SecureUrl.ToString() });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(500, new { message = "File upload failed." });
            }
        }
    }
}
