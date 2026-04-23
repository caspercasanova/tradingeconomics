using System;  
using System.IO;  
using System.Net;  
  
namespace Examples.System.Net
{
    public class Indicators
    {
        public static void Main()
        {
            // Create a request for the URL. 
            // Please subscribe to a plan at https://tradingeconomics.com/api/pricing.aspx to get an API key.   
            WebRequest request = WebRequest.Create("https://api.tradingeconomics.com/indicators?c=Please subscribe to a plan at https://tradingeconomics.com/api/pricing.aspx to get an API key.");
    
            // Get the response.  
            WebResponse response = request.GetResponse();
            // Display the status.  
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            
            // Get the stream containing content returned by the server. 
            // The using block ensures the stream is automatically closed. 
            using (Stream dataStream = response.GetResponseStream())
            {
                // Open the stream using a StreamReader for easy access.  
                StreamReader reader = new StreamReader(dataStream);
                // Read the content.  
                string responseFromServer = reader.ReadToEnd();
                // Display the content.  
                Console.WriteLine(responseFromServer);
            }
            
            // Close the response.  
            response.Close();
        }
    }
}