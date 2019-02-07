<?php 

$conn = mysqli_connect('', '', '', '');

$truncateSQL = "TRUNCATE `students`";

mysqli_query($conn, $truncateSQL);

$insertSQL = "INSERT INTO `students` (`id`, `name`, `course`, `grade`) VALUES
(69, 'Andre Duparte', 'Biology', 56),
(71, 'Bruce Wayne', 'Biology', 75),
(73, 'Demarcus Cousins', 'Biology', 84),
(76, 'Maynard Guiao', 'Biology', 92),
(77, 'Tyreek Hill', 'Algebra', 83),
(78, 'John Tesley', 'Algebra', 78),
(79, 'Jessica Abrams', 'English', 74),
(80, 'Sridhar Madala', 'English', 81),
(81, 'Tony Precios', 'English ', 87),
(82, 'Andrew Mirshafiee', 'English', 89),
(86, 'Andy Park', 'English', 97);";


mysqli_query($conn, $insertSQL);

?>