using System;
namespace Packer_Challenge.Exceptions
{
    public class APIException : Exception
    {
        public APIException(string message) : base(message)
        {
        }

        public APIException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}

