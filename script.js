$(document).ready( initializeApp );

function initializeApp(){
      getData();
}

// Globals

var student_array = [];
var update_student_id = null;

// Functions

function handleAddClicked(){
      addStudent();
}

function handleCancelClick(){
      clearAddStudentFormInputs();
}

function handleEditClick( studentInfo ){
      $(".container").addClass("sgt-main-blur");
      $(".update-modal-container").removeClass("displaynone");
      $('#updateName').val(studentInfo.name);
      $('#updateCourse').val(studentInfo.course);
      $('#updateGrade').val(studentInfo.grade);
}

function handleUpdateClick(){
      var updateName = $('#updateName').val();
      var updateCourse = $('#updateCourse').val();
      var updateGrade = $('#updateGrade').val();
      updateData( update_student_id, updateName, updateCourse, updateGrade );
      update_student_id = null;

      $(".container").removeClass("sgt-main-blur");
      $(".update-modal-container").addClass("displaynone");
}

function handleCancelUpdate(){
      $(".container").removeClass("sgt-main-blur");
      $(".update-modal-container").addClass("displaynone");
      update_student_id = null;
}

function addStudent(){
      var studentName = $('#studentName').val();
      var studentCourse = $('#course').val();
      var studentGrade = $('#studentGrade').val();
      console.log('Add student info:', studentName, studentCourse, studentGrade);
      addData(studentName, studentCourse, studentGrade); 
}

function clearAddStudentFormInputs(){
      $('#studentName').val('');
      $('#course').val('');
      $('#studentGrade').val('');
}

function renderStudentOnDom( studentList ){
      $('.student-list tbody').empty();

      for (var i=0; i<studentList.length; i++){
      
      var editButton = $('<button>', {
            'text': 'edit',
            'class': 'btn btn-warning btn-xs',
      });

      (function( button, index ){
            var student = student_array[index];
            button.click(function(){
          
                  handleEditClick(student);
                  update_student_id = student.id
                  
            });
      })( editButton, i );

            
      var deleteButton = $('<button>', {
            'text': 'delete',
            'class': 'btn btn-danger btn-xs',
      });

      (function( button, index ){
            var student = student_array[index];
            button.click(function(){

                  deleteData(student.id, student, event.currentTarget, studentList);

            });
      })( deleteButton, i );

      var tableDataName = $('<td>').append(studentList[i]['name']);
      var tableDataCourse = $('<td>').append(studentList[i]['course']);
      var tableDataGrade = $('<td>').append(studentList[i]['grade']);
      var tableRowEdit = $('<td>').append(editButton);
      var tableRowDelete = $('<td>').append(deleteButton);
      var tableRow = $('<tr>').append(tableDataName, tableDataCourse, tableDataGrade, tableRowEdit, tableRowDelete);
      $('.student-list').append(tableRow);
      }
}

function removeStudent( student ){
      var index = student_array.indexOf(student);
     if ( index === -1 ){
      return
     }
     student_array.splice(index,1);
}

function updateStudentList( studentList ){
      renderStudentOnDom( studentList );
      renderGradeAverage( calculateGradeAverage(studentList) );
}

// Calculate and Render Student Data

function calculateGradeAverage( studentList ){
      var gradesTotal = 0;
      for (var student=0; student<studentList.length; student++){
           gradesTotal += parseFloat( studentList[student].grade );
      }
      studentAvg = parseInt(gradesTotal/studentList.length);
      if (isNaN(studentAvg)){
            studentAvg = 0;
      }
      return studentAvg;
}

function renderGradeAverage( studentAvg ){
      $('.avgGrade').text( studentAvg );
}

// AJAX Calls

      // Get list from DB

function getData(){
      var key = {api_key:'root'}
    var ajaxConfig = {
        data: key,
        dataType: 'json',
        method: 'GET',
        url: 'http://localhost:8888/php/index.php?action=read',
        success: function(result) {
            for (var x=0; x < result.students.length; x++){
                  var tempObj={
                        'id': null,
                        'name': null,
                        'course': null,
                        'grade': null
                  }
                  tempObj['id'] = result.students[x]['id'];
                  tempObj['name'] = result.students[x]['name'];
                  tempObj['grade'] = result.students[x]['grade'];
                  tempObj['course'] = result.students[x]['course'];
                  student_array.push(tempObj);
            }
            updateStudentList(student_array);
            console.log('Current students in DB:', result);
        }
      
    }
    $.ajax(ajaxConfig);
}

      // Add a student to DB

function addData( name, course, grade ){
      $.ajax({
      dataType: 'json',
      data: {
            'api_key': 'root',
            'name': name,
            'course': course,
            'grade': grade,
            },
      method: 'POST',
      url: 'http://localhost:8888/php/index.php?action=create',
      success: function(result){
            if (result.success === false){
                  for(var errorMsg=0; errorMsg< result.errors.length; errorMsg++){
                        alert(result.errors[errorMsg]);
                  }
                  return;
            } 
            var studentObj = {
                  'name': name,
                  'course': course,
                  'grade': grade
                  }
            student_array.push( studentObj );
            clearAddStudentFormInputs();
            updateStudentList( student_array );
            student_array[student_array.length-1]['id'] = result.new_id;
            },
      error: function(result){
            console.log(result);
      }
      })
}

      // Update student in DB

function updateData( id, name, course, grade ){
      $.ajax({
      dataType: 'json',
      data: {
            'api_key': 'root',
            'id': id,
            'name': name,
            'course': course,
            'grade': grade,
            },
      method: 'POST',
      url: 'http://localhost:8888/php/index.php?action=update',
      success: function(result){
            if (result.success === false){
                  for(var errorMsg=0; errorMsg< result.errors.length; errorMsg++){
                        alert(result.errors[errorMsg]);
                  }
                  return;
            } else if (result.success === true){
                  for (var i=0; i<student_array.length; i++){
                        if (student_array[i].id === id){
                              student_array[i].name = name;
                              student_array[i].course = course;
                              student_array[i].grade = grade;
                        }
                  }
            }
            
            updateStudentList( student_array );
            // student_array[student_array.length-1]['id'] = result.new_id;
            },
      error: function(result){
            console.log(result);
      }
      })
}

      // Remove a student from DB

function deleteData( id, student, location, studentList){
      $.ajax({
            dataType: 'json',
            data:{
                  'api_key': 'root',
                  'id': id
                  },
            method: 'POST',
            url: 'http://localhost:8888/php/index.php?action=delete',
            success: function(result){
                 if (result.success === false){
                       alert(result.errors[0]);
                       return;
                 }
                 removeStudent( student );
                 $(location).closest('tr').remove();
                 renderGradeAverage( calculateGradeAverage(studentList) );
            },
            error: function(result){
                  console.log(result);
            }
      })
}

