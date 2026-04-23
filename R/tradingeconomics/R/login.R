credCheck <- function(usersApiKey){
  pattern <- ":"
  if (!grepl(pattern, usersApiKey)) stop('Incorrect credentials format!')
}

#'Insert users APIkey
#'@export login
#'@param usersApiKey string.

login <- function(usersApiKey = NULL) {

    if (!is.null(usersApiKey)){
      credCheck(usersApiKey)
    } else {
      stop('API key is required. Please subscribe to a plan at https://tradingeconomics.com/api/pricing.aspx to get an API key.')
    }

     usersApiKey = gsub("[[:space:]]", "", usersApiKey)
     assign("apiKey", usersApiKey, envir = .GlobalEnv)
     
     #apikey <<- usersApiKey
     

    #return(apiKey)
}



