<?php
$student_id = $_POST['id'];

$query = "DELETE FROM `students` WHERE id = $student_id";

if (mysqli_query($conn, $query)){
    $output['success'] = true;
} else {
    $output['message'] = 'Error deleting student from the database';
}
?>