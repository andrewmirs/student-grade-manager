<?php 

$conn = mysqli_connect('', '', '', '');

$truncateSQL = "TRUNCATE `students`";

mysqli_query($conn, $truncateSQL); 

$insertSQL = "INSERT INTO `students` (`id`, `name`, `course`, `grade`) VALUES
(69, 'Steven Rogers', 'Biology', 56),
(71, 'Bruce Wayne', 'Biology', 75),
(73, 'Scott Summers', 'Biology', 84),
(76, 'Peter Parker', 'Biology', 92),
(77, 'Cain Marko', 'Algebra', 83),
(78, 'Andrew Mirshafiee', 'Algebra', 78),
(79, 'Lynn Hayden', 'English', 74),
(80, 'Jan Arrah', 'English', 81),
(81, 'Clark Kent', 'English ', 87),
(82, 'Orin Curry', 'English', 89),
(86, 'Anna Marie', 'English', 97);
";


mysqli_query($conn, $insertSQL);

?>