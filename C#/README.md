# Trading Economics - C# examples

Use this project as a reference how integrate your .NET application with Trading Economics data. The project provides general examples of how one can access the Trading Economics API using the programming language C#. The .cs files are divided by area of interest into the API.

#

## Getting Started

* We recommend to get the Visual Studio IDE
* https://visualstudio.microsoft.com/vs/

#

## Usage

Since there are .cs files for each area within the same solution, to run the desired file on startup, the project configuration file (.csproj) must be tweaked. There are two simple ways to do this configuration change.

1. Visual Studio IDE
* Right click on the _CSharpExamples_ project and click the last option (Properties). 
* Under the Application section, choose the Startup object that you like, meaning, the file that you would like to execute on startup.

2. Text Editor
* Open the file _CSharpExamples.csproj_
* Find the tag &lt;StartupObject&gt; 
* Change the inner object with the namespace and name of the file you want to execute.

```
<PropertyGroup>
    <StartupObject>CSharpExamples.Streamer</StartupObject>
</PropertyGroup>
```
#

## API Key

Please subscribe to a plan at https://tradingeconomics.com/api/pricing.aspx to get an API key. You can provide your key when prompted during program execution for full API access.
