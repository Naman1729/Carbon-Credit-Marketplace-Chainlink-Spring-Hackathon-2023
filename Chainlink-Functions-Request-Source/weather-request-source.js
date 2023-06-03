// This function fetches the latest temperature for a particular area from openweathermap API
// Args include the zipcode of your location, ISO 3166 country code
// units- unit in which we want the temperature (standard, metric, imperial)

if (!secrets.apiKey) {
    throw Error("Weather API Key is not available!")
  }
  
  const zipCode = `${args[0]},${args[1]}`
  
  const geoCodingURL = "http://api.openweathermap.org/geo/1.0/zip?"
  
  console.log(`Sending HTTP request to ${geoCodingURL}zip=${zipCode}`)
  
  const geoCodingRequest = Functions.makeHttpRequest({
    url: geoCodingURL,
    method: "GET",
    params: {
      zip: zipCode,
      appid: secrets.apiKey,
    },
  })
  
  const geoCodingResponse = await geoCodingRequest
  
  if (geoCodingResponse.error) {
    console.error(geoCodingResponse.error)
    throw Error("Request failed, try checking the params provided")
  }
  
  const latitude = geoCodingResponse.data.lat
  const longitude = geoCodingResponse.data.lon
  
  const url = `https://api.openweathermap.org/data/2.5/weather?`
  
  console.log(`Sending HTTP request to ${url}lat=${latitude}&lon=${longitude}`)
  
  const weatherRequest = Functions.makeHttpRequest({
    url: url,
    method: "GET",
    params: {
      lat: latitude,
      lon: longitude,
      appid: secrets.apiKey,
    },
  })
  
  // Execute the API request (Promise)
  const weatherResponse = await weatherRequest
  if (weatherResponse.error) {
    console.error(weatherResponse.error)
    throw Error("Request failed, try checking the params provided")
  }
  
  // gets the current temperature
  const weather = weatherResponse.data.weather[0].description
  
  // Use JSON.stringify() to convert from JSON object to JSON string
  // Finally, use the helper Functions.encodeString() to encode from string to bytes
  return Functions.encodeString(weather)  