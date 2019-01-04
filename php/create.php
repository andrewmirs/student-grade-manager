<?php
$student_name = $_POST['name'];
$student_course = $_POST['course'];
$student_grade = $_POST['grade'];

$query = "INSERT INTO `students`(`name`, `course`, `grade`) VALUES ('$student_name', '$student_course', $student_grade)";
print $query;

if (mysqli_query($conn, $query)){
    $output['success'] = true;
} else {
    $output['message'] = 'Error adding student to the database';
}

?>