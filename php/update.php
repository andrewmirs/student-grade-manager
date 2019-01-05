<?php
$student_id = $_POST['id']; 
$student_name = $_POST['name'];
$student_course = $_POST['course'];
$student_grade = $_POST['grade'];


$query = "UPDATE `students` SET `name`=['$student_name'],`course`=['$student_course'],`grade`=['$student_grade'] WHERE id = $student_id";

if (mysqli_query($conn, $query)){
    $output['success'] = true;
} else {
    $output['message'] = 'Error updating student info';
}

?>