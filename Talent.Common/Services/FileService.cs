using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private IAwsService _awsService;
        private readonly string _bucketName;

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _awsService = awsService;
            _bucketName = "projecttalentadvancedtasks";
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            string fileUrl = await _awsService.GetStaticUrl(id, _bucketName);
            return fileUrl;
        }

        public async Task<string> GetPresignedFileURL(string id, FileType type)
        {
            string fileUrl = await _awsService.GetPresignedUrlObject(id, _bucketName);
            return fileUrl;
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            try
            {
                var uniqueFileName = ($"{DateTime.Now.Ticks}_{file.FileName}");
                using (MemoryStream memoryStream = new MemoryStream())
                {

                    await file.CopyToAsync(memoryStream);
                    memoryStream.Position = 0;
                    bool uploadSuccess = await _awsService.PutFileToS3(uniqueFileName, memoryStream, _bucketName, false);
                    if (!uploadSuccess)
                    {
                        return "";
                    }
                }
                return uniqueFileName;
            }
            catch
            {
                return "";
            }
        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            try
            {
                var removeSuccess = await _awsService.RemoveFileFromS3(id, _bucketName);
                if (!removeSuccess)
                    return false;
            }
            catch
            {
                return false;
            }
            return true;
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
