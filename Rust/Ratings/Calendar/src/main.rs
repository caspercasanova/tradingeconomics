use std::error::Error;

fn main() {
    let client = "";

	MakeCalendarRequest(client);
	MakeCalendarCountryRequest(client);
	MakeCalendarIndicatorRequest(client);
	MakeCalendarCountryIndicatorRequest(client);
	MakeCalendarIdRequest(client);
}

fn MakeCalendarRequest(client: &str) -> Result<(), Box<dyn Error>> {
    let resp = reqwest::blocking::get(format!("https://api.tradingeconomics.com/calendar?c={}", client))?.json::<serde_json::Value>()?;
    println!("-----------------------CALENDAR EVENTS----------------------");
    println!("{:#?}", resp);
    Ok(())

}

fn MakeCalendarCountryRequest(client: &str) -> Result<(), Box<dyn Error>> {
    let resp = reqwest::blocking::get(format!("https://api.tradingeconomics.com/calendar/country/united%20states?c={}", client))?.json::<serde_json::Value>()?;
    println!("-------------------CALENDAR BY COUNTRY => 'united states'------------------");
    println!("{:#?}", resp);
    Ok(())

}

fn MakeCalendarIndicatorRequest(client: &str) -> Result<(), Box<dyn Error>> {
    let resp = reqwest::blocking::get(format!("https://api.tradingeconomics.com/calendar/indicator/inflation%20rate/2016-03-01/2016-03-03?c={}", client))?.json::<serde_json::Value>()?;
    println!("-------------------CALENDAR BY INDICATORS AND DATES =>'INFLATION RATE'------------------");
    println!("{:#?}", resp);
    Ok(())

}

fn MakeCalendarCountryIndicatorRequest(client: &str) -> Result<(), Box<dyn Error>> {
    let resp = reqwest::blocking::get(format!("https://api.tradingeconomics.com/calendar/country/united%20states/indicator/initial%20jobless%20claims/2016-12-01/2017-02-25?c={}", client))?.json::<serde_json::Value>()?;
    println!("-------------------CALENDAR BY COUNTRY, INDICATOR AND DATES => 'united states, INITIAL JOBLESS CLAIMS'------------------");
    println!("{:#?}", resp);
    Ok(())

}

fn MakeCalendarIdRequest(client: &str) -> Result<(), Box<dyn Error>> {
    let resp = reqwest::blocking::get(format!("https://api.tradingeconomics.com/calendar/calendarid/174108,160025,160030?c={}", client))?.json::<serde_json::Value>()?;
    println!("-------------------CALENDAR BY ID=> '174108,160025,160030'------------------");
    println!("{:#?}", resp);
    Ok(())

}

