-- Bookings tablosundaki kolonları kontrol et
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;

-- Eksik kolonları kontrol et
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'specialRequests') THEN 'specialRequests var' ELSE 'specialRequests YOK' END AS special_requests_check,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'contactPhone') THEN 'contactPhone var' ELSE 'contactPhone YOK' END AS contact_phone_check,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'contactEmail') THEN 'contactEmail var' ELSE 'contactEmail YOK' END AS contact_email_check;

