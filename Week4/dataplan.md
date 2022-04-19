# Data Plan Update

https://data.cityofnewyork.us/Public-Safety/NYPD-Arrests-Data-Historic-/8h9b-rp9u/data

This dataset contains a list of every single arrest in NYC up till the end of 2021. Variables of interest include the reason for arrest, the perpatrator race and sex, as well as the exact coordinates of where the crime was committed.

Data will be exported from the website as a CSV file from the given link and geocoded using JavaScript. Each category of data by perpetrator_race will be a separate layer on the map, and toggles will allow users to view one or more layers at the same time. Likewise, using the field arrest_date, we will also create a time filter that allows users to select which years they want to see arrest data from. Narratives will be driven by combining the offense description, arrest date, and details about the perpetrator as a pop-up box when a marker is clicked.


https://data.cityofnewyork.us/Public-Safety/Crime-Map-/5jvd-shfj: This dataset includes all valid felony, misdemeanor, and violation crimes reported to the New York City Police Department (NYPD) in the year 2016. The data provides specific offense descriptions, as well as specific location descriptions, accompanied by coordinates. 

This data will be exported as a CSV from the given link and geocoded using Javascript. The data points from this map, primarily the offense description and the date of complaint, will be integrated as a separate layer that can be toggled on and off as well. 