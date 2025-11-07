-- Tours tablosundaki kolonları kontrol et
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tours' 
ORDER BY ordinal_position;

-- Popular field var mı?
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'tours' 
  AND column_name = 'popular'
) AS has_popular;

-- Meeting point fields var mı?
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'tours' 
  AND column_name = 'meetingPointAddress'
) AS has_meeting_point_address;

SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'tours' 
  AND column_name = 'meetingPointMapUrl'
) AS has_meeting_point_map_url;

-- Available times var mı?
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'tours' 
  AND column_name = 'availableTimes'
) AS has_available_times;

-- Category kolonu var mı? (olmamalı)
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'tours' 
  AND column_name = 'category'
) AS has_category;

-- CategoryId kolonu var mı? (olmamalı)
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_name = 'tours' 
  AND column_name = 'categoryId'
) AS has_category_id;

