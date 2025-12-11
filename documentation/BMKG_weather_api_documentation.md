# BMKG Weather API Documentation

This document provides a comprehensive guide for accessing and utilizing weather forecast data from the Indonesian Agency for Meteorology, Climatology, and Geophysics (BMKG) via their Open Data API. The API offers an accessible and straightforward method to retrieve public weather information.

## Overview

The BMKG Weather API provides extensive weather forecast data for all villages and sub-districts across Indonesia.

| Aspect | Detail |
| :----- | :----- |
| Coverage | National, encompassing all villages and sub-districts |
| Forecast Horizon | Up to 3 days in advance |
| Temporal Detail | Data updates every 3 hours (8 data points per day) |
| Data Refresh Rate | Refreshed twice daily |
| Format | JSON |
| Rate Limit | Maximum 60 requests per minute per IP address |

### Attribution Requirement

It is mandatory to cite BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) as the data source in any application or service utilizing this API.

## API Access

### Main Endpoint

Access the weather forecast data via the following GET endpoint:

```
GET https://api.bmkg.go.id/publik/prakiraan-cuaca
```

### Required Parameters

The API requires a single parameter for specifying the target administrative area:

| Parameter | Type | Required | Description |
| :-------- | :--- | :------- | :---------- |
| `adm4` | String | Yes | The administrative code for the target village or sub-district |

### Administrative Code

The `adm4` codes adhere to the standards outlined in the Decree of the Minister of Home Affairs Number 100.1.1-6117 Year 2022.

For example, the administrative code for Kemayoran Sub-district is `31.71.03.1001`.

### Example Request

To retrieve weather data for Kemayoran Sub-district:

```bash
curl "https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=31.71.03.1001"
```

## Response Data Structure

The API returns a JSON object containing location details and an array of weather forecast data.

### Data Dictionary

| Key | Format | Description |
| :-- | :----- | :---------- |
| `utc_datetime` | `YYYY-MM-DD HH:mm:ss` | Forecast time in UTC |
| `local_datetime` | `YYYY-MM-DD HH:mm:ss` | Forecast time in local timezone |
| `t` | Celsius | Air temperature |
| `hu` | Percentage | Humidity |
| `weather_desc` | String | Weather condition description in Indonesian |
| `weather_desc_en` | String | Weather condition description in English |
| `ws` | km/h | Wind speed |
| `wd` | String | Wind direction (e.g., N for North) |
| `tcc` | Percentage | Total cloud cover |
| `vs_text` | km | Visibility distance |
| `analysis_date` | UTC Timestamp | Date and time when the data was generated |
| `image` | URL | URL to a weather icon |

### Example Response

```json
{
  "lokasi": {
    "adm1": "31",
    "adm2": "31.71",
    "adm3": "31.71.01",
    "adm4": "31.71.01.1001",
    "provinsi": "DKI Jakarta",
    "kotkab": "Kota Adm. Jakarta Pusat",
    "kecamatan": "Gambir",
    "desa": "Gambir",
    "lon": 106.8267073562,
    "lat": -6.1763842693,
    "timezone": "Asia/Jakarta"
  },
  "data": [
    {
      "lokasi": {},
      "cuaca": [
        [
          {
            "datetime": "2025-10-12T08:00:00Z",
            "t": 32,
            "tcc": 79,
            "weather_desc": "Cerah Berawan",
            "weather_desc_en": "Partly Cloudy",
            "ws": 10.1,
            "hu": 59,
            "vs_text": "> 10 km",
            "analysis_date": "2025-10-12T00:00:00",
            "image": "https://api-apps.bmkg.go.id/storage/icon/cuaca/cerah%20berawan-am.svg",
            "utc_datetime": "2025-10-12 08:00:00",
            "local_datetime": "2025-10-12 15:00:00"
          }
        ]
      ]
    }
  ]
}
```

## Code Example in PHP

The following PHP script demonstrates how to fetch and display weather data from the BMKG API.

```php
<?php
$kode_wilayah = "31.71.01.1001";
$api_url = "https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=" . $kode_wilayah;

$response_body = @file_get_contents($api_url);

if ($response_body === false) {
    die("Error: Failed to retrieve data from BMKG server.");
}

$data = json_decode($response_body, true);

if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    die("Error: Invalid JSON response. " . htmlspecialchars(json_last_error_msg()));
}

header("Content-Type: text/html; charset=utf-8");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BMKG Weather Forecast</title>
    <style>
        body { font-family: sans-serif; line-height: 1.5; padding: 15px; max-width: 800px; margin: 0 auto; }
        h1, h2, h3, h4 { margin-top: 1.5em; color: #333; }
        ul { list-style: none; padding-left: 0; }
        li { margin-bottom: 0.5em; border-bottom: 1px solid #eee; padding: 10px 0; display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
        img.weather-icon { width: 30px; height: 30px; vertical-align: middle; }
        .info-box { background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
        .attribution { margin-top: 2em; font-size: 0.8em; color: #666; }
    </style>
</head>
<body>

<h1>BMKG Weather Forecast</h1>

<?php if (isset($data["lokasi"]["desa"])): ?>
    <div class="info-box">
        <h2>Location: <?php echo htmlspecialchars($data["lokasi"]["desa"]); ?></h2>
        <p>
            <strong>Sub-district:</strong> <?php echo htmlspecialchars($data["lokasi"]["kecamatan"] ?? "-"); ?><br>
            <strong>City/Regency:</strong> <?php echo htmlspecialchars($data["lokasi"]["kotkab"] ?? "-"); ?><br>
            <strong>Province:</strong> <?php echo htmlspecialchars($data["lokasi"]["provinsi"] ?? "-"); ?><br>
            <strong>Timezone:</strong> <?php echo htmlspecialchars($data["lokasi"]["timezone"] ?? "-"); ?>
        </p>
    </div>
<?php else: ?>
    <h2>Error: Location not found. Please check the administrative code.</h2>
<?php endif; ?>

<h3>3-Day Weather Forecast:</h3>

<?php
if (isset($data["data"][0]["cuaca"]) && is_array($data["data"][0]["cuaca"])) {
    foreach ($data["data"][0]["cuaca"] as $index_hari => $prakiraan_harian) {
        echo "<h4>Day " . ($index_hari + 1) . "</h4>";
        echo "<ul>";
        
        if (is_array($prakiraan_harian)) {
            foreach ($prakiraan_harian as $prakiraan) {
                $jam        = htmlspecialchars($prakiraan["local_datetime"] ?? "-");
                $cuaca      = htmlspecialchars($prakiraan["weather_desc"] ?? "-");
                $suhu       = htmlspecialchars($prakiraan["t"] ?? "-");
                $kelembapan = htmlspecialchars($prakiraan["hu"] ?? "-");
                $angin_kec  = htmlspecialchars($prakiraan["ws"] ?? "-");
                $angin_arah = htmlspecialchars($prakiraan["wd"] ?? "-");
                
                $img_url = $prakiraan["image"] ?? "";
                $img_tag = "";
                if (!empty($img_url)) {
                    $img_url = str_replace(" ", "%20", $img_url);
                    $img_tag = '<img class="weather-icon" src="' . $img_url . '" alt="' . $cuaca . '">';
                }

                echo "<li>";
                echo "<strong>{$jam}</strong> | ";
                echo "{$img_tag} <strong>{$cuaca}</strong> | ";
                echo "Temperature: <strong>{$suhu}C</strong> | ";
                echo "Humidity: {$kelembapan}% | ";
                echo "Wind: {$angin_kec} km/h ({$angin_arah})";
                echo "</li>";
            }
        }
        echo "</ul>";
    }
} else {
    echo "<p>No forecast data available.</p>";
}
?>

<hr>
<small class="attribution">Data Source: Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</small>

</body>
</html>
```

## Data Source

All weather data is provided by Badan Meteorologi, Klimatologi, dan Geofisika (BMKG).
