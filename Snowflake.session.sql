-- SELECT LOCATION_NAME as name, latitude, longitude
-- FROM PUBLIC.CORE_POI
-- WHERE ST_DISTANCE(ST_POINT(longitude, latitude), ST_POINT(-121.141057, 37.752761)) <= 10/69;

-- SELECT LOCATION_NAME, latitude, longitude FROM PUBLIC.CORE_POI WHERE REGION='CA';

SELECT LOCATION_NAME, street_address, city, region, Phone_number, latitude, longitude
FROM PUBLIC.CORE_POI
WHERE ST_DISTANCE(
    TO_GEOGRAPHY(ST_POINT(longitude, latitude)),
    TO_GEOGRAPHY(ST_POINT(-121.141057, 37.752761))
) <= 16093.4; -- 10 miles in meters
