
-- 1. Filter a specific user by username (Juan Perez)
SELECT * FROM users 
WHERE user_name = 'juan_perez85';

-- 2. Filter using AND to validate credentials (ID and Password)
SELECT * FROM users 
WHERE id_person = 1 
  AND password = 'juanxd';

-- 3. Filter using OR to retrieve multiple specific users (Sofia or Paty)
SELECT * FROM users 
WHERE user_name = 'sofia' 
   OR user_name = 'paty';

-- 4. Simple sort
SELECT * FROM users 
ORDER BY user_name ASC;
