# Cumulus API Documentation

This document provides details about the API endpoints available in the Cumulus weather application server.

## Base URL

The API is served from the same host as the application. All endpoint paths are prefixed with `/api`.

---

## 1. Location Endpoints

These endpoints provide data for Indonesian administrative regions. The data is queried from a MySQL database.

### GET `/api/search-location`

Searches for village locations based on a query string.

-   **Query Parameters:**
    -   `q` (string): The search term for the village name. Minimum 2 characters.
-   **Success Response (200):** `application/json`
    ```json
    [
      {
        "code": "35.08.01.2004",
        "name": "TAMBAHREJO"
      },
      {
        "code": "35.08.01.2005",
        "name": "SENDURO"
      }
    ]
    ```

### GET `/api/all-locations`

Retrieves a list of all village locations. This is intended for client-side caching.

-   **Query Parameters:** None
-   **Success Response (200):** `application/json`
    ```json
    [
      {
        "code": "11.01.01.2001",
        "name": "AIR PINANG"
      },
      {
        "code": "11.01.01.2002",
        "name": "UJUNG PADANG"
      }
    ]
    ```

### GET `/api/provinces`

Retrieves a list of all provinces in Indonesia.

-   **Query Parameters:** None
-   **Success Response (200):** `application/json`
    ```json
    [
      {
        "code": "11",
        "name": "ACEH"
      },
      {
        "code": "12",
        "name": "SUMATERA UTARA"
      }
    ]
    ```

### GET `/api/cities`

Retrieves a list of cities (regencies) within a specific province.

-   **Query Parameters:**
    -   `province` (string, required): The code of the province (e.g., `35` for Jawa Timur).
-   **Success Response (200):** `application/json`
    ```json
    [
      {
        "code": "35.01",
        "name": "PACITAN",
        "type": "KABUPATEN"
      },
      {
        "code": "35.02",
        "name": "PONOROGO",
        "type": "KABUPATEN"
      }
    ]
    ```

### GET `/api/districts`

Retrieves a list of districts within a specific city/regency.

-   **Query Parameters:**
    -   `city` (string, required): The code of the city/regency (e.g., `35.08`).
-   **Success Response (200):** `application/json`
    ```json
    [
      {
        "code": "35.08.01",
        "name": "SENDURO"
      },
      {
        "code": "35.08.02",
        "name": "GUCIAH"
      }
    ]
    ```

### GET `/api/villages`

Retrieves a list of villages within a specific district.

-   **Query Parameters:**
    -   `district` (string, required): The code of the district (e.g., `35.08.01`).
-   **Success Response (200):** `application/json`
    ```json
    [
      {
        "code": "35.08.01.2001",
        "name": "KANDANGAN",
        "village_type": "DESA"
      },
      {
        "code": "35.08.01.2002",
        "name": "SARIKEMUNING",
        "village_type": "DESA"
      }
    ]
    ```

### GET `/api/search-regency`

Searches for regencies (Kabupaten/Kota) by name.

-   **Query Parameters:**
    -   `q` (string): The search term for the regency name. Minimum 2 characters.
-   **Success Response (200):** `application/json`
    ```json
    [
        {
            "id": 123,
            "code": "35.08",
            "name": "LUMAJANG",
            "type": "KABUPATEN"
        }
    ]
    ```

### GET `/api/search-unified`

Performs a unified search across regencies, districts, and villages.

-   **Query Parameters:**
    -   `q` (string): The search term. Minimum 2 characters.
-   **Success Response (200):** `application/json`
    ```json
    [
        {
            "id": 16,
            "code": "35.08",
            "name": "LUMAJANG",
            "type": "regency",
            "parent_name": null,
            "search_type": "Kabupaten/Kota"
        },
        {
            "id": 451,
            "code": "35.08.01",
            "name": "SENDURO",
            "type": "district",
            "parent_name": "LUMAJANG",
            "search_type": "Kecamatan"
        }
    ]
    ```

### GET `/api/random-village`

Gets a single random village from within a specified regency.

-   **Query Parameters:**
    -   `regencyId` (integer, required): The ID of the regency from the `regencies` table.
-   **Success Response (200):** `application/json`
    ```json
    {
        "code": "35.08.11.2005",
        "name": "ROGOYOSO",
        "district_name": "ROGOJAMPI"
    }
    ```
-   **Error Response (404):**
    ```json
    {
        "error": "No villages found for this regency."
    }
    ```

---

## 2. Weather Endpoint

This endpoint fetches weather forecast data from the public BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) API.

### GET `/api/cuaca`

Retrieves the weather forecast for a specific administrative area (level 4).

-   **Query Parameters:**
    -   `adm4` (string, required): The administrative area code (e.g., a village code like `501620`).
-   **Success Response (200):** `application/json`
    ```json
    {
      "lokasi": {
        "desa": "Senduro",
        "kecamatan": "Senduro",
        "kota": "Lumajang",
        "provinsi": "Jawa Timur",
        "lat": -8.08,
        "lon": 112.98,
        "timezone": "WIB"
      },
      "prakiraan": [
        {
          "hari": "Jumat, 29 November 2025",
          "periode": [
            {
              "local_datetime": "2025-11-29T00:00:00+07:00",
              "t": 22,
              "hu": 95,
              "weather_desc": "Berawan",
              "weather_desc_en": "Cloudy",
              "url_ikon": "https://...",
              "wind_dir": "SW",
              "wind_speed": 10
            }
          ]
        }
      ]
    }
    ```
-   **Error Responses:**
    -   `400 Bad Request`: If the `adm4` parameter is missing.
    -   `404 Not Found`: If no weather data is found for the given `adm4` code.
    -   `500 Internal Server Error`: If there is an error fetching or processing data from the BMKG API.
    -   `504 Gateway Timeout`: If the request to the BMKG API times out.
